import React, { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import MouseMeshInteraction from '@danielblagy/three-mmi'
import "./App.css"
const App = () => {
  useLayoutEffect(() => {
    const loader = new GLTFLoader();
    const canvas = document.querySelector('canvas.webgl')
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(0x000ff);
    const textureLoader = new THREE.TextureLoader();
    const envirnment = ("/env.hdr")
    const rotationSpeed = 0.005;
    const movementSpeed = 0.0002;

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 1
    scene.add(camera)

    // let sampler
    let pointsGeometry = new THREE.BufferGeometry()
    const vertices = []
    const tempPosition = new THREE.Vector3();
    let pointPositions = [];
    let points;
    const pointer = new THREE.Vector2();
    const intersectionThreshold = 0.1;

    // const cursor = new THREE.Vector2();
    const floatingAmplitude = 1.5; // Adjust this to control the float height
    const floatingSpeed = 1;
    let pointObjects = [];


    // loader.load('/mesh3.glb', function (gltf) {
    //   const model = gltf.scene;
    //   gltf.scene.traverse((obj) => {
    //     if (obj.isMesh) {
    //       sampler = new MeshSurfaceSampler(obj).build()
    //     }
    //   })
    //   model.scale.set(0.1, 0.1, 0.1);

    //   for (let i = 0; i < 9; i++) {
    //     sampler.sample(tempPosition)
    //     vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
    //     pointPositions.push(tempPosition.clone());
    //   }

    //   pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))

    //   const pointsMaterial = new THREE.PointsMaterial({
    //     color: 0xfff0f0f,
    //     size: 0.04,
    //     blending: THREE.AdditiveBlending,
    //     uniforms: {
    //       mousePosition: { type: "v2", value: new THREE.Vector2() },
    //     },
    //     transparent: true,
    //     opacity: 0.4,
    //   })

    //   points = new THREE.Points(pointsGeometry, pointsMaterial);
    //   points.name = 'myPoints';
    //   points.position.set(0, -1, -1);
    //   points.scale.set(0.01, 0.01, 0.01);
    //   points.geometry.boundingBox = null

    //   pointObjects.push(pointsGeometry);
    //   // scene.add(points)

    //   renderer.render(scene, camera)
    //   console.log("model Loaded");

    // }, undefined, function (error) {
    //   console.error(error);
    // });



    function getPointPositions() {
      const positions = [];

      for (let i = 0; i < pointsGeometry.attributes.position.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(pointsGeometry.attributes.position, i);
        positions.push({ x: vertex.x, y: vertex.y });
      }
      return positions;
    }




    // const bigSphereGeometry = new THREE.SphereGeometry(0.5, 64, 64);
    // const sphereGeometry = new THREE.SphereGeometry(0.005, 16, 16);

    // const numParticles = bigSphereGeometry.attributes.position.count;
    // const particles = [];
    // const originalPositions = [];
    // const originalMaterials = [];
    // const highlightMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Change the color to your desired highlight color


    // for (let i = 0; i < numParticles; i++) {
    //   const x = bigSphereGeometry.attributes.position.getX(i);
    //   const y = bigSphereGeometry.attributes.position.getY(i);
    //   const z = bigSphereGeometry.attributes.position.getZ(i);

    //   const particle = new THREE.Mesh(sphereGeometry, new THREE.MeshStandardMaterial);

    //   particle.position.set(x, y, z);
    //   particles.push(particle);
    //   originalPositions.push(new THREE.Vector3(x, y, z));
    //   originalMaterials.push(particle.material.clone());
    // }
    // scene.add(...particles);

    // const interactionRadius = 0.1;
    // const particleSpeed = 0.09; // Adjust this value to control the particle speed
    // const cursor = new THREE.Vector3();
    // const originalPositionss = particles.map(particle => particle.position.clone());

    // const rayDirection = new THREE.Vector3();

    // function onMouseMove(event) {
    //   const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    //   const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    //   cursor.set(mouseX, mouseY, 0.5);
    //   cursor.unproject(camera);
    //   particles.forEach((particle, index) => {
    //     rayDirection.copy(cursor).sub(camera.position).normalize();
    //     const ray = new THREE.Ray(camera.position, rayDirection);
    //     if (ray.distanceToPoint(particle.position) < interactionRadius) {
    //       particle.position.add(cursor.clone().multiplyScalar(particleSpeed*0.05));
    //       particle.material = highlightMaterial;
    //     } else {
    //       particle.position.copy(originalPositionss[index]);
    //       particle.material = originalMaterials[index];
    //     }
    //   });
    // }


    // document.addEventListener('mousemove', onMouseMove);






    const sphereGeometry = new THREE.SphereGeometry(0.003, 16, 16);
    const particles = [];
    const originalPositions = [];
    const originalMaterials = [];
    const highlightMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const dummy = new THREE.Object3D();

    let sampler;


    const geometry = new THREE.IcosahedronGeometry(0.1);
    const material = new THREE.MeshStandardMaterial({ color: 0xfff });


    loader.load('/mesh3.glb', (gltf) => {
      const model = gltf.scene;
      model.scale.set(0.8, 0.8, 0.8)
      model.position.set(0, -0.7, -1);
      gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
          sampler = new MeshSurfaceSampler(obj).build();
          const numParticles = 3000;
          for (let i = 0; i < numParticles; i++) {
            const sample = new THREE.Vector3();
            sampler.sample(sample);
            const particle = new THREE.Mesh(sphereGeometry, new THREE.MeshStandardMaterial());
            const mesh = new THREE.InstancedMesh(geometry, material, 10000);
            particle.position.copy(sample);
            dummy.position.copy(sample);
            particle.position.copy(obj.localToWorld(particle.position));
            mesh.position.copy(obj.localToWorld(mesh.position));
            particles.push(particle);
            originalPositions.push(sample.clone());
            originalMaterials.push(particle.material.clone());
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
            // scene.add(mesh)
          }
        }
      });
    });
















    // const interactionRadius = 0.1;
    // const particleSpeed = 0.09;
    // const cursor = new THREE.Vector3();
    // const originalPositionss = particles.map((particle) => particle.position.clone());
    // const rayDirection = new THREE.Vector3();

    // function onMouseMove(event) {
    //   const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    //   const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    //   cursor.set(mouseX, mouseY, 0.5);
    //   cursor.unproject(camera);
    //   particles.forEach((particle, index) => {
    //     rayDirection.copy(cursor).sub(camera.position).normalize();
    //     const ray = new THREE.Ray(camera.position, rayDirection);
    //     if (ray.distanceToPoint(particle.position) < interactionRadius) {
    //       particle.position.add(cursor.clone().multiplyScalar(particleSpeed * 0.05));
    //       particle.material = highlightMaterial;
    //     } else {
    //       particle.position.copy(originalPositions[index]);
    //       particle.material = originalMaterials[index];
    //     }
    //   });
    // }

    // document.addEventListener('mousemove', onMouseMove);




    // Function to update cursor position
    // function updateCursor(event) {
    //   cursor.x = (event.clientX / window.innerWidth) * 2 - 1;
    //   cursor.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // }

    // document.addEventListener('mousemove', updateCursor);
    // document.addEventListener('touchmove', (event) => {
    //   updateCursor(event.touches[0]);
    // });




    const mmi = new MouseMeshInteraction(scene, camera);
    mmi.addHandler('sasi', 'mouseenter', function (mesh) {
      console.log("sasi has been clicked");
      console.log(points);
    })




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

    // function onMouseMove(event) {
    //   mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    //   mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    // }


    // window.addEventListener('mousemove', onMouseMove, false);
    // window.addEventListener('click', RaycasterOnMouseDown, false);
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


    const controls = new OrbitControls(camera, renderer.domElement);


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

      window.requestAnimationFrame(tick)
      mmi.update();
      renderer.render(scene, camera)
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