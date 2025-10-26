import React from 'react'

const Header = () => {
  return (
    <div className='h-[10vh] w-full pt-4 items-center justify-between flex bg-white/20 px-[10vw]'>
      <h1 className='font-main text-emerald-900 opacity-20 cursor-pointer'>Gallery</h1>
      <h1 className='font-main font-thin text-teal-800 text-[4vh] max-w-[10vw] text-center justify-center items-center flex '>Palmier Auto</h1>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 cursor-pointer">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
</svg>

    </div>
  )
}

export default Header