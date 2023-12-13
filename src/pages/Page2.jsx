import React, { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import profilePic from "/profile-pic-2.jpg";
import SplitType from 'split-type'
import "./Page2.css";


const Page2 = () => {

  useLayoutEffect(() => {
    const page2 = document.getElementById('page2')
    const text = new SplitType('.short-description>p', { types: 'words' })
    let ctx = gsap.context(() => {

      gsap.fromTo(".abt-h1", {
        opacity: 0,
        x: -100
      }, {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: "#page2",
          scrub: true,
          start: "center 70%",
          end: "center 50%"
        }
      })

      gsap.fromTo(".word", {
        opacity: 0,
      }, {
        opacity: 1,
        ease: "ease",
        scrollTrigger: {
          trigger: "#page2",
          scrub: true,
          start: "center 70%",
          end: "center 30%",
        }
      })


      gsap.fromTo(".page2-right-btn>button", {
        opacity: 0,
      }, {
        opacity: 1,
        scrollTrigger: {
          trigger: "#page2",
          scrub: true,
          start: "center 70%",
          end: "center top"
        }
      })



      gsap.to(".abt-h1", {
        color: "black",
        ease: "ease",
        scrollTrigger: {
          trigger: "#page2",
          scrub: true,
          start: "bottom 20%",
        }
      })


      gsap.to(".word", {
        color: "black",
        stagger: 0.5,
        ease: "ease",
        scrollTrigger: {
          trigger: "#page2",
          scrub: true,
          start: "bottom 20%",
        }
      })

      gsap.to(".page2-right-btn>button", {
        y:100,
        scrollTrigger: {
          trigger: "#page2",
          scrub: true,
          start: "bottom 20%",
        }
      })


      const tl = gsap.timeline({
        delay: 2,
        scrollTrigger: {
          trigger: "#page2",
          pin: true,
          start: "top top",
          end: `+=${page2.clientHeight}`,
          scrub: true,
        }
      })

    });
    return () => ctx.revert();
  }, []);

  const toContact = () => {
    const contactPage = document.getElementById("page5");
    gsap.to(window, { scrollTo: contactPage.offsetHeight * 8, scrollBehavior: "smooth" });
  };

  return (
    <div id='page2' className='section'>
      <div className="page2-left">
        <div className="abt-h1-container">
          <h1 className='abt-h1'>About Me</h1>
        </div>
        <div className="short-description">
          <p>
            My name is Unnikrishnan.
            Based in India,Kerala.
            I am a  FULL STACK DEVELOPER.
            My aim is to create better
            interfaces and experiences,
            making the web and mobile
            applications easier and more
            pleasant to use. I like hard
            and interesting tasks.</p>

          <p>
            Feel free to share with me any of your next projects.
            I'm just a message away!
          </p>
        </div>
        <div className="page2-right-btn">
          <button className='cv-btn btn'>DOWNLOAD CV <span className="material-icons-sharp">trending_flat</span></button>
          <button onClick={toContact} className='btn'>OK, LET'S TALK <span className="material-icons-sharp">north_east</span></button>
        </div>
      </div>
    </div>
  )
}

export default Page2