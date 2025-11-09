import React from 'react'
import {motion} from 'framer-motion'
import {Link} from 'react-router-dom'
import Imported from '../assets/Tundra.avif'
const About = () => {
  return (
   <div 
   id='about'
   className='h-screen w-screen bg-white overflow-hidden flex max-md:flex-col justify-start items-end'>
    <div
    style={{backgroundImage:`url(${Imported})`, backgroundSize:'cover', backgroundPosition:'center'}}
    className='h-[80%] w-[60%] max-md:w-full max-md:mt-[5vh] mb-[5vh] bg-black items-center justify-center flex rounded-xl ml-[1vw]'>
    </div>
    <div className='h-[80%] w-[40%] max-md:w-full flex flex-col jutify-start items-start p-10'>
     <h1 className='font-main text-[8vh]'>
      Notre Service
     </h1>
     <p className='font-main font-light text-[2vh] text-neutral-400 p-3'>
      Palmier Auto est une entreprise spécialisée dans l’importation et la distribution de véhicules provenant des quatre coins du monde. Grâce à des partenariats solides établis en Europe, en Asie, en Amérique du Nord et au Moyen-Orient, Palmier Auto offre à ses clients un large choix de voitures alliant performance, fiabilité et élégance.
Notre mission est de rendre l’achat de véhicules internationaux simple, transparent et accessible. 
     </p>
     <Link to='/auth'>
     <motion.button 
           initial={{backgroundColor:'#F2F2F2' , color:'#000000' , scale:1}}
           whileHover={{backgroundColor:'#000' , color:'#FFF' , scale:1.05}}
           className='px-[3vw] py-[2vh] font-main bg-white text-black cursor-pointer mt-[2vh]'>
            Commandez!
      </motion.button>
      </Link>
    </div>
   </div>
  )
}

export default About