import React from 'react'
import {motion} from 'framer-motion'
const About = () => {
  return (
   <div className='h-screen w-screen bg-white overflow-hidden flex justify-start items-end'>
    <div className='h-[80%] w-[60%] mb-[5vh] bg-black items-center justify-center flex'>
      <p className='font-main text-3xl text-white'>
        Photo
      </p>
    </div>
    <div className='h-[80%] w-[40%] flex flex-col jutify-start items-start p-4'>
     <h1 className='font-main text-[8vh]'>
      Notre Service
     </h1>
     <p className='font-main font-thin'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis iste expedita nesciunt mollitia sequi ex voluptatum quisquam! Atque, dolorum beatae vitae nobis qui sequi quisquam distinctio dolorem possimus fugiat eaque! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officiis voluptatibus iure ad ducimus necessitatibus error quibusdam in eos, adipisci corporis odit sint quo repellendus tempora rem amet ullam, soluta dolorum?</p>
     <motion.button 
           initial={{backgroundColor:'#FFFFFF' , color:'#000000' , scale:1}}
           whileHover={{backgroundColor:'#F2F2F2' , color:'#000' , scale:1.05}}
           className='px-[3vw] py-[2vh] font-main bg-white text-black cursor-pointer mt-[2vh]'>
            Commandez!
      </motion.button>
    </div>
   </div>
  )
}

export default About