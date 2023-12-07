import React, { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import "./Page4.css";
import Technologies from '../components/technologies/Technologies';

function Page4() {

  useLayoutEffect(() => {
    const page4 = document.getElementById('page4');
    const technologiesContainer = document.querySelector(".technologies-container");
    let mouseCursor = document.querySelector(".cursor");
    technologiesContainer.addEventListener("mouseover", () => {
      mouseCursor.style.zIndex = 10
    });
    technologiesContainer.addEventListener("mouseleave", () => {
      mouseCursor.style.zIndex = -1
    })

    let ctx = gsap.context(() => {

      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: "#page4",
          scrub: true,
          start: "top 30%",
          end:"top",
        }
      })

      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: "#page4",
          scrub: true,
          start: "bottom 30%",
        }
      })

      tl1.fromTo(".page4-heading>h1",{
        opacity:0,
      },{
        opacity:1,
      });

      gsap.fromTo(".page4-heading>h3",{
        opacity:0,
      },{
        opacity:1,
        scrollTrigger: {
          trigger: "#page4",
          scrub: true,
          start: "top 30%",
          end:"top",
        }
      });

      gsap.fromTo(".technologies-container",{
        scaleX:0
      },{
        scaleX:1,
        scrollTrigger: {
          trigger: "#page4",
          scrub: true,
          start: "top 10%",
          end:"top",
        }
      });

      tl2.fromTo(".page4-heading>h1",{
        color:"white"
      }, {
        opacity:0,
        ease: "ease",
      }).fromTo(".page4-heading>h3",{
        color:"white"
      }, {
        opacity:0,
        ease: "ease",
      }).fromTo(".technologies-container",{
        color:"white"
      },{
        opacity:0,
      })


      const tl = gsap.timeline({
        delay: 2,
        scrollTrigger: {
          trigger: "#page4",
          pin: true,
          start: "top top",
          end: `+=${page4.clientHeight}`,
          scrub: true,
        }
      })

    });
    return () => ctx.revert();
  }, []);

  return (
    <div id='page4' className='section'>
      <div className="page4-heading">
        <h1>My Skills</h1>
        <h3>Technologies I've been working with recently</h3>
      </div>
      <div className="technologies-container">
        <Technologies />
      </div>
    </div>
  )
}

export default Page4
