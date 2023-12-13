import React from 'react';
import { projectData } from '../project-card/projects';
import ProjectCard from '../project-card/ProjectCard';
import "./ProjectSlider.css";

function ProjectSlider() {
  return (
    <div className='ProjectSlider-main'>
      {projectData.map((project,index)=>{
        return(
          <div>
            <div className='project-img-container' draggable={true}>
            <ProjectCard project={project} index={index} key={index} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProjectSlider
