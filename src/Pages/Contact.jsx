import React from 'react'

const Contact = () => {
  return (
    <div className='h-screen w-screen bg-white flex flex-col justify-end items-start'>
      <div className='absolute shadow-xl mb-[25vh] ml-[5vw] h-[60vh] w-[22vw] bg-neutral-400'></div>
      <div className='h-[55vh] w-screen justify-center items-center bg-black/20'>
        
      </div>
      <div className='w-screen h-fit flex justify-between items-center py-5 px-5'>
        <div className='h-full flex flex-col justify-start items-start '>
            <h1 className='font-main text-[4vh] text-black'>Palmier-Auto</h1>
            <p className='font-main text-[1vh] text-neutral-400 max-w-[20vw]'>
             Lorem ipsum dolor, sit amet consectetur adipisicing elit. Illum eum sequi impedit, inventore architecto consequuntur consequatur a nobis ipsa at, quaerat numquam dolore nulla dolorum! Eius ea tempore odio molestiae.
            </p>
        </div>
        <div className='h-full flex gap-[2vw] mt-[7vh] mr-[7vw] font-main'>
           <p>Facebook</p>
           <p>Instagram</p>
           <p>Whatsapp</p>
           <p>Telegram</p>
        </div>
        <div className='h-full flex flex-col mt-[3vh] p-4 font-main'>
            <p>Copyrights 2025 c</p>
        </div>
      </div>
    </div>
  )
}

export default Contact