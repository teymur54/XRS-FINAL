import React, { useState } from 'react'
import PostLetter from './PostLetter'
import AllLetters from './Allletters'
import { MessageHideIcon, MessageIcon } from '../assets/HeroIcons'

const Letters = () => {
  // const [showPost, setShowPost] = useState(false)
  // const [showLetters, setShowLetters] = useState(true)

  // const togglePost = () => {
  //   setShowPost(!showPost)
  //   setShowLetters(showPost)
  // }

  // const toggleLetters = () => {
  //   setShowLetters(!showLetters)
  //   setShowPost(showLetters)
  // }
  return (
    <>
      <AllLetters />
    </>
  )
}

export default Letters

{
  /* <div
          className={`${showPost ? 'transition-opacity duration-300 ease-in-out' : ''} opacity-${
            showPost ? '100' : '0'
          }`}
        > */
}

{
  /* <div className="absolute left-0 -ml-8 mt-60">
        <button onClick={togglePost} className="w-20 rotate-90 transform">
          <div
            className={`flex items-center justify-between rounded-2xl border-2 border-oceanblue ${
              showPost ? 'bg-red-950' : 'bg-white'
            }  ${showPost ? 'text-white' : 'text-black'} px-2`}
          >
            {showPost ? <MessageHideIcon /> : <MessageIcon />}
            {showPost ? 'Gizlət' : 'Yarat'}
          </div>
        </button>
      </div>
      <div className="absolute -left-1 -ml-8 mt-[325px]">
        <button onClick={toggleLetters} className="w-22 rotate-90 transform pb-1" disabled={showLetters}>
          <div
            className={`flex items-center justify-between rounded-2xl border-2 border-oceanblue ${
              showLetters ? 'bg-red-950' : 'bg-white'
            }  ${showLetters ? 'text-white' : 'text-black'} px-2`}
          >
            <MessageIcon />
            Siyahı
          </div>
        </button>
      </div> */
}

{
  /* {showPost && <PostLetter />} */
  // {
  // showLetters && !showPost && <AllLetters />
  // }
}
