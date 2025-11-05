
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Car, Trash2, Edit, X } from "lucide-react";

const API_BASE_URL = "YOUR_API_BASE_URL_HERE"; // Replace with your actual API URL

const MarketingAgent = () => {
  const [cars, setCars] = useState([]);
  const [commercials, setCommercials] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    commercial_id: "",
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
    price: "",
    shipping_date: "",
    arriving_date: "",
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchCars(), fetchCommercials(), fetchCurrencies()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cars/all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const fetchCommercials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/commercials/`);
      const data = await response.json();
      setCommercials(data);
    } catch (error) {
      console.error("Error fetching commercials:", error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/currencies/`);
      const data = await response.json();
      setCurrencies(data);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    if (!formData.model || !formData.commercial_id || !formData.currency_id) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/cars/`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Voiture ajoutée avec succès!");
        setFormData({
          commercial_id: "",
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
          price: "",
          shipping_date: "",
          arriving_date: "",
        });
        fetchCars();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.detail || "Impossible d'ajouter la voiture"}`);
      }
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Erreur lors de l'ajout de la voiture");
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette voiture?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/cars/?car_id=${carId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("Voiture supprimée avec succès!");
        fetchCars();
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Erreur lors de la suppression de la voiture");
    }
  };

  const [filter, setFilter] = useState({
    model: "",
    color: "",
    yearFrom: "",
    yearTo: "",
    country: "",
  });
  const [selectedCar, setSelectedCar] = useState(null);
  const [editForm, setEditForm] = useState({
    car_id: "",
    commercial_id: "",
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
    price: "",
    shipping_date: "",
    arriving_date: "",
  });

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const clearFilter = () => setFilter({ model: "", color: "", yearFrom: "", yearTo: "", country: "" });

  const filteredCars = cars.filter((c) => {
    if (filter.model && !c.model?.toLowerCase().includes(filter.model.toLowerCase())) return false;
    if (filter.color && !c.color?.toLowerCase().includes(filter.color.toLowerCase())) return false;
    if (filter.country && !c.country?.toLowerCase().includes(filter.country.toLowerCase())) return false;
    if (filter.yearFrom && Number(c.year) < Number(filter.yearFrom)) return false;
    if (filter.yearTo && Number(c.year) > Number(filter.yearTo)) return false;
    return true;
  });

  const selectCarToEdit = (car) => {
    setSelectedCar(car.id);
    setEditForm({
      car_id: car.id,
      commercial_id: car.commercial_id || "",
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
      price: car.price || "",
      shipping_date: car.shipping_date || "",
      arriving_date: car.arriving_date || "",
    });
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.keys(editForm).forEach(key => {
        if (editForm[key]) {
          formDataToSend.append(key, editForm[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/cars/`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Voiture modifiée avec succès!");
        setSelectedCar(null);
        setEditForm({
          car_id: "",
          commercial_id: "",
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
          price: "",
          shipping_date: "",
          arriving_date: "",
        });
        fetchCars();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.detail || "Impossible de modifier la voiture"}`);
      }
    } catch (error) {
      console.error("Error updating car:", error);
      alert("Erreur lors de la modification de la voiture");
    }
  };

  const handleCancelEdit = () => {
    setSelectedCar(null);
    setEditForm({
      car_id: "",
      commercial_id: "",
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
      price: "",
      shipping_date: "",
      arriving_date: "",
    });
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [activetab, setActivetab] = useState('New');
  const [showFilter, setShowFilter] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggletab = (tab) => {
    setActivetab(tab);
    setMenuOpen(!menuOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-2xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="font-main flex min-h-screen bg-neutral-950 text-neutral-100">
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className={`fixed z-20 h-screen w-[15vw] max-md:w-[40vw] ${menuOpen ? '' : 'ml-[-40vw]'} justify-between flex flex-col bg-neutral-900 border-r border-neutral-800 p-4 transition-all duration-300`}
      >
        <ul className="flex flex-col gap-[2vh]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" onClick={toggleMenu} className="size-[3vh] cursor-pointer hover:scale-105 transition-all">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>

          <h2 className="text-xl mb-[4vh]">Palmier Auto</h2>
          <motion.li
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            onClick={() => toggletab('New')}
            className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-emerald-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
            <h1>Nouvelle voiture</h1>
          </motion.li>
          <motion.li
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            onClick={() => toggletab('Modify')}
            className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-emerald-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            <h1>Modifier Les Voiture</h1>
          </motion.li>
        </ul>
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-red-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[3vh]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          <h1>Logout</h1>
        </motion.div>
      </motion.div>

      {activetab === 'New' && (
        <div className="flex-1 px-[3vw] overflow-y-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="gray" onClick={toggleMenu} className="size-[5vh] cursor-pointer my-[2vh] hover:scale-110 transition-all">
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
              <select
                name="commercial_id"
                value={formData.commercial_id}
                onChange={handleChange}
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Sélectionner Commercial *</option>
                {commercials.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.surname}
                  </option>
                ))}
              </select>

              <select
                name="currency_id"
                value={formData.currency_id}
                onChange={handleChange}
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Sélectionner Devise *</option>
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
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
            </div>

            <button
              type="submit"
              className="mt-5 bg-emerald-600 hover:bg-emerald-700 transition px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium"
            >
              <Plus size={18} /> Ajouter la voiture
            </button>
          </motion.form>

          <motion.div
            className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
              <Car size={22} /> Voitures ajoutées ({cars.length})
            </h2>
            {cars.length === 0 ? (
              <p className="text-neutral-500">Aucune voiture ajoutée pour le moment.</p>
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
                      <th className="p-2">Kilométrage</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <tr
                        key={car.id}
                        className="border-b border-neutral-800 hover:bg-neutral-800/50"
                      >
                        <td className="p-2">{car.model}</td>
                        <td className="p-2">{car.color}</td>
                        <td className="p-2">{car.year}</td>
                        <td className="p-2">{car.country}</td>
                        <td className="p-2">{car.price}</td>
                        <td className="p-2">{car.milage}</td>
                        <td className="p-2 flex gap-2">
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="text-red-400 hover:text-red-500"
                          >
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

      {activetab === 'Modify' && (
        <div className="min-h-screen w-screen px-[3vw] py-[2vh] text-neutral-100 relative overflow-y-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="gray" onClick={toggleMenu} className="size-[5vh] cursor-pointer my-[2vh] hover:scale-110 transition-all">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>

          <div className="flex justify-between items-center mb-6">
            <div
              onClick={() => setShowFilter(true)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={1.5} stroke="currentColor" className="size-6 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              <h1 className="text-sm font-main">Filtrer</h1>
            </div>
            <h1 className="text-sm text-neutral-400">
              Total: {filteredCars.length}
            </h1>
          </div>

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
                  <button
                    onClick={() => setShowFilter(false)}
                    className="text-neutral-400 hover:text-red-500 transition"
                  >
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
                  <button
                    onClick={clearFilter}
                    className="bg-neutral-700 hover:bg-neutral-600 transition px-4 py-2 rounded-xl text-sm"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setShowFilter(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 transition px-4 py-2 rounded-xl text-sm"
                  >
                    Appliquer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                    <button
                      onClick={handleCancelEdit}
                      className="text-neutral-400 hover:text-red-500 transition"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEdit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select
                        name="commercial_id"
                        value={editForm.commercial_id}
                        onChange={handleEditChange}
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Sélectionner Commercial</option>
                        {commercials.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} {c.surname}
                          </option>
                        ))}
                      </select>

                      <select
                        name="currency_id"
                        value={editForm.currency_id}
                        onChange={handleEditChange}
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Sélectionner Devise</option>
                        {currencies.map((c) => (
                          <option key={c.code} value={c.code}>
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
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-neutral-700 hover:bg-neutral-600 transition px-4 py-2 rounded-xl text-sm"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 transition px-4 py-2 rounded-xl text-sm flex items-center gap-2"
                      >
                        <Edit size={18} /> Enregistrer
                      </button>
                    </div>
                  </form>
                </motion.div>
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

            {filteredCars.length === 0 ? (
              <p className="text-neutral-500">Aucune voiture trouvée pour ces critères.</p>
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
                      <th className="p-2">Kilométrage</th>
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
                        <td className="p-2">{car.milage}</td>
                        <td className="p-2 flex gap-2">
                          <button
                            onClick={() => selectCarToEdit(car)}
                            className="text-emerald-400 hover:text-emerald-500"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(car.id)}
                            className="text-red-400 hover:text-red-500"
                          >
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