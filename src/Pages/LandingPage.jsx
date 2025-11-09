import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {Link as Scorll} from 'react-scroll'
import Tundra from '../assets/TundraG.png';
import Sportage from '../assets/Sportage.jpg';
import Tharu from '../assets/Tharu.jpg';

const LandingPage = () => {
  const slides = [
    { title: 'PALMIER AUTO', desc: 'L’élégance mécanique, réinventée.', img: Tundra },
    { title: 'EXCLUSIVITÉ SUR ROUTE', desc: 'Chaque véhicule, une œuvre d’art roulante.', img: Sportage },
    { title: 'SERVICE CONCIERGE', desc: 'Personnalisé, discret, impeccable.', img: Tharu },
    { title: 'TECHNOLOGIE DE POINTE', desc: 'Pour ceux qui exigent l’impeccable.', img: Tundra }
  ];

  const [current, setCurrent] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((c) => (c + 1) % slides.length);
  };

  return (
    <div className="relative font-main h-screen w-screen overflow-hidden bg-black text-white">
      {/* Header */}
      <header className="z-40 relative h-[10vh] flex items-center justify-between px-6 md:px-12">
        <h1 className=" text-xl md:text-2xl tracking-wider">PALMIER AUTO</h1>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {['Collection', 'Atelier', 'Contact'].map((label, idx) => {
            const linkTargets = ['Inventory', 'about', 'Contact'];
            const target = linkTargets[idx] || '';
            return (
              <Scorll
                key={label}
                to={target}
                smooth={true}
                duration={500}
                className="text-sm tracking-widest hover:text-amber-400 transition-colors cursor-pointer"
              >
                {label}
              </Scorll>
            );
          })}
          <Link to="/auth">
            <button className="ml-6 px-6 py-2 border border-white/30 text-sm tracking-widest hover:bg-white/5 transition-all">
              Espace Client
            </button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="lg:hidden z-50 w-6 h-5 flex flex-col justify-between"
          aria-label="Open menu"
        >
          <span className="block w-full h-0.5 bg-white"></span>
          <span className="block w-full h-0.5 bg-white"></span>
          <span className="block w-full h-0.5 bg-white"></span>
        </button>
      </header>

      {/* ✅ Mobile Menu — Fixed z-index and classes */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed top-0 right-0 h-screen w-4/5 max-w-xs bg-black/95 backdrop-blur-lg z-50 pt-20 px-6"
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 text-white/70 text-sm"
            >
              Fermer
            </button>
            <div className="flex flex-col gap-5 mt-8">
              {['A Propos', 'Services', 'Contact', 'Commandez'].map((item, i) => (
                <button
                  key={i}
                  className="text-left py-3  tracking-wide border-b border-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Slider — Controlled by opacity only */}
      <div className="absolute inset-0 z-10">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${slide.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* ✅ Content: No exit animation — just fade in on change */}
      <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between h-full px-6 max-md:pt-[40vh] md:px-12 pb-12 lg:pb-0">
        <div className="max-w-lg lg:max-w-xl mt-16 lg:mt-0">
          {/* 🔁 Only re-render content when current changes */}
          <div key={current} className="space-y-5">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight">
              {slides[current].title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-md">
              {slides[current].desc}
            </p>
            <Link to="/inventory">
              <button className="mt-6 px-8 py-3 border border-white/30 hover:bg-white/5 transition-all  tracking-wider">
                DÉCOUVRIR LA COLLECTION
              </button>
            </Link>
          </div>
        </div>

        {/* Slide Indicators & Nav */}
        <div className="flex flex-col items-end mt-12 lg:mt-0">
          <div className="flex gap-2 mb-6">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-2 h-2 rounded-full ${
                  idx === current ? 'bg-amber-400' : 'bg-white/30'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={prevSlide}
              className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-amber-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 flex items-center justify-center border border-white/20 hover:border-amber-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-32 bg-amber-500/5 blur-3xl rounded-full"></div>
    </div>
  );
};

export default LandingPage;