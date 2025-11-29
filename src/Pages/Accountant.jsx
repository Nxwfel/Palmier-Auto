import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car, DollarSign, TrendingUp, Users } from "lucide-react";

// ✅ FIXED: Trimmed URL
const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com";

const Accountant = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Jour");
  const [selectedCommercial, setSelectedCommercial] = useState(null);
  const [commercials, setCommercials] = useState([]);
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [expenses, setExpenses] = useState({ total_amount: 0, purchases: 0, transport: 0, other: 0 });
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // ✅ Auth-aware fetch
  const apiFetch = async (url, options = {}) => {
    const token = localStorage.getItem("authToken"); // ✅ correct key
    if (!token) throw new Error("No auth token");
    const res = await fetch(url, {
      ...options,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (res.status === 401) {
      localStorage.removeItem("authToken");
      throw new Error("Unauthorized");
    }
    return res;
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setAuthError(true);
        return;
      }

      const [commsRes, clientsRes, ordersRes, carsRes, expRes, earnRes] = await Promise.all([
        apiFetch(`${API_BASE_URL}/commercials/`),
        apiFetch(`${API_BASE_URL}/clients/`),
        apiFetch(`${API_BASE_URL}/orders/client/`), // ✅ client-accessible orders
        apiFetch(`${API_BASE_URL}/cars/all`, { method: "POST", body: JSON.stringify({}) }),
        apiFetch(`${API_BASE_URL}/expenses/monthly`),
        apiFetch(`${API_BASE_URL}/earnings/monthly`),
      ]);

      const commercialsData = await commsRes.json();
      const clientsData = await clientsRes.json();
      const ordersData = await ordersRes.json();
      const carsData = await carsRes.json();
      const expensesData = await expRes.json();
      const earningsData = await earnRes.json();

      setCommercials(Array.isArray(commercialsData) ? commercialsData : []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setCars(Array.isArray(carsData) ? carsData : []);
      setExpenses({
        total_amount: expensesData.total_amount || 0,
        purchases: expensesData.purchases || 0,
        transport: expensesData.transport || 0,
        other: expensesData.other || 0,
      });

      // ✅ Sum monthly earnings (array of {commercial_id, year, month, amount})
      const total = Array.isArray(earningsData)
        ? earningsData.reduce((sum, e) => sum + (e.amount || 0), 0)
        : 0;
      setTotalEarnings(total);
    } catch (error) {
      console.error("Fetch error:", error);
      setAuthError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ✅ Compute stats per commercial
  const getCommercialStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return commercials.map(commercial => {
      // Clients assigned to this commercial
      const assignedClients = clients.filter(c => c.commercial_id === commercial.id);
      const clientIds = assignedClients.map(c => c.id);

      // Orders from those clients (today only)
      const todayOrders = orders.filter(o =>
        clientIds.includes(o.client_id) &&
        o.created_at &&
        new Date(o.created_at) >= today
      );

      // Activities: all orders from this commercial’s clients
      const activities = orders
        .filter(o => clientIds.includes(o.client_id))
        .map(o => {
          const car = cars.find(c => c.id === o.car_id) || {};
          return {
            type: "Vente",
            car: o.car_model || car.model || "—",
            client: `${o.client_name || ""} ${o.client_surname || ""}`.trim() || "—",
            amount: `${(o.price_dzd || 0).toLocaleString()} DZD`,
            paid: `${(o.payment_amount || 0).toLocaleString()} DZD`,
            date: o.created_at ? new Date(o.created_at).toLocaleDateString() : "—",
            status: o.delivery_status === "showroom" ? "Complété" :
                     o.delivery_status === "arrived" ? "Arrivé" : "En expédition"
          };
        });

      return {
        ...commercial,
        day_transactions: todayOrders.length,
        total_revenue: todayOrders.reduce((sum, o) => sum + (o.price_dzd || 0), 0),
        total_paid: todayOrders.reduce((sum, o) => sum + (o.payment_amount || 0), 0),
        activities,
        wilayas_display: Array.isArray(commercial.wilayas)
          ? commercial.wilayas.join(", ")
          : commercial.wilayas || "—"
      };
    });
  };

  const commercialStats = getCommercialStats();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter(o => o.created_at && new Date(o.created_at) >= today);
  const totalCarsSold = todayOrders.length;
  const totalRevenue = todayOrders.reduce((sum, o) => sum + (o.price_dzd || 0), 0);

  const stats = [
    { title: "Voitures Vendues (Aujourd'hui)", value: totalCarsSold, icon: <Car />, color: "bg-blue-600" },
    { title: "Chiffre d'Affaire (Aujourd'hui)", value: `${totalRevenue.toLocaleString()} DZD`, icon: <DollarSign />, color: "bg-emerald-600" },
    { title: "Commercials", value: commercials.length, icon: <Users />, color: "bg-purple-600" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-2xl">Chargement...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen w-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl mb-4">Session expirée</h1>
          <p className="text-neutral-400 mb-6">Veuillez vous reconnecter</p>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              window.location.href = "/accountantlogin";
            }}
            className="px-6 py-3 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const setTab = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-screen font-main bg-neutral-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" onClick={toggleMenu} strokeWidth={1.5} stroke="currentColor" className="size-[4vh] cursor-pointer absolute mt-5 ml-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>

      <motion.div
        className={`fixed z-20 h-screen w-[15vw] max-md:w-[40vw] ${menuOpen ? "" : "ml-[-40vw]"} flex flex-col justify-between bg-neutral-900 border-r border-neutral-800 p-4 transition-all duration-300`}
      >
        <div>
          <button onClick={toggleMenu} className="mb-6 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </button>
          <h2 className="text-xl mb-6">Palmier Auto</h2>
          {[
            { id: "Jour", label: "Nouvelles du jour", icon: "📅" },
            { id: "Commercials", label: "Commercials", icon: "👥" },
            { id: "Finance", label: "Finance", icon: "💰" },
          ].map(({ id, label, icon }) => (
            <motion.button
              key={id}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 1 }}
              onClick={() => setTab(id)}
              className={`w-full text-left p-3 rounded-lg mb-2 flex items-center gap-3 ${
                activeTab === id ? "bg-emerald-600" : "text-gray-300 hover:bg-neutral-800"
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </motion.button>
          ))}
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = "/";
          }}
          className="w-full p-3 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          Déconnexion
        </button>
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 max-md:ml-0 p-6 mt-[4vh]">

        {activeTab === "Jour" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold">Nouvelles du Jour</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`${s.color} bg-opacity-20 border border-neutral-800 rounded-2xl p-6`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{s.title}</h3>
                    <div className="text-2xl">{s.icon}</div>
                  </div>
                  <div className="text-3xl font-bold mt-2">{s.value}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Finance" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold">Finance Générale</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-emerald-400">Chiffre d'Affaire (Ce mois)</h3>
                <p className="text-3xl font-bold mt-2">{totalEarnings.toLocaleString()} DZD</p>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-blue-400">Bénéfice Net</h3>
                <p className={`text-3xl font-bold mt-2 ${totalEarnings - expenses.total_amount >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {(totalEarnings - expenses.total_amount).toLocaleString()} DZD
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4">Dépenses Mensuelles</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-neutral-400">Achats:</span>
                    <span className="ml-2 text-emerald-400">{expenses.purchases.toLocaleString()} DZD</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Transport:</span>
                    <span className="ml-2 text-blue-400">{expenses.transport.toLocaleString()} DZD</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Autres:</span>
                    <span className="ml-2 text-purple-400">{expenses.other.toLocaleString()} DZD</span>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4">Ventes Aujourd'hui</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-neutral-400 border-b">
                      <tr>
                        <th className="py-2 text-left">Client</th>
                        <th className="py-2 text-left">Voiture</th>
                        <th className="py-2 text-right">Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todayOrders.slice(0, 5).map((order, i) => (
                        <tr key={i} className="border-b border-neutral-800/30">
                          <td>{order.client_name} {order.client_surname}</td>
                          <td>{order.car_model}</td>
                          <td className="text-right">{(order.price_dzd || 0).toLocaleString()} DZD</td>
                        </tr>
                      ))}
                      {todayOrders.length === 0 && (
                        <tr><td colSpan="3" className="py-4 text-center text-neutral-500">Aucune vente aujourd'hui</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Commercials" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold">Commercials</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commercialStats.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedCommercial(c)}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-800/50 cursor-pointer"
                >
                  <h3 className="text-xl font-bold text-emerald-400">{c.name} {c.surname}</h3>
                  <p className="text-neutral-400 text-sm mt-1">📍 {c.wilayas_display}</p>
                  <div className="mt-4 space-y-2">
                    <div>
                      <span className="text-neutral-500">Ventes Aujourd'hui:</span>
                      <span className="ml-2 font-medium">{c.day_transactions}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">CA (Aujourd'hui):</span>
                      <span className="ml-2 text-emerald-400 font-medium">{c.total_revenue.toLocaleString()} DZD</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Payé:</span>
                      <span className="ml-2 text-blue-400 font-medium">{c.total_paid.toLocaleString()} DZD</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Commercial Detail Modal */}
        <AnimatePresence>
          {selectedCommercial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedCommercial(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-900 w-full max-w-3xl rounded-2xl border border-neutral-800 p-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {selectedCommercial.name} {selectedCommercial.surname} — Activités
                  </h2>
                  <button
                    onClick={() => setSelectedCommercial(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <div className="mb-4 p-4 bg-neutral-800/30 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-neutral-500">Wilayas:</span>
                      <p className="font-medium">{selectedCommercial.wilayas_display}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Ventes Aujourd'hui:</span>
                      <p className="font-medium text-emerald-400">{selectedCommercial.day_transactions}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">CA (Aujourd'hui):</span>
                      <p className="font-bold text-2xl text-emerald-400">
                        {selectedCommercial.total_revenue.toLocaleString()} DZD
                      </p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-4">Historique des Activités</h3>
                {selectedCommercial.activities.length === 0 ? (
                  <p className="text-neutral-500 text-center py-4">Aucune activité récente</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedCommercial.activities.map((act, i) => (
                      <div key={i} className="bg-neutral-800/20 p-4 rounded-lg border-l-4 border-emerald-500">
                        <div className="flex justify-between">
                          <div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              act.status === "Complété" ? "bg-green-500/20 text-green-400" :
                              act.status === "Arrivé" ? "bg-blue-500/20 text-blue-400" :
                              "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {act.status}
                            </span>
                            <h4 className="font-medium mt-1">{act.car}</h4>
                            <p className="text-sm text-neutral-400">{act.client}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-emerald-400">{act.amount}</p>
                            <p className="text-xs text-blue-400">Payé: {act.paid}</p>
                            <p className="text-xs text-neutral-500">{act.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Accountant;