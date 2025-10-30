import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Sportage from '../assets/Sportage.jpg'
import Tundra from '../assets/TundraG.png'
import Tharu from '../assets/Tharu.jpg'

const cars = [
  {
    name: 'Kia Sportage 2025',
    desc: "1.6 CRDI qui devlop 167ps et une boite de 7 rapports et LED d'ambiance à l'interieur",
    img: Sportage
  },
  {
    name: 'Toyota Tundra',
    desc: "Puissant V8, 4x4, grand confort et technologie avancée.",
    img: Tundra
  },
  {
    name: 'Volkswagen Tharu',
    desc: "SUV compact, moteur efficient, intérieur moderne et spacieux.",
    img: Tharu
  },
  {
    name: 'Kia Sportage 2025',
    desc: "1.6 CRDI qui devlop 167ps et une boite de 7 rapports et LED d'ambiance à l'interieur",
    img: Sportage
  },
  {
    name: 'Toyota Tundra',
    desc: "Puissant V8, 4x4, grand confort et technologie avancée.",
    img: Tundra
  }
];

const Inventoryflex = () => {
  const sliderRef = useRef();
  const [current, setCurrent] = useState(0);

  const scrollToCard = (idx) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const card = slider.children[idx];
    if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };

  const prev = () => {
    const nextIdx = Math.max(current - 1, 0);
    setCurrent(nextIdx);
    scrollToCard(nextIdx);
  };
  const next = () => {
    const nextIdx = Math.min(current + 1, cars.length - 1);
    setCurrent(nextIdx);
    scrollToCard(nextIdx);
  };

  return (
    <div className='h-screen w-screen bg-neutral-900 justify-start items-start flex flex-col'>
      <h1 className='font-main font-thin text-[5vw] text-white pt-[10vh]'>Notre Voiture <span className='text-neutral-600'>Importé</span></h1>
      <div className='flex h-fit w-screen justify-start items-start mt-[5vh]'>
        <ul className='font-main flex flex-col text-neutral-400 gap-[1vh] font-light text-xl mt-[2vh] ml-[1vw]'>
          <motion.li initial={{scale:1, color:'#9CA3AF'}} whileHover={{scale:1.05, color:'#FFFFFF'}} className='cursor-pointer'>Chinois</motion.li>
          <motion.li initial={{scale:1, color:'#9CA3AF'}} whileHover={{scale:1.05, color:'#FFFFFF'}} className='cursor-pointer'>Canadienes</motion.li>
          <motion.li initial={{scale:1, color:'#9CA3AF'}} whileHover={{scale:1.05, color:'#FFFFFF'}} className='cursor-pointer'>Europeanes</motion.li>
          <motion.li initial={{scale:1, color:'#9CA3AF'}} whileHover={{scale:1.05, color:'#FFFFFF'}} className='cursor-pointer'>Pays du Golf</motion.li>
        </ul>
        {/* Img Slider */}
        <div className='h-fit flex flex-col overflow-x-scroll max-w-[80vw] ml-auto'>
          <div ref={sliderRef} className='flex h-[45vh] gap-[2vw] scroll-smooth'>
            {cars.map((car, idx) => (
              <div key={idx} className='h-full min-w-[23vw] flex flex-col'>
                <div className='h-[80%] w-full bg-white rounded-lg overflow-hidden flex items-center justify-center'>
                  <img src={car.img} alt={car.name} className='object-cover h-full w-full'/>
                </div>
                <h1 className='font-main text-[2vh] text-black mt-2'>{car.name}</h1>
                <p className='font-main font-thins text-[1.7vh] text-neutral-400'>{car.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Navigation Arrows */}
      <div className='flex w-[80%] h-fit ml-auto items-center justify-between mt-[2vh]'>
        <button onClick={prev} disabled={current === 0} className='p-2 rounded-full bg-black/30 hover:bg-black/50 disabled:opacity-40'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button onClick={next} disabled={current === cars.length - 1} className='p-2 rounded-full bg-black/30 hover:bg-black/50 disabled:opacity-40'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Inventoryflex