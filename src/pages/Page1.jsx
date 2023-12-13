import React, { useLayoutEffect } from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import HomeContent from '../components/home-content/HomeContent';
import "./Page1.css";
import SplitType from 'split-type'

const Page1 = () => {
  useLayoutEffect(() => {

    const page1 = document.getElementById("page1")
    const text = new SplitType('.para-my-self>p', { types: 'lines' })
    let ctx = gsap.context(() => {

      gsap.to(".say-hey>h3", {
        y: 100,
        duration: 3,
        ease: "ease",
        scrollTrigger: {
          id: "color",
          trigger: "#page1",
          scrub: true,
          start: `${page1.clientHeight} ${page1.clientHeight / 3}`,
          end: `${page1.clientHeight} top`
        }
      });

      gsap.to(".my-self>h1", {
        y: 200,
        duration: 3,
        ease: "ease",
        scrollTrigger: {
          id: "color",
          trigger: "#page1",
          scrub: true,
          start: `${page1.clientHeight} ${page1.clientHeight / 3}`,
          end: `${page1.clientHeight} top`
        }
      });

      gsap.to(".para-my-self>p", {
        opacity: 0,
        x:-100,
        duration: 3,
        ease: "ease",
        scrollTrigger: {
          id: "color",
          trigger: "#page1",
          scrub: true,
          start: `${page1.clientHeight} ${page1.clientHeight / 3}`,
          end: `${page1.clientHeight} top`
        }
      });

      gsap.to(".about-btn", {
        opacity: 0,
        x:-100,
        duration: 3,
        ease: "ease",
        scrollTrigger: {
          id: "color",
          trigger: "#page1",
          scrub: true,
          start: `${page1.clientHeight} ${page1.clientHeight / 3}`,
          end: `${page1.clientHeight} top`
        }
      });



    




      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#page1",
          pin: true,
          start: "top top",
          scrub: true,
        }
      })


    });
    return () => ctx.revert();
  }, []);

  
  return (
    <div id='page1' className='section'>
      <HomeContent />
    </div>
  )
}

export default Page1