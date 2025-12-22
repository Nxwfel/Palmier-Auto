import React, { useState } from 'react'
import Map from '../assets/map.jpeg'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail } from 'lucide-react'
import { motion } from 'framer-motion'

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: replace alert with real submit (API call)
    alert(`Merci ${name || 'client'}! Nous avons reçu votre message.`)
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <div
    id='Contact'
    className='h-screen w-screen font-main bg-white flex flex-col justify-end items-start'>
      <div className='absolute shadow-xl mb-[25vh] max-md:mb-[30vh] ml-[5vw] h-[70vh] w-[25vw] max-md:w-[50vw] bg-white rounded-lg z-20 p-6 overflow-y-auto'>
  <h3 className='text-2xl font-semibold text-black'>Palmier Auto</h3>
  <p className='text-sm text-neutral-500 mt-1 mb-4'>Votre concessionnaire automobile de confiance</p>
  
  {/* Dealership Contact */}
  <div className='mb-6 flex flex-col justify-start items-start'>
    <h4 className='font-semibold mb-2 text-amber-400'>Siège Social Principale</h4>
    <div className='space-y-2 text-sm'>
      <p><span className='font-medium'>Adresse:</span><br/>622 logts bechar 08000 Colomb-Béchar, Algeria</p>
      <p><span className='font-medium'>Téléphone:</span><br/>0773 96 41 96</p>
      <p><span className='font-medium'>Email:</span><br/>Palmier.auto@gmail.com</p>
    </div>
    <h4 className='font-semibold mb-2 text-amber-400'>Notre Bureaus:</h4>
    <Link to={'/Contact'}>
    <div className="flex justify-center items-center gap-12 h-full">
  <div
    className="bg-gradient-to-b from-stone-300/40 to-transparent p-[4px] rounded-[16px]"
  >
    <button
      className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]"
    >
      <div
        className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-2 py-2"
      >
        <div className="flex gap-2 items-center">
          <span className="font-semibold text-amber-400">Consultez</span>
        </div>
      </div>
    </button>
  </div>
</div>
</Link>

  </div>
  
</div>
      <div 
            style={{backgroundImage:`url(${Map})` , backgroundPosition:'center'}}
      className='h-[55vh] w-screen justify-center items-center bg-black/20'>
        
      </div>
      <div className='w-screen h-fit flex justify-between items-center py-5 px-5'>
        <div className='h-full flex flex-col justify-start items-start '>
            <h1 className='font-main text-[4vh] text-black'>Palmier-Auto</h1>
            <p className='font-main text-[1vh] text-neutral-400 max-w-[20vw]'>
              Palmier Auto est une entreprise spécialisée dans l'importation et la distribution de véhicules provenant des quatre coins du monde. Grâce à des partenariats solides établis en Europe, en Asie, en Amérique du Nord et au Moyen-Orient, Palmier Auto offre à ses clients un large choix de voitures alliant performance, fiabilité et élégance.</p>
        </div>
        <div className='h-full flex max-md:flex-col gap-[2vw] mt-[7vh] mr-[7vw] font-main'>
           <motion.a 
             href="https://www.facebook.com/profile.php?id=61574967869777"
             target="_blank"
             rel="noopener noreferrer"
             whileHover={{ scale: 1.1, y: -2 }}
             whileTap={{ scale: 0.95 }}
             className='flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-amber-400 transition-colors duration-200'
           >
             <Facebook size={20} />
             <span>Facebook</span>
           </motion.a>
           
           <motion.a 
             href="https://www.instagram.com/palmier.auto"
             target="_blank"
             rel="noopener noreferrer"
             whileHover={{ scale: 1.1, y: -2 }}
             whileTap={{ scale: 0.95 }}
             className='flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-amber-400 transition-colors duration-200'
           >
             <Instagram size={20} />
             <span>Instagram</span>
           </motion.a>
           
           <motion.a 
             href="mailto:Palmier.auto@gmail.com"
             whileHover={{ scale: 1.1, y: -2 }}
             whileTap={{ scale: 0.95 }}
             className='flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-amber-400 transition-colors duration-200'
           >
             <Mail size={20} />
             <span>Email</span>
           </motion.a>
        </div>
        <div className='h-full flex flex-col mt-[3vh] p-4 font-main'>
            <p>Copyrights 2025 c</p>
        </div>
      </div>
    </div>
  )
}

export default Contact