import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com";

const Inventory = () => {
  const [cars, setCars] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [carImages, setCarImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    model: "",
    color: "",
    yearMin: "",
    yearMax: "",
    engine: "",
    fuelType: "",
    country: "",
    priceMin: "",
    priceMax: ""
  });

  const currencyMap = useMemo(() => {
    const map = new Map();
    currencies.forEach(c => {
      if (c.id !== undefined) map.set(c.id, c);
    });
    return map;
  }, [currencies]);

  // Fetch car images
  const fetchCarImages = async (carId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cars/${carId}/images`, {
        method: "GET",
      });

      if (!response.ok) {
        console.warn(`Failed to fetch images for car ${carId}`);
        return null;
      }

      const data = await response.json();
      
      // API returns: { "car_id": 1, "images": ["/cars_images/1/2.png", ...] }
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        // Convert relative path to full URL
        const imagePath = data.images[0];
        return `${API_BASE_URL}${imagePath}`;
      }
      
      return null;
    } catch (err) {
      console.warn(`Error fetching image for car ${carId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch currencies
        const currencyRes = await fetch(`${API_BASE_URL}/currencies/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!currencyRes.ok) {
          const errData = await currencyRes.json().catch(() => ({}));
          throw new Error(errData.detail || "Échec du chargement des devises");
        }
        const currencyData = await currencyRes.json();
        setCurrencies(Array.isArray(currencyData) ? currencyData : currencyData.currencies || []);

        // Fetch cars
        const carRes = await fetch(`${API_BASE_URL}/cars/all`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        if (!carRes.ok) {
          const errData = await carRes.json().catch(() => ({}));
          throw new Error(errData.detail || "Échec du chargement des véhicules");
        }
        const carData = await carRes.json();
        const carList = Array.isArray(carData) ? carData : carData.cars || [];
        setCars(carList);

        // Fetch images for each car
        const imagePromises = carList.map(async (car) => {
          if (car.id) {
            const imageUrl = await fetchCarImages(car.id);
            return { id: car.id, imageUrl };
          }
          return { id: car.id, imageUrl: null };
        });

        const imageResults = await Promise.all(imagePromises);
        const imageMap = {};
        imageResults.forEach(({ id, imageUrl }) => {
          if (imageUrl) imageMap[id] = imageUrl;
        });
        setCarImages(imageMap);

      } catch (err) {
        console.error("Inventory fetch error:", err);
        setError(err.message || "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format price in DZD (in millions)
  const formatPriceInMillions = (priceInDZD) => {
    if (priceInDZD == null || priceInDZD === 0) return "Prix non disponible";
    const millions = priceInDZD / 1_000_0;
    return `${millions.toFixed(1)} Millions DZD`;
  };

  // Get car image
  const getCarImage = (car) => {
    // First try from our fetched images (already formatted with full URL)
    if (carImages[car.id]) {
      return carImages[car.id];
    }
    
    // Then try from car data itself (if images are included in the car object)
    if (Array.isArray(car.images) && car.images.length > 0) {
      const img = car.images[0];
      if (typeof img === "string") {
        // Check if it's already a full URL
        if (img.startsWith("http")) return img;
        // Check if it's a relative path
        if (img.startsWith("/")) return `${API_BASE_URL}${img}`;
        // Check if it's a base64 string
        if (img.startsWith("data:image")) return img;
      }
      if (img?.url) return img.url;
    }
    
    return "/placeholder-car.jpg";
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (key) => {
    const values = [...new Set(cars.map(car => car[key]).filter(Boolean))];
    return values.sort();
  };

  // Apply filters to cars
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const currency = currencyMap.get(car.currency_id);
      const priceInDZD = currency ? car.price * currency.exchange_rate_to_dzd : 0;
      const priceInMillions = priceInDZD / 1_000_000;

      if (filters.model && !car.model?.toLowerCase().includes(filters.model.toLowerCase())) {
        return false;
      }
      if (filters.color && car.color?.toLowerCase() !== filters.color.toLowerCase()) {
        return false;
      }
      if (filters.yearMin && car.year < parseInt(filters.yearMin)) {
        return false;
      }
      if (filters.yearMax && car.year > parseInt(filters.yearMax)) {
        return false;
      }
      if (filters.engine && !car.engine?.toLowerCase().includes(filters.engine.toLowerCase())) {
        return false;
      }
      if (filters.fuelType && car.fuel_type?.toLowerCase() !== filters.fuelType.toLowerCase()) {
        return false;
      }
      if (filters.country && car.country?.toLowerCase() !== filters.country.toLowerCase()) {
        return false;
      }
      if (filters.priceMin && priceInMillions < parseFloat(filters.priceMin)) {
        return false;
      }
      if (filters.priceMax && priceInMillions > parseFloat(filters.priceMax)) {
        return false;
      }
      return true;
    });
  }, [cars, filters, currencyMap]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      model: "",
      color: "",
      yearMin: "",
      yearMax: "",
      engine: "",
      fuelType: "",
      country: "",
      priceMin: "",
      priceMax: ""
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== "").length;

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
      <div className="h-auto w-full flex flex-col gap-[2vh]">
        <div className="flex justify-between items-center gap-[2vw] max-md:flex-col max-md:items-start max-md:gap-[1vh]">
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex justify-center items-center cursor-pointer bg-white px-4 py-2 rounded-full shadow-md gap-2 relative"
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
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </motion.div>

          <p className="font-main pr-[3vw] text-neutral-700 text-[1vw] max-md:text-[3.5vw]">
            Résultat : {filteredCars.length}
          </p>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6 grid grid-cols-3 max-md:grid-cols-1 gap-4">
                {/* Model Filter */}
                <div>
                  <label className="block text-sm font-main text-neutral-700 mb-2">Modèle</label>
                  <input
                    type="text"
                    value={filters.model}
                    onChange={(e) => handleFilterChange("model", e.target.value)}
                    placeholder="Rechercher un modèle..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Color Filter */}
                <div>
                  <label className="block text-sm font-main text-neutral-700 mb-2">Couleur</label>
                  <select
                    value={filters.color}
                    onChange={(e) => handleFilterChange("color", e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Toutes</option>
                    {getUniqueValues("color").map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                {/* Year Range */}
                <div>
                  <label className="block text-sm font-main text-neutral-700 mb-2">Année</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.yearMin}
                      onChange={(e) => handleFilterChange("yearMin", e.target.value)}
                      placeholder="Min"
                      className="w-1/2 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={filters.yearMax}
                      onChange={(e) => handleFilterChange("yearMax", e.target.value)}
                      placeholder="Max"
                      className="w-1/2 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-main text-neutral-700 mb-2">Carburant</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => handleFilterChange("fuelType", e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous</option>
                    {getUniqueValues("fuel_type").map(fuel => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-main text-neutral-700 mb-2">Pays</label>
                  <select
                    value={filters.country}
                    onChange={(e) => handleFilterChange("country", e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tous</option>
                    {getUniqueValues("country").map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range (in Millions DZD) */}
                <div>
                  <label className="block text-sm font-main text-neutral-700 mb-2">Prix (Millions DZD)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                      placeholder="Min"
                      className="w-1/2 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                      placeholder="Max"
                      className="w-1/2 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Reset Button */}
                <div className="col-span-3 max-md:col-span-1 flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-lg transition-colors font-main"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center mt-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800"></div>
            <p className="text-neutral-600 text-xl font-main">Chargement des véhicules...</p>
          </div>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-4 max-lg:grid-cols-3 max-md:h-fit max-md:flex max-md:flex-col max-md:gap-[2vh] max-md:items-center max-md:justify-center max-md:py-[5vh] max-sm:grid-cols-1 gap-[3vw] mt-[3vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {filteredCars.length === 0 ? (
            <div className="col-span-full text-center py-10 text-neutral-600">
              {activeFilterCount > 0 
                ? "Aucun véhicule ne correspond aux critères de filtrage."
                : "Aucun véhicule disponible pour le moment."}
            </div>
          ) : (
            filteredCars.map((car) => {
              const currency = currencyMap.get(car.currency_id);
              const priceInDZD = currency ? car.price * currency.exchange_rate_to_dzd : null;
              const formattedPrice = formatPriceInMillions(priceInDZD);

              return (
                <motion.div
                  key={car.id || car.model + "-" + car.year}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 1 }}
                  className="cursor-pointer h-[50vh] max-md:h-[60vh] w-[20vw] max-md:w-[60vw] bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col"
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
                    {car.quantity && (
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <p className="text-xs font-main text-neutral-700">Stock: {car.quantity}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center h-[40%] p-4">
                    <h1 className="font-main text-[1.2vw] max-md:text-[4.5vw] text-neutral-800 font-semibold">
                      {car.model} {car.year ? `(${car.year})` : ""}
                    </h1>
                    <p className="font-main text-[0.9vw] max-md:text-[3vw] text-neutral-500">
                      {car.color} • {car.fuel_type}
                    </p>
                    <p className="font-main font-semibold text-[1vw] max-md:text-[3.5vw] text-blue-600 mt-2">
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