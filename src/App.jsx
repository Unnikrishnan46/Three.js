import React, { useLayoutEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import gsap from 'gsap';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import LoadingPage from './pages/LoadingPage';
import { Timeline } from 'gsap/gsap-core';
import "./App.css"
import Navbar from './components/navbar/Navbar';
import SplitType from 'split-type'
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Page5 from './pages/Page5';
import Menu from './pages/Menu';

const App = () => {

  useLayoutEffect(() => {
    const loadingManager = new THREE.LoadingManager()
    const loader = new GLTFLoader(loadingManager);
    const canvas = document.querySelector('canvas.webgl')
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(0x000ff);
    const envirnment = ("/env.hdr")
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    let sprite = new THREE.TextureLoader().load('https://static.vecteezy.com/system/resources/thumbnails/017/398/790/small/white-circle-free-png.png');
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 100)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 1
    scene.add(camera)



    let model1;
    let model2;
    let model3;
    let model4;
    let model5;

    let boxData;
    let tknotData;
    let rocketData;
    let characterData;
    let threejs;
    let p;

    let gu = {
      time: { value: 1 }
    }
    let pu = {
      interpolation: { value: 0 }
    }
    let amount = 8000;
    let blue = new THREE.Color(0x006dff);
    let red = new THREE.Color(0xfc0001);
    let yellow = new THREE.Color(0xf2e300);
    let m = new THREE.PointsMaterial({
      size: 0.008,
      vertexColors: true,
      onBeforeCompile: shader => {
        shader.uniforms.time = gu.time;
        shader.uniforms.interpolation = pu.interpolation;
        shader.vertexShader = `
        uniform float time;
        uniform float interpolation;
  
        attribute vec3 position1;
        attribute vec3 normal1;
        attribute vec3 color1;
  
        attribute vec3 position2;
        attribute vec3 normal2;
        attribute vec3 color2;

        attribute vec3 position3;
        attribute vec3 normal3;
        attribute vec3 color3;

        attribute vec3 position4; 
        attribute vec3 normal4;  


        attribute vec3 position5; 
  
        // attribute float sizeData;
  
        mat2 rot2d(float a){return mat2(cos(a), sin(a), -sin(a), cos(a));}
        ${shader.vertexShader}
      `.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
          float a = interpolation;
          
          if (a < 0.25) {
            transformed = mix(position1, position2, a * 4.0); 
          } else if (a < 0.5) {
            transformed = mix(position2, position3, (a - 0.25) * 4.0); 
          } else if (a < 0.75) {
            transformed = mix(position3, position4, (a - 0.5) * 4.0); 
          } else {
            transformed = mix(position4, position5, (a - 0.75) * 4.0); 
          }

          vColor = mix(color1, color3, a);
          vec3 normal = normalMatrix * normalize(mix(normal1, normal2, a));
        `
        )
        shader.fragmentShader = `
        ${shader.fragmentShader}
      `.replace(
          `#include <clipping_planes_fragment>`,
          `#include <clipping_planes_fragment>
  
          if(length(gl_PointCoord.xy - 0.5) > 0.5) discard;
        `
        );
      }
    });

    console.log(document.querySelector('#page1').offsetWidth);


    loader.load('/earth.glb', (gltf1) => {
      gltf1.scene.traverse((obj1) => {
        if (obj1.isMesh) {
          model1 = obj1;
          boxData = pointification(model1, amount, blue, red, yellow, 0.9, new THREE.Vector3(0, 0, 0));
        }
      })
    })

    loader.load('/land.glb', (gltf2) => {
      gltf2.scene.traverse((obj2) => {
        if (obj2.isMesh) {
          model2 = obj2;
          tknotData = pointification(model2, amount, blue, red, yellow, 1, new THREE.Vector3(0, 0, 0));
        }
      })
    })

    loader.load('/mesh3.glb', (gltf3) => {
      gltf3.scene.traverse((obj3) => {
        if (obj3.isMesh) {
          model3 = obj3;
          rocketData = pointification(model3, amount, blue, red, yellow, 0.018, new THREE.Vector3(0, -1.5, 0));
        }
      })
    })

    loader.load('/react.glb', (gltf4) => {
      gltf4.scene.traverse((obj4) => {
        if (obj4.isMesh) {
          model4 = obj4;
          characterData = pointification(model4, amount, blue, red, yellow, 0.3, new THREE.Vector3(0, 0, 0));
        }
      })
    })

    loader.load('/three.js.glb', (gltf5) => {
      gltf5.scene.traverse((obj5) => {
        if (obj5.isMesh) {
          model5 = obj5;
          threejs = pointification(model5, amount, blue, red, yellow, 0.03, new THREE.Vector3(0, 0, 0));
        }
      })
    })



    const progressBar = document.querySelector('.progress')
    loadingManager.onProgress = function (url, loaded, total) {
      if (progressBar) {
        progressBar.innerHTML = `${(loaded / total) * 100} %`
      }
    }




    function pointification(mesh, amount, color1, color2, color3, scale, offset = new THREE.Vector3()) {
      let mss = new MeshSurfaceSampler(mesh).build();
      let p = mesh.geometry.attributes.position;
      let box = new THREE.Box3().setFromBufferAttribute(p);
      let size = new THREE.Vector3();
      box.getSize(size);

      let v = new THREE.Vector3();
      let n = new THREE.Vector3();
      let c = new THREE.Color();
      let pos = [];
      let nor = [];
      let col = [];
      for (let i = 0; i < amount; i++) {
        mss.sample(v, n);
        v.multiplyScalar(scale).add(offset);
        v.toArray(pos, i * 3);
        n.toArray(nor, i * 3);
        let a = (v.x - box.min.x) / size.x;
        c.setStyle(color1.getStyle()).lerp(color2, a);
        if (a > 0.5) {
          a = (v.x - box.min.x - size.x * 0.5) / (size.x * 0.5);
          c.lerp(color3, a);
        }
        c.toArray(col, i * 3);
      }

      return {
        pos: pos,
        nor: nor,
        col: col
      }
    }


    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);
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

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
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
    unrealBloomPass.strength = 2.0;
    unrealBloomPass.radius = 0.2;
    unrealBloomPass.threshold = 0.0;
    unrealBloomPass.resolution = screenDimension
    composer.addPass(unrealBloomPass);
    const filmPass = new FilmPass(0.000001, false);
    // composer.addPass(filmPass)


    // const controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener("scroll", event => {
      let h = document.documentElement,
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
      let ratio = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight);
      pu.interpolation.value = ratio;
    })



    const LoaderPage = document.querySelector(".loadingPage");
    loadingManager.onLoad = function () {
      let g = new THREE.BufferGeometry()
        .setAttribute("position", new THREE.Float32BufferAttribute(new Array(amount * 3).fill(0), 3))
        .setAttribute("color", new THREE.Float32BufferAttribute(new Array(amount * 3).fill(0), 3))
        .setAttribute("position1", new THREE.Float32BufferAttribute(boxData.pos, 3))
        .setAttribute("normal1", new THREE.Float32BufferAttribute(boxData.nor, 3))
        .setAttribute("color1", new THREE.Float32BufferAttribute(boxData.col, 3))
        .setAttribute("position2", new THREE.Float32BufferAttribute(tknotData.pos, 3))
        .setAttribute("normal2", new THREE.Float32BufferAttribute(tknotData.nor, 3))
        .setAttribute("color2", new THREE.Float32BufferAttribute(tknotData.col, 3))
        .setAttribute("position3", new THREE.Float32BufferAttribute(rocketData.pos, 3))
        .setAttribute("normal3", new THREE.Float32BufferAttribute(rocketData.nor, 3))
        .setAttribute("color3", new THREE.Float32BufferAttribute(rocketData.col, 3))
        .setAttribute("position4", new THREE.Float32BufferAttribute(characterData.pos, 3))
        .setAttribute("normal4", new THREE.Float32BufferAttribute(characterData.nor, 3))
        .setAttribute("color4", new THREE.Float32BufferAttribute(characterData.col, 3))
        .setAttribute("position5", new THREE.Float32BufferAttribute(threejs.pos, 3))
        .setAttribute("normal5", new THREE.Float32BufferAttribute(threejs.nor, 3))
        .setAttribute("color5", new THREE.Float32BufferAttribute(threejs.col, 3))
        .setAttribute("sizeData", new THREE.Float32BufferAttribute(new Array(amount).fill().map(_ => Math.random()), 0.1));
      p = new THREE.Points(g, m);
      p.scale.set(0.4, 0.4, 0.4);
      scene.add(p);
      const tl = new Timeline();
      setTimeout(() => {
        tl.to(LoaderPage, {
          opacity: 0,
          duration: 1,
          zIndex: 0
        })

        const tl2 = new Timeline();
        const text = new SplitType('.para-my-self>p', { types: 'lines' })

        tl2.to(p.rotation, { y: Math.PI * 3, duration: 2 });

        tl.fromTo(p.position, {
          z: 1
        }, {
          z: 0
        })

        gsap.fromTo(".nav-link", {
          opacity: 0,
          y: -50
        }, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          delay: 1
        })

        tl.fromTo(".say-hey>h3", {
          y: 100
        }, {
          y: 0
        }).fromTo(".my-self>h1", {
          y: 200
        }, {
          y: 0
        }).fromTo(".line", {
          y: 500
        }, {
          y: 0,
          stagger: 0.05,
        }).fromTo(".para-my-self>button", {
          opacity: 0,
          x: -50
        }, {
          opacity: 1,
          x: 0
        })

        tl.add(tl2, 0);


        gsap.to(p.position, {
          x: 0.5,
          ease: "ease",
          scrollTrigger: {
            trigger: "#page2",
            scrub: true
          }
        })

      }, 5000);
    }




    let mouseCursor = document.querySelector(".cursor");
    let headings = document.querySelectorAll('.nav-link');
    let buttons = document.querySelectorAll('.btn');
    window.addEventListener("mousemove", cursor);

    function cursor(e) {
      mouseCursor.style.top = e.pageY + 'px'
      mouseCursor.style.left = e.pageX + 'px'
    }

    headings.forEach(head => {
      head.addEventListener('mouseover', () => {
        mouseCursor.classList.add('headGrow');
        head.classList.add('hovered-link');
      });
      head.addEventListener('mouseleave', () => {
        mouseCursor.classList.remove('headGrow');
        head.classList.remove('hovered-link');
      })
    })


    buttons.forEach(button => {
      button.addEventListener('mouseover', () => {
        button.className === "cv-btn" ? mouseCursor.classList.add('mouse-btn-grow-blue') : mouseCursor.classList.add('mouse-btn-grow');
        button.classList.add('button-hovered');
      });
      button.addEventListener('mouseleave', () => {
        button.className === "cv-btn" ? mouseCursor.classList.remove('mouse-btn-grow-blue') : mouseCursor.classList.remove('mouse-btn-grow');
        button.classList.remove('button-hovered');
      })
    })


    const clock = new THREE.Clock()

    const tick = () => {
      let t = clock.getElapsedTime();

      gu.time.value = t;

      if (p) {
        p.rotation.y += 0.002
      }
      updateParticles();
      window.requestAnimationFrame(tick)
      composer.render()
    }
    tick()

  }, [])


  return (
    <div id='app'>
      <LoadingPage />
      
      <div className="main-content" style={{ position: "absolute", color: "white", height: "100vh", width: "100%", zIndex: 50 }}>
        <div className="cursor"></div>
        <Navbar />
        <Menu/>
        <Page1 />
        <Page2 />
        <Page3 />
        <Page4 />
        <Page5 />
      </div>
      <canvas className="webgl"></canvas>
    </div>
  )
}

export default App