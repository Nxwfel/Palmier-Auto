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

  const menuItems = [
    { id: "addClient", icon: <UserPlus size={20} />, label: "Ajouter Client" },
    { id: "orders", icon: <ClipboardList size={20} />, label: "Commandes" },
    { id: "requests", icon: <Send size={20} />, label: "Demandes Admin" },
    { id: "delivery", icon: <Clock size={20} />, label: "Livraisons" },
  ];

  return (
    <div className="h-screen w-screen font-main flex bg-gradient-to-br from-neutral-950 to-neutral-900 text-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-[18vw] min-w-[240px] bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between p-6"
      >
        <div>
          <h1 className="text-2xl font-semibold text-green-500 mb-8 tracking-tight">
            Palmier Auto
          </h1>
          <nav className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === item.id
                    ? "bg-green-600 text-white shadow-md shadow-green-600/30"
                    : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
        <div className="text-sm text-neutral-500 mt-8 border-t border-neutral-800 pt-4">
          <p>© 2025 Palmier Auto</p>
          <p>Interface Commercial</p>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          {/* === ADD CLIENT === */}
          {activeTab === "addClient" && (
            <motion.div key="addClient" {...fade} className="grid md:grid-cols-2 gap-8">
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
                    className="bg-green-600 py-3 rounded-lg font-medium hover:bg-green-700 transition"
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
              <div className="flex justify-between items-center mb-6">
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
            <motion.div key="requests" {...fade} className="max-w-3xl">
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
                    className="bg-green-600 py-3 rounded-lg hover:bg-green-700 font-medium"
                  >
                    Envoyer la demande
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* === DELIVERY === */}
          {activeTab === "delivery" && (
            <motion.div key="delivery" {...fade}>
              <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
                <Clock size={22} /> Suivi des Livraisons
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders
                  .filter((o) => o.delivery.includes("1") || o.delivery.includes("2"))
                  .map((o) => (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      key={o.id}
                      className="bg-neutral-900/90 p-5 rounded-2xl border border-neutral-800 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{o.car}</p>
                        <p className="text-sm text-neutral-400">Client: {o.client}</p>
                      </div>
                      <span className="text-green-400 text-sm font-medium">{o.delivery} restantes</span>
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
