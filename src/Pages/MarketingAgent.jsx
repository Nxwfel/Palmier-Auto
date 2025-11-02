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

  return (
    <div className="font-main flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Left Menu */}
      <div className="w-[16vw] bg-neutral-900 border-r border-neutral-800 flex flex-col items-center py-6">
        <motion.div
          className="text-2xl font-semibold mb-8 text-emerald-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Marketing Agent
        </motion.div>
        <div className="flex flex-col gap-4 w-full px-4">
          <button className="py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 rounded-lg text-sm transition">
            Add Car
          </button>
          <button className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition">
            My Cars
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-[3vw] py-[2vh] overflow-y-auto">
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
    </div>
  );
};

export default MarketingAgent;
