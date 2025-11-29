import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Car, Trash2, Edit, X } from "lucide-react";

const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com";

// ✅ Enhanced apiFetch: preserves redirect intent on 401
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("authToken");
  const headers = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("authToken");
    const currentPath = window.location.pathname;
    const redirectParam = currentPath !== "/marketinglogin" ? `?redirect=${encodeURIComponent(currentPath)}` : "";
    window.location.href = `/marketinglogin${redirectParam}`;
    throw new Error("Session expired — please log in again");
  }

  return response;
};

const MarketingAgent = () => {
  const [cars, setCars] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);

  const currencyMap = useMemo(() => {
    const map = {};
    currencies.forEach((currency) => {
      map[currency.id] = currency;
    });
    return map;
  }, [currencies]);

  // ✅ Added wholesale_price to initial state
  const [formData, setFormData] = useState({
    currency_id: "",
    model: "",
    color: "",
    year: "",
    engine: "",
    power: "",
    fuel_type: "",
    milage: "", // kept as "milage" to match your backend spelling
    country: "",
    commercial_comission: "",
    quantity: "",
    price: "",
    wholesale_price: "", // ✅ ADDED
    shipping_date: "",
    arriving_date: "",
    images: [],
  });

  const [filter, setFilter] = useState({
    model: "",
    color: "",
    yearFrom: "",
    yearTo: "",
    country: "",
  });

  const [selectedCar, setSelectedCar] = useState(null);
  
  // ✅ Added wholesale_price to edit state
  const [editForm, setEditForm] = useState({
    car_id: "",
    currency_id: "",
    model: "",
    color: "",
    year: "",
    engine: "",
    power: "",
    fuel_type: "",
    milage: "",
    country: "",
    commercial_comission: "",
    quantity: "",
    price: "",
    wholesale_price: "", // ✅ ADDED
    shipping_date: "",
    arriving_date: "",
    images: [],
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("New");
  const [showFilter, setShowFilter] = useState(false);

  const isFieldEmpty = (value) => value === "" || value == null;

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchCars(), fetchCurrencies()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await apiFetch(`${API_BASE_URL}/cars/all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      setCars(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await apiFetch(`${API_BASE_URL}/currencies/`);
      const data = await response.json();
      setCurrencies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCar = async (e) => {
    e.preventDefault();


    // ✅ Added wholesale_price to required fields
    const requiredFields = [
      "currency_id",
      "model",
      "color",
      "year",
      "engine",
      "power",
      "fuel_type",
      "milage",
      "country",
      "commercial_comission",
      "quantity",
      "price",
      "wholesale_price", // ✅ ADDED
      "shipping_date",
      "arriving_date",
    ];

    for (const field of requiredFields) {
      if (isFieldEmpty(formData[field])) {
        alert("Veuillez remplir tous les champs obligatoires");
        return;
      }
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("currency_id", parseInt(formData.currency_id));
      formDataToSend.append("model", formData.model);
      formDataToSend.append("color", formData.color);
      formDataToSend.append("year", parseInt(formData.year));
      formDataToSend.append("engine", formData.engine);
      formDataToSend.append("power", formData.power);
      formDataToSend.append("fuel_type", formData.fuel_type);
      formDataToSend.append("milage", parseFloat(formData.milage));
      formDataToSend.append("country", formData.country);
      formDataToSend.append("commercial_comission", parseFloat(formData.commercial_comission));
      formDataToSend.append("quantity", parseInt(formData.quantity));
      formDataToSend.append("price", parseFloat(formData.price));
      formDataToSend.append("wholesale_price", parseFloat(formData.wholesale_price)); // ✅ ADDED
      formDataToSend.append("shipping_date", formData.shipping_date);
      formDataToSend.append("arriving_date", formData.arriving_date);
      formData.images.forEach(file => {
      formDataToSend.append("images", file);
    });
      const response = await apiFetch(`${API_BASE_URL}/cars/`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Voiture ajoutée avec succès!");
        setFormData({
          currency_id: "",
          model: "",
          color: "",
          year: "",
          engine: "",
          power: "",
          fuel_type: "",
          milage: "",
          country: "",
          commercial_comission: "",
          quantity: "",
          price: "",
          wholesale_price: "", // ✅ Reset
          shipping_date: "",
          arriving_date: "",
        });
        fetchCars();
      } else {
        const error = await response.json().catch(() => ({}));
        alert(`Erreur: ${error.detail ? JSON.stringify(error.detail) : "Échec de l'ajout"}`);
      }
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Erreur réseau lors de l'ajout");
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?")) return;

    try {
      const response = await apiFetch(`${API_BASE_URL}/cars/?car_id=${carId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Voiture supprimée !");
        fetchCars();
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Erreur réseau");
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const clearFilter = () => {
    setFilter({ model: "", color: "", yearFrom: "", yearTo: "", country: "" });
  };

  const filteredCars = cars.filter((car) => {
    if (filter.model && !car.model?.toLowerCase().includes(filter.model.toLowerCase())) return false;
    if (filter.color && !car.color?.toLowerCase().includes(filter.color.toLowerCase())) return false;
    if (filter.country && !car.country?.toLowerCase().includes(filter.country.toLowerCase())) return false;
    if (filter.yearFrom && Number(car.year) < Number(filter.yearFrom)) return false;
    if (filter.yearTo && Number(car.year) > Number(filter.yearTo)) return false;
    return true;
  });

  const selectCarToEdit = (car) => {
    setSelectedCar(car.id);
    setEditForm({
      car_id: car.id,
      currency_id: car.currency_id || "",
      model: car.model || "",
      color: car.color || "",
      year: car.year || "",
      engine: car.engine || "",
      power: car.power || "",
      fuel_type: car.fuel_type || "",
      milage: car.milage || "",
      country: car.country || "",
      commercial_comission: car.commercial_comission || "",
      quantity: car.quantity || "",
      price: car.price || "",
      wholesale_price: car.wholesale_price || "", // ✅ ADDED
      shipping_date: car.shipping_date || "",
      arriving_date: car.arriving_date || "",
      images: [],
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append("car_id", editForm.car_id);
      formDataToSend.append("currency_id", editForm.currency_id || "");
      formDataToSend.append("model", editForm.model || "");
      formDataToSend.append("color", editForm.color || "");
      formDataToSend.append("year", editForm.year || "");
      formDataToSend.append("engine", editForm.engine || "");
      formDataToSend.append("power", editForm.power || "");
      formDataToSend.append("fuel_type", editForm.fuel_type || "");
      formDataToSend.append("milage", editForm.milage || "");
      formDataToSend.append("country", editForm.country || "");
      formDataToSend.append("commercial_comission", editForm.commercial_comission || "");
      formDataToSend.append("quantity", editForm.quantity || "");
      formDataToSend.append("price", editForm.price || "");
      formDataToSend.append("wholesale_price", editForm.wholesale_price || ""); // ✅ ADDED
      formDataToSend.append("shipping_date", editForm.shipping_date || "");
      formDataToSend.append("arriving_date", editForm.arriving_date || "");
      editForm.images.forEach(file => {
  formDataToSend.append("images", file);
});
      const response = await apiFetch(`${API_BASE_URL}/cars/`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Voiture modifiée !");
        setSelectedCar(null);
        fetchCars();
      } else {
        let errorDetails = "Échec de la modification";
        try {
          const error = await response.json();
          errorDetails = error.detail || JSON.stringify(error);
        } catch {
          try {
            const errorText = await response.text();
            errorDetails = errorText || errorDetails;
          } catch {
            errorDetails = response.statusText || errorDetails;
          }
        }
        alert(`Erreur: ${errorDetails}`);
      }
    } catch (error) {
      console.error("Edit error:", error);
      alert("Erreur réseau: " + error.message);
    }
  };

  const handleCancelEdit = () => {
    setSelectedCar(null);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const switchTab = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-2xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="font-sans flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className={`fixed z-20 h-screen w-[15vw] max-md:w-[40vw] ${
          menuOpen ? "" : "ml-[-40vw]"
        } justify-between flex flex-col bg-neutral-900 border-r border-neutral-800 p-4 transition-all duration-300`}
      >
        <ul className="flex flex-col gap-[2vh]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="gray"
            onClick={toggleMenu}
            className="size-[3vh] cursor-pointer hover:scale-105 transition-all"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>

          <h2 className="text-xl mb-[4vh]">Palmier Auto</h2>
          <motion.li
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            onClick={() => switchTab("New")}
            className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-emerald-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
            <h1>Nouvelle voiture</h1>
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            onClick={() => switchTab("Modify")}
            className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-emerald-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            <h1>Modifier les voitures</h1>
          </motion.li>
        </ul>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-red-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[3vh]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          <h1>Logout</h1>
        </motion.div>
      </motion.div>

      {/* Main Content: New Tab */}
      {activeTab === "New" && (
        <div className="flex-1 px-[3vw] overflow-y-auto">
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

          <motion.h1
            className="text-3xl font-bold mb-6 text-emerald-400"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Ajouter une voiture à l'inventaire
          </motion.h1>

          <motion.form
            onSubmit={handleAddCar}
            className="bg-neutral-900 rounded-2xl p-6 mb-10 border border-neutral-800 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Currency */}
              <select
                name="currency_id"
                value={formData.currency_id}
                onChange={handleChange}
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Sélectionner Devise *</option>
                {currencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>

              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Modèle *"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Couleur *"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Année *"
                type="number"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="engine"
                value={formData.engine}
                onChange={handleChange}
                placeholder="Moteur *"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="power"
                value={formData.power}
                onChange={handleChange}
                placeholder="Puissance *"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                placeholder="Type de carburant *"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="milage"
                value={formData.milage}
                onChange={handleChange}
                placeholder="Kilométrage *"
                type="number"
                step="0.01"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Quantité *"
                type="number"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Pays *"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="commercial_comission"
                value={formData.commercial_comission}
                onChange={handleChange}
                placeholder="Commission *"
                type="number"
                step="0.01"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Prix *"
                type="number"
                step="0.01"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              {/* ✅ ADDED wholesale_price */}
              <input
                name="wholesale_price"
                value={formData.wholesale_price}
                onChange={handleChange}
                placeholder="Prix de gros *"
                type="number"
                step="0.01"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="shipping_date"
                value={formData.shipping_date}
                onChange={handleChange}
                type="date"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="arriving_date"
                value={formData.arriving_date}
                onChange={handleChange}
                type="date"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              {/* ✅ Photo Upload */}
<div className="md:col-span-3">
  <label className="block text-sm text-emerald-400 mb-2">Photos (facultatif)</label>
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => {
      const files = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: files }));
    }}
    className="w-full bg-neutral-800 text-sm p-2 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
  />
  {/* Preview */}
  {formData.images.length > 0 && (
    <div className="mt-3">
      <p className="text-xs text-neutral-400 mb-2">
        {formData.images.length} image{formData.images.length > 1 ? 's' : ''} sélectionnée{formData.images.length > 1 ? 's' : ''}
      </p>
      <div className="flex flex-wrap gap-2">
        {formData.images.slice(0, 4).map((file, i) => (
          <div key={i} className="relative w-16 h-16">
            <img
              src={URL.createObjectURL(file)}
              alt={`preview ${i}`}
              className="w-full h-full object-cover rounded border border-neutral-700"
            />
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  images: prev.images.filter((_, idx) => idx !== i)
                }));
              }}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
        {formData.images.length > 4 && (
          <div className="w-16 h-16 bg-neutral-800 rounded flex items-center justify-center text-xs">
            +{formData.images.length - 4}
          </div>
        )}
      </div>
    </div>
  )}
</div>
            </div>

            <button
              type="submit"
              className="mt-5 bg-emerald-600 hover:bg-emerald-700 transition px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <Plus size={18} /> Ajouter la voiture
            </button>
          </motion.form>

          {/* Car List */}
          <motion.div
            className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
              <Car size={22} /> Voitures ajoutées ({cars.length})
            </h2>
            {cars.length === 0 ? (
              <p className="text-neutral-500">Aucune voiture ajoutée.</p>
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
                      <th className="p-2">Prix gros</th> {/* ✅ Added */}
                      <th className="p-2">Devise</th>
                      <th className="p-2">Kilométrage</th>
                      <th className="p-2">Quantité</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <tr key={car.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                        <td className="p-2">{car.model}</td>
                        <td className="p-2">{car.color}</td>
                        <td className="p-2">{car.year}</td>
                        <td className="p-2">{car.country}</td>
                        <td className="p-2">{car.price}</td>
                        <td className="p-2">{car.wholesale_price}</td> {/* ✅ Display */}
                        <td className="p-2">{currencyMap[car.currency_id]?.name || "Unknown"}</td>
                        <td className="p-2">{car.milage}</td>
                        <td className="p-2">{car.quantity}</td>
                        <td className="p-2 flex gap-2">
                          <button onClick={() => handleDelete(car.id)} className="text-red-400 hover:text-red-500">
                            <Trash2 size={18} />
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
      )}

      {/* Modify Tab */}
      {activeTab === "Modify" && (
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
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
                  <input
                    name="model"
                    value={filter.model}
                    onChange={handleFilterChange}
                    placeholder="Modèle"
                    className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    name="color"
                    value={filter.color}
                    onChange={handleFilterChange}
                    placeholder="Couleur"
                    className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    name="country"
                    value={filter.country}
                    onChange={handleFilterChange}
                    placeholder="Pays"
                    className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    name="yearFrom"
                    value={filter.yearFrom}
                    onChange={handleFilterChange}
                    placeholder="Année min"
                    type="number"
                    className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    name="yearTo"
                    value={filter.yearTo}
                    onChange={handleFilterChange}
                    placeholder="Année max"
                    type="number"
                    className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
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

          {/* Edit Modal */}
          <AnimatePresence>
            {selectedCar && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4"
                onClick={handleCancelEdit}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-emerald-400">Modifier la voiture</h2>
                    <button onClick={handleCancelEdit} className="text-neutral-400 hover:text-red-500 transition">
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEdit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select
                        name="currency_id"
                        value={editForm.currency_id}
                        onChange={handleEditChange}
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Sélectionner Devise</option>
                        {currencies.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.code})
                          </option>
                        ))}
                      </select>

                      <input
                        name="model"
                        value={editForm.model}
                        onChange={handleEditChange}
                        placeholder="Modèle"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="color"
                        value={editForm.color}
                        onChange={handleEditChange}
                        placeholder="Couleur"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="year"
                        value={editForm.year}
                        onChange={handleEditChange}
                        placeholder="Année"
                        type="number"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="engine"
                        value={editForm.engine}
                        onChange={handleEditChange}
                        placeholder="Moteur"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="power"
                        value={editForm.power}
                        onChange={handleEditChange}
                        placeholder="Puissance"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="fuel_type"
                        value={editForm.fuel_type}
                        onChange={handleEditChange}
                        placeholder="Type de carburant"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="milage"
                        value={editForm.milage}
                        onChange={handleEditChange}
                        placeholder="Kilométrage"
                        type="number"
                        step="0.01"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="quantity"
                        value={editForm.quantity}
                        onChange={handleEditChange}
                        placeholder="Quantité"
                        type="number"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="country"
                        value={editForm.country}
                        onChange={handleEditChange}
                        placeholder="Pays"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="commercial_comission"
                        value={editForm.commercial_comission}
                        onChange={handleEditChange}
                        placeholder="Commission"
                        type="number"
                        step="0.01"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        placeholder="Prix"
                        type="number"
                        step="0.01"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {/* ✅ ADDED wholesale_price in edit form */}
                      <input
                        name="wholesale_price"
                        value={editForm.wholesale_price}
                        onChange={handleEditChange}
                        placeholder="Prix de gros"
                        type="number"
                        step="0.01"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="shipping_date"
                        value={editForm.shipping_date}
                        onChange={handleEditChange}
                        type="date"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="arriving_date"
                        value={editForm.arriving_date}
                        onChange={handleEditChange}
                        type="date"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      
{/* ✅ Photo Upload */}
<div className="md:col-span-3">
  <label className="block text-sm text-emerald-400 mb-2">Ajouter/Remplacer photos (facultatif)</label>
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => {
      const files = Array.from(e.target.files);
      setEditForm(prev => ({ ...prev, images: files }));
    }}
    className="w-full bg-neutral-800 text-sm p-2 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
  />
  
  {editForm.images.length > 0 && (
    <div className="mt-3">
      <p className="text-xs text-neutral-400 mb-2">
        {editForm.images.length} nouvelle{editForm.images.length > 1 ? 's' : ''} image{editForm.images.length > 1 ? 's' : ''}
      </p>
      <div className="flex flex-wrap gap-2">
        {editForm.images.slice(0, 4).map((file, i) => (
          <div key={i} className="relative w-16 h-16">
            <img
              src={URL.createObjectURL(file)}
              alt={`preview ${i}`}
              className="w-full h-full object-cover rounded border border-neutral-700"
            />
            <button
              type="button"
              onClick={() => {
                setEditForm(prev => ({
                  ...prev,
                  images: prev.images.filter((_, idx) => idx !== i)
                }));
              }}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
        {editForm.images.length > 4 && (
          <div className="w-16 h-16 bg-neutral-800 rounded flex items-center justify-center text-xs">
            +{editForm.images.length - 4}
          </div>
        )}
      </div>
    </div>
  )}
</div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <button type="button" onClick={handleCancelEdit} className="bg-neutral-700 hover:bg-neutral-600 transition px-4 py-2 rounded-xl text-sm">
                        Annuler
                      </button>
                      <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 transition px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                        <Edit size={18} /> Enregistrer
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filtered Cars Table */}
          <motion.div
            className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
              <Car size={22} /> Résultats du filtrage
            </h2>

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
                      <th className="p-2">Prix gros</th> {/* ✅ Added */}
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
                        <td className="p-2">{car.wholesale_price}</td> {/* ✅ Display */}
                        <td className="p-2">{currencyMap[car.currency_id]?.name || "Unknown"}</td>
                        <td className="p-2">{car.milage}</td>
                        <td className="p-2">{car.quantity}</td>
                        <td className="p-2 flex gap-2">
                          <button onClick={() => selectCarToEdit(car)} className="text-emerald-400 hover:text-emerald-500">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(car.id)} className="text-red-400 hover:text-red-500">
                            <Trash2 size={18} />
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
      )}
    </div>
  );
};

export default MarketingAgent;