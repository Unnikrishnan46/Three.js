import React, { useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from 'axios';
gsap.registerPlugin(ScrollTrigger);
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Page5.css";

function Page5() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const toastOptions = {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async () => {
    const data = {
      name: name,
      email: email,
      message: message
    }

    if (name && email && message  && isValidEmail(email)) {
      try {
        await axios.post("https://3d-portfolio-server.vercel.app/send-email", data).then((response) => {
          if (response.status === 200) {
            setName('');
            setEmail('');
            setMessage('');
            toast.success('Message send successfully.', toastOptions);
            return null;
          } else {
            toast.error('Something went wrong.', toastOptions);
            return null;
          }
        })
      } catch (error) {
        toast.error('Something went wrong.', toastOptions);
        return null
      }
    } else {
      toast.warn('Something went incorrect.', toastOptions);
      return null
    }

  }

  useLayoutEffect(() => {
    const page5 = document.getElementById('page5');
    const formContainer = document.querySelector(".page5-right");
    let mouseCursor = document.querySelector(".cursor");
    formContainer.addEventListener("mouseover", () => {
      mouseCursor.style.zIndex = 10
    });
    formContainer.addEventListener("mouseleave", () => {
      mouseCursor.style.zIndex = -1
    })
    let ctx = gsap.context(() => {

      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: "#page5",
          scrub: true,
          start: "top 50%",
          end:"top",
        }
      });

      const tl2 = gsap.timeline({
        stagger:0.5,
        scrollTrigger: {
          trigger: "#page5",
          scrub: true,
          start: "top 50%",
          end:"top",
        }
      })

      tl1.fromTo(".page5-left-heading>h2",{
        opacity:0,
        x:-400,
        stagger:0.5,
      },{
        opacity:1,
        ease:"ease",
        x:0
      });

      tl1.fromTo(".services>h4",{
        opacity:0,
        x:-400,
      },{
        opacity:1,
        ease:"ease",
        x:0
      })

      tl1.fromTo(".services>ul>li",{  
        opacity:0,
        x:-400,
      },{
        stagger:0.5,
        opacity:1,
        ease:"ease",
        x:0
      })

      tl2.fromTo(".form-container>input",{
        opacity:0,
        x:100,
      },{
        stagger:0.5,
        opacity:1,
        ease:"ease",
        x:0
      })

      tl2.fromTo(".form-container>textarea",{
        opacity:0,
        x:100,
      },{
        opacity:1,
        ease:"ease",
        x:0
      });

      tl2.fromTo(".form-button>button",{
        opacity:0,
        x:100,
      },{
        opacity:1,
        ease:"ease",
        x:0
      })

      tl2.fromTo(".github",{
        opacity:0,
        x:100,
      },{
        opacity:1,
        ease:"ease",
        x:0
      })

      tl2.fromTo(".linkedin",{
        opacity:0,
        x:100,
      },{
        opacity:1,
        ease:"ease",
        x:0
      })


      tl2.fromTo(".instagram",{
        opacity:0,
        x:100,
      },{
        opacity:1,
        ease:"ease",
        x:0
      })


      const tl = gsap.timeline({
        delay: 2,
        scrollTrigger: {
          trigger: "#page5",
          pin: true,
          start: "top top",
          end: `+=${page5.clientHeight}`,
          scrub: true,
        }
      })

    });
    return () => ctx.revert();
  }, []);


  return (
    <div id='page5' className='section'>
      <div className="page5-subcontainer">
        <div className="page5-left">
          <div className="page5-left-heading">
            <h2>Let's discuss on something cool together</h2>
          </div>

          <div className="services">
            <h4>SERVICES</h4>
            <ul>
              <li>Web Development</li>
              <li>Mobile App Development(IOS,Android)</li>
            </ul>
          </div>
        </div>
        <div className="page5-right">
          <div className="form-container">
            <input type="text" placeholder='Your name' onChange={(e) => { setName(e.target.value) }} value={name} />
            <input type="email" placeholder='Your email' onChange={(e) => { setEmail(e.target.value) }} value={email} />
            <textarea name="message" id="" cols="30" rows="10" placeholder='Your message' onChange={(e) => { setMessage(e.target.value) }} value={message}></textarea>
          </div>
          <div className="form-button">
            <button onClick={onSubmit}><i class="fa-regular fa-paper-plane"></i>  Submit</button>
          </div>
          <div className="social-media">
            <div onClick={()=>{window.open("https://github.com/Unnikrishnan46")}} className="github">
              <i className="fa-brands fa-github"></i>
            </div>
            <div onClick={()=>{window.open("https://www.linkedin.com/in/unni-krishnan-3a162124b/")}} className="linkedin">
              <i className="fa-brands fa-linkedin-in"></i>
            </div>
            <div onClick={()=>{window.open("https://www.instagram.com/not_me734/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA==")}} className="instagram">
              <i className="fa-brands fa-instagram"></i>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Page5
