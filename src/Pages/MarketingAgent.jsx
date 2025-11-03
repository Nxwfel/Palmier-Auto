import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Car, Trash2, Edit } from "lucide-react";

const MarketingAgent = () => {
  const [cars, setCars] = useState([]);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    importCountry: "",
    buyPrice: "",
    sellPrice: "",
    quantity: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCar = (e) => {
    e.preventDefault();
    if (!formData.brand || !formData.model || !formData.year) return;
    const newCar = { ...formData, id: Date.now() };
    setCars([...cars, newCar]);
    setFormData({
      brand: "",
      model: "",
      year: "",
      importCountry: "",
      buyPrice: "",
      sellPrice: "",
      quantity: "",
      description: "",
    });
  };

  const handleDelete = (id) => {
    setCars(cars.filter((c) => c.id !== id));
  };
  // Filter and edit states
  const [filter, setFilter] = useState({
    brand: "",
    model: "",
    yearFrom: "",
    yearTo: "",
    importCountry: "",
  });
  const [selectedCar, setSelectedCar] = useState(null);
  const [editForm, setEditForm] = useState({
    brand: "",
    model: "",
    year: "",
    importCountry: "",
    buyPrice: "",
    sellPrice: "",
    quantity: "",
    description: "",
  });

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const clearFilter = () => setFilter({ brand: "", model: "", yearFrom: "", yearTo: "", importCountry: "" });

  const filteredCars = cars.filter((c) => {
    if (filter.brand && !c.brand?.toLowerCase().includes(filter.brand.toLowerCase())) return false;
    if (filter.model && !c.model?.toLowerCase().includes(filter.model.toLowerCase())) return false;
    if (filter.importCountry && !c.importCountry?.toLowerCase().includes(filter.importCountry.toLowerCase())) return false;
    if (filter.yearFrom && Number(c.year) < Number(filter.yearFrom)) return false;
    if (filter.yearTo && Number(c.year) > Number(filter.yearTo)) return false;
    return true;
  });

  const selectCarToEdit = (car) => {
    setSelectedCar(car.id);
    setEditForm({ ...car });
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setCars(cars.map((c) => (c.id === selectedCar ? { ...c, ...editForm } : c)));
    setSelectedCar(null);
    setEditForm({ brand: "", model: "", year: "", importCountry: "", buyPrice: "", sellPrice: "", quantity: "", description: "" });
  };

  const handleCancelEdit = () => {
    setSelectedCar(null);
    setEditForm({ brand: "", model: "", year: "", importCountry: "", buyPrice: "", sellPrice: "", quantity: "", description: "" });
  };

    const [menuOpen, setMenuOpen] = useState(false);
    const [activetab , setActivetab] = useState('New');
    const [showFilter, setShowFilter] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggletab = (tab) => 
      {setActivetab(tab)
       setMenuOpen(!menuOpen)
      }

  return (
    <div className="font-main flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Left Menu */}
      <motion.div
              initial={{ x: -250 }}
              animate={{ x: 0  }}
              className={`fixed z-20 h-screen w-[15vw] max-md:w-[40vw] ${menuOpen ? '' : 'ml-[-40vw]'} justify-between flex flex-col bg-neutral-900 border-r border-neutral-800 p-4 transition-all duration-300`}
            >
                
              <ul className="flex flex-col gap-[2vh]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" onClick={toggleMenu} className="size-[3vh] cursor-pointer hover:scale-105 transition-all">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
      
                <h2 className="text-xl mb-[4vh]">Palmier Auto</h2>
                <motion.li
                initial={{scale:1}}
                whileHover={{scale:1.05}}
                whileTap={{scale:1}}
                onClick={() => toggletab('New')}
                className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-emerald-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
                  <h1>Nouvelle voiture
                  </h1>
                </motion.li>
                <motion.li
                initial={{scale:1}}
                whileHover={{scale:1.05}}
                whileTap={{scale:1}}
                onClick={() => toggletab('Modify')}
                className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-emerald-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>
                  <h1>Modifier Les Voiture
                  </h1>
                </motion.li>
              </ul>
                        <motion.div
                initial={{scale:1}}
                whileHover={{scale:1.05}}
                whileTap={{scale:1}}
      
                className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-red-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[3vh]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
      
                  <h1>Logout</h1>
                </motion.div>
      
            </motion.div>
      {/* Main Content */}
      {activetab === 'New' && (
       <div className="flex-1 px-[3vw]  overflow-y-auto">
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

        {/* Add Car Form */}
        <motion.form
          onSubmit={handleAddCar}
          className="bg-neutral-900 rounded-2xl p-6 mb-10 border border-neutral-800 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Marque"
              className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Modèle"
              className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Année"
              type="number"
              className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              name="importCountry"
              value={formData.importCountry}
              onChange={handleChange}
              placeholder="Pays d'importation"
              className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              name="buyPrice"
              value={formData.buyPrice}
              onChange={handleChange}
              placeholder="Prix d'achat ($)"
              type="number"
              className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              name="sellPrice"
              value={formData.sellPrice}
              onChange={handleChange}
              placeholder="Prix de vente ($)"
              type="number"
              className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Quantité"
              type="number"
              className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 mt-4"
            rows={3}
          ></textarea>

          <button
            type="submit"
            className="mt-5 bg-emerald-600 hover:bg-emerald-700 transition px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={18} /> Ajouter la voiture
          </button>
        </motion.form>

        {/* Cars List */}
        <motion.div
          className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
            <Car size={22} /> Mes voitures ajoutées
          </h2>
          {cars.length === 0 ? (
            <p className="text-neutral-500">Aucune voiture ajoutée pour le moment.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="border-b border-neutral-800 text-neutral-400 text-sm">
                  <tr>
                    <th className="p-2">Marque</th>
                    <th className="p-2">Modèle</th>
                    <th className="p-2">Année</th>
                    <th className="p-2">Pays</th>
                    <th className="p-2">Prix Achat</th>
                    <th className="p-2">Prix Vente</th>
                    <th className="p-2">Qté</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car) => (
                    <tr
                      key={car.id}
                      className="border-b border-neutral-800 hover:bg-neutral-800/50"
                    >
                      <td className="p-2">{car.brand}</td>
                      <td className="p-2">{car.model}</td>
                      <td className="p-2">{car.year}</td>
                      <td className="p-2">{car.importCountry}</td>
                      <td className="p-2">${car.buyPrice}</td>
                      <td className="p-2">${car.sellPrice}</td>
                      <td className="p-2">{car.quantity}</td>
                      <td className="p-2 flex gap-2">
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="text-emerald-400 hover:text-emerald-500">
                          <Edit size={18} />
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
    {/* Top bar */}
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

    {/* Filter Popup */}
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
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="brand"
            value={filter.brand}
            onChange={handleFilterChange}
            placeholder="Marque"
            className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            name="model"
            value={filter.model}
            onChange={handleFilterChange}
            placeholder="Modèle"
            className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            name="importCountry"
            value={filter.importCountry}
            onChange={handleFilterChange}
            placeholder="Pays d'importation"
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

    {/* Filtered cars display */}
    <motion.div
      className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-lg mt-6"
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
                <th className="p-2">Marque</th>
                <th className="p-2">Modèle</th>
                <th className="p-2">Année</th>
                <th className="p-2">Pays</th>
                <th className="p-2">Prix Achat</th>
                <th className="p-2">Prix Vente</th>
                <th className="p-2">Qté</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                <tr key={car.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                  <td className="p-2">{car.brand}</td>
                  <td className="p-2">{car.model}</td>
                  <td className="p-2">{car.year}</td>
                  <td className="p-2">{car.importCountry}</td>
                  <td className="p-2">${car.buyPrice}</td>
                  <td className="p-2">${car.sellPrice}</td>
                  <td className="p-2">{car.quantity}</td>
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
