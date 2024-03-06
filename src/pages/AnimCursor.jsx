import React from 'react'
import AnimatedCursor from 'react-animated-cursor'

const AnimCursor = () => {
  return (
    <AnimatedCursor
      innerSize={8}
      outerSize={4}
      color="255, 194, 0"
      outerAlpha={0.5}
      innerScale={1}
      outerScale={5}
      clickables={[
        'a',
        'input[type="text"]',
        'input[type="password"]',
        'input[type="email"]',
        'input[type="number"]',
        'input[type="submit"]',
        'input[type="image"]',
        'label[for]',
        'select',
        'textarea',
        'button',
        '.link',
      ]}
    />
  )
}

export default AnimCursor
