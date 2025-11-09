import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

// ✅ FIXED: Removed trailing spaces
const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com";

const Inventory = () => {
  const [cars, setCars] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get auth token
  const authToken = localStorage.getItem("authToken");

  // Build fast currency lookup
  const currencyMap = useMemo(() => {
    const map = new Map();
    currencies.forEach(c => {
      if (c.id !== undefined) map.set(c.id, c);
    });
    return map;
  }, [currencies]);

  // Fetch data on mount
  useEffect(() => {
    if (!authToken) {
      setError("Non autorisé. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ Fetch currencies WITH auth header
        const currencyRes = await fetch(`${API_BASE_URL}/currencies/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`, // 🔑 Required by your API
          },
        });

        if (!currencyRes.ok) {
          const errData = await currencyRes.json().catch(() => ({}));
          throw new Error(errData.detail || "Échec du chargement des devises");
        }
        const currencyData = await currencyRes.json();
        // Your API likely returns { "currencies": [...] } or just array — handle both
        setCurrencies(Array.isArray(currencyData) ? currencyData : currencyData.currencies || []);

        // ✅ Fetch cars WITH auth + correct body
        const carRes = await fetch(`${API_BASE_URL}/cars/all`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`, // 🔑 Required
          },
          body: JSON.stringify({}), // Matches `getCars` schema (all optional)
        });

        if (!carRes.ok) {
          const errData = await carRes.json().catch(() => ({}));
          throw new Error(errData.detail || "Échec du chargement des véhicules");
        }
        const carData = await carRes.json();
        // Handle response structure: your API may return { "cars": [...] }
        const carList = Array.isArray(carData) ? carData : carData.cars || [];
        setCars(carList);
      } catch (err) {
        console.error("Inventory fetch error:", err);
        setError(err.message || "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken]);

  // Format price in DZD (in millions)
  const formatPriceInMillions = (priceInDZD) => {
    if (priceInDZD == null || priceInDZD === 0) return "Prix non disponible";
    const millions = priceInDZD / 1_000_000;
    return `${millions.toFixed(1)} Millions DZD`;
  };

  // Get car image safely
  const getCarImage = (car) => {
    if (Array.isArray(car.images) && car.images.length > 0) {
      // If images are URLs
      if (typeof car.images[0] === "string") return car.images[0];
      // If images are objects with url field (adjust if needed)
      if (car.images[0]?.url) return car.images[0].url;
    }
    return "/placeholder-car.jpg"; // Make sure this exists in public/
  };

  const totalres = cars.length;

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

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-neutral-600 text-xl font-main">Chargement des véhicules...</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-[3vw] mt-[3vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {cars.length === 0 ? (
            <div className="col-span-full text-center py-10 text-neutral-600">
              Aucun véhicule disponible pour le moment.
            </div>
          ) : (
            cars.map((car) => {
              const currency = currencyMap.get(car.currency_id);
              const priceInDZD = currency ? car.price * currency.exchange_rate_to_dzd : null;
              const formattedPrice = formatPriceInMillions(priceInDZD);

              return (
                <motion.div
                  key={car.id || car.model + car.year}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 1 }}
                  className="cursor-pointer h-[50vh] w-[20vw] bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col"
                >
                  <div className="h-[60%] bg-neutral-300 relative">
                    <img
                      src={getCarImage(car)}
                      alt={`${car.model} ${car.year}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-car.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="flex flex-col justify-center h-[40%] p-4">
                    <h1 className="font-main text-[1.2vw] max-md:text-[4.5vw] text-neutral-800">
                      {car.model} {car.year ? `(${car.year})` : ""}
                    </h1>
                    <p className="font-main font-light text-[1vw] max-md:text-[3.5vw] text-neutral-600">
                      {formattedPrice}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Inventory;