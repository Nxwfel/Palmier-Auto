import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Sportage from '../assets/Sportage.jpg';
import Tundra from '../assets/TundraG.png';
import Tharu from '../assets/Tharu.jpg';

const cars = [
  {
    name: 'Kia Sportage 2025',
    desc: "1.6 CRDI qui développe 167ps et une boîte de 7 rapports et LED d'ambiance à l'intérieur",
    img: Sportage,
  },
  {
    name: 'Toyota Tundra',
    desc: 'Puissant V8, 4x4, grand confort et technologie avancée.',
    img: Tundra,
  },
  {
    name: 'Volkswagen Tharu',
    desc: 'SUV compact, moteur efficient, intérieur moderne et spacieux.',
    img: Tharu,
  },
  {
    name: 'Kia Sportage 2025 (Hybride)',
    desc: "Version hybride avec consommation réduite et conduite silencieuse.",
    img: Sportage,
  },
  {
    name: 'Toyota Tundra TRD Pro',
    desc: "Édition spéciale tout-terrain avec suspension renforcée.",
    img: Tundra,
  },
];

const Inventoryflex = () => {
  const sliderRef = useRef(null);
  const [current, setCurrent] = useState(0);

  const scrollToCard = (idx) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const cardWidth = slider.children[0]?.offsetWidth + 24; // + gap (1.5rem = 24px)
    slider.scrollTo({
      left: idx * cardWidth,
      behavior: 'smooth',
    });
  };

  const prev = () => {
    if (current > 0) {
      const nextIdx = current - 1;
      setCurrent(nextIdx);
      scrollToCard(nextIdx);
    }
  };

  const next = () => {
    if (current < cars.length - 1) {
      const nextIdx = current + 1;
      setCurrent(nextIdx);
      scrollToCard(nextIdx);
    }
  };

  return (
    <div
      id="Inventory"
      className="w-full bg-neutral-900 py-[10vh] px-4 md:px-8"
    >
      {/* Title */}
      <h1 className="font-main font-thin text-3xl md:text-5xl text-white text-center md:text-left">
        Notre Voiture <span className="text-amber-500">Importée</span>
      </h1>

      <div className="mt-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Category Sidebar — Hidden on mobile */}
        <div className="lg:w-1/4 hidden lg:block">
          <ul className="font-main flex flex-col text-neutral-400 gap-4 font-light text-lg">
            {['Chinois', 'Canadiennes', 'Européennes', 'Pays du Golfe'].map((cat, i) => (
              <motion.li
                key={i}
                initial={{ scale: 1, color: '#9CA3AF' }}
                whileHover={{ scale: 1.05, color: '#FFFFFF' }}
                className="cursor-pointer transition-colors"
              >
                {cat}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Car Slider */}
        <div className="lg:w-3/4 w-full">
          {/* Mobile Category Tabs (Optional) */}
          <div className="lg:hidden mb-6 flex overflow-x-auto gap-4 pb-2">
            {['Chinois', 'Canadiennes', 'Européennes', 'Golfe'].map((cat, i) => (
              <button
                key={i}
                className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded whitespace-nowrap"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Slider Container */}
          <div className="relative">
            <div
              ref={sliderRef}
              className="flex overflow-x-auto gap-6 pb-4 snap-mandatory snap-x scrollbar-hide"
              style={{ scrollBehavior: 'smooth' }}
            >
              {cars.map((car, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 snap-start w-full sm:w-[320px] md:w-[360px] lg:w-[380px] xl:w-[420px]"
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-xl h-[300px] md:h-[340px]">
                    <img
                      src={car.img}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="font-main text-lg md:text-xl text-white mt-3 font-medium">
                    {car.name}
                  </h2>
                  <p className="font-main text-neutral-400 text-sm md:text-base mt-1">
                    {car.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation Arrows — Always visible on desktop, optional on mobile */}
            <div className="hidden md:flex absolute -bottom-16 left-0 right-0 justify-between w-full max-w-4xl mx-auto">
              <button
                onClick={prev}
                disabled={current === 0}
                className="p-3 rounded-full bg-black/30 hover:bg-black/50 disabled:opacity-40 transition-all"
                aria-label="Previous car"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button
                onClick={next}
                disabled={current === cars.length - 1}
                className="p-3 rounded-full bg-black/30 hover:bg-black/50 disabled:opacity-40 transition-all"
                aria-label="Next car"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Arrows (optional — or rely on scroll) */}
          <div className="md:hidden flex justify-center gap-6 mt-6">
            <button
              onClick={prev}
              disabled={current === 0}
              className="p-2 rounded-full bg-black/30 disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={next}
              disabled={current === cars.length - 1}
              className="p-2 rounded-full bg-black/30 disabled:opacity-40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventoryflex;