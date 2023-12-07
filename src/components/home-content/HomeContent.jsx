import React from 'react';
import "./HomeContent.css";

function HomeContent() {

    return (
        <div className='homeContent-container'>
            <div className="say-hey">
                <h3>Hey There,</h3>
            </div>
            <div className="my-self">
                <h1>I'M <span>Unnikrishnan</span></h1>
                <h1>A FULL STACK DEVELOPER</h1>
            </div>
            <div className="para-my-self">
                <p>It is not just about making something look good. I will help you
                    to deliver high-quality products and services which lead to
                    better user experience and in turn, happier customers.
                </p>
                <button className='about-btn btn'>About Me <span className="material-icons-sharp">chevron_right</span></button>
            </div>
        </div>
    )
}

export default HomeContent
