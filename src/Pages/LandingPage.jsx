import React , {useState} from 'react'
import {motion} from 'framer-motion'
const LandingPage = () => {
  const [Model , setModel] = useState('Palmier Auto');
  const [Description , setDescription] = useState('Votre partenaire de confiance pour l\'entretien et la réparation automobile.');
  return (
    <div className='h-screen w-screen flex flex-col items-center justify-start bg-black text-white font-main'>
      {/* Header */}
       <div className='z-10 h-[10vh] w-full flex justify-between px-5 items-center '>
        <h1 className='font-main font-thin text-[2vw]'>Palmier Auto</h1>
        <div className='font-main font-thin justify-center items-center gap-[2vw] flex'>
          <motion.p
          initial={{scale:1 , color:'#FFFFFF'}}
          whileHover={{scale:1.1 , color:'#FFC50F'}}
          className='text-[1vw] cursor-pointer'>A propos</motion.p>
          <motion.p
          initial={{scale:1 , color:'#FFFFFF'}}
          whileHover={{scale:1.1 , color:'#FFC50F'}}
          className='text-[1vw] cursor-pointer'>Services</motion.p>
          <motion.p 
          initial={{scale:1 , color:'#FFFFFF'}}
          whileHover={{scale:1.1 , color:'#FFC50F'}}
          className=' text-[1vw] cursor-pointer'>Contact</motion.p>
        </div>
       </div>
       {/* Image Slider */}
        <div className='absolute bg-emerald-400 z-0 h-screen w-screen top-0 left-0'></div>
        {/* Model , Description , slider and indicator */}
        <div className='flex justify-between items-center h-[30vh]'>

        </div>
    </div>
  )
}

export default LandingPage