import React, { useLayoutEffect,useRef} from 'react'
import gsap from 'gsap';
import { Timeline } from 'gsap/gsap-core';
import "./Loader.css";

function Loader() {
    const ref = useRef()
    useLayoutEffect(() => {
        let ctx = gsap.context(({ }) => {
            const tl = new Timeline();
            tl.fromTo(ref.current, {
                y: 100,
                opacity: 0
            }, {
                delay: 2,
                y: 0,
                opacity: 1
            });
            return () => ctx.revert();
        }, []);

    }, [])

    return (
        <div className="loader" ref={ref}>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
        </div>
    )
}

export default Loader
