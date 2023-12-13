import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SplitType from 'split-type';
import { projectData } from '../components/project-card/projects';
import gsap from 'gsap';
import "./projectPage.css";

function ProjectPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const filteredProject = projectData.filter(item => item.id === projectId);
    setProject(filteredProject[0]);
  }, [projectId]); // Trigger the effect whenever projectId changes

  useEffect(() => {
    if (project) {
      const text = new SplitType('.projectPage-right>p', { types: 'words' });
      const H1text = new SplitType('.projectPage-h1>h1', { types: 'chars' });
      const tl = gsap.timeline({delay:1});

      let ctx = gsap.context(() => {
        tl.fromTo(".char", {
          y: 50,
          opacity: 0,
        }, {
          opacity: 1,
          y: 0,
          stagger: 0.03,
        });
        tl.fromTo(".word", {
          opacity: 0,
        }, {
          opacity: 1,
          stagger: 0.05
        });
      });
      tl.fromTo(".showSiteBtn",{
        opacity:0,
      },{
        opacity:1
      })

      return () => ctx.revert();
    }
  }, [project]); // Trigger the effect whenever project changes

  return (
    <div id='projectPage'>
      <div className="projectPage-left">
        <div className="project-image">
          <img src={project ? project.largeImageURL : ""} alt="" />
        </div>
      </div>
      <div className="projectPage-right">
        <div className="projectPage-h1">
           <h1>{project ? project.name : ""}</h1>
        </div>
        <p>{project ? project.fullDescription : ""}</p>
        {project?.siteURL &&<button className='showSiteBtn' onClick={()=>{window.open(project.siteURL,'_blank')}} style={{background:"pink", padding:"1rem",color:"black",fontWeight:"bold",display:"flex",justifyContent:"center",alignItems:"center",cursor:"pointer"}}>Show Site</button> }
      </div>
    </div>
  );
}

export default ProjectPage;
