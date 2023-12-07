import React, { useLayoutEffect ,useRef} from 'react'
import gsap from 'gsap';
import SplitType from 'split-type'
import Loader from '../components/Loader/Loader';
import { Timeline } from 'gsap/gsap-core';
import "./LoadingPage.css";

function LoadingPage() {
const ref = useRef()
  useLayoutEffect(() => {
    let ctx = gsap.context(({ }) => {
      // const ourText = new SplitType('.wave', { types: 'chars' })
      // const chars = ourText.chars
      const tl = new Timeline();
      tl.fromTo(ref.current, {
        y:100,
        opacity:0
      },{
        delay:2,
        y:0,
        opacity:1
      });
      
      return () => ctx.revert();
    }, []);

  }, [])




  return (
    <div className='loadingPage'>
      <div className="loader-container">
        <Loader />
      </div>
      <div className="progress-container">
        <h1 className='progress' ref={ref}>0%</h1>
      </div>
    </div>
  )
}

export default LoadingPage
