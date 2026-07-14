import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, X, Image as ImageIcon, Search } from "lucide-react";
import { parseColors } from "../lib/utils";
import { apiFetch } from "../lib/api";

const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com";

const MarketingAgent = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [filter, setFilter] = useState({
    model: "",
    color: "",
    yearFrom: "",
    yearTo: "",
    country: "",
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // View images
  const [showCarImages, setShowCarImages] = useState(false);
  const [selectedCarForImages, setSelectedCarForImages] = useState(null);
  const [carImages, setCarImages] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found");
      window.location.href = "/marketinglogin";
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetchCurrencies();
      await fetchCars();
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await apiFetch(`${API_BASE_URL}/cars/all`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error(`Failed to fetch cars: ${response.status}`);
      const data = await response.json();
      const normalized = (Array.isArray(data) ? data : []).map(car => {
        const colors = parseColors(car.color);
        return { ...car, colors, color: colors[0] || car.color };
      });
      setCars(normalized);
    } catch (error) {
      console.error("Error fetching cars:", error);
      throw error;
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await apiFetch(`${API_BASE_URL}/currencies/`);
      if (!response.ok) throw new Error(`Failed to fetch currencies: ${response.status}`);
      const data = await response.json();
      setCurrencies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      throw error;
    }
  };

  const currencyMap = useMemo(() => {
    return currencies.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }, [currencies]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const clearFilter = () => {
    setFilter({ model: "", color: "", yearFrom: "", yearTo: "", country: "" });
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchModel = car.model.toLowerCase().includes(filter.model.toLowerCase());
      const matchColor = car.color ? car.color.toLowerCase().includes(filter.color.toLowerCase()) : true;
      const matchCountry = car.country ? car.country.toLowerCase().includes(filter.country.toLowerCase()) : true;
      const matchYearFrom = filter.yearFrom ? car.year >= parseInt(filter.yearFrom) : true;
      const matchYearTo = filter.yearTo ? car.year <= parseInt(filter.yearTo) : true;
      return matchModel && matchColor && matchCountry && matchYearFrom && matchYearTo;
    });
  }, [cars, filter]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleViewImages = async (car) => {
    setSelectedCarForImages(car);
    setCarImages([]); // Reset while loading
    setShowCarImages(true);
    try {
      const res = await apiFetch(`${API_BASE_URL}/cars/${car.id}/images`);
      if (res.ok) {
        const data = await res.json();
        setCarImages(Array.isArray(data) ? data : []);
      } else {
        // Fallback to car.images if the endpoint fails or isn't populated
        console.warn(`Failed to fetch images for car ${car.id}, falling back to car.images`);
        setCarImages(Array.isArray(car.images) ? car.images : []);
      }
    } catch (err) {
      console.error("Error fetching car images:", err);
      setCarImages(Array.isArray(car.images) ? car.images : []);
    }
  };

  if (loading && cars.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex font-sans overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-64 bg-neutral-900 border-r border-neutral-800 p-6 z-50 shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white tracking-wide">
                Marketing
              </h2>
              <button onClick={toggleMenu} className="text-neutral-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex-1 space-y-2">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium bg-emerald-600 text-white`}
              >
                <Car size={20} /> Inventaire
              </button>
            </nav>
            
            <button
              onClick={() => {
                localStorage.removeItem("authToken");
                window.location.href = "/marketinglogin";
              }}
              className="mt-auto w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors font-medium text-left"
            >
              Déconnexion
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen w-screen px-[3vw] py-[2vh] text-neutral-100 relative overflow-y-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.3}
          stroke="gray"
          onClick={toggleMenu}
          className="size-[5vh] cursor-pointer my-[2vh] hover:scale-110 transition-all"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
        </svg>

        <div className="flex justify-between items-center mb-6">
          <div
            onClick={() => setShowFilter(true)}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
          >
            <Search size={20} className="text-emerald-400" />
            <h1 className="text-sm font-sans">Filtrer</h1>
          </div>
          <h1 className="text-sm text-neutral-400">Total: {filteredCars.length}</h1>
        </div>

        {/* Filter Modal */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="absolute top-[10vh] left-1/2 -translate-x-1/2 bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-lg z-30 w-[90%] md:w-[60%]"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-emerald-400">Filtrer les voitures</h2>
                <button onClick={() => setShowFilter(false)} className="text-neutral-400 hover:text-red-500 transition">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input name="model" value={filter.model} onChange={handleFilterChange} placeholder="Modèle" className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                <input name="color" value={filter.color} onChange={handleFilterChange} placeholder="Couleur" className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                <input name="country" value={filter.country} onChange={handleFilterChange} placeholder="Pays" className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                <input name="yearFrom" value={filter.yearFrom} onChange={handleFilterChange} placeholder="Année min" type="number" className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                <input name="yearTo" value={filter.yearTo} onChange={handleFilterChange} placeholder="Année max" type="number" className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button onClick={clearFilter} className="bg-neutral-700 hover:bg-neutral-600 transition px-4 py-2 rounded-xl text-sm">
                  Réinitialiser
                </button>
                <button onClick={() => setShowFilter(false)} className="bg-emerald-600 hover:bg-emerald-700 transition px-4 py-2 rounded-xl text-sm">
                  Appliquer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
            <Car size={22} /> Résultats du filtrage
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-500/20 text-red-400 rounded-xl border border-red-500/50">
              {error}
            </div>
          )}

          {filteredCars.length === 0 ? (
            <p className="text-neutral-500">Aucune voiture trouvée.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-neutral-800 text-neutral-400 text-sm">
                  <tr>
                    <th className="p-2">Modèle</th>
                    <th className="p-2">Couleur</th>
                    <th className="p-2">Année</th>
                    <th className="p-2">Pays</th>
                    <th className="p-2">Prix</th>
                    <th className="p-2">Prix gros</th>
                    <th className="p-2">Devise</th>
                    <th className="p-2">Kilométrage</th>
                    <th className="p-2">Quantité</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car) => (
                    <tr key={car.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                      <td className="p-2">{car.model}</td>
                      <td className="p-2">{car.color}</td>
                      <td className="p-2">{car.year}</td>
                      <td className="p-2">{car.country}</td>
                      <td className="p-2">{car.price}</td>
                      <td className="p-2">{car.wholesale_price}</td>
                      <td className="p-2">{currencyMap[car.currency_id]?.name || "Unknown"}</td>
                      <td className="p-2">{car.milage}</td>
                      <td className="p-2">{car.quantity}</td>
                      <td className="p-2 flex gap-2">
                        <button onClick={() => handleViewImages(car)} className="text-emerald-400 hover:text-emerald-500 flex items-center gap-1" title="Voir les images">
                          <ImageIcon size={18} /> Images
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Car Images Modal */}
      <AnimatePresence>
        {showCarImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCarImages(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ImageIcon className="text-emerald-400" /> 
                  Images - {selectedCarForImages?.model}
                </h2>
                <button onClick={() => setShowCarImages(false)} className="text-neutral-400 hover:text-white transition">
                  <X size={24} />
                </button>
              </div>

              {carImages.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Aucune image disponible.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {carImages.map((img, i) => {
                    const src = typeof img === 'string' ? img : (img.url || img.image_url || `${API_BASE_URL}/download_static_files/${img.key || img.image_key}`);
                    return (
                      <div key={i} className="aspect-video bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
                        <img 
                          src={src} 
                          alt={`Car view ${i+1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23333%22 width=%22100%22 height=%22100%22/><text fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22>No Image</text></svg>'; }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MarketingAgent;
