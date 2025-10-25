import React from 'react'

const Header = () => {
  return (
    <div className='h-[10vh] w-full pt-4 items-center justify-between flex bg-white/20 px-[10vw]'>
      <h1 className='font-main text-emerald-900 opacity-20 cursor-pointer'>Gallery</h1>
      <h1 className='font-redressed text-teal-800 text-[4vh] max-w-[10vw] text-center justify-center items-center flex '>Palmier Auto</h1>
      <h1 className='font-main text-emerald-900 opacity-20 cursor-pointer'>Menu</h1>
    </div>
  )
}

export default Header