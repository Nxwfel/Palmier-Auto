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

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Your Tesla Model 3 has been shipped!",
      date: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      message: "Payment confirmed for BMW X5 by commercial dept.",
      date: "1 day ago",
      read: false,
    },
    {
      id: 3,
      message: "Your Mercedes C-Class is ready for pickup",
      date: "3 days ago",
      read: true,
    },
  ]);

  const billingDetails = [
    {
      orderId: "ORD-001",
      car: "Tesla Model 3",
      totalPrice: 45000,
      amountPaid: 30000,
      remaining: 15000,
      payments: [
        { method: "Bank Transfer", date: "Oct 1, 2025", amount: 15000, status: "Completed" },
        { method: "Card Payment", date: "Oct 20, 2025", amount: 15000, status: "Completed" },
      ],
    },
  ];

  const orders = [
    {
      id: "ORD-001",
      car: "Tesla",
      model: "Model 3",
      price: "$45,000",
      phase: "Shipping",
      status: "shipping",
      confirmedBy: "Ali",
      date: "Oct 26, 2025",
    },
    {
      id: "ORD-002",
      car: "BMW",
      model: "X5",
      price: "$60,000",
      phase: "Shipped",
      status: "shipped",
      confirmedBy: "Yacine",
      date: "Oct 20, 2025",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "shipping":
        return "text-blue-400 bg-blue-500/10";
      case "shipped":
        return "text-amber-400 bg-amber-500/10";
      case "ready":
        return "text-emerald-400 bg-emerald-500/10";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "shipping":
        return <Truck className="w-4 h-4" />;
      case "shipped":
        return <Package className="w-4 h-4" />;
      case "ready":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalPaid = billingDetails.reduce((s, o) => s + o.amountPaid, 0);
  const totalDue = billingDetails.reduce((s, o) => s + o.remaining, 0);
  const totalPrice = billingDetails.reduce((s, o) => s + o.totalPrice, 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white">
      {/* Sidebar */}
      <aside className="w-20 md:w-24 flex flex-col items-center py-6 space-y-6 fixed left-0 top-0 h-full bg-neutral-950/80 backdrop-blur-md border-r border-neutral-800 z-40">
       <ArrowBigLeft className=" rounded-xl relative group transition-all cursor-pointer"/>
        {[
          { id: "dashboard", icon: Home, label: "Dashboard" },
          { id: "orders", icon: Package, label: "Orders" },
          { id: "billing", icon: CreditCard, label: "Billing" },
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
                <p className="p-4 text-gray-500 text-center">No notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() =>
                      setNotifications((n) =>
                        n.map((x) =>
                          x.id === notif.id ? { ...x, read: true } : x
                        )
                      )
                    }
                    className={`p-4 border-b border-neutral-800 cursor-pointer hover:bg-white/5 ${
                      !notif.read ? "bg-emerald-500/5" : ""
                    }`}
                  >
                    <p className="text-white">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.date}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="ml-20 md:ml-28 w-full py-10 px-6 md:px-10 space-y-10 max-w-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-4xl font-main">Welcome, Farid 👋</h1>
              <p className="text-gray-400 mb-8">
                Manage your orders, payments, and account details.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
               <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                    <Card className="max-w-full mx-auto flex flex-col justify-center items-center gap-8">
                      <div className="h-24 w-24 md:h-32 md:w-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-3xl font-main">
                        FM
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-center w-full">
                        <div>
                          <span className="text-gray-400">Full Name:</span>{" "}
                          <span className="ml-2 font-medium">Farid Mahomoudi</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Phone:</span>{" "}
                          <span className="ml-2 font-medium">0676159221</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Dealer:</span>{" "}
                          <span className="ml-2 font-medium">
                            Skikda Palmier-Auto
                          </span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                <StatCard label="Cars Ordered" value={orders.length} />
                <StatCard
                  label="Total Paid"
                  value={`$${totalPaid.toLocaleString()}`}
                  color="text-emerald-400"
                />
                <StatCard
                  label="Balance Due"
                  value={`$${totalDue.toLocaleString()}`}
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
                <h1 className="text-3xl font-main">Your Orders</h1>
                <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Commercial confirmation required
                  </span>
                </div>
              </div>

              <Card>
                <div className="max-w-screen overflow-x-scroll">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-neutral-700">
                        <th className="py-3 px-4 text-left">Order ID</th>
                        <th className="py-3 px-4 text-left">Vehicle</th>
                        <th className="py-3 px-4 text-left">Model</th>
                        <th className="py-3 px-4 text-left">Price</th>
                        <th className="py-3 px-4 text-left">Phase</th>
                        <th className="py-3 px-4 text-left">Confirmed By</th>
                        <th className="py-3 px-4 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-neutral-800/50 hover:bg-white/5 transition"
                        >
                          <td className="py-4 px-4 font-mono text-emerald-400">
                            {order.id}
                          </td>
                          <td className="py-4 px-4 font-medium">
                            {order.car}
                          </td>
                          <td className="py-4 px-4 text-gray-300">
                            {order.model}
                          </td>
                          <td className="py-4 px-4 font-main text-white">
                            {order.price}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              {order.phase}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium">
                              {order.confirmedBy}
                            </div>
                            <div className="text-xs text-gray-500">
                              Commercial
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-400">
                            {order.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
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
                <h1 className="text-3xl font-main">Billing Overview</h1>
                <div className="flex items-center gap-2 text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Payments processed offline
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard label="Total Amount" value={`$${totalPrice.toLocaleString()}`} />
                <StatCard label="Amount Paid" value={`$${totalPaid.toLocaleString()}`} color="text-emerald-400" />
                <StatCard label="Remaining Balance" value={`$${totalDue.toLocaleString()}`} color="text-amber-400" />
              </div>

              {billingDetails.map((order, i) => (
                <Card key={i}>
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="font-main text-xl">{order.car}</h3>
                      <p className="text-sm text-gray-500">{order.orderId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Total</p>
                      <p className="text-2xl font-main">${order.totalPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Payment Progress</span>
                      <span>{Math.round((order.amountPaid / order.totalPrice) * 100)}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{
                          width: `${(order.amountPaid / order.totalPrice) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-emerald-400 font-medium">
                        Paid: ${order.amountPaid.toLocaleString()}
                      </span>
                      <span
                        className={`font-medium ${
                          order.remaining > 0
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        Due: ${order.remaining.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Payment History */}
                  <h4 className="font-medium mb-3">Payment History</h4>
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
                            p.status === "Completed"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }`}
                        >
                          ${p.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default UserAccount;
