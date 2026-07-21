import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, X, Image as ImageIcon, Search, Plus } from "lucide-react";
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
  const [showAddCar, setShowAddCar] = useState(false);
  const [addCarLoading, setAddCarLoading] = useState(false);
  const [addCarError, setAddCarError] = useState("");
  const [addCarSuccess, setAddCarSuccess] = useState("");
  const initialCarForm = {
    model: "",
    description: "",
    color: "",
    year: "",
    engine: "",
    power: "",
    fuelType: "",
    milage: "",
    country: "",
    price: "",
    min_price: "",
    max_price: "",
    wholesale_price: "",
    num_chassis: "",
    shippingDate: "",
    arrivingDate: "",
    currency_id: "",
    quantity: "",
    customs_cleared: false,
    imageFiles: [],
  };
  const [carForm, setCarForm] = useState(initialCarForm);

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

  const openAddCarModal = () => {
    setCarForm(initialCarForm);
    setAddCarError("");
    setAddCarSuccess("");
    setShowAddCar(true);
  };

  const handleSubmitCar = async (e) => {
    e.preventDefault();
    if (!carForm.model || !carForm.currency_id || !carForm.quantity || !carForm.color || !carForm.min_price || !carForm.max_price) {
      setAddCarError("Please fill in all required fields.");
      return;
    }

    if (parseFloat(carForm.price) < parseFloat(carForm.min_price) || parseFloat(carForm.price) > parseFloat(carForm.max_price)) {
      setAddCarError(`Erreur: Le prix doit être entre ${carForm.min_price} et ${carForm.max_price}.`);
      return;
    }

    try {
      setAddCarLoading(true);
      setAddCarError("");
      setAddCarSuccess("");

      const formData = new FormData();
      formData.append("model", carForm.model);
      formData.append("description", carForm.description || "");

      const colorsArray = carForm.color.split(",").map((c) => c.trim()).filter(Boolean);
      colorsArray.forEach((color) => {
        formData.append("color", color);
      });

      if (carForm.num_chassis) {
        const chassisArray = carForm.num_chassis.split(",").map((c) => c.trim()).filter(Boolean);
        chassisArray.forEach((chassis) => formData.append("num_chassis", chassis));
      }

      formData.append("year", parseInt(carForm.year, 10) || new Date().getFullYear());
      formData.append("quantity", parseInt(carForm.quantity, 10) || 1);
      formData.append("engine", carForm.engine);
      formData.append("power", carForm.power);
      formData.append("fuel_type", carForm.fuelType);
      formData.append("milage", parseFloat(carForm.milage) || 0);
      formData.append("country", carForm.country);
      formData.append("price", parseFloat(carForm.price) || 0);
      formData.append("min_price", parseFloat(carForm.min_price));
      formData.append("max_price", parseFloat(carForm.max_price));
      formData.append("wholesale_price", parseFloat(carForm.wholesale_price) || 0);
      formData.append("shipping_date", carForm.shippingDate || new Date().toISOString().split("T")[0]);
      formData.append("arriving_date", carForm.arrivingDate || new Date().toISOString().split("T")[0]);
      formData.append("currency_id", parseInt(carForm.currency_id, 10));
      formData.append("customs_cleared", carForm.customs_cleared ? "true" : "false");

      if (carForm.imageFiles && carForm.imageFiles.length > 0) {
        Array.from(carForm.imageFiles).forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await apiFetch(`${API_BASE_URL}/cars/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 422) {
          const errorData = await response.json().catch(() => ({}));
          let msg = "Validation Error";
          if (Array.isArray(errorData.detail)) {
            msg = errorData.detail.map((e) => `${e.loc.join(".")}: ${e.msg}`).join("\n");
          } else if (errorData.detail) {
            msg = typeof errorData.detail === "string" ? errorData.detail : JSON.stringify(errorData.detail);
          }
          throw new Error(`HTTP 422:\n${msg}`);
        }
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      setShowAddCar(false);
      setCarForm(initialCarForm);
      setAddCarSuccess("Voiture ajoutée avec succès.");
      await fetchAllData();
    } catch (err) {
      console.error("Error saving car:", err);
      setAddCarError("Error saving car: " + err.message);
    } finally {
      setAddCarLoading(false);
    }
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

        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div
              onClick={() => setShowFilter(true)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
            >
              <Search size={20} className="text-emerald-400" />
              <h1 className="text-sm font-sans">Filtrer</h1>
            </div>
            <button
              onClick={openAddCarModal}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition text-sm font-medium"
            >
              <Plus size={18} /> Ajouter une voiture
            </button>
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

      <AnimatePresence>
        {showAddCar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddCar(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Ajouter une voiture</h2>
                <button onClick={() => setShowAddCar(false)} className="text-neutral-400 hover:text-white transition">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitCar} className="space-y-4">
                {addCarError && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                    {addCarError}
                  </div>
                )}
                {addCarSuccess && (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
                    {addCarSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    value={carForm.currency_id}
                    onChange={(e) => setCarForm({ ...carForm, currency_id: e.target.value })}
                    className="bg-neutral-800 p-2 rounded text-sm"
                    required
                  >
                    <option value="">Sélectionner la devise</option>
                    {currencies.map((curr) => (
                      <option key={curr.id} value={curr.id}>
                        {curr.name} ({curr.code?.toUpperCase() || ""})
                      </option>
                    ))}
                  </select>
                  <input
                    autoFocus
                    value={carForm.model}
                    onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
                    placeholder="Modèle *"
                    className="bg-neutral-800 p-2 rounded text-sm"
                    required
                  />
                  <input
                    value={carForm.color}
                    onChange={(e) => setCarForm({ ...carForm, color: e.target.value })}
                    placeholder="Couleurs (séparées par des virgules) *"
                    className="bg-neutral-800 p-2 rounded text-sm"
                    required
                  />

                  <textarea
                    value={carForm.description}
                    onChange={(e) => setCarForm({ ...carForm, description: e.target.value })}
                    placeholder="Description (optionnelle)"
                    className="bg-neutral-800 p-2 rounded text-sm md:col-span-3 min-h-[80px]"
                    rows="3"
                  />

                  <input
                    type="number"
                    value={carForm.year}
                    onChange={(e) => setCarForm({ ...carForm, year: e.target.value })}
                    placeholder="Année"
                    className="bg-neutral-800 p-2 rounded text-sm"
                  />
                  <input
                    value={carForm.engine}
                    onChange={(e) => setCarForm({ ...carForm, engine: e.target.value })}
                    placeholder="Moteur"
                    className="bg-neutral-800 p-2 rounded text-sm"
                  />
                  <input
                    value={carForm.power}
                    onChange={(e) => setCarForm({ ...carForm, power: e.target.value })}
                    placeholder="Puissance"
                    className="bg-neutral-800 p-2 rounded text-sm"
                  />
                  <input
                    value={carForm.fuelType}
                    onChange={(e) => setCarForm({ ...carForm, fuelType: e.target.value })}
                    placeholder="Carburant"
                    className="bg-neutral-800 p-2 rounded text-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={carForm.milage}
                    onChange={(e) => setCarForm({ ...carForm, milage: e.target.value })}
                    placeholder="Kilométrage"
                    className="bg-neutral-800 p-2 rounded text-sm"
                  />
                  <input
                    value={carForm.country}
                    onChange={(e) => setCarForm({ ...carForm, country: e.target.value })}
                    placeholder="Pays"
                    className="bg-neutral-800 p-2 rounded text-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={carForm.price}
                    onChange={(e) => setCarForm({ ...carForm, price: e.target.value })}
                    placeholder="Prix *"
                    className="bg-neutral-800 p-2 rounded text-sm"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={carForm.min_price}
                    onChange={(e) => setCarForm({ ...carForm, min_price: e.target.value })}
                    placeholder="Prix min *"
                    className="bg-neutral-800 p-2 rounded text-sm"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={carForm.max_price}
                    onChange={(e) => setCarForm({ ...carForm, max_price: e.target.value })}
                    placeholder="Prix max *"
                    className="bg-neutral-800 p-2 rounded text-sm"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={carForm.wholesale_price}
                    onChange={(e) => setCarForm({ ...carForm, wholesale_price: e.target.value })}
                    placeholder="Prix gros"
                    className="bg-neutral-800 p-2 rounded text-sm"
                  />
                  <input
                    value={carForm.num_chassis}
                    onChange={(e) => setCarForm({ ...carForm, num_chassis: e.target.value })}
                    placeholder="Numéro de chassis (séparés par des virgules)"
                    className="bg-neutral-800 p-2 rounded text-sm"
                  />
                  <input
                    type="number"
                    value={carForm.quantity}
                    onChange={(e) => setCarForm({ ...carForm, quantity: e.target.value })}
                    placeholder="Quantité *"
                    className="bg-neutral-800 p-2 rounded text-sm"
                    required
                  />
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-neutral-400">Date d'achat</span>
                    <input
                      type="date"
                      value={carForm.shippingDate}
                      onChange={(e) => setCarForm({ ...carForm, shippingDate: e.target.value })}
                      className="bg-neutral-800 p-2 rounded text-sm"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-neutral-400">Date d'arrivée</span>
                    <input
                      type="date"
                      value={carForm.arrivingDate}
                      onChange={(e) => setCarForm({ ...carForm, arrivingDate: e.target.value })}
                      className="bg-neutral-800 p-2 rounded text-sm"
                    />
                  </label>
                  <label className="flex items-center gap-2 col-span-3 cursor-pointer bg-neutral-800/60 px-3 py-2 rounded text-sm">
                    <input
                      type="checkbox"
                      checked={!!carForm.customs_cleared}
                      onChange={(e) => setCarForm({ ...carForm, customs_cleared: e.target.checked })}
                      className="w-4 h-4 rounded accent-emerald-500"
                    />
                    <span className="text-neutral-300">Dédouanée</span>
                  </label>
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-neutral-800 px-3 py-2 rounded text-sm">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setCarForm({ ...carForm, imageFiles: Array.from(e.target.files) })}
                      className="hidden"
                    />
                    📸 Ajouter des images
                  </label>
                  {carForm.imageFiles && carForm.imageFiles.length > 0 && (
                    <p className="text-xs text-neutral-400 mt-2">{carForm.imageFiles.length} fichier(s) sélectionné(s)</p>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddCar(false)} className="px-4 py-2 rounded bg-neutral-800/60 text-sm">
                    Annuler
                  </button>
                  <button type="submit" disabled={addCarLoading} className="px-4 py-2 rounded bg-emerald-500/20 text-emerald-400 text-sm disabled:opacity-60">
                    {addCarLoading ? "Enregistrement..." : "➕ Enregistrer"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MarketingAgent;
