import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tundra from '../assets/TundraG.png'
import Sportage from '../assets/Sportage.jpg'
import Tharu from '../assets/Tharu.jpg'
const LandingPage = () => {
  const slides = [
    { title: 'Palmier Auto', desc: "Votre partenaire de confiance pour l'entretien et la réparation automobile.", img: Tundra },
    { title: 'Service Express', desc: "Réparations rapides et fiables pour que vous repreniez la route.", img: Sportage },
    { title: 'Entretien Complet', desc: "Des forfaits d'entretien adaptés à chaque véhicule.", img: Tharu },
    { title: 'Diagnostics Pro', desc: "Analyse et diagnostics précis avec équipement moderne.", img: Tundra }
  ];
  
  const [current, setCurrent] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const prevSlide = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrent((c) => (c + 1) % slides.length);
  
  const Model = slides[current].title;
  const Description = slides[current].desc;

  return (
    <div
    
    className='h-screen w-screen overflow-hidden flex flex-col items-center justify-start bg-black text-white font-sans'>
      {/* Header */}
      <div className='z-20 h-[10vh] w-full flex justify-between px-[3vw] items-center'>
        <h1 className='font-main font-thin text-2xl md:text-[2vw]'>Palmier Auto</h1>
        
        {/* Desktop Navigation */}
        <div className='hidden lg:flex font-light justify-center items-center gap-[2vw]'>
          <motion.p
            initial={{scale:1, color:'#FFFFFF'}}
            whileHover={{scale:1.1, color:'#F2F2F2'}}
            className='font-main text-[1vw] cursor-pointer'>A propos</motion.p>
          <motion.p
            initial={{scale:1, color:'#FFFFFF'}}
            whileHover={{scale:1.1, color:'#F2F2F2'}}
            className='font-main text-[1vw] cursor-pointer'>Services</motion.p>
          <motion.p 
            initial={{scale:1, color:'#FFFFFF'}}
            whileHover={{scale:1.1, color:'#F2F2F2'}}
            className='font-main text-[1vw] cursor-pointer'>Contact</motion.p>
          <motion.button 
            initial={{backgroundColor:'#FFFFFF', color:'#000000', scale:1}}
            whileHover={{backgroundColor:'#F2F2F2', color:'#000', scale:1.05}}
            className='font-main px-[2vw] py-[1.5vh] text-[1vw] bg-white text-black cursor-pointer'>
            Suivez Votre Commande
          </motion.button>
          <span className='h-full font-thin text-3xl text-white'>|</span>
          <motion.button 
            initial={{backgroundColor:'#FFFFFF', color:'#000000', scale:1}}
            whileHover={{backgroundColor:'#F2F2F2', color:'#000', scale:1.05}}
            className='font-main px-[2vw] py-[1.5vh] text-[1vw] bg-white text-black cursor-pointer'>
            Commandez
          </motion.button>
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className='font-main lg:hidden z-30 flex flex-col gap-1.5'
          aria-label='Toggle menu'>
          <motion.span 
            animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className='w-6 h-0.5 bg-white transition-all'></motion.span>
          <motion.span 
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className='w-6 h-0.5 bg-white transition-all'></motion.span>
          <motion.span 
            animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className='w-6 h-0.5 bg-white transition-all'></motion.span>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className='lg:hidden fixed top-0 right-0 h-screen w-64 bg-zinc-900 z-20 pt-20 px-6'>
            <div className='flex flex-col gap-6'>
              <p className='font-main text-lg cursor-pointer hover:text-gray-300' onClick={() => setIsMenuOpen(false)}>A propos</p>
              <p className='font-main text-lg cursor-pointer hover:text-gray-300' onClick={() => setIsMenuOpen(false)}>Services</p>
              <p className='font-main text-lg cursor-pointer hover:text-gray-300' onClick={() => setIsMenuOpen(false)}>Contact</p>
              <button 
                className='font-main px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors'
                onClick={() => setIsMenuOpen(false)}>
                Suivez Votre Commande
              </button>
              <button 
                className='font-main px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors'
                onClick={() => setIsMenuOpen(false)}>
                Commandez
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Slider (animated) */}
      <motion.div className='absolute z-10 h-screen w-screen top-0 left-0 overflow-hidden'>
        <motion.div
          className='flex h-full'
          animate={{ x: `-${current * 100}vw` }}
          transition={{ type: 'tween', duration: 0.6 }}
        >
          {slides.map((s, i) => (
            <div
              key={i}
              style={{
                backgroundImage: `url(${s.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minWidth: '100vw',
                height: '100vh'
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Model, Description, slider and indicator */}
      <div className='z-20 flex flex-col lg:flex-row mt-auto justify-between items-center h-auto lg:h-[30vh] w-screen pb-6 lg:pb-0 px-[3vw]'>
        <div className='h-auto lg:h-[20vh] max-w-full lg:max-w-[20vw] flex flex-col justify-center items-start mb-6 lg:mb-0'>
          <h1 className='font-main text-3xl lg:text-[5vh]'>{Model}</h1>
          <h1 className='font-main text-base lg:text-[2vh] font-thin mt-2'>{Description}</h1>
          <motion.button 
            initial={{backgroundColor:'#FFFFFF', color:'#000000', scale:1}}
            whileHover={{backgroundColor:'#F2F2F2', color:'#000', scale:1.05}}
            className='font-main px-6 lg:px-[3vw] py-3 lg:py-[2vh] bg-white text-black cursor-pointer mt-4 lg:mt-[2vh]'>
            Commandez!
          </motion.button>
        </div>

        <div className='h-auto lg:h-[20vh] max-w-full lg:max-w-[30vw] flex justify-center items-center gap-4 lg:gap-[2vw] mb-6 lg:mb-0'>
          {slides.map((s, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrent(idx)}
              initial={{scale:1, color:'#FFFFFF'}}
              whileHover={{scale:1.1}}
              className={`text-sm cursor-pointer transition-all duration-200 ${idx === current ? 'text-black bg-white px-3 py-1 rounded-full' : 'text-white'}`}
              aria-label={`Go to slide ${idx+1}`}>
              {idx === current ? '●' : '○'}
            </motion.button>
          ))}
        </div>

        <div className='min-w-full lg:min-w-[25vw] flex justify-center items-center gap-4 lg:gap-[2vw]'>
          <button onClick={prevSlide} aria-label='Previous slide' className='p-2 rounded-full bg-black/30 hover:bg-black/50'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.7} stroke="currentColor" className="w-8 h-8 lg:w-[5vh] lg:h-[5vh]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
            </svg>
          </button>
          <span className='text-2xl font-thin'>|</span>
          <button onClick={nextSlide} aria-label='Next slide' className='p-2 rounded-full bg-black/30 hover:bg-black/50'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.7} stroke="currentColor" className="w-8 h-8 lg:w-[5vh] lg:h-[5vh]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;