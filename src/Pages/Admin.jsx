import React, { useState } from "react";
import {
  DollarSign,
  Truck,
  Car,
  Users,
  Plus,
  Eye,
  Lock,
  CreditCard,
  BarChart3,
  Trash,
  Edit,
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
      <p className="text-gray-400 text-sm mb-[2vh]">{label}</p>
      <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
    </div>
    <Icon className={`${color} w-8 h-8`} />
  </Card>
);

const BarChart = ({ data = [] }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-4">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between mb-1 text-sm text-gray-300">
            <span>{d.label}</span>
            <span className="font-semibold">${d.value.toLocaleString()}</span>
          </div>
          <div className="w-full bg-neutral-800 rounded h-3">
            <div
              className="h-3 rounded"
              style={{ width: `${(d.value / max) * 100}%`, background: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [currencies, setCurrencies] = useState({
    Dirham: 1,
    Euro: 10.9,
    Dollar: 10.2,
    CanadianDollar: 7.3,
  });

  const [cars, setCars] = useState([
    {
      id: "ORD-1203",
      model: "BMW X5",
      distributor: "Munich Motors",
      price: 67000,
      currency: "Euro",
      status: "Ordered",
    },
    {
      id: "ORD-1432",
      model: "Tesla Model 3",
      distributor: "EV World",
      price: 51000,
      currency: "Dollar",
      status: "In Storage",
    },
    {
      id: "ORD-1579",
      model: "Mercedes C-Class",
      distributor: "AutoLux Paris",
      price: 58000,
      currency: "Euro",
      status: "Delivered",
    },
  ]);

  const [distributors, setDistributors] = useState([
    { id: 1, name: "Munich Motors", owes: 12000, paid: 20000 },
    { id: 2, name: "AutoLux Paris", owes: 0, paid: 30000 },
  ]);

  const [expenses, setExpenses] = useState({
    transport: 12000,
    carFees: 80000,
    douane: 7000,
  });

  const [commercials, setCommercials] = useState([
    {
      id: 1,
      name: "Yacine",
      phone: "0667452891",
      email: "yacine@dealer.com",
      password: "******",
      sold: 5,
      earnings: 2500,
    },
    {
      id: 2,
      name: "Amir",
      phone: "0671128457",
      email: "amir@dealer.com",
      password: "******",
      sold: 3,
      earnings: 1800,
    },
  ]);

  const finances = {
    profit: 124000,
    expenses:
      expenses.transport + expenses.carFees + expenses.douane,
    distributorsRemaining: distributors.reduce(
      (acc, d) => acc + d.owes,
      0
    ),
  };

  // 🔧 Handlers
  const addCar = () => {
    const model = prompt("Enter car model:");
    const distributor = prompt("Enter distributor:");
    const price = parseFloat(prompt("Enter price:"));
    const currency = prompt("Currency (Dirham, Euro, Dollar, CanadianDollar):");
    if (model && distributor && price) {
      setCars((prev) => [
        ...prev,
        {
          id: `ORD-${Math.floor(Math.random() * 10000)}`,
          model,
          distributor,
          price,
          currency,
          status: "Ordered",
        },
      ]);
    }
  };

  const removeCar = (id) => {
    setCars((prev) => prev.filter((c) => c.id !== id));
  };

  const generatePassword = (id) => {
    const newPassword = Math.random().toString(36).slice(-8);
    setCommercials((prev) =>
      prev.map((c) => (c.id === id ? { ...c, password: newPassword } : c))
    );
  };

  const updateDistributor = (id, field, value) => {
    setDistributors((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, [field]: parseFloat(value) || 0 } : d
      )
    );
  };

  const updateCurrency = (cur, val) => {
    setCurrencies((prev) => ({
      ...prev,
      [cur]: parseFloat(val) || prev[cur],
    }));
  };

  const filteredCars = cars.filter(
    (c) =>
      c.model.toLowerCase().includes(search.toLowerCase()) ||
      c.distributor.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen font-main bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white flex">
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
              <h1 className="text-3xl font-main">Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  icon={DollarSign}
                  label="Profit"
                  value={`$${finances.profit.toLocaleString()}`}
                  color="text-emerald-400"
                />
                <StatCard
                  icon={Users}
                  label="Commercials"
                  value={commercials.length}
                  color="text-amber-400"
                />
                <StatCard
                  icon={Car}
                  label="Cars"
                  value={cars.length}
                  color="text-teal-400"
                />
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
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Cars Overview</h1>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search car..."
                    className="px-3 py-2 rounded-xl bg-neutral-800 text-white text-sm focus:outline-none"
                  />
                  <button
                    onClick={addCar}
                    className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl hover:bg-emerald-500/30 transition"
                  >
                    <Plus className="w-4 h-4" /> Add Car
                  </button>
                </div>
              </div>
              <Card>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-neutral-700">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Model</th>
                      <th className="py-3 px-4">Distributor</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Currency</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCars.map((car) => (
                      <tr
                        key={car.id}
                        className="border-b border-neutral-800/50 hover:bg-white/5 transition"
                      >
                        <td className="py-3 px-4 text-emerald-400 font-mono">
                          {car.id}
                        </td>
                        <td className="py-3 px-4">{car.model}</td>
                        <td className="py-3 px-4 text-gray-300">
                          {car.distributor}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          {car.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-gray-400">
                          {car.currency}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => removeCar(car.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash className="w-5 h-5 inline" />
                          </button>
                        </td>
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
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold mb-4">
                Payments & Financials
              </h1>

              {/* Distributors */}
              <Card>
                <h3 className="text-lg font-bold mb-4">
                  Distributor Balances
                </h3>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-neutral-700">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Owes ($)</th>
                      <th className="py-3 px-4">Paid ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributors.map((d) => (
                      <tr
                        key={d.id}
                        className="border-b border-neutral-800/50 hover:bg-white/5 transition"
                      >
                        <td className="py-3 px-4 font-medium">{d.name}</td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={d.owes}
                            onChange={(e) =>
                              updateDistributor(d.id, "owes", e.target.value)
                            }
                            className="w-24 bg-neutral-800 rounded p-1 text-center"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={d.paid}
                            onChange={(e) =>
                              updateDistributor(d.id, "paid", e.target.value)
                            }
                            className="w-24 bg-neutral-800 rounded p-1 text-center"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* Currency rates */}
              <Card>
                <h3 className="text-lg font-bold mb-4">Currency Rates</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(currencies).map(([cur, val]) => (
                    <div key={cur}>
                      <p className="text-gray-400 text-sm mb-1">{cur}</p>
                      <input
                        type="number"
                        value={val}
                        onChange={(e) =>
                          updateCurrency(cur, e.target.value)
                        }
                        className="w-full bg-neutral-800 rounded p-2 text-center"
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Expenses */}
              <Card>
                <h3 className="text-lg font-bold mb-4">Expenses</h3>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(expenses).map(([key, val]) => (
                    <div key={key}>
                      <p className="text-gray-400 text-sm capitalize mb-1">
                        {key}
                      </p>
                      <input
                        type="number"
                        value={val}
                        onChange={(e) =>
                          setExpenses({
                            ...expenses,
                            [key]: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-neutral-800 rounded p-2 text-center"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === "commercials" && (
            <motion.div
              key="commercials"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Commercial Management</h1>
              </div>
              <Card>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-neutral-700">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Cars Sold</th>
                      <th className="py-3 px-4">Earnings ($)</th>
                      <th className="py-3 px-4">Password</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commercials.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-neutral-800/50 hover:bg-white/5 transition"
                      >
                        <td className="py-3 px-4 font-medium">{c.name}</td>
                        <td className="py-3 px-4 text-gray-300">{c.email}</td>
                        <td className="py-3 px-4 text-gray-400">{c.phone}</td>
                        <td className="py-3 px-4 text-center">{c.sold}</td>
                        <td className="py-3 px-4 text-center text-emerald-400">
                          {c.earnings}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {c.password}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => generatePassword(c.id)}
                            className="text-emerald-400 hover:text-emerald-300"
                          >
                            <Lock className="w-5 h-5 inline" /> Generate
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
