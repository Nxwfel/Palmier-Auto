import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  ClipboardList,
  Send,
  Clock,
  Car,
  CheckCircle,
  AlertTriangle,
  Search,
} from "lucide-react";

const Commercials = () => {
  const [activeTab, setActiveTab] = useState("addClient");

  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([
    { id: 1, client: "Ahmed Benali", car: "Toyota Corolla", status: "Online", delivery: "2 jours" },
    { id: 2, client: "Sarah M.", car: "BMW X3", status: "En attente Admin", delivery: "5 jours" },
    { id: 3, client: "Karim Z.", car: "Peugeot 3008", status: "Livraison proche", delivery: "1 jour" },
  ]);

  const [newClient, setNewClient] = useState({ name: "", phone: "", car: "" });
  const [search, setSearch] = useState("");

  const handleAddClient = () => {
    if (!newClient.name || !newClient.phone || !newClient.car)
      return alert("Veuillez remplir tous les champs !");
    setClients([...clients, newClient]);
    setNewClient({ name: "", phone: "", car: "" });
  };

  const fade = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggletab = (tab) => 
    {setActiveTab(tab)
     setMenuOpen(!menuOpen)
    }
  ;
    const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-screen w-screen font-main flex bg-gradient-to-br from-neutral-950 to-neutral-900 text-white overflow-hidden">
      {/* Sidebar */}
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
                onClick={() => toggletab('addClient')}
                className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-emerald-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
                  <h1>Ajouter un client
                  </h1>
                </motion.li>
                <motion.li
                initial={{scale:1}}
                whileHover={{scale:1.05}}
                whileTap={{scale:1}}
                onClick={() => toggletab('orders')}
                className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-emerald-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="size-[3vh]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                  <h1>Commandes</h1>
                </motion.li>
                <motion.li
                initial={{scale:1}}
                whileHover={{scale:1.05}}
                whileTap={{scale:1}}
                onClick={() => toggletab('cars')}
                className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-emerald-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">

                <svg xmlns="http://www.w3.org/2000/svg" className="size-[3vh]" viewBox="0 0 256 256">
                    <path fill="#fff" d="M240 112h-10.8l-27.78-62.5A16 16 0 0 0 186.8 40H69.2a16 16 0 0 0-14.62 9.5L26.8 112H16a8 8 0 0 0 0 16h8v80a16 16 0 0 0 16 16h24a16 16 0 0 0 16-16v-16h96v16a16 16 0 0 0 16 16h24a16 16 0 0 0 16-16v-80h8a8 8 0 0 0 0-16ZM69.2 56h117.6l24.89 56H44.31ZM64 208H40v-16h24Zm128 0v-16h24v16Zm24-32H40v-48h176ZM56 152a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16H64a8 8 0 0 1-8-8Zm112 0a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16h-16a8 8 0 0 1-8-8Z"></path>
                </svg>

                  <h1>Voiture Disponible</h1>
                </motion.li>
                <motion.li
                initial={{scale:1}}
                whileHover={{scale:1.05}}
                whileTap={{scale:1}}
                onClick={() => toggletab('requests')}
                className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-emerald-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>

                  <h1>Demande Client</h1>
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
      <main className="flex-1 overflow-y-auto p-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="gray" onClick={toggleMenu} className="size-[5vh] cursor-pointer my-[2vh] hover:scale-110 transition-all">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        <AnimatePresence mode="wait">
          {/* === ADD CLIENT === */}
          {activeTab === "addClient" && (
            <motion.div key="addClient" {...fade} className="flex flex-col p-5 gap-8">
              <h1 className="text-[5vh] font-semibold">Ajouter un Client</h1>
              {/* Add Client Form */}
              <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 shadow-xl backdrop-blur-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <UserPlus size={20} /> Ajouter un Client
                </h2>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Nom du client"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="bg-neutral-800 p-3 rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Téléphone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="bg-neutral-800 p-3 rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Modèle de voiture"
                    value={newClient.car}
                    onChange={(e) => setNewClient({ ...newClient, car: e.target.value })}
                    className="bg-neutral-800 p-3 rounded-lg outline-none"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddClient}
                    className="bg-emerald-600 py-3 rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Ajouter Client
                  </motion.button>
                </div>
              </div>

              {/* Clients List */}
              <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 shadow-xl backdrop-blur-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ClipboardList size={20} /> Clients Enregistrés
                </h2>
                <div className="max-h-[70vh] overflow-y-auto space-y-3">
                  {clients.length === 0 ? (
                    <p className="text-neutral-500">Aucun client ajouté.</p>
                  ) : (
                    clients.map((c, i) => (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        key={i}
                        className="bg-neutral-800 p-3 rounded-xl flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-sm text-neutral-400">{c.phone}</p>
                        </div>
                        <span className="text-green-400 text-sm">{c.car}</span>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* === ORDERS === */}
          {activeTab === "orders" && (
            <motion.div key="orders" {...fade}>
              <div className="flex justify-between items-center mb-6 p-8">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <ClipboardList size={22} /> Commandes
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-neutral-400" size={18} />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="bg-neutral-800 pl-9 pr-3 py-2 rounded-lg outline-none text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                {orders
                  .filter(
                    (o) =>
                      o.client.toLowerCase().includes(search.toLowerCase()) ||
                      o.car.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((order) => (
                    <motion.div
                      key={order.id}
                      whileHover={{ scale: 1.03 }}
                      className="p-6 bg-neutral-900/90 rounded-2xl border border-neutral-800"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-lg">{order.car}</h3>
                        {order.status === "Online" ? (
                          <CheckCircle className="text-green-500" />
                        ) : (
                          <AlertTriangle className="text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-400">Client: {order.client}</p>
                      <p className="text-sm">
                        <span className="text-neutral-400">Statut:</span>{" "}
                        <span className="text-white">{order.status}</span>
                      </p>
                      <p className="text-sm">
                        <span className="text-neutral-400">Livraison:</span>{" "}
                        <span className="text-green-400">{order.delivery}</span>
                      </p>
                    </motion.div>
                  ))}
                  
              </div>
              
            </motion.div>
          )}

          {/* === REQUESTS === */}
          {activeTab === "requests" && (
            <motion.div key="requests" {...fade} className="max-w-screen p-8">
              <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                <Send size={22} /> Demande à l'Admin
              </h2>
              <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 shadow-xl">
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Modèle non disponible"
                    className="bg-neutral-800 p-3 rounded-lg outline-none"
                  />
                  <textarea
                    placeholder="Détails ou remarques..."
                    className="bg-neutral-800 p-3 rounded-lg outline-none h-40 resize-none"
                  ></textarea>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="bg-emerald-600 py-3 rounded-lg hover:bg-green-700 font-medium"
                  >
                    Envoyer la demande
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
          {/* Cars Part */}
{activeTab === "cars" && (
  <motion.div
    key="cars"
    {...fade}
    className="p-8"
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Car size={22} /> Voitures Disponibles
      </h2>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-neutral-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher un modèle..."
          className="bg-neutral-800 pl-9 pr-3 py-2 rounded-lg outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>

    {/* Cars Data */}
    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
      {[
        {
          id: 1,
          model: "Toyota Corolla",
          quantity: 12,
          colors: ["Blanc", "Noir", "Gris"],
        },
        {
          id: 2,
          model: "BMW X3",
          quantity: 5,
          colors: ["Bleu", "Noir", "Gris foncé"],
        },
        {
          id: 3,
          model: "Peugeot 3008",
          quantity: 8,
          colors: ["Rouge", "Blanc", "Noir"],
        },
        {
          id: 4,
          model: "Kia Sportage",
          quantity: 10,
          colors: ["Argent", "Blanc", "Bleu marine"],
        },
      ]
        .filter((car) =>
          car.model.toLowerCase().includes(search.toLowerCase())
        )
        .map((car) => (
          <motion.div
            key={car.id}
            whileHover={{ scale: 1.03 }}
            className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 shadow-lg"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">{car.model}</h3>
              <span className="text-green-500 font-medium">
                {car.quantity} unités
              </span>
            </div>
            <p className="text-neutral-400 text-sm mb-2">
              Couleurs disponibles :
            </p>
            <div className="flex gap-2 flex-wrap">
              {car.colors.map((color, i) => (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="bg-neutral-800 px-3 py-1 rounded-full text-sm border border-neutral-700"
                >
                  {color}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
    </div>
  </motion.div>
)}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Commercials;
