import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const CarDetails = () => {
  const colors = [
    { name: "Bleu Glacier", hex: "#A7C7E7" },
    { name: "Noir Mat", hex: "#111827" },
    { name: "Gris Argenté", hex: "#D1D5DB" },
    { name: "Rouge Passion", hex: "#DC2626" },
  ];
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const containerRef = useRef(null);
  const previewRef = useRef(null);

  const handleBuy = () => {
    gsap.to(".buy-btn", {
      scale: 1.05,
      yoyo: true,
      repeat: 1,
      duration: 0.2,
      ease: "power2.inOut",
    });
    alert(`🚗 Merci ! Vous avez choisi la couleur ${selectedColor.name}.`);
  };

  // GSAP animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
      });
      gsap.from(".car-img", {
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        delay: 0.3,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // GSAP color transition
  useEffect(() => {
    gsap.to(previewRef.current, {
      backgroundColor: selectedColor.hex,
      duration: 0.8,
      ease: "power2.inOut",
    });
  }, [selectedColor]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900 flex flex-col items-center py-12 px-6 overflow-hidden"
    >
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-7xl flex justify-between items-center mb-10 fade-up"
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">
          Palmier Auto — <span className="text-blue-600">Model X</span>
        </h1>
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Retour
        </button>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 fade-up">
        {/* LEFT SECTION */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              "https://images.unsplash.com/photo-1604147495798-57c855a70ef8",
              "https://images.unsplash.com/photo-1604147706283-3727c707b3ed",
              "https://images.unsplash.com/photo-1604147705911-6a2d9b6b9d4b",
            ].map((img, idx) => (
              <motion.img
                key={idx}
                src={img}
                alt="Car"
                className="car-img rounded-lg object-cover w-full h-40 shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 150 }}
              />
            ))}
          </div>

          <div
            ref={previewRef}
            className="w-full h-72 rounded-xl flex items-center justify-center shadow-inner transition-all"
            style={{ backgroundColor: selectedColor.hex }}
          >
            <motion.h2
              className={`text-2xl font-semibold ${
                selectedColor.name === "Noir Mat" ? "text-white" : "text-black"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Aperçu ({selectedColor.name})
            </motion.h2>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-semibold mb-3 text-gray-800 fade-up">
              Voiture Électrique Haut de Gamme
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed fade-up">
              Confort, puissance et innovation. Découvrez une expérience de
              conduite futuriste avec un design raffiné et des performances
              électrisantes.
            </p>

            <motion.h3
              className="text-4xl font-bold text-gray-900 mt-8 mb-4 fade-up"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              €29,999
            </motion.h3>

            {/* COLORS */}
            <div className="mt-4 fade-up">
              <p className="text-gray-700 font-medium mb-2">Couleur</p>
              <div className="flex gap-3 mt-2 items-center">
                {colors.map((c) => (
                  <motion.button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    whileHover={{ scale: 1.15 }}
                    className={`h-9 w-9 rounded-full border-2 shadow-inner ${
                      selectedColor.name === c.name
                        ? "ring-2 ring-gray-700"
                        : ""
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                <span className="ml-3 text-sm text-gray-600">
                  Sélectionné :{" "}
                  <span className="font-semibold">{selectedColor.name}</span>
                </span>
              </div>
            </div>

            {/* SPECS */}
            <div className="mt-8 fade-up">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Spécifications Techniques
              </h4>
              <div className="border-t border-gray-200">
                {[
                  ["Puissance maximale", "510 ch"],
                  ["Vitesse maximale", "200 km/h"],
                  ["Autonomie (WLTP)", "510 km"],
                  ["0–100 km/h", "4.5 s"],
                  ["Transmission", "Intégrale"],
                  ["Poids", "2290 kg"],
                ].map(([label, value], idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-2 text-sm text-gray-700 border-b border-gray-100"
                  >
                    <span>{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BUY BUTTON */}
          <motion.button
            onClick={handleBuy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="buy-btn w-full mt-10 py-4 bg-black text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-gray-800 fade-up"
          >
            Acheter maintenant
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
