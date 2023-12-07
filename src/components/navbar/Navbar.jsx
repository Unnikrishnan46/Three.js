import React, { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/all';
import { ScrollTrigger } from 'gsap/all';
// import { ScrollSmoother } from 'gsap/all';
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);
import "./Navbar.css"
import Menu from '../../pages/Menu';
function Navbar() {

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {

      // ScrollSmoother.create({
      //   smooth: 1
      // });

    });
    return () => ctx.revert();
  }, [])



  const toHome = () => {
    gsap.to(window, { scrollTo: 0, scrollBehavior: "smooth", ease: "power2.inOut" });
  };

  const toAbout = () => {
    const aboutPage = document.getElementById("page2");
    gsap.to(window, { scrollTo: aboutPage.offsetHeight * 2, scrollBehavior: "smooth" });
  };


  const toPortfolio = () => {
    const portfolioPage = document.getElementById("page3");
    gsap.to(window, { scrollTo: portfolioPage.offsetHeight * 4, scrollBehavior: "smooth" });
  };

  const toMySkills = () => {
    const skillPage = document.getElementById("page4");
    gsap.to(window, { scrollTo: skillPage.offsetHeight * 6, scrollBehavior: "smooth" });
  };

  const toContact = () => {
    const contactPage = document.getElementById("page5");
    gsap.to(window, { scrollTo: contactPage.offsetHeight * 8, scrollBehavior: "smooth" });
  };

  const openMenu = ()=>{
    const tl = gsap.timeline()
    tl.fromTo(".menu",{
      scale:0,
    },{
      scale:1,
      transformOrigin:"right top",
      display:"flex",
    }).fromTo(".menu-links>h2",{
      opacity:0,
    },{
      opacity:1,
      stagger:0.05
    })
  }

  const closeMenu = ()=>{
    const tl = gsap.timeline()
    tl.fromTo(".menu-links>h2",{
      opacity:1,
    },{
      opacity:0,
      stagger:0.05
    }).fromTo(".menu",{
      scale:1,
      display:"flex"
    },{
      scale:0,
      display:"none",
      transformOrigin:"right top",
    })
  }

  const menuCheck = (e)=>{
    const checkbox = e.target;
    if(checkbox.checked){
      openMenu()
    }else{
      closeMenu()
    }
  }

  return (
    <div className="navbar">
      <div className="portfolio-container">
        <h1>Portfolio</h1>
      </div>
      <div className="nav-links-container">
        <ul>
            <li className='nav-link' onClick={toHome}>Home</li>
            <li className='nav-link' onClick={toAbout}>About</li>
            <li className='nav-link' onClick={toPortfolio}>Portfolio</li>
            <li className='nav-link' onClick={toMySkills}>My Skills</li>
            <li className='nav-link' onClick={toContact}>Contact</li>
            <input type="checkbox" id="checkbox" onChange={(e)=>menuCheck(e)}/>
            <label for="checkbox" class="toggle">
              <div class="bars" id="bar1"></div>
              <div class="bars" id="bar2"></div>
              <div class="bars" id="bar3"></div>
            </label>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
