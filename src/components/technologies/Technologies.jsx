import React from 'react'
import "./Technologies.css";

function Technologies() {
  const row1 = [
    "/JavaScript.png",
    "/nodejs.png",
    "/nextjs.png",
    "/mongodb.png",
    "/mysql.png",
    "/react.png",
    "/redux.png",
    "/reactnative.png",
  ]

  const row2 = [
    "/Threejs.png",
    "/tailwind.png",
    "/express.png",
    "/bootstrap.png",
    "/html.png",
    "/css.png",
    "/aws.png",
    "/vscode.png"
  ]
  return (
    <div className='marquee-main'>
      <div className='marquee'>
        <div className="marqueeGroup">
          {row1.map(el => {
            return (
              <div className="imageGroup">
                <img src={el} alt="" />
              </div>
            )
          })}
        </div>
        <div className="marqueeGroup">
          {row1.map(el => {
            return (
              <div className="imageGroup">
                <img src={el} alt="" />
              </div>
            )
          })}
        </div>
      </div>

      <div className='marquee'>
        <div className="marqueeGroup2">
          {row2.map(el => {
            return (
              <div className="imageGroup">
                <img src={el} alt="" />
              </div>
            )
          })}
        </div>
        <div className="marqueeGroup2">
          {row2.map(el => {
            return (
              <div className="imageGroup">
                <img src={el} alt="" />
              </div>
            )
          })}
        </div>
      </div>
    </div>

  )
}

export default Technologies
