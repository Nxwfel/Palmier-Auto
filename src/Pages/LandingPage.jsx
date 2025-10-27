import React , {useState} from 'react'
import { motion } from 'framer-motion';

import Cover from '../assets/Cover.png'
const LandingPage = () => {

  const slides = [
    { title: 'Palmier Auto', desc: "Votre partenaire de confiance pour l'entretien et la réparation automobile." },
    { title: 'Service Express', desc: "Réparations rapides et fiables pour que vous repreniez la route." },
    { title: 'Entretien Complet', desc: "Des forfaits d'entretien adaptés à chaque véhicule." },
    { title: 'Diagnostics Pro', desc: "Analyse et diagnostics précis avec équipement moderne." }
  ];
  const [current, setCurrent] = useState(0);
  const Model = slides[current].title;
  const Description = slides[current].desc;
  return (
    <div className='h-screen w-screen overflow-hidden flex flex-col items-center justify-start bg-black text-white font-main'>
      {/* Header */}
       <div className='z-20 h-[10vh] w-full flex justify-between px-[3vw] items-center '>
        <h1 className='font-main font-thin text-[2vw]'>Palmier Auto</h1>
        <div className='font-main font-thin justify-center items-center gap-[2vw] flex'>
          <motion.p
          initial={{scale:1 , color:'#FFFFFF'}}
          whileHover={{scale:1.1 , color:'#F2F2F2'}}
          className='text-[1vw] cursor-pointer'>A propos</motion.p>
          <motion.p
          initial={{scale:1 , color:'#FFFFFF'}}
          whileHover={{scale:1.1 , color:'#F2F2F2'}}
          className='text-[1vw] cursor-pointer'>Services</motion.p>
          <motion.p 
          initial={{scale:1 , color:'#FFFFFF'}}
          whileHover={{scale:1.1 , color:'#F2F2F2'}}
          className=' text-[1vw] cursor-pointer'>Contact</motion.p>
          <motion.button 
           initial={{backgroundColor:'#FFFFFF' , color:'#000000' , scale:1}}
           whileHover={{backgroundColor:'#F2F2F2' , color:'#000' , scale:1.05}}
           className='px-[2vw] py-[1.5vh] text-[1vw] bg-white text-black cursor-pointer '>
            Suivez Votre Commande
           </motion.button>
           <span className='h-full font-thin text-3xl text-white'>|</span>
           <motion.button 
           initial={{backgroundColor:'#FFFFFF' , color:'#000000' , scale:1}}
           whileHover={{backgroundColor:'#F2F2F2' , color:'#000' , scale:1.05}}
           className='px-[2vw] py-[1.5vh] text-[1vw] bg-white text-black cursor-pointer '>
            Commandez
           </motion.button>
        </div>
       </div>
       {/* Image Slider */}
        <div
  style={{ backgroundImage: `url(${Cover})` , backgroundPosition:'center' }}
        className='absolute bg-emerald-400 z-10 h-screen w-screen top-0 left-0'>

        </div>
        {/* Model , Description , slider and indicator */}
        <div className='z-20 flex mt-auto justify-between items-center h-[30vh] w-screen'>
         <div className='h-[20vh] max-w-[25vw] flex flex-col justify-center items-start ml-[3vw]'>
           <h1 className='font-main text-[5vh]'>{Model}</h1>
           <h1 className='font-main text-[2vh] font-thin'>{Description}</h1>
           <motion.button 
           initial={{backgroundColor:'#FFFFFF' , color:'#000000' , scale:1}}
           whileHover={{backgroundColor:'#F2F2F2' , color:'#000' , scale:1.05}}
           className='px-[3vw] py-[2vh] bg-white text-black cursor-pointer mt-[2vh]'>
            Commandez!
           </motion.button>
         </div>
         <div className='h-[20vh] max-w-[30vw] flex justify-center items-center gap-[2vw]'>
           {slides.map((s, idx) => (
             <motion.button
               key={idx}
               onClick={() => setCurrent(idx)}
               initial={{scale:1, color:'#FFFFFF'}}
               whileHover={{scale:1.1}}
               className={`text-sm cursor-pointer transition-all duration-200 ${idx === current ? 'text-black bg-white px-3 py-1 rounded-full' : 'text-white'}`}
               aria-label={`Go to slide ${idx+1}`}
             >
               {idx === current ? '●' : '○'}
             </motion.button>
           ))}
         </div>
         <div className='min-w-[25vw] flex justify-center items-center gap-[2vw] mr-[3vw]'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.7} stroke="currentColor" className="size-[5vh]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
          </svg>
          <span className='text-2xl font-thin'>|</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.7} stroke="currentColor" className="size-[5vh]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg>
         </div>
        </div>
    </div>
  )
}

export default LandingPage