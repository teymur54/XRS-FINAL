import '../styles/eyeballs.css'

import React, { useEffect } from 'react'
import { useState } from 'react'
import { useRef } from 'react'

const EyeBalls = () => {
  const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 })

  const eyeLeft = useRef()
  const eyeRight = useRef()

  const eyeBrowLeft = useRef()
  const eyeBrowRight = useRef()

  const mouth = useRef()

  const imgContainer = useRef()

  function calcAngle(element) {
    if (!element.current) return

    let elX = element.current.offsetLeft + element.current.clientWidth / 2
    let elY = element.current.offsetTop + element.current.clientHeight / 2

    var rad = Math.atan2(mouseCoordinates.x - elX, mouseCoordinates.y - elY)
    var rot = rad * (180 / Math.PI) * -1 + -18

    return rot
  }

  const handleMouseMove = (event) => {
    const imgRect = imgContainer.current.getBoundingClientRect()

    setMouseCoordinates({
      x: event.clientX - imgRect.left,
      y: event.clientY - imgRect.top,
    })

    eyeBrowLeft.current.style.transform = `translateY(${event.clientY / 100}px)`
    eyeBrowRight.current.style.transform = `translateY(${event.clientY / 100}px)`

    mouth.current.style.transform = `translateY(${event.clientY / 100}px) rotate(${event.clientX / 100}deg)`
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="police-container">
      <div className="relative">
        <img src="../public/police.png" className={`w-40`} />
        <div className="App" ref={imgContainer}>
          <div className="eyebrow_container">
            <div ref={eyeBrowLeft} className="eye_brow left"></div>
            <div ref={eyeBrowRight} className="eye_brow right"></div>
          </div>
          <div className="eye_container">
            <div
              ref={eyeLeft}
              style={{
                transform: `rotate(${calcAngle(eyeLeft)}deg)`,
              }}
              className="eye"
            ></div>
            <div
              ref={eyeRight}
              style={{
                transform: `rotate(${calcAngle(eyeRight)}deg)`,
              }}
              className="eye"
            ></div>
          </div>
        </div>
        <div ref={mouth} className="mouth"></div>
      </div>
    </div>
  )
}

export default EyeBalls
