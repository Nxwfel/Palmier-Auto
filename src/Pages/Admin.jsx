import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Car,
  Users,
  CreditCard,
  FilePlus,
  Trash2,
  Edit2,
  TrendingUp,
  TrendingDown,
  Clock,
  X,
  Image as ImageIcon,
  Lock,
  DollarSign,
} from "lucide-react";

// Reusable small UI pieces
const Card = ({ children, className = "" }) => (
  <div className={`bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

const Stat = ({ label, value, icon: Icon }) => (
  <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-between">
    <div>
      <p className="text-neutral-400 text-sm">{label}</p>
      <div className="text-2xl font-bold">{value}</div>
    </div>
    <Icon className="w-8 h-8 text-neutral-300" />
  </div>
);

// Modal component
const Modal = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className="relative z-10 w-[95%] md:w-[70%] lg:w-[50%] p-6 bg-neutral-900 rounded-2xl border border-neutral-800"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{title}</h3>
            <button onClick={onClose} className="p-2 rounded hover:bg-white/5">
              <X />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function AdminSuperPanel() {

  const API_BASE='https://showroomd38d7382d23h8dio3d46wqdxasjdl.onrender.com'

  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [earnings, setEarnings] = useState('');

  useEffect(() => {
  const fetchEarnings = async () => {
    const response = await fetch(`${API_BASE}/cash_register`);
    const data = await response.json();
    setEarnings(data);
  };
  fetchEarnings();
}, []);

  const [expenses, setExpenses] = useState([]);
  useEffect(()=>{
    const fetchExpenses = async () => {
      const response = await fetch(`${API_BASE}/expenses`);
      const data = await response.json();
      setExpenses(data);
    }
    fetchExpenses();
  })
  const [profit , setProfit] = useState('');
  const [requests , setRequests] = useState([]);
  const [carsvalue , setCarsValue] = useState('');
  const [cars , setCars] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [commercials, setCommercials] = useState([]);
  const [logs, setLogs] = useState([]);
    const CurrenciesList = {
    usd: '',
    eur: '',
    aed: '',
    cad: '',
  }
  const [currencies , setCurrencies] = useState(CurrenciesList)
  const [showAddCar, setShowAddCar] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const initialCarForm = {
    model: "",
    buyPrice: "",
    sellPrice: "",
    currency: "",
    transportFee: "",
    otherFees: "",
    quantity: 1,
    colors: "",
    description: "",
    imageFile: null,
  };
  const [carForm, setCarForm] = useState(initialCarForm);
  const pushLog = (actor, action) => {
    setLogs((p) => [{ id: Date.now(), actor, action, date: new Date().toISOString() }, ...p]);
  };

  // add car handler (admin or marketing agent)
  const handleOpenAdd = (agent = "Admin") => {
    setCarForm(initialCarForm);
    setEditingCar(null);
    setShowAddCar(true);
    pushLog(agent, "Opened Add Car modal");
  };

  const handleImageToDataUrl = (file) => {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = () => rej(new Error("Image read error"));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitCar = async (e) => {
    e.preventDefault();
    // basic validation
    if (!carForm.model || !carForm.fournisseur) return alert("Model and fournisseur required");

    let imageData = null;
    if (carForm.imageFile) {
      try {
        imageData = await handleImageToDataUrl(carForm.imageFile);
      } catch (err) {
        console.error(err);
      }
    }

    const newCar = {
      id: editingCar ? editingCar.id : `C-${Math.floor(Math.random() * 10000)}`,
      model: carForm.model,
      fournisseur: carForm.fournisseur,
      buyPrice: parseFloat(carForm.buyPrice) || 0,
      sellPrice: parseFloat(carForm.sellPrice) || 0,
      currency: carForm.currency || "DZD",
      status: "Available",
      transportFee: parseFloat(carForm.transportFee) || 0,
      otherFees: parseFloat(carForm.otherFees) || 0,
      quantity: parseInt(carForm.quantity) || 1,
      colors: carForm.colors ? carForm.colors.split(",").map((s) => s.trim()) : [],
      description: carForm.description,
      image: imageData,
      paidToFournisseur: 0,
    };

    if (editingCar) {
      setCars((p) => p.map((c) => (c.id === editingCar.id ? newCar : c)));
      pushLog("Admin", `Edited car ${newCar.model} (${newCar.id})`);
    } else {
      setCars((p) => [newCar, ...p]);
      pushLog("Admin", `Added car ${newCar.model} (${newCar.id})`);
    }

    setShowAddCar(false);
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setCarForm({
      model: car.model,
      fournisseur: car.fournisseur,
      buyPrice: car.buyPrice,
      sellPrice: car.sellPrice,
      currency: car.currency,
      transportFee: car.transportFee,
      otherFees: car.otherFees,
      quantity: car.quantity,
      colors: car.colors.join(", "),
      description: car.description,
      imageFile: null,
    });
    setShowAddCar(true);
    pushLog("Admin", `Opened Edit modal for ${car.model} (${car.id})`);
  };

  const handleDelete = (id) => {
    if (!confirm("Supprimer cette voiture ?")) return;
    setCars((p) => p.filter((c) => c.id !== id));
    pushLog("Admin", `Deleted car ${id}`);
  };

  // Commercial requests handling
  const handleApproveRequest = (r) => {
    // transforms request into an order (add a car placeholder)
    const newCar = {
      id: `C-${Math.floor(Math.random() * 10000)}`,
      model: r.model,
      fournisseur: "(To be defined)",
      buyPrice: 0,
      sellPrice: 0,
      currency: "DZD",
      status: "Requested",
      transportFee: 0,
      otherFees: 0,
      quantity: 1,
      colors: [],
      description: `Added from request ${r.id} by commercial ${r.commercialId}`,
      image: null,
      paidToFournisseur: 0,
    };
    setCars((p) => [newCar, ...p]);
    setRequests((p) => p.map((rq) => (rq.id === r.id ? { ...rq, status: "Approved" } : rq)));
    pushLog("Admin", `Approved request ${r.id} -> created car ${newCar.id}`);
  };

  const handleDeclineRequest = (r) => {
    setRequests((p) => p.map((rq) => (rq.id === r.id ? { ...rq, status: "Declined" } : rq)));
    pushLog("Admin", `Declined request ${r.id}`);
  };

  // Fournisseur payment update per car
  const updatePaidToFournisseur = (carId, amount) => {
    setCars((p) => p.map((c) => (c.id === carId ? { ...c, paidToFournisseur: parseFloat(amount) || 0 } : c)));
    pushLog("Admin", `Updated paid for ${carId} to ${amount}`);
  };

  // commission set
  const setCommissionForCommercial = (id, rate) => {
    setCommercials((p) => p.map((c) => (c.id === id ? { ...c, commissionRate: parseFloat(rate) || 0 } : c)));
    pushLog("Admin", `Set commission ${rate}% for commercial ${id}`);
  };

  // filtered lists
  const filteredCars = cars.filter((c) => c.model.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()) || c.fournisseur.toLowerCase().includes(search.toLowerCase()));
  const pendingRequests = requests.filter((r) => r.status === "Pending");

  // derived finances
  const totalExpenses = cars.reduce((s, c) => s + (c.buyPrice + (c.transportFee || 0) + (c.otherFees || 0)), 0) + Object.values(expenses).reduce((s, v) => s + v, 0);
  const totalPaidToFournisseurs = fournisseurs.reduce((s, f) => s + (f.paid || 0), 0);
  const totalStockValue = cars.reduce((s, c) => s + (c.buyPrice * (c.quantity || 1)), 0);

  // small effect to keep fournisseurs remaining consistent (demo only)
  useEffect(() => {
    setFournisseurs((prev) => prev.map((f) => ({ ...f, remaining: Math.max(0, (f.remaining || 0)) })));
  }, []);
  // render
  return (
    <div className="min-h-screen font-main bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-20 md:w-28 flex flex-col items-center py-6 space-y-6 border-r border-neutral-800 bg-neutral-950/70 backdrop-blur-md fixed left-0 top-0 h-full">
        {[
          { id: "overview", icon: BarChart3, label: "Overview" },
          { id: "cars", icon: Car, label: "Cars" },
          { id: "fournisseurs", icon: CreditCard, label: "Fournisseurs" },
          { id: "commercials", icon: Users, label: "Commercials" },
          { id: "requests", icon: FilePlus, label: "Requests" },
          { id: "logs", icon: Clock, label: "Logs" },
          { id: "currency", icon: DollarSign, label: "currency" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            title={label}
            className={`p-3 rounded-xl transition-all cursor-pointer ${tab === id ? "bg-emerald-500/20 text-emerald-400" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
          >
            <Icon className="w-6 h-6" />
          </button>
        ))}
        <motion.svg 
        initial={{ scale:1 }}
        whileHover={{ scale:1.09 }}
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="red" className="size-[3vh] flex mt-auto cursor-pointer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </motion.svg>

      </aside>

      {/* Main content */}
      <main className="flex-1 ml-20 md:ml-28 p-8 space-y-8">
        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-semibold">Dashboard</h1>
                <div className="flex items-center gap-3">
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="bg-neutral-800 px-3 py-2 rounded-lg text-sm" />
                  <button onClick={() => handleOpenAdd("Admin")} className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400">Add Car</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Stat label="Caisse" value={`${totalExpenses.toLocaleString()}`} icon={CreditCard} />
                <Stat label="Chiffre d'affaire" value={earnings.balance} icon={TrendingUp} />
                <Stat label="Total Expenses" value={expenses.month} icon={TrendingDown} />
                <Stat label="Paid to Fournisseurs" value={`${totalPaidToFournisseurs.toLocaleString()}`} icon={Users} />
                <Stat label="Pending Requests" value={pendingRequests.length} icon={FilePlus} />
                <Stat label="Total Stock Value" value={`${totalStockValue.toLocaleString()}`} icon={Car} />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Recent Cars</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {cars.slice(0, 6).map((c) => (
                      <div key={c.id} className="flex items-center gap-4 p-3 bg-neutral-900/40 rounded-lg border border-neutral-800">
                        <div className="w-20 h-12 bg-neutral-800 rounded overflow-hidden flex items-center justify-center">
                          {c.image ? <img src={c.image} alt={c.model} className="w-full h-full object-cover" /> : <ImageIcon />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{c.model}</div>
                              <div className="text-sm text-neutral-400">{c.fournisseur}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-neutral-400">Stock: {c.quantity}</div>
                              <div className="text-sm text-emerald-400">{(c.sellPrice).toLocaleString()} {c.currency}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => handleOpenAdd("Admin")} className="w-full p-3 rounded-lg text-left bg-emerald-500/10">Add Car</button>
                    <button onClick={() => setTab("requests")} className="w-full p-3 rounded-lg text-left bg-yellow-500/10">View Requests ({pendingRequests.length})</button>
                    <button onClick={() => setTab("commercials")} className="w-full p-3 rounded-lg text-left bg-blue-500/10">Manage Commercials</button>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
          {tab === "currency" && (
            <motion.div key="currency" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-2xl font-semibold mb-6">Taux de Change (DZD)</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
            { key: "usd", label: "Dollar (USD)" },
            { key: "eur", label: "Euro (EUR)" },
            { key: "aed", label: "Dirham (AED)" },
            { key: "cad", label: "Dollar Canadien (CAD)" },
            ].map((c) => (
            <div
            key={c.key}
            className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 flex flex-col gap-3"
            >
            <h3 className="text-lg font-semibold">{c.label}</h3>
            <input
            type="number"
            step="0.01"
            value={currencies[c.key]}
            onChange={(e) => handleCurrencyChange(c.key, e.target.value)}
            className="bg-neutral-800 p-2 rounded-lg outline-none text-center text-white"
            />
            <span className="text-neutral-400 text-sm">1 {c.label.split(" ")[0]} = {currencies[c.key]} DZD</span>
            </div>
            ))}
            </div>
            </motion.div>
            )}
          {tab === "cars" && (
            <motion.div key="cars" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Cars Management</h2>
                <div className="flex items-center gap-3">
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search car..." className="bg-neutral-800 px-3 py-2 rounded-lg text-sm" />
                  <button onClick={() => handleOpenAdd("Admin")} className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400">Add Car</button>
                </div>
              </div>

              <Card>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                      <th className="py-3 px-3">ID</th>
                      <th className="py-3 px-3">Model</th>
                      <th className="py-3 px-3">Fournisseur</th>
                      <th className="py-3 px-3">Buy Price</th>
                      <th className="py-3 px-3">Transport</th>
                      <th className="py-3 px-3">Other Fees</th>
                      <th className="py-3 px-3">Qty</th>
                      <th className="py-3 px-3">Paid</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCars.map((c) => (
                      <tr key={c.id} className="border-b border-neutral-800/40 hover:bg-white/5 transition">
                        <td className="py-3 px-3 font-mono text-emerald-400">{c.id}</td>
                        <td className="py-3 px-3">{c.model}</td>
                        <td className="py-3 px-3">{c.fournisseur}</td>
                        <td className="py-3 px-3">{(c.buyPrice).toLocaleString()} {c.currency}</td>
                        <td className="py-3 px-3">{(c.transportFee || 0).toLocaleString()}</td>
                        <td className="py-3 px-3">{(c.otherFees || 0).toLocaleString()}</td>
                        <td className="py-3 px-3">{c.quantity}</td>
                        <td className="py-3 px-3">
                          <input type="number" value={c.paidToFournisseur || 0} onChange={(e) => updatePaidToFournisseur(c.id, e.target.value)} className="w-28 bg-neutral-800 rounded p-1 text-center" />
                        </td>
                        <td className="py-3 px-3 text-emerald-400">{c.status}</td>
                        <td className="py-3 px-3 text-right">
                          <button onClick={() => handleEdit(c)} className="mr-2 text-blue-400 hover:text-blue-300"><Edit2 /></button>
                          <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300"><Trash2 /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </motion.div>
          )}

          {tab === "fournisseurs" && (
            <motion.div key="fournisseurs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Fournisseurs & Finance</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Fournisseurs</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                        <th className="py-2 px-2">Name</th>
                        <th className="py-2 px-2">Paid</th>
                        <th className="py-2 px-2">Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fournisseurs.map((f) => (
                        <tr key={f.id} className="border-b border-neutral-800/40 hover:bg-white/5">
                          <td className="py-2 px-2">{f.name}</td>
                          <td className="py-2 px-2"><input className="bg-neutral-800 rounded p-1 w-28" type="number" value={f.paid} onChange={(e) => setFournisseurs((p) => p.map((x) => x.id === f.id ? { ...x, paid: parseFloat(e.target.value) || 0 } : x))} /></td>
                          <td className="py-2 px-2">{(f.remaining || 0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-4">Expenses</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(expenses).map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between">
                        <div className="capitalize">{k}</div>
                        <input className="bg-neutral-800 rounded p-1 w-32" type="number" value={v} onChange={(e) => setExpenses((p) => ({ ...p, [k]: parseFloat(e.target.value) || 0 }))} />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Supplier Payment Details (per car)</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {cars.map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 bg-neutral-900/40 rounded-lg border border-neutral-800">
                        <div>
                          <div className="font-medium">{c.model} — {c.id}</div>
                          <div className="text-sm text-neutral-400">Fournisseur: {c.fournisseur}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm">Paid: {c.paidToFournisseur || 0}</div>
                          <button className="px-3 py-1 rounded bg-emerald-500/20">Sync</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {tab === "commercials" && (
            <motion.div key="commercials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Commercials Management</h2>
              </div>

              <Card>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                      <th className="py-3 px-3">Name</th>
                      <th className="py-3 px-3">Email</th>
                      <th className="py-3 px-3">Phone</th>
                      <th className="py-3 px-3">Commission %</th>
                      <th className="py-3 px-3">Cars Sold</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commercials.map((cm) => (
                      <tr key={cm.id} className="border-b border-neutral-800/40 hover:bg-white/5">
                        <td className="py-3 px-3">{cm.name}</td>
                        <td className="py-3 px-3">{cm.email}</td>
                        <td className="py-3 px-3">{cm.phone}</td>
                        <td className="py-3 px-3">
                          <input className="w-20 bg-neutral-800 rounded p-1" type="number" value={cm.commissionRate} onChange={(e) => setCommissionForCommercial(cm.id, e.target.value)} />
                        </td>
                        <td className="py-3 px-3">{cm.sold}</td>
                        <td className="py-3 px-3 text-right">
                          <button onClick={() => { const newPass = Math.random().toString(36).slice(-8); setCommercials((p) => p.map(x => x.id === cm.id ? { ...x, password: newPass } : x)); pushLog('Admin', `Generated password for commercial ${cm.name}`); }} className="text-emerald-400 mr-2">Generate</button>
                          <button onClick={() => alert('Open details') } className="text-blue-400">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </motion.div>
          )}

          {tab === "requests" && (
            <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Requests from Commercials</h2>
              </div>

              <Card>
                <div className="space-y-4">
                  {requests.map((r) => (
                    <div key={r.id} className="p-4 bg-neutral-900/40 rounded-lg border border-neutral-800 flex justify-between items-start">
                      <div>
                        <div className="font-medium">{r.model}</div>
                        <div className="text-sm text-neutral-400">From commercial ID: {r.commercialId} • {r.date}</div>
                        <div className="mt-2 text-sm">{r.message}</div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button onClick={() => handleApproveRequest(r)} className="px-3 py-1 rounded bg-emerald-500/20">Approve</button>
                          <button onClick={() => handleDeclineRequest(r)} className="px-3 py-1 rounded bg-red-500/20">Decline</button>
                        </div>
                        <div className="text-sm text-neutral-400">Status: {r.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {tab === "logs" && (
            <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Historique d'Activité</h2>
                <div className="text-sm text-neutral-400">Total operations: {logs.length}</div>
              </div>

              <Card>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs.map((l) => (
                    <div key={l.id} className="flex items-start gap-4 p-3 bg-neutral-900/30 rounded">
                      <div className="text-neutral-400 text-sm w-44">{new Date(l.date).toLocaleString()}</div>
                      <div>
                        <div className="font-medium">{l.actor}</div>
                        <div className="text-sm text-neutral-400">{l.action}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add / Edit Car Modal */}
        <Modal open={showAddCar} onClose={() => setShowAddCar(false)} title={editingCar ? "Edit Car" : "Add Car"}>
          <form onSubmit={handleSubmitCar} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={carForm.model} onChange={(e) => setCarForm({ ...carForm, model: e.target.value })} placeholder="Model" className="bg-neutral-800 p-2 rounded" />
              <input value={carForm.fournisseur} onChange={(e) => setCarForm({ ...carForm, fournisseur: e.target.value })} placeholder="Fournisseur" className="bg-neutral-800 p-2 rounded" />
              <input value={carForm.buyPrice} onChange={(e) => setCarForm({ ...carForm, buyPrice: e.target.value })} placeholder="Buy Price" className="bg-neutral-800 p-2 rounded" />
              <input value={carForm.sellPrice} onChange={(e) => setCarForm({ ...carForm, sellPrice: e.target.value })} placeholder="Sell Price" className="bg-neutral-800 p-2 rounded" />
              <input value={carForm.transportFee} onChange={(e) => setCarForm({ ...carForm, transportFee: e.target.value })} placeholder="Transport Fee" className="bg-neutral-800 p-2 rounded" />
              <input value={carForm.otherFees} onChange={(e) => setCarForm({ ...carForm, otherFees: e.target.value })} placeholder="Other Fees" className="bg-neutral-800 p-2 rounded" />
              <input value={carForm.quantity} onChange={(e) => setCarForm({ ...carForm, quantity: e.target.value })} placeholder="Quantity" className="bg-neutral-800 p-2 rounded" />
              <input value={carForm.colors} onChange={(e) => setCarForm({ ...carForm, colors: e.target.value })} placeholder="Colors (comma separated)" className="bg-neutral-800 p-2 rounded" />
            </div>

            <textarea value={carForm.description} onChange={(e) => setCarForm({ ...carForm, description: e.target.value })} placeholder="Description" className="bg-neutral-800 p-2 rounded h-28" />

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-neutral-800 px-3 py-2 rounded">
                <ImageIcon /> Upload Image
                <input type="file" accept="image/*" onChange={(e) => setCarForm({ ...carForm, imageFile: e.target.files[0] })} className="hidden" />
              </label>

              <div className="flex-1 text-sm text-neutral-400">
                Total cost will be calculated automatically after save (buy + transport + other fees)
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddCar(false)} className="px-4 py-2 rounded bg-neutral-800/60">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-emerald-500/20 text-emerald-400">Save Car</button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
