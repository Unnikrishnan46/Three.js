import React, { useLayoutEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import "./App.css"
const App = () => {
  useLayoutEffect(() => {
    const loader = new GLTFLoader();
    const canvas = document.querySelector('canvas.webgl')
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(0x000ff);
    const envirnment = ("/env.hdr")

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 1
    scene.add(camera)






    // const sphereGeometry = new THREE.SphereGeometry(0.004, 16, 16);
    // const particles = [];
    // const originalPositions = [];
    // const originalMaterials = [];
    // const highlightMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });


    // let sampler;
    // let model;
    // loader.load('/earth.glb', (gltf) => {
    //   model = gltf.scene;
    //   model.scale.set(0.7, 0.7, 0.7)
    //   // model.position.set(0, -0.7, -1);
    //   model.position.set(0, -0.1, -1);
    //   gltf.scene.traverse((obj) => {
    //     if (obj.isMesh) {
    //       sampler = new MeshSurfaceSampler(obj).build();
    //       const numParticles = 3000;
    //       for (let i = 0; i < numParticles; i++) {
    //         const sample = new THREE.Vector3();
    //         sampler.sample(sample);
    //         const particle = new THREE.Mesh(sphereGeometry, new THREE.MeshStandardMaterial());
    //         particle.position.copy(sample);
    //         particle.position.copy(obj.localToWorld(particle.position));
    //         particle.rotation.copy(obj.rotation);
    //         particles.push(particle);
    //         originalPositions.push(sample.clone());
    //         originalMaterials.push(particle.material.clone());
    //         scene.add(particle)
    //       }
    //     }
    //   });
    // });









    const particles = [];
    const particleGeometry = new THREE.BufferGeometry();
    const pointMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.002 });

    let model;

    loader.load('/earth.glb', (gltf) => {
      model = gltf.scene;
      model.scale.set(0.7, 0.7, 0.7);
      model.position.set(0, -0.1, -1);

      gltf.scene.traverse((obj) => {
        if (obj.isMesh) {
          const geometry = obj.geometry.clone();
          const positions = geometry.attributes.position.array;

          for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];

            const particle = new THREE.Vector3(x, y, z);
            particles.push(particle);

            if (particles.length >= 50000) {
              break;
            }
          }
        }
      });

      const particlePositions = new Float32Array(particles.length * 3);
      for (let i = 0; i < particles.length; i++) {
        particlePositions[i * 3] = particles[i].x;
        particlePositions[i * 3 + 1] = particles[i].y;
        particlePositions[i * 3 + 2] = particles[i].z;
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      const particleSystem = new THREE.Points(particleGeometry, pointMaterial);
      particleSystem.scale.set(0.4, 0.4, 0.4);
      scene.add(particleSystem);
    });



    const numInstances = 500;
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const instancedMesh = new THREE.InstancedMesh(geometry, material, numInstances);
    
    // Set individual positions, rotations, and scales for each instance
    for (let i = 0; i < numInstances; i++) {
      const matrix = new THREE.Matrix4();
    
      // Randomly position each cube within a certain range
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
    
      // Set the position of the cube
      matrix.setPosition(new THREE.Vector3(x, y, z));
    
      instancedMesh.setMatrixAt(i, matrix);
    }
    
    scene.add(instancedMesh);
    




    const galaxyGroup = new THREE.Group();
    // scene.add(galaxyGroup);
    const particleCount = 300;
    const Gparticles = new THREE.BufferGeometry();
    const colors = [0x03A9F4, 0xFF9800, 0xFFEB3B];

    const positions = [];
    const colorsArray = [];


    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * 20 - 10;
      const y = Math.random() * 20 - 10;
      const z = Math.random() * 20 - 10;

      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      positions.push(x, y, z);
      colorsArray.push(color.r, color.g, color.b);
    }

    Gparticles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    Gparticles.setAttribute('color', new THREE.Float32BufferAttribute(colorsArray, 3));

    let sprite = new THREE.TextureLoader().load('https://static.vecteezy.com/system/resources/thumbnails/017/398/790/small/white-circle-free-png.png');
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      opacity: 0.8,
      transparent: true,
      map: sprite
    });

    const particleSystem = new THREE.Points(Gparticles, particleMaterial);
    galaxyGroup.add(particleSystem);



    function updateParticles() {
      const positionAttribute = Gparticles.getAttribute('position');
      const positionsArray = positionAttribute.array;

      for (let i = 0; i < particleCount; i++) {
        const currentX = positionsArray[i * 3];
        if (currentX > 10) {
          positionsArray[i * 3] = -10;
        } else {
          positionsArray[i * 3] += 0.01;
        }
      }

      positionAttribute.needsUpdate = true;
    }




    window.addEventListener('resize', () => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })





    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      powerPreference: "high-performance",
      antialias: false,
      stencil: false,
      depth: false
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;


    const composer = new EffectComposer(renderer);
    const rendererPass = new RenderPass(scene, camera);
    composer.addPass(rendererPass)
    const screenDimension = new THREE.Vector2(window.innerWidth, window.innerHeight);
    const unrealBloomPass = new UnrealBloomPass()
    unrealBloomPass.strength = 1.1;
    unrealBloomPass.radius = 0.3;
    unrealBloomPass.threshold = 0.0;
    unrealBloomPass.resolution = screenDimension
    composer.addPass(unrealBloomPass);
    const filmPass = new FilmPass(0.035, false);
    composer.addPass(filmPass)




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



    function updateCameraPosition() {
      const maxCameraOffset = 0.3;
      const targetX = mouseX * maxCameraOffset;
      const targetY = mouseY * (maxCameraOffset - 0.4);
      camera.position.x = targetX;
      camera.position.y = targetY;
    }






    const clock = new THREE.Clock()


    const controls = new OrbitControls(camera, renderer.domElement);


    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      // updateCameraPosition();


      // updateParticles();
      window.requestAnimationFrame(tick)
      composer.render()
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