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

const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com";

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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Auth state
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loginForm, setLoginForm] = useState({ phone: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Data state
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Derived billing data
  const billingDetails = orders.map((order) => {
    const totalPrice = order.price_dzd || 0;
    const amountPaid = order.payment_amount || 0;
    const remaining = Math.max(0, totalPrice - amountPaid);
    return {
      orderId: `ORD-${order.order_id}`,
      car: order.car_model,
      totalPrice,
      amountPaid,
      remaining,
      payments: [
        {
          method: "Payment",
          date: order.purchase_date
            ? new Date(order.purchase_date).toLocaleDateString("fr-FR")
            : "N/A",
          amount: amountPaid,
          status: "Completed",
        },
      ],
    };
  });

  const totalPaid = billingDetails.reduce((s, o) => s + o.amountPaid, 0);
  const totalDue = billingDetails.reduce((s, o) => s + o.remaining, 0);
  const totalPrice = billingDetails.reduce((s, o) => s + o.totalPrice, 0);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle click outside notifications
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data when token changes
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Get user profile
        const profileRes = await fetch(`${API_BASE_URL}/clients/client`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        if (!profileRes.ok) throw new Error("Failed to load profile");
        const profile = await profileRes.json();
        setUserProfile(profile);

        // Get orders
        const ordersRes = await fetch(`${API_BASE_URL}/orders/client/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ client_id: profile.id }),
        });

        if (!ordersRes.ok) throw new Error("Failed to load orders");
        const ordersData = await ordersRes.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);

        // Get notifications
        const notifRes = await fetch(`${API_BASE_URL}/notifications/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            recipient_type: "client",
            recipient_id: profile.id,
          }),
        });

        if (!notifRes.ok) throw new Error("Failed to load notifications");
        const notifs = await notifRes.json();
        setNotifications(Array.isArray(notifs) ? notifs : []);

      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
        // Clear token on auth failure
        if (err.message.includes("401") || err.message.includes("403")) {
          localStorage.removeItem("token");
          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleLogin = async () => {
    if (!loginForm.phone || !loginForm.password) {
      setLoginError("Veuillez remplir tous les champs");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: loginForm.phone,
          password: loginForm.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        setLoginError("");
      } else {
        setLoginError("Numéro de téléphone ou mot de passe incorrect");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Erreur de connexion. Réessayez.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserProfile(null);
    setOrders([]);
    setNotifications([]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
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

  // Login screen
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-950 to-black p-4">
        <Card className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Connexion Client</h2>
          {loginError && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg text-sm mb-4">
              {loginError}
            </div>
          )}
          <input
            value={loginForm.phone}
            onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
            placeholder="Numéro de téléphone"
            className="w-full p-3 bg-neutral-800 rounded-lg outline-none mb-3 text-white placeholder:text-neutral-500"
          />
          <input
            type="password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            placeholder="Mot de passe"
            className="w-full p-3 bg-neutral-800 rounded-lg outline-none mb-4 text-white placeholder:text-neutral-500"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-emerald-600 py-3 rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            Se connecter
          </button>
        </Card>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white">
      {/* Sidebar */}
      <aside className="w-20 md:w-24 flex flex-col items-center py-6 space-y-6 fixed left-0 top-0 h-full bg-neutral-950/80 backdrop-blur-md border-r border-neutral-800 z-40">
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title="Logout"
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

      {/* Notification Panel */}
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
                    onClick={() => markNotificationAsRead(notif.id)}
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

      {/* Main Content */}
      <main className="ml-20 md:ml-28 w-full py-10 px-6 md:px-10 space-y-10 max-w-screen overflow-hidden">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

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
              <p className="text-gray-400 mb-8">
                Gérez vos commandes, paiements et informations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="max-w-full mx-auto flex flex-col justify-center items-center gap-8">
                    <div className="h-24 w-24 md:h-32 md:w-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-main">
                      {(userProfile?.name?.[0] || "U") + (userProfile?.surname?.[0] || "C")}
                    </div>
                    <div className="grid grid-cols-1 gap-3 text-center w-full">
                      <div>
                        <span className="text-gray-400">Nom complet:</span>{" "}
                        <span className="ml-2 font-medium">
                          {userProfile?.name} {userProfile?.surname}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Téléphone:</span>{" "}
                        <span className="ml-2 font-medium">{userProfile?.phone_number}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Wilaya:</span>{" "}
                        <span className="ml-2 font-medium">{userProfile?.wilaya}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
                <StatCard label="Voitures commandées" value={orders.length} />
                <StatCard
                  label="Total payé"
                  value={`${totalPaid.toLocaleString()} DZD`}
                  color="text-emerald-400"
                />
                <StatCard
                  label="Solde restant"
                  value={`${totalDue.toLocaleString()} DZD`}
                  color="text-amber-400"
                />
              </div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <h1 className="text-3xl font-main">Vos Commandes</h1>
                {orders.some(o => o.payment_amount < o.price_dzd) && (
                  <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Paiement partiel – solde restant
                    </span>
                  </div>
                )}
              </div>

              {loading ? (
                <Card>
                  <p className="text-center py-8 text-gray-500">Chargement...</p>
                </Card>
              ) : orders.length === 0 ? (
                <Card>
                  <p className="text-center py-8 text-gray-500">Aucune commande trouvée.</p>
                </Card>
              ) : (
                <Card>
                  <div className="max-w-screen overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-400 border-b border-neutral-700">
                          <th className="py-3 px-4 text-left">Commande</th>
                          <th className="py-3 px-4 text-left">Véhicule</th>
                          <th className="py-3 px-4 text-left">Prix</th>
                          <th className="py-3 px-4 text-left">Statut</th>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Payé / Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr
                            key={order.order_id}
                            className="border-b border-neutral-800/50 hover:bg-white/5 transition"
                          >
                            <td className="py-4 px-4 font-mono text-emerald-400">
                              ORD-{order.order_id}
                            </td>
                            <td className="py-4 px-4 font-medium">
                              {order.car_model}
                            </td>
                            <td className="py-4 px-4 font-main text-white">
                              {order.price_dzd?.toLocaleString() || "N/A"} DZD
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                                  order.delivery_status
                                )}`}
                              >
                                {getStatusIcon(order.delivery_status)}
                                {getStatusText(order.delivery_status)}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-400">
                              {order.purchase_date
                                ? new Date(order.purchase_date).toLocaleDateString("fr-FR")
                                : "N/A"}
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-medium text-emerald-400">
                                {order.payment_amount?.toLocaleString() || 0} DZD
                              </div>
                              <div className="text-xs text-gray-500">
                                / {order.price_dzd?.toLocaleString() || 0} DZD
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
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <h1 className="text-3xl font-main">Facturation</h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard label="Montant total" value={`${totalPrice.toLocaleString()} DZD`} />
                <StatCard label="Montant payé" value={`${totalPaid.toLocaleString()} DZD`} color="text-emerald-400" />
                <StatCard label="Solde restant" value={`${totalDue.toLocaleString()} DZD`} color="text-amber-400" />
              </div>

              {billingDetails.length === 0 ? (
                <Card>
                  <p className="text-center py-8 text-gray-500">Aucune facture disponible.</p>
                </Card>
              ) : (
                billingDetails.map((order, i) => (
                  <Card key={i}>
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <h3 className="font-main text-xl">{order.car}</h3>
                        <p className="text-sm text-gray-500">{order.orderId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Total</p>
                        <p className="text-2xl font-main">{order.totalPrice.toLocaleString()} DZD</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progression du paiement</span>
                        <span>{Math.round((order.amountPaid / (order.totalPrice || 1)) * 100)}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          style={{
                            width: `${(order.amountPaid / (order.totalPrice || 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-emerald-400 font-medium">
                          Payé: {order.amountPaid.toLocaleString()} DZD
                        </span>
                        <span
                          className={`font-medium ${
                            order.remaining > 0 ? "text-amber-400" : "text-emerald-400"
                          }`}
                        >
                          Reste: {order.remaining.toLocaleString()} DZD
                        </span>
                      </div>
                    </div>

                    {/* Payment History */}
                    <h4 className="font-medium mb-3">Historique des paiements</h4>
                    <div className="space-y-3">
                      {order.payments.map((p, j) => (
                        <div
                          key={j}
                          className="flex justify-between text-sm bg-white/5 rounded-lg p-3"
                        >
                          <div>
                            <p className="font-medium">{p.method}</p>
                            <p className="text-xs text-gray-500">{p.date}</p>
                          </div>
                          <p
                            className={`font-bold ${
                              p.status === "Completed" ? "text-emerald-400" : "text-amber-400"
                            }`}
                          >
                            {p.amount.toLocaleString()} DZD
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default UserAccount;