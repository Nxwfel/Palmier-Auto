import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronRight, Loader2 } from "lucide-react";

const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com";

const ITEMS_PER_PAGE = 12;

const Inventory = () => {
  const [cars, setCars] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [carImages, setCarImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const navigate = useNavigate();
  
  const observerTarget = useRef(null);
  
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

  // Helper function to parse colors
  const parseColors = (colorData) => {
    if (!colorData) return [];
    if (Array.isArray(colorData)) return colorData;
    if (typeof colorData === 'string') {
      return colorData.split(',').map(c => c.trim()).filter(Boolean);
    }
    return [];
  };

  // Fetch car images with caching
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
      
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
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

        const currencyRes = await fetch(`${API_BASE_URL}/currencies/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!currencyRes.ok) {
          const errData = await currencyRes.json().catch(() => ({}));
          throw new Error(errData.detail || "Échec du chargement des devises");
        }
        const currencyData = await currencyRes.json();
        setCurrencies(Array.isArray(currencyData) ? currencyData : currencyData.currencies || []);

        const carRes = await fetch(`${API_BASE_URL}/cars/all`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (!carRes.ok) {
          const errData = await carRes.json().catch(() => ({}));
          throw new Error(errData.detail || "Échec du chargement des véhicules");
        }
        const carData = await carRes.json();
        const carList = Array.isArray(carData) ? carData : carData.cars || [];
        setCars(carList);

        const initialCars = carList.slice(0, ITEMS_PER_PAGE);
        const imagePromises = initialCars.map(async (car) => {
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

  const formatPriceInMillions = (priceInDZD) => {
    if (priceInDZD == null || priceInDZD === 0) return "Prix sur demande";
    const millions = priceInDZD / 1_000_0;
    return `${millions.toFixed(1)}M DZD`;
  };

  const getCarImage = (car) => {
    if (carImages[car.id]) return carImages[car.id];
    if (Array.isArray(car.images) && car.images.length > 0) {
      const img = car.images[0];
      if (typeof img === "string") {
        if (img.startsWith("http")) return img;
        if (img.startsWith("/")) return `${API_BASE_URL}${img}`;
        if (img.startsWith("data:image")) return img;
      }
      if (img?.url) return img.url;
    }
    return "/placeholder-car.jpg";
  };

  const getUniqueValues = (key) => {
    if (key === 'color') {
      const allColors = new Set();
      cars.forEach(car => {
        const colors = parseColors(car.color);
        colors.forEach(c => allColors.add(c));
      });
      return Array.from(allColors).sort();
    }
    const values = [...new Set(cars.map(car => car[key]).filter(Boolean))];
    return values.sort();
  };

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      const currency = currencyMap.get(car.currency_id);
      const priceInDZD = currency ? car.price * currency.exchange_rate_to_dzd : 0;
      const priceInMillions = priceInDZD / 1_000_000;

      if (filters.model && !car.model?.toLowerCase().includes(filters.model.toLowerCase().trim())) return false;
      if (filters.color) {
        const carColors = parseColors(car.color);
        if (!carColors.some(c => c.toLowerCase() === filters.color.toLowerCase().trim())) return false;
      }
      if (filters.yearMin && car.year < parseInt(filters.yearMin)) return false;
      if (filters.yearMax && car.year > parseInt(filters.yearMax)) return false;
      if (filters.fuelType && car.fuel_type?.toLowerCase() !== filters.fuelType.toLowerCase().trim()) return false;
      if (filters.country && car.country?.toLowerCase() !== filters.country.toLowerCase().trim()) return false;
      if (filters.priceMin && priceInMillions < parseFloat(filters.priceMin)) return false;
      if (filters.priceMax && priceInMillions > parseFloat(filters.priceMax)) return false;

      return true;
    });
  }, [cars, filters, currencyMap]);

  const displayedCars = useMemo(() => {
    return filteredCars.slice(0, displayCount);
  }, [filteredCars, displayCount]);

  const loadMoreImages = useCallback(async (startIndex, endIndex) => {
    const carsToLoadImages = filteredCars.slice(startIndex, endIndex);
    const newImagePromises = carsToLoadImages
      .filter(car => car.id && !carImages[car.id])
      .map(async (car) => {
        const imageUrl = await fetchCarImages(car.id);
        return { id: car.id, imageUrl };
      });

    if (newImagePromises.length > 0) {
      const imageResults = await Promise.all(newImagePromises);
      const newImageMap = { ...carImages };
      imageResults.forEach(({ id, imageUrl }) => {
        if (imageUrl) newImageMap[id] = imageUrl;
      });
      setCarImages(newImageMap);
    }
  }, [filteredCars, carImages]);

  const loadMore = useCallback(async () => {
    if (displayCount >= filteredCars.length || loadingMore) return;

    setLoadingMore(true);
    const newDisplayCount = Math.min(displayCount + ITEMS_PER_PAGE, filteredCars.length);
    await loadMoreImages(displayCount, newDisplayCount);
    setDisplayCount(newDisplayCount);
    setLoadingMore(false);
  }, [displayCount, filteredCars.length, loadingMore, loadMoreImages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && displayCount < filteredCars.length) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);
    return () => { if (currentTarget) observer.unobserve(currentTarget); };
  }, [loadMore, loadingMore, displayCount, filteredCars.length]);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      model: "", color: "", yearMin: "", yearMax: "", engine: "",
      fuelType: "", country: "", priceMin: "", priceMax: ""
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== "").length;
  const getDisplayColor = (car) => {
    const colors = parseColors(car.color);
    return colors.length > 0 ? colors[0] : car.color || "N/A";
  };
  const hasMore = displayCount < filteredCars.length;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-6">
          <div className="flex justify-between items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              className="font-main cursor-pointer text-3xl md:text-4xl text-neutral-800 tracking-tight"
              onClick={() => navigate('/')}
            >
              Palmier <span className="text-amber-500">Auto</span>
            </motion.h1>

            <motion.button
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="hidden md:flex items-center gap-3 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full shadow-lg transition-all relative"
            >
              <SlidersHorizontal size={18} />
              <span className="font-medium">Filtres</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>
          </div>

          <div className="mt-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text" value={filters.model}
                onChange={(e) => handleFilterChange("model", e.target.value)}
                placeholder="Rechercher un modèle..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white rounded-2xl"
            >
              <SlidersHorizontal size={18} />
              <span>Tous les filtres</span>
              {activeFilterCount > 0 && (
                <span className="bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-main text-neutral-800">Filtres</h2>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-neutral-100 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Modèle</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input type="text" value={filters.model}
                      onChange={(e) => handleFilterChange("model", e.target.value)}
                      placeholder="Rechercher..."
                      className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Couleur</label>
                  <select value={filters.color} onChange={(e) => handleFilterChange("color", e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                    <option value="">Toutes les couleurs</option>
                    {getUniqueValues("color").map(color => <option key={color} value={color}>{color}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Année</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" value={filters.yearMin}
                      onChange={(e) => handleFilterChange("yearMin", e.target.value)}
                      placeholder="Min"
                      className="px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <input type="number" value={filters.yearMax}
                      onChange={(e) => handleFilterChange("yearMax", e.target.value)}
                      placeholder="Max"
                      className="px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Carburant</label>
                  <select value={filters.fuelType} onChange={(e) => handleFilterChange("fuelType", e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                    <option value="">Tous types</option>
                    {getUniqueValues("fuel_type").map(fuel => <option key={fuel} value={fuel}>{fuel}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Pays d'origine</label>
                  <select value={filters.country} onChange={(e) => handleFilterChange("country", e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                    <option value="">Tous les pays</option>
                    {getUniqueValues("country").map(country => <option key={country} value={country}>{country}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Prix (Millions DZD)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" value={filters.priceMin}
                      onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                      placeholder="Min" step="0.1"
                      className="px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <input type="number" value={filters.priceMax}
                      onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                      placeholder="Max" step="0.1"
                      className="px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={resetFilters}
                    className="flex-1 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-medium">
                    Réinitialiser
                  </button>
                  <button onClick={() => setShowFilters(false)}
                    className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium">
                    Appliquer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-8">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-neutral-600 font-medium">
            {displayedCars.length} sur {filteredCars.length} véhicule{filteredCars.length !== 1 ? 's' : ''}
          </p>
          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="text-sm text-amber-600 hover:text-amber-700 font-medium">
              Effacer les filtres
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-neutral-600 text-lg font-medium">Chargement de la collection...</p>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              {filteredCars.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-10 h-10 text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-800 mb-2">Aucun véhicule trouvé</h3>
                    <p className="text-neutral-600 mb-6">
                      {activeFilterCount > 0 ? "Essayez d'ajuster vos critères" : "Aucun véhicule disponible"}
                    </p>
                    {activeFilterCount > 0 && (
                      <button onClick={resetFilters}
                        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium">
                        Réinitialiser les filtres
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                displayedCars.map((car, index) => {
                  const currency = currencyMap.get(car.currency_id);
                  const priceInDZD = currency ? car.price * currency.exchange_rate_to_dzd : null;
                  const formattedPrice = formatPriceInMillions(priceInDZD);
                  const displayColor = getDisplayColor(car);

                  return (
                    <motion.div
                      key={car.id || `${car.model}-${car.year}`}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8 }}
                      onClick={() => navigate(`/car/${car.id}`)}
                      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                    >
                      <div className="relative h-56 overflow-hidden bg-neutral-100">
                        <img src={getCarImage(car)} alt={`${car.model} ${car.year}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { e.target.src = "/placeholder-car.jpg"; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        {car.quantity > 0 && (
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                            <p className="text-xs font-semibold text-neutral-700">En stock: {car.quantity}</p>
                          </div>
                        )}

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-xl">
                            <span className="font-semibold text-neutral-800">Voir détails</span>
                            <ChevronRight size={18} />
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-neutral-800 mb-1 line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {car.model}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
                          <span>{car.year}</span><span>•</span>
                          <span>{displayColor}</span><span>•</span>
                          <span>{car.fuel_type}</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                          <span className="text-xl font-bold text-amber-600">{formattedPrice}</span>
                          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                            <ChevronRight className="text-amber-600" size={20} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>

            {hasMore && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div ref={observerTarget} className="h-10 w-full" />
                {loadingMore ? (
                  <div className="flex items-center gap-3 text-neutral-600">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                    <span className="font-medium">Chargement...</span>
                  </div>
                ) : (
                  <button onClick={loadMore}
                    className="px-8 py-3 bg-white hover:bg-neutral-50 border-2 border-neutral-200 hover:border-amber-500 text-neutral-700 hover:text-amber-600 rounded-xl font-medium shadow-sm hover:shadow-md">
                    Charger plus de véhicules
                  </button>
                )}
                <p className="text-sm text-neutral-500">
                  {displayedCars.length} sur {filteredCars.length} véhicules affichés
                </p>
              </div>
            )}

            {!hasMore && filteredCars.length > 0 && (
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 rounded-full">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-neutral-600 font-medium">Vous avez vu tous les véhicules</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Inventory;