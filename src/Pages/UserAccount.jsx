// src/Pages/UserAccount.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Package,
  Truck,
  CheckCircle,
  User,
  CreditCard,
  Home,
  AlertCircle,
  X,
  ArrowBigLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com".trim();

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-neutral-900/60 backdrop-blur-xl rounded-2xl border border-neutral-800 p-6 shadow-lg hover:shadow-emerald-500/10 transition-all ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({ label, value, color = "text-white" }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Card className="text-center space-y-1">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`text-3xl font-main ${color}`}>{value}</p>
    </Card>
  </motion.div>
);

const UserAccount = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  const [token, setToken] = useState(localStorage.getItem("authToken"));

  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auth-aware fetch helper
  const apiFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("authToken");
      setToken(null);
      navigate("/auth");
      throw new Error("Unauthorized");
    }

    return res;
  };

  // Data loading
  useEffect(() => {
    if (!token) {
      setLoading(false);
      navigate("/auth");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch client profile
        const profileRes = await apiFetch(`${API_BASE_URL}/clients/client`, {
          method: "POST",
          body: JSON.stringify({ client_id: null }),
        });
        const profile = await profileRes.json();
        setUserProfile(profile);

        // GET orders
        const ordersRes = await apiFetch(`${API_BASE_URL}/orders/client/`);
        const ordersData = await ordersRes.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);

        // GET notifications
        const notifRes = await apiFetch(`${API_BASE_URL}/notifications/`);
        const notifs = await notifRes.json();
        setNotifications(Array.isArray(notifs) ? notifs : []);
      } catch (err) {
        console.error("UserAccount load error:", err);
        setError(err.message || "Échec du chargement");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setToken(null);
    setUserProfile(null);
    setOrders([]);
    setNotifications([]);
    navigate("/auth");
  };

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "shipping": return "text-blue-400 bg-blue-500/10";
      case "arrived": return "text-amber-400 bg-amber-500/10";
      case "showroom": return "text-emerald-400 bg-emerald-500/10";
      default: return "text-gray-400 bg-gray-500/10";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "shipping": return <Truck className="w-4 h-4" />;
      case "arrived": return <Package className="w-4 h-4" />;
      case "showroom": return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "shipping": return "En expédition";
      case "arrived": return "Arrivé";
      case "showroom": return "En showroom";
      default: return status;
    }
  };

  // Derived stats
  const billing = orders.map((order) => {
    const total = order.price_dzd || 0;
    const paid = order.payment_amount || 0;
    const remaining = Math.max(0, total - paid);
    return { order, total, paid, remaining };
  });
  const totalPaid = billing.reduce((s, o) => s + o.paid, 0);
  const totalDue = billing.reduce((s, o) => s + o.remaining, 0);
  const totalPrice = billing.reduce((s, o) => s + o.total, 0);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white">
      {/* Sidebar */}
      <aside className="w-20 md:w-24 flex flex-col items-center py-6 space-y-6 fixed left-0 top-0 h-full bg-neutral-950/80 backdrop-blur-md border-r border-neutral-800 z-40">
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title="Déconnexion"
        >
          <ArrowBigLeft className="w-6 h-6" />
        </button>

        {[
          { id: "dashboard", icon: Home, label: "Tableau de bord" },
          { id: "orders", icon: Package, label: "Commandes" },
          { id: "billing", icon: CreditCard, label: "Facturation" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`p-3 rounded-xl relative group transition-all ${
              activeTab === id
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="absolute left-14 bg-neutral-800 text-xs rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition">
              {label}
            </span>
          </button>
        ))}

        {/* Notifications */}
        <div className="mt-auto relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all relative"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] rounded-full flex items-center justify-center font-main">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            ref={notifRef}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed left-24 top-8 w-80 md:w-96 bg-neutral-900/90 backdrop-blur-xl rounded-xl border border-neutral-700 shadow-2xl z-50 max-h-[80vh] flex flex-col"
          >
            <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
              <h3 className="font-main text-lg">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">Aucune notification</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 border-b border-neutral-800 cursor-pointer hover:bg-white/5 ${
                      !notif.read ? "bg-emerald-500/5" : ""
                    }`}
                  >
                    <p className="text-white">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notif.created_at
                        ? new Date(notif.created_at).toLocaleDateString("fr-FR")
                        : "Récemment"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="ml-20 md:ml-28 w-full py-10 px-6 md:px-10 space-y-10">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Show content only if authenticated */}
        {token && (
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <h1 className="text-4xl font-main">
                  Bonjour, {userProfile?.name || "Client"} 👋
                </h1>
                <p className="text-gray-400 mb-8">Gérez vos commandes, paiements et informations.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard label="Commandes" value={orders.length} />
                  <StatCard label="Total payé" value={`${totalPaid.toLocaleString()} DZD`} color="text-emerald-400" />
                  <StatCard label="Solde restant" value={`${totalDue.toLocaleString()} DZD`} color="text-amber-400" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8"
                >
                  <Card>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="h-24 w-24 md:h-32 md:w-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-main">
                        {(userProfile?.name?.[0] || "U") + (userProfile?.surname?.[0] || "C")}
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-center md:text-left">
                        <div>
                          <span className="text-gray-400">Nom:</span>{" "}
                          <span className="ml-2 font-medium">{userProfile?.name} {userProfile?.surname}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Téléphone:</span>{" "}
                          <span className="ml-2 font-medium">{userProfile?.phone_number}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Wilaya:</span>{" "}
                          <span className="ml-2 font-medium">{userProfile?.wilaya}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">NIN:</span>{" "}
                          <span className="ml-2 font-medium">{userProfile?.nin}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-main">Vos Commandes</h1>
                  {totalDue > 0 && (
                    <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Solde restant: {totalDue.toLocaleString()} DZD</span>
                    </div>
                  )}
                </div>

                {loading ? (
                  <Card><p className="text-center py-8 text-gray-500">Chargement...</p></Card>
                ) : orders.length === 0 ? (
                  <Card><p className="text-center py-8 text-gray-500">Aucune commande trouvée.</p></Card>
                ) : (
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-400 border-b border-neutral-700">
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Véhicule</th>
                            <th className="py-3 px-4 text-left">Prix</th>
                            <th className="py-3 px-4 text-left">Statut</th>
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">Payé / Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.order_id || order.id} className="border-b border-neutral-800/50 hover:bg-white/5">
                              <td className="py-4 px-4 font-mono text-emerald-400">
                                ORD-{order.order_id || order.id}
                              </td>
                              <td className="py-4 px-4 font-medium">{order.car_model}</td>
                              <td className="py-4 px-4">{(order.price_dzd || 0).toLocaleString()} DZD</td>
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.delivery_status)}`}>
                                  {getStatusIcon(order.delivery_status)} {getStatusText(order.delivery_status)}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-gray-400">
                                {order.created_at ? new Date(order.created_at).toLocaleDateString("fr-FR") : "—"}
                              </td>
                              <td className="py-4 px-4">
                                <div className="font-medium text-emerald-400">
                                  {(order.payment_amount || 0).toLocaleString()} DZD
                                </div>
                                <div className="text-xs text-gray-500">
                                  / {(order.price_dzd || 0).toLocaleString()} DZD
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h1 className="text-3xl font-main mb-6">Facturation</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <StatCard label="Total commandes" value={`${totalPrice.toLocaleString()} DZD`} />
                  <StatCard label="Total payé" value={`${totalPaid.toLocaleString()} DZD`} color="text-emerald-400" />
                  <StatCard label="Solde restant" value={`${totalDue.toLocaleString()} DZD`} color="text-amber-400" />
                </div>

                {billing.length === 0 ? (
                  <Card><p className="text-center py-8 text-gray-500">Aucune facture disponible.</p></Card>
                ) : (
                  billing.map(({ order, total, paid, remaining }, i) => (
                    <Card key={i} className="mb-4">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h3 className="font-main text-xl">{order.car_model}</h3>
                          <p className="text-sm text-gray-500">ORD-{order.order_id || order.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">Montant total</p>
                          <p className="text-2xl font-main">{total.toLocaleString()} DZD</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Progression</span>
                          <span>{total > 0 ? Math.round((paid / total) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                            style={{ width: `${total > 0 ? (paid / total) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                          <span className="text-emerald-400 font-medium">Payé: {paid.toLocaleString()} DZD</span>
                          <span className={remaining > 0 ? "text-amber-400 font-medium" : "text-emerald-400 font-medium"}>
                            Reste: {remaining.toLocaleString()} DZD
                          </span>
                        </div>
                      </div>

                      {paid > 0 && (
                        <div>
                          <h4 className="font-medium mb-3">Paiement(s)</h4>
                          <div className="bg-neutral-800/50 rounded-lg p-3 text-sm">
                            <div className="flex justify-between">
                              <span>Montant versé</span>
                              <span className="text-emerald-400 font-medium">{paid.toLocaleString()} DZD</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Date: {order.created_at ? new Date(order.created_at).toLocaleDateString("fr-FR") : "—"}
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default UserAccount;

