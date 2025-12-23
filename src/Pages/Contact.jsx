import React, { useState } from 'react'
import Map from '../assets/map.jpeg'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, ExternalLink } from 'lucide-react'
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
      className='min-h-screen w-screen font-main bg-white flex flex-col justify-end items-start'
    >
      {/* Contact Card */}
      <div className='absolute shadow-xl mb-[20vh] md:mb-[25vh] ml-[5vw] max-md:ml-[2vw] h-auto max-h-[70vh] w-[90vw] sm:w-[60vw] md:w-[40vw] lg:w-[25vw] bg-white rounded-lg z-20 p-4 md:p-6 overflow-y-auto'>
        <h3 className='text-xl md:text-2xl font-semibold text-black'>Palmier Auto</h3>
        <p className='text-xs md:text-sm text-neutral-500 mt-1 mb-4'>
          Votre concessionnaire automobile de confiance
        </p>
        
        {/* Dealership Contact */}
        <div className='mb-6 flex flex-col justify-start items-start'>
          <h4 className='font-semibold mb-2 text-amber-400 text-sm md:text-base'>
            Siège Social Principal
          </h4>
          <div className='space-y-2 text-xs md:text-sm'>
            <p>
              <span className='font-medium'>Adresse:</span><br/>
              622 logts bechar 08000 Colomb-Béchar, Algeria
            </p>
            <p>
              <span className='font-medium'>Téléphone:</span><br/>
              <a href="tel:0773964196" className='hover:text-amber-400 transition-colors'>
                0773 96 41 96
              </a>
            </p>
            <p>
              <span className='font-medium'>Email:</span><br/>
              <a href="mailto:Palmier.auto@gmail.com" className='hover:text-amber-400 transition-colors'>
                Palmier.auto@gmail.com
              </a>
            </p>
          </div>
          
          <h4 className='font-semibold mb-2 mt-4 text-amber-400 text-sm md:text-base'>
            Nos Bureaux:
          </h4>
          <Link to={'/Contact'}>
            <div className="flex justify-center items-center gap-12 h-full">
              <div className="bg-gradient-to-b from-stone-300/40 to-transparent p-[4px] rounded-[16px]">
                <button className="group p-[4px] rounded-[12px] bg-gradient-to-b from-white to-stone-200/40 shadow-[0_1px_3px_rgba(0,0,0,0.5)] active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] active:scale-[0.995]">
                  <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-3 py-2">
                    <div className="flex gap-2 items-center">
                      <span className="font-semibold text-amber-400 text-xs md:text-sm">
                        Consultez
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Map Section */}
      <div 
        style={{
          backgroundImage: `url(${Map})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
        className='h-[50vh] md:h-[55vh] w-screen flex justify-center items-center bg-black/20'
      />

      {/* Footer Section */}
      <div className='w-screen h-auto flex flex-col lg:flex-row justify-between items-start lg:items-center py-6 px-4 md:px-8 gap-6 lg:gap-4 bg-white border-t border-neutral-200'>

        {/* Social Links */}
        <div className='w-full lg:w-auto flex flex-row flex-wrap lg:flex-col gap-4 lg:gap-3 font-main'>
          <motion.a 
            href="https://www.facebook.com/profile.php?id=61574967869777"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-amber-400 transition-colors duration-200 text-sm md:text-base'
          >
            <Facebook size={20} />
            <span>Facebook</span>
          </motion.a>
          
          <motion.a 
            href="https://www.instagram.com/palmier.auto"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-amber-400 transition-colors duration-200 text-sm md:text-base'
          >
            <Instagram size={20} />
            <span>Instagram</span>
          </motion.a>
          
          <motion.a 
            href="mailto:Palmier.auto@gmail.com"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-amber-400 transition-colors duration-200 text-sm md:text-base'
          >
            <Mail size={20} />
            <span>Email</span>
          </motion.a>
        </div>

        {/* Copyright and Credits */}
        <div className='w-full lg:w-auto flex flex-col justify-start items-start lg:items-end gap-2 font-main text-xs md:text-sm'>
          <p className='text-neutral-600'>© 2025 Palmier Auto. Tous droits réservés.</p>
          <motion.a
            href="https://novaq-lemon.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='flex items-center gap-1.5 text-neutral-500 hover:text-amber-400 transition-colors duration-200'
          >
            <span>Conçu par</span>
            <span className='font-semibold'>NovaQ</span>
            <ExternalLink size={14} />
          </motion.a>
        </div>
      </div>
    </div>
  )
}

export default Contact