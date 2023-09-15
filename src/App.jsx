import React, { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import * as CANNON from "cannon-es"
import "./App.css"
const App = () => {
  useLayoutEffect(() => {
    const gui = new dat.GUI()
    const loader = new GLTFLoader();
    const canvas = document.querySelector('canvas.webgl')
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(0x000ff);
    const textureLoader = new THREE.TextureLoader();
    const envirnment = ("/env.hdr")
    const rotationSpeed = 0.005;
    const movementSpeed = 0.0002;

    let sampler
    let pointsGeometry = new THREE.BufferGeometry()
    const vertices = []
    const tempPosition = new THREE.Vector3();
    let pointPositions = [];
    let points;
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const intersectionThreshold = 0.1;

    const cursor = new THREE.Vector2();
    const floatingAmplitude = 1.5; // Adjust this to control the float height
    const floatingSpeed = 1;

    loader.load('/mesh3.glb', function (gltf) {
      const model = gltf.scene;
      gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
          sampler = new MeshSurfaceSampler(obj).build()
        }
      })
      model.scale.set(0.1, 0.1, 0.1);

      for (let i = 0; i < 9; i++) {
        sampler.sample(tempPosition)
        vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
        pointPositions.push(tempPosition.clone());
      }

      pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

      const pointsMaterial = new THREE.PointsMaterial({
        color: 0xfff0f0f,
        size: 0.04,
        blending: THREE.AdditiveBlending,
        uniforms: {
          mousePosition: { type: "v2", value: new THREE.Vector2() },
        },
        transparent: true,
        opacity: 0.4,
      })

      points = new THREE.Points(pointsGeometry, pointsMaterial);
      points.name = 'myPoints';
      points.position.set(0, -1, -1);
      points.scale.set(0.01, 0.01, 0.01);
      points.geometry.boundingBox = null
      // scene.add(points)

      renderer.render(scene, camera)
      console.log("model Loaded");

    }, undefined, function (error) {
      console.error(error);
    });



    function getPointPositions() {
      const positions = [];

      for (let i = 0; i < pointsGeometry.attributes.position.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(pointsGeometry.attributes.position, i);
        positions.push({ x: vertex.x, y: vertex.y });
      }
      return positions;
    }



    function RaycasterOnMouseDown(event) {
      event.preventDefault();
      cursor.x = ((event.clientX + canvas.offsetLeft) / canvas.width) * 2 - 1;
      cursor.y = -((event.clientY - canvas.offsetTop) / canvas.height) * 2 + 1;
      // console.log("x : " + cursor.x + " y : " + cursor.y);
      raycaster.setFromCamera(cursor, camera);
      var intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        if (intersects[0].object) {
          console.log(intersects[0].object);
        }
      }
    }


    const boxGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const boxMaterial = new THREE.MeshStandardMaterial();
    const box = new THREE.Mesh(boxGeometry, boxMaterial);

    scene.add(box);





    function createParticleSystem(model) {
      const particles = new THREE.Group();
      const numParticles = 50;

      for (let i = 0; i < numParticles; i++) {
        const instance = model.clone();

        const scale = Math.random() * 0.1 + 0.01;
        instance.scale.set(scale, scale, scale);

        const rotationX = Math.random() * Math.PI * 2;
        const rotationY = Math.random() * Math.PI * 2;
        const rotationZ = Math.random() * Math.PI * 2;
        instance.rotation.set(rotationX, rotationY, rotationZ);

        const position = new THREE.Vector3(
          Math.random() * 15 - 7.5,
          Math.random() * 10 - 5,
          -3
        );
        instance.position.copy(position);

        particles.add(instance);
      }

      return particles;
    }


    loader.load('/cone-green.glb', function (gltf) {
      const model = gltf.scene;
      model.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.name = 'cone-green';
        }
      });
      const particles = createParticleSystem(model);
      scene.add(particles);
    }, undefined, function (error) {
      console.error(error);
    });

    loader.load('/cone-yellow.glb', function (gltf) {
      const model = gltf.scene;
      model.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.name = 'cone-yellow'; // Set a name for identification
        }
      });
      const particles = createParticleSystem(model);
      scene.add(particles);
    }, undefined, function (error) {
      console.error(error);
    });

    loader.load('/cone-violet1.glb', function (gltf) {
      const model = gltf.scene;
      model.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.name = 'cone-violet'; // Set a name for identification
        }
      });
      const particles = createParticleSystem(model);
      scene.add(particles);
    }, undefined, function (error) {
      console.error(error);
    });




    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }


    const blurPlaneGeometry = new THREE.PlaneGeometry(sizes.width, sizes.height);
    const blurPlaneMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 7,
      color: new THREE.Color(0, 0, 0),
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transmission: 1,
    });
    const blurPlaneMesh = new THREE.Mesh(blurPlaneGeometry, blurPlaneMaterial);
    blurPlaneMesh.position.z = -2.5
    scene.add(blurPlaneMesh)


    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })


    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 1
    scene.add(camera)


    const controls = new OrbitControls(camera, canvas)


    const renderer = new THREE.WebGLRenderer({
      canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;


    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(envirnment, function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping
      // scene.background = texture;
      scene.environment = texture;
    });

    let mouseX = 0;
    let mouseY = 0;

    function onMouseMove(event) {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    }


    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('click', RaycasterOnMouseDown, false);
    // window.addEventListener('mousemove',()=>{
    //   console.log(pointsGeometry.attributes);
    // })


    function updateCameraPosition() {
      const maxCameraOffset = 0.3;
      const targetX = mouseX * maxCameraOffset;
      const targetY = mouseY * (maxCameraOffset - 0.4);
      camera.position.x = targetX;
      camera.position.y = targetY;
    }






    const clock = new THREE.Clock()
    let moveRight = true;





    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      // updateCameraPosition();
      if (points) {
        const pointPositions = getPointPositions();
      }

      const time = performance.now() * 0.001;


      // if (points) {
      //   for (let i = 0; i < pointsGeometry.attributes.position.count; i++) {
      //     const vertex = new THREE.Vector3();
      //     vertex.fromBufferAttribute(pointsGeometry.attributes.position, i);
      //     vertex.y = pointPositions[i].y + Math.sin(time * floatingSpeed + i) * floatingAmplitude;
      //     pointsGeometry.attributes.position.setXYZ(i, vertex.x, vertex.y, vertex.z);
      //   }
      //   pointsGeometry.attributes.position.needsUpdate = true;
      // }

      scene.traverse((object) => {
        if (object.isMesh && object.name.includes('cone')) {
          object.rotation.x += rotationSpeed;
          object.rotation.y += rotationSpeed;
        }
      });

      scene.traverse((object) => {
        if (object.isMesh && object.name.includes('cone')) {
          if (moveRight) {
            object.position.x += Math.sin(elapsedTime * movementSpeed) * 0.05;
          } else {
            object.position.x -= Math.sin(elapsedTime * movementSpeed) * 0.05;
          }

          if (object.position.x >= 2) {
            moveRight = false;
          } else if (object.position.x <= -2) {
            moveRight = true;
          }
        }
      });
      renderer.render(scene, camera)
      window.requestAnimationFrame(tick)
    }
    tick()
  }, [])



  return (
    <div id='app'>
      <canvas className="webgl"></canvas>
    </div>
  )
}

export default App