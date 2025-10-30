import React, { useState } from "react";
import {
  DollarSign,
  Truck,
  Car,
  Users,
  Plus,
  Eye,
  Lock,
  Package,
  CreditCard,
  BarChart3,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Simple reusable card
const Card = ({ children, className = "" }) => (
  <div
    className={`bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 ${className}`}
  >
    {children}
  </div>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card className="flex items-center justify-between">
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
    </div>
    <Icon className={`${color} w-8 h-8`} />
  </Card>
);

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [commercials, setCommercials] = useState([
    { id: 1, name: "Yacine", phone: "0667452891", email: "yacine@dealer.com", password: "******" },
    { id: 2, name: "Amir", phone: "0671128457", email: "amir@dealer.com", password: "******" },
  ]);

  const [cars, setCars] = useState([
    { id: "ORD-1203", model: "BMW X5", status: "Ordered", distributor: "Munich Motors", price: 67000 },
    { id: "ORD-1432", model: "Tesla Model 3", status: "In Storage", distributor: "EV World", price: 51000 },
    { id: "ORD-1579", model: "Mercedes C-Class", status: "Delivered", distributor: "AutoLux Paris", price: 58000 },
  ]);

  const [finances] = useState({
    profit: 124000,
    expenses: 89000,
    transportFees: 12000,
    distributorsRemaining: 34000,
  });

  const generatePassword = (id) => {
    const newPassword = Math.random().toString(36).slice(-8);
    setCommercials((prev) =>
      prev.map((c) => (c.id === id ? { ...c, password: newPassword } : c))
    );
  };

  const addCommercial = () => {
    const name = prompt("Enter commercial name:");
    const email = prompt("Enter commercial email:");
    const phone = prompt("Enter phone number:");
    if (name && email && phone) {
      setCommercials((prev) => [
        ...prev,
        { id: Date.now(), name, email, phone, password: "******" },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-20 md:w-24 flex flex-col items-center py-6 space-y-6 border-r border-neutral-800 bg-neutral-950/70 backdrop-blur-md fixed left-0 top-0 h-full">
        {[
          { id: "overview", icon: BarChart3, label: "Overview" },
          { id: "cars", icon: Car, label: "Cars" },
          { id: "payments", icon: CreditCard, label: "Payments" },
          { id: "commercials", icon: Users, label: "Commercials" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`p-3 rounded-xl transition-all ${
              activeTab === id
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
            title={label}
          >
            <Icon className="w-6 h-6" />
          </button>
        ))}
      </aside>

      {/* Content */}
      <main className="flex-1 ml-20 md:ml-28 p-8 space-y-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <h1 className="text-3xl font-bold">Admin Overview</h1>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={DollarSign} label="Profit" value={`$${finances.profit.toLocaleString()}`} color="text-emerald-400" />
                <StatCard icon={CreditCard} label="Expenses" value={`$${finances.expenses.toLocaleString()}`} color="text-amber-400" />
                <StatCard icon={Truck} label="Transport Fees" value={`$${finances.transportFees.toLocaleString()}`} color="text-blue-400" />
                <StatCard icon={Shield} label="Remaining (Distributors)" value={`$${finances.distributorsRemaining.toLocaleString()}`} color="text-teal-400" />
              </div>
            </motion.div>
          )}

          {activeTab === "cars" && (
            <motion.div
              key="cars"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold mb-6">Cars Overview</h1>
              <Card>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-neutral-700">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Model</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Distributor</th>
                      <th className="py-3 px-4">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <tr
                        key={car.id}
                        className="border-b border-neutral-800/50 hover:bg-white/5 transition"
                      >
                        <td className="py-3 px-4 text-emerald-400 font-mono">{car.id}</td>
                        <td className="py-3 px-4">{car.model}</td>
                        <td className="py-3 px-4 text-gray-300">{car.status}</td>
                        <td className="py-3 px-4 text-gray-400">{car.distributor}</td>
                        <td className="py-3 px-4 font-bold text-white">${car.price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </motion.div>
          )}

          {activeTab === "payments" && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold mb-6">Payments Management</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-bold mb-4">Distributor Payments</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Track outgoing payments to distributors and their remaining balances.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex justify-between text-sm bg-white/5 p-3 rounded-lg">
                      <span>Munich Motors</span>
                      <span className="text-amber-400">Remaining: $12,000</span>
                    </li>
                    <li className="flex justify-between text-sm bg-white/5 p-3 rounded-lg">
                      <span>AutoLux Paris</span>
                      <span className="text-emerald-400">Paid in full</span>
                    </li>
                  </ul>
                </Card>

                <Card>
                  <h3 className="text-lg font-bold mb-4">Transport Fees</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Monitor the transport costs for each car shipment.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex justify-between text-sm bg-white/5 p-3 rounded-lg">
                      <span>Tesla Model 3</span>
                      <span className="text-gray-300">$1,400</span>
                    </li>
                    <li className="flex justify-between text-sm bg-white/5 p-3 rounded-lg">
                      <span>BMW X5</span>
                      <span className="text-gray-300">$2,000</span>
                    </li>
                  </ul>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === "commercials" && (
            <motion.div
              key="commercials"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Commercial Management</h1>
                <button
                  onClick={addCommercial}
                  className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl hover:bg-emerald-500/30 transition"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>
              <Card>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-neutral-700">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Password</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commercials.map((c) => (
                      <tr key={c.id} className="border-b border-neutral-800/50 hover:bg-white/5 transition">
                        <td className="py-3 px-4 font-medium">{c.name}</td>
                        <td className="py-3 px-4 text-gray-300">{c.email}</td>
                        <td className="py-3 px-4 text-gray-400">{c.phone}</td>
                        <td className="py-3 px-4 text-gray-500">{c.password}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => generatePassword(c.id)}
                            className="text-emerald-400 hover:text-emerald-300 mr-3"
                          >
                            <Lock className="w-5 h-5 inline" /> Generate
                          </button>
                          <button className="text-blue-400 hover:text-blue-300">
                            <Eye className="w-5 h-5 inline" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Admin;
