import React, { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import "./ProjectCard.css";

function ProjectCard({ project, index }) {

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {

      gsap.fromTo(".projectCard", {
        opacity: 0
      }, {
        opacity: 1,
        stagger: 0.5,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: "#page3",
          scrub: true,
          start: "top 30%",
          end: "top",
        }
      });

      //  gsap.to(".projectCard-img>img", {
      //   visibility:"hidden",
      //   ease: "ease",
      //   scrollTrigger: {
      //     trigger: "#page3",
      //     scrub: true,
      //     start: "bottom 30%",
      //     markers:true
      //   }
      // })


    });
    return () => ctx.revert();
  }, [])



  return (
    <div className='projectCard' key={index}>
      <div className="projectCard-img">
        <img src={project.imageURL} alt="" />
      </div>
      <div className="projectCard-name">
        <h3>{project.name}</h3>
      </div>
      <div className="projectCard-shortDescription">
        <p>{project.shortDescription}</p>
      </div>
      <div className="projectCard-showDetails">
        <button onClick={() => { window.location.href = `/project/${project.id}` }}>Show Details</button>
      </div>
    </div>
  )
}

export default ProjectCard
