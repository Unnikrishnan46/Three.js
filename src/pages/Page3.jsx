import React, { useEffect, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { projectData } from '../components/project-card/projects';
import ProjectCard from '../components/project-card/ProjectCard';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'swiper/css';
import "./Page3.css";


function Page3() {
  
  const settings = {
    infinite: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    slidesToShow:4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        }
      },
      {
        breakpoint: 1188,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 866,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };



  useLayoutEffect(() => {
    const page3 = document.getElementById('page3');
    let mouseCursor = document.querySelector(".cursor");
    page3.addEventListener("mouseover", () => {
      mouseCursor.style.zIndex = 10
    });
    page3.addEventListener("mouseleave", () => {
      mouseCursor.style.zIndex = -1
    })
    let ctx = gsap.context(() => {

      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: "#page3",
          scrub: true,
          start: "top 50%",
          end: "top",
        }
      });

      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: "#page3",
          scrub: true,
          start: "bottom 30%",
        }
      })

      tl1.fromTo(".page3-heading>h1", {
        opacity: 0,
      }, {
        opacity: 1,
        ease: "sine.inOut",
      })

      tl1.fromTo(".page3-subheadings>h2", {
        opacity: 0,
        x: -100
      }, {
        opacity: 1,
        x: 0,
        ease: "sine.inOut",
        stagger: 0.05,
      });


      tl2.fromTo(".page3-heading>h1", {
        color: "white"
      }, {
        y: -100,
        opacity: 0,
        ease: "sine.inOut",
      })

      tl2.fromTo(".page3-subheadings>h2", {
        border: "none"
      }, {
        y: -100,
        opacity: 0,
        ease: "sine.inOut",
      })

      tl2.fromTo(".project-container", {
        color: "white"
      }, {
        y: -100,
        opacity: 0,
        stagger: 0.05,
        ease: "sine.inOut",
      })



      const tl = gsap.timeline({
        delay: 2,
        scrollTrigger: {
          trigger: "#page3",
          pin: true,
          start: "top top",
          end: `+=${page3.clientHeight}`,
          scrub: true,
        }
      })

    });
    return () => ctx.revert();
  }, []);

  return (
    <div id='page3' className='section'>
      <div className="page3-heading">
        <h1>PORTFOLIO</h1>
      </div>
      {/* <div className="page3-subheadings">
        <h2 style={{ color: tab === "website" ? "red" : "white" }} onClick={clickWebsite}>Website</h2>
        <h2 style={{ color: tab === "mobileApp" ? "red" : "white" }} onClick={clickMobileApp}>Mobile App</h2>
        <h2 style={{ color: tab === "desktop" ? "red" : "white" }} onClick={clickDesktop}>Desktop</h2>
      </div> */}
      <div className="project-container">
        <Slider {...settings}>
          {projectData ? projectData.map((project, index) => (
            <ProjectCard project={project} index={index} key={index} />
          )) : ""}
        </Slider>
      </div>
    </div>
  )
}

export default Page3
