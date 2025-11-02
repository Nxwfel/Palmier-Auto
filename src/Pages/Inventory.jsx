import React, { useState } from "react";
import { motion } from "framer-motion";

const Inventory = () => {
  const [totalres, setTotalres] = useState(8);

  const cars = [
    { name: "Kia Sportage", price: "250 Millions", image: "/cars/sportage.jpg" },
    { name: "Hyundai Tucson", price: "245 Millions", image: "/cars/tucson.jpg" },
    { name: "Toyota Corolla", price: "210 Millions", image: "/cars/corolla.jpg" },
    { name: "Peugeot 3008", price: "270 Millions", image: "/cars/3008.jpg" },
    { name: "Dacia Duster", price: "190 Millions", image: "/cars/duster.jpg" },
    { name: "Volkswagen Tiguan", price: "310 Millions", image: "/cars/tiguan.jpg" },
    { name: "Renault Megane", price: "220 Millions", image: "/cars/megane.jpg" },
    { name: "Nissan Qashqai", price: "260 Millions", image: "/cars/qashqai.jpg" },
  ];

  return (
    <div className="min-h-screen w-screen bg-neutral-100 flex flex-col px-[5vw] py-[4vh]">
      {/* Header */}
      <div className="z-20 h-[10vh] w-full flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.03 }}
          className="font-main cursor-pointer font-thin text-[2.2vw] max-md:text-[6vw] text-neutral-800"
        >
          Palmier Auto
        </motion.h1>
      </div>

      {/* Filter Bar */}
      <div className="h-[10vh] w-full flex justify-between items-center gap-[2vw] max-md:flex-col max-md:items-start max-md:gap-[1vh]">
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          className="flex justify-center items-center cursor-pointer bg-white px-4 py-2 rounded-full shadow-md gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 text-neutral-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
            />
          </svg>
          <p className="font-main text-neutral-700 text-[1vw] max-md:text-[3.5vw]">
            Filtrer
          </p>
        </motion.div>

        <p className="font-main pr-[3vw] text-neutral-700 text-[1vw] max-md:text-[3.5vw]">
          Résultat : {totalres}
        </p>
      </div>

      {/* Cars Grid */}
      <motion.div
        className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-[3vw] mt-[3vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {cars.map((car, index) => (
          <motion.div
            key={index}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 1 }}
            className="cursor-pointer h-[50vh] w-[20vw] bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="h-[60%] bg-neutral-300 relative">
              <img
                src={car.image}
                alt={car.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="flex flex-col justify-center h-[40%] p-4">
              <h1 className="font-main text-[1.2vw] max-md:text-[4.5vw] text-neutral-800">
                {car.name}
              </h1>
              <p className="font-main font-light text-[1vw] max-md:text-[3.5vw] text-neutral-600">
                {car.price}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Inventory;
