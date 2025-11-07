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
  ImageIcon,
  Lock,
  DollarSign,
} from "lucide-react";

// Reusable UI
const Card = ({ children, className = "" }) => (
  <div className={`bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

const CommercialCarsModal = ({ open, onClose, commercial, cars, suppliers, currencyList }) => {
  if (!commercial) return null;

  const soldCars = cars.filter(car => car.commercial_id === commercial.id);

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? `${supplier.name} ${supplier.surname}` : 'Unknown';
  };

  const getCurrencyName = (currencyId) => {
    const currency = currencyList.find(c => c.id === currencyId);
    return currency ? currency.name : 'Unknown';
  };

  const convertToDZD = (price, currencyId) => {
    const currency = currencyList.find(c => c.id === currencyId);
    if (!currency) return price;
    return price * currency.exchange_rate_to_dzd;
  };

  return (
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
            className="relative z-10 w-[95%] md:w-[80%] lg:w-[70%] p-6 bg-neutral-900 rounded-2xl border border-neutral-800 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">
                Cars Sold by {commercial.name} {commercial.surname}
              </h3>
              <button onClick={onClose} className="p-2 rounded hover:bg-white/5">
                <X className="w-6 h-6" />
              </button>
            </div>
            {soldCars.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No cars sold yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {soldCars.map((car) => {
                 const supplierItem = supplierItems.find(item => item.car_id === car.id);
                  const supplierId = supplierItem?.supplier_id || car.supplier_id;
                  const paidAmount = supplierItem?.payment_amount || 0;
                  const currency = currencyList.find(c => c.id === car.currency_id);
                  const totalCostDZD = (car.price || 0) * (currency?.exchange_rate_to_dzd || 1);
                  const remainingAmount = totalCostDZD - paidAmount;

                  return (
                    <div key={car.id} className="bg-neutral-800/30 rounded-xl p-4 border border-neutral-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-emerald-400 mb-2">{car.model}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Color:</span>
                              <span>{car.color || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Year:</span>
                              <span>{car.year || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Price ({getCurrencyName(car.currency_id)}):</span>
                              <span>{car.price?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span className="text-emerald-400">Price (DZD):</span>
                              <span className="text-emerald-400">
                                {convertToDZD(car.price || 0, car.currency_id).toLocaleString()} DZD
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-purple-400 mb-2">Supplier Information</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Supplier:</span>
                              <span>{getSupplierName(supplierId) || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Paid Amount:</span>
                              <span>
                                {paidAmount ? `${paidAmount.toLocaleString()} DZD` : 'Not paid'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Remaining:</span>
                              <span className={remainingAmount > 0 ? 'text-red-400' : 'text-green-400'}>
                                {remainingAmount > 0 ? `${remainingAmount.toLocaleString()} DZD` : 'Fully paid'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Total Cost:</span>
                              <span>{totalCostDZD.toLocaleString()} DZD</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-neutral-700">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">ID: {car.id}</span>
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Country: {car.country || 'N/A'}</span>
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
                            Commission: {car.commercial_comission || '0'}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Stat = ({ label, value, icon: Icon }) => (
  <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-between">
    <div>
      <p className="text-neutral-400 text-sm">{label}</p>
      <div className="text-2xl font-bold">{value}</div>
    </div>
    <Icon className="w-8 h-8 text-neutral-300" />
  </div>
);

const Earnings = ({ label, monthly, yearly, icon: Icon }) => (
  <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-between">
    <div>
      <p className="text-neutral-400 text-sm">{label}</p>
      <div className="text-lg font-bold">Monthly: {monthly}</div>
      <div className="text-lg font-bold">Yearly: {yearly}</div>
    </div>
    <Icon className="w-8 h-8 text-neutral-300" />
  </div>
);

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
          className="relative z-10 w-[95%] md:w-[70%] lg:w-[50%] p-6 bg-neutral-900 rounded-2xl border border-neutral-800 max-h-[90vh] overflow-y-auto"
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
  const API_BASE = 'https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com';
  const [tab, setTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [monthlyearnings, setMonthlyEarnings] = useState(0);
  const [yearlyearnings, setYearlyEarnings] = useState(0);
  const [expenses, setExpenses] = useState({ total_amount: 0, purchases: 0, transport: 0, other: 0 });
  const [yearlyExpenses, setYearlyExpenses] = useState({ total_expenses: 0, total_purchases: 0, total_transport: 0, total_other: 0 });
  const [Caisse, setCaisse] = useState({ balance: 0 });
  const [cars, setCars] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [commercials, setCommercials] = useState([]);
  const [logs, setLogs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [currencies, setCurrencies] = useState({});
  const [currencyList, setCurrencyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supplierItems, setSupplierItems] = useState([]);
  const [showCommercialCars, setShowCommercialCars] = useState(false);
  const [selectedCommercial, setSelectedCommercial] = useState(null);

  // --- API FETCH HOOKS (same as before) ---

  // Fetch Monthly Earnings
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await fetch(`${API_BASE}/earnings/monthly`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        const total = Array.isArray(data) ? data.reduce((sum, e) => sum + (e.amount || 0), 0) : 0;
        setMonthlyEarnings(total.toFixed(2));
      } catch (err) {
        console.error("Error fetching monthly earnings:", err);
        setMonthlyEarnings(0);
      }
    };
    fetchEarnings();
  }, []);

  // Fetch Yearly Earnings
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await fetch(`${API_BASE}/earnings/yearly`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        setYearlyEarnings(data.total_amount ? data.total_amount.toFixed(2) : 0);
      } catch (err) {
        console.error("Error fetching yearly earnings:", err);
        setYearlyEarnings(0);
      }
    };
    fetchEarnings();
  }, []);

  // Fetch Monthly Expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`${API_BASE}/expenses/monthly`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        if (data) {
          setExpenses({
            total_amount: data.total_amount || 0,
            purchases: data.purchases || 0,
            transport: data.transport || 0,
            other: data.other || 0
          });
        }
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };
    fetchExpenses();
  }, []);

  // Fetch Yearly Expenses
  useEffect(() => {
    const fetchYearlyExpenses = async () => {
      try {
        const response = await fetch(`${API_BASE}/expenses/yearly`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        setYearlyExpenses({
          total_expenses: data.total_expenses || 0,
          total_purchases: data.total_purchases || 0,
          total_transport: data.total_transport || 0,
          total_other: data.total_other || 0
        });
      } catch (err) {
        console.error("Error fetching yearly expenses:", err);
      }
    };
    fetchYearlyExpenses();
  }, []);

  // Fetch Cash Register
  useEffect(() => {
    const fetchCaisse = async () => {
      try {
        const response = await fetch(`${API_BASE}/cash_register/`);
        if (!response.ok) throw new Error('Failed to fetch cash register');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const totalBalance = data.reduce((sum, reg) => sum + (reg.balance || 0), 0);
          setCaisse({ balance: totalBalance.toFixed(2) });
        } else {
          setCaisse({ balance: '0.00' });
        }
      } catch (err) {
        console.error("Error fetching cash register:", err);
        setCaisse({ balance: '0.00' });
      }
    };
    fetchCaisse();
  }, []);

  // Fetch Cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch(`${API_BASE}/cars/all`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        if (!response.ok) throw new Error('Failed to fetch cars');
        const data = await response.json();
        setCars(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setCars([]);
      }
    };
    fetchCars();
  }, []);

  // Fetch Fournisseurs
  const [showAddFournisseur, setShowAddFournisseur] = useState(false);
  const [loadingFournisseurs, setLoadingFournisseurs] = useState(false);
  const [fournisseurForm, setFournisseurForm] = useState({
    name: "", surname: "", phone_number: "", address: "",
  });

  const fetchFournisseurs = async () => {
    try {
      setLoadingFournisseurs(true);
      const res = await fetch(`${API_BASE}/suppliers/`);
      const data = await res.json();
      setFournisseurs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors du chargement des fournisseurs:", err);
    } finally {
      setLoadingFournisseurs(false);
    }
  };

  useEffect(() => { fetchFournisseurs(); }, []);

  const handleChangeFournisseur = (e) => {
    setFournisseurForm({ ...fournisseurForm, [e.target.name]: e.target.value });
  };

  const handleAddFournisseur = async (e) => {
    e.preventDefault();
    try {
      const isUpdate = !!fournisseurForm.id;
      const url = `${API_BASE}/suppliers/`;
      const requestBody = {
        name: fournisseurForm.name,
        surname: fournisseurForm.surname,
        phone_number: fournisseurForm.phone_number,
        address: fournisseurForm.address,
      };
      if (isUpdate) requestBody.supplier_id = fournisseurForm.id;
      const res = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (res.ok) {
        await fetchFournisseurs();
        setShowAddFournisseur(false);
        setFournisseurForm({ name: "", surname: "", phone_number: "", address: "" });
      } else {
        const errorText = await res.text();
        console.error("Erreur API fournisseur:", errorText);
      }
    } catch (err) {
      console.error("Erreur réseau fournisseur:", err);
    }
  };

  const handleEditFournisseur = (f) => {
    setFournisseurForm(f);
    setShowAddFournisseur(true);
  };

  const handleDeleteFournisseur = async (id) => {
    if (!window.confirm("Supprimer ce fournisseur ?")) return;
    try {
      const url = `${API_BASE}/suppliers/?supplier_id=${id}`;
      await fetch(url, { method: "DELETE" });
      await fetchFournisseurs();
    } catch (err) {
      console.error("Erreur de suppression fournisseur:", err);
    }
  };

  // Fetch Supplier Items
  useEffect(() => {
    const fetchSupplierItems = async () => {
      try {
        const response = await fetch(`${API_BASE}/suppliers_items/`);
        if (!response.ok) throw new Error('Failed to fetch supplier items');
        const data = await response.json();
        setSupplierItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching supplier items:", err);
        setSupplierItems([]);
      }
    };
    fetchSupplierItems();
  }, []);

  // Fetch Commercials
  useEffect(() => {
    const fetchCommercials = async () => {
      try {
        const response = await fetch(`${API_BASE}/commercials/`);
        if (!response.ok) throw new Error('Failed to fetch commercials');
        const data = await response.json();
        setCommercials(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching commercials:", err);
        setCommercials([]);
      }
    };
    fetchCommercials();
  }, []);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE}/orders/`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

  // Fetch Clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_BASE}/clients/`);
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setClients([]);
      }
    };
    fetchClients();
  }, []);

  // Fetch Currencies
 // Replace your current currency useEffect with this:
useEffect(() => {
  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`${API_BASE}/currencies/`);
      if (!response.ok) throw new Error('Failed to fetch currencies');
      const data = await response.json();
      setCurrencyList(Array.isArray(data) ? data : []);
      const currencyMap = {};
      if (Array.isArray(data)) {
        data.forEach(curr => {
          currencyMap[curr.code] = curr.exchange_rate_to_dzd;
        });
      }
      setCurrencies(currencyMap);

      // 👇 Initialize default currencies if none exist
      const defaultCurrencies = [
        { code: "DZD", name: "Algerian Dinar", rate: 1 },
        { code: "EUR", name: "Euro", rate: 145 },
        { code: "USD", name: "US Dollar", rate: 135 },
        { code: "CAD", name: "Canadian Dollar", rate: 98 },
        { code: "AED", name: "UAE Dirham", rate: 36.8 },
      ];

      const missing = defaultCurrencies.filter(dc => !data.some(c => c.code === dc.code));
      for (const curr of missing) {
        try {
          await fetch(`${API_BASE}/currencies/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: curr.code.toLowerCase(),
              name: curr.name,
              exchange_rate_to_dzd: curr.rate
            })
          });
        } catch (err) {
          console.warn(`Failed to create currency ${curr.code}:`, err);
        }
      }

      // Re-fetch to include defaults
      const finalResponse = await fetch(`${API_BASE}/currencies/`);
      const finalData = await finalResponse.json();
      setCurrencyList(Array.isArray(finalData) ? finalData : []);
    } catch (err) {
      console.error("Error fetching/initializing currencies:", err);
      setCurrencyList([]);
    } finally {
      setLoading(false);
    }
  };
  fetchCurrencies();
}, []);

  // Update currency
 const handleCurrencyChange = async (code, value) => {
  const numericValue = parseFloat(value);
  if (isNaN(numericValue)) return;

  // Optimistically update UI
  setCurrencies(prev => ({ ...prev, [code]: numericValue }));

  try {
    // Find existing currency by code (case-insensitive)
    const existing = currencyList.find(c => c.code.toLowerCase() === code.toLowerCase());
    
    if (existing) {
      // Update existing
      const response = await fetch(`${API_BASE}/currencies/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: existing.id,
          exchange_rate_to_dzd: numericValue
        })
      });
      if (!response.ok) throw new Error('Update failed');
    } else {
      // Create new currency
      const response = await fetch(`${API_BASE}/currencies/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toLowerCase(),
          name: {
            dzd: 'Algerian Dinar',
            eur: 'Euro',
            usd: 'US Dollar',
            cad: 'Canadian Dollar',
            aed: 'UAE Dirham'
          }[code] || code.toUpperCase(),
          exchange_rate_to_dzd: numericValue
        })
      });
      if (!response.ok) throw new Error('Creation failed');
      // Re-fetch to update currencyList & currencies
      const fresh = await fetch(`${API_BASE}/currencies/`).then(r => r.json());
      setCurrencyList(Array.isArray(fresh) ? fresh : []);
      const map = {};
      fresh.forEach(c => { map[c.code] = c.exchange_rate_to_dzd; });
      setCurrencies(map);
    }

    pushLog("Admin", `Updated ${code.toUpperCase()} exchange rate to ${numericValue} DZD`);
  } catch (err) {
    console.error("Error updating currency:", err);
    alert(`Failed to save ${code.toUpperCase()} rate`);
    // Revert optimistic update
    setCurrencies(prev => {
      const copy = { ...prev };
      delete copy[code];
      return copy;
    });
  };
  };

  // --- Car CRUD (unchanged, omitted for brevity but kept in full code) ---

  const [showAddCar, setShowAddCar] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const initialCarForm = {
    model: "", color: "", year: "", engine: "", power: "", fuelType: "", milage: "",
    country: "", commercial_comission: "", price: "", shippingDate: "", arrivingDate: "",
    currency_id: "", commercial_id: "", imageFiles: [],
  };
  const [carForm, setCarForm] = useState(initialCarForm);

  const pushLog = (actor, action) => {
    setLogs((p) => [{ id: Date.now(), actor, action, date: new Date().toISOString() }, ...p]);
  };

  const handleOpenAdd = (agent = "Admin") => {
    setCarForm(initialCarForm);
    setEditingCar(null);
    setShowAddCar(true);
    pushLog(agent, "Opened Add Car modal");
  };

  const handleOpenAddCommercial = (agent = "Admin") => {
    setCommercialForm({
      name: "", surname: "", phone_number: "", password: "", wilaya: "", address: ""
    });
    setShowAddCommercial(true);
    pushLog(agent, "Opened Add Commercial modal");
  };

  const handleSubmitCar = async (e) => {
    e.preventDefault();
    if (!carForm.model || !carForm.commercial_id || !carForm.currency_id) {
      alert("Model, Commercial, and Currency are required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('model', carForm.model);
      formData.append('color', carForm.color);
      formData.append('year', parseInt(carForm.year) || new Date().getFullYear());
      formData.append('engine', carForm.engine);
      formData.append('power', carForm.power);
      formData.append('fuel_type', carForm.fuelType);
      formData.append('milage', parseFloat(carForm.milage) || 0);
      formData.append('country', carForm.country);
      formData.append('commercial_comission', parseFloat(carForm.commercial_comission) || 0);
      formData.append('price', parseFloat(carForm.price) || 0);
      formData.append('shipping_date', carForm.shippingDate || new Date().toISOString().split('T')[0]);
      formData.append('arriving_date', carForm.arrivingDate || new Date().toISOString().split('T')[0]);
      formData.append('currency_id', parseInt(carForm.currency_id));
      formData.append('commercial_id', parseInt(carForm.commercial_id));
      if (carForm.imageFiles && carForm.imageFiles.length > 0) {
        Array.from(carForm.imageFiles).forEach(file => {
          formData.append('images', file);
        });
      }
      const url = `${API_BASE}/cars/`;
      const method = editingCar ? 'PUT' : 'POST';
      if (editingCar) {
        formData.append('car_id', editingCar.id);
      }
      const response = await fetch(url, { method, body: formData });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      pushLog("Admin", `${editingCar ? 'Updated' : 'Added'} car ${carForm.model}`);
      setShowAddCar(false);
      setCarForm(initialCarForm);
      const carsResponse = await fetch(`${API_BASE}/cars/all`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({})
      });
      const carsData = await carsResponse.json();
      setCars(Array.isArray(carsData) ? carsData : []);
    } catch (err) {
      console.error("Error saving car:", err);
      alert("Error saving car: " + err.message);
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setCarForm({
      model: car.model || "",
      color: car.color || "",
      year: car.year || "",
      engine: car.engine || "",
      power: car.power || "",
      fuelType: car.fuel_type || "",
      milage: car.milage || "",
      country: car.country || "",
      commercial_comission: car.commercial_comission || "",
      price: car.price || "",
      shippingDate: car.shipping_date || "",
      arrivingDate: car.arriving_date || "",
      currency_id: car.currency_id || "",
      commercial_id: car.commercial_id || "",
      imageFiles: [],
    });
    setShowAddCar(true);
    pushLog("Admin", `Opened Edit modal for ${car.model} (${car.id})`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette voiture ?")) return;
    try {
      const response = await fetch(`${API_BASE}/cars/?car_id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete car');
      setCars((p) => p.filter((c) => c.id !== id));
      pushLog("Admin", `Deleted car ${id}`);
    } catch (err) {
      console.error("Error deleting car:", err);
      alert("Error deleting car: " + err.message);
    }
  };

  const [CommercialForm, setCommercialForm] = useState({
    name: "", surname: "", phone_number: "", password: "", wilaya: "", address: ""
  });
  const [showAddCommercial, setShowAddCommercial] = useState(false);
  const [message, setMessage] = useState("");
  const [commercialLoading, setCommercialLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommercialForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommercialLoading(true);
    setMessage("");
    try {
      const isUpdate = !!CommercialForm.commercial_id;
      const url = `${API_BASE}/commercials/`;
      const requestBody = {
        name: CommercialForm.name,
        surname: CommercialForm.surname,
        phone_number: CommercialForm.phone_number,
        wilaya: CommercialForm.wilaya,
        address: CommercialForm.address,
      };
      if (!isUpdate) requestBody.password = CommercialForm.password;
      if (isUpdate) requestBody.commercial_id = CommercialForm.commercial_id;
      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        setMessage("Commercial saved successfully ✅");
        setCommercialForm({ name: "", surname: "", phone_number: "", password: "", wilaya: "", address: "" });
        setShowAddCommercial(false);
        const freshCommercials = await fetch(`${API_BASE}/commercials/`).then(r => r.json());
        setCommercials(Array.isArray(freshCommercials) ? freshCommercials : []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setMessage(`❌ Error: ${errorData.detail || "Failed to save commercial"}`);
      }
    } catch (error) {
      setMessage("⚠️ Network error: " + error.message);
    } finally {
      setCommercialLoading(false);
    }
  };

  const updateSupplierItemPayment = async (itemId, amount) => {
    try {
      const response = await fetch(`${API_BASE}/suppliers_items/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplier_item_id: itemId, payment_amount: parseFloat(amount) || 0 })
      });
      if (response.ok) {
        pushLog("Admin", `Updated payment for supplier item ${itemId}`);
        const itemsResponse = await fetch(`${API_BASE}/suppliers_items/`);
        const itemsData = await itemsResponse.json();
        setSupplierItems(Array.isArray(itemsData) ? itemsData : []);
      }
    } catch (err) {
      console.error("Error updating supplier item:", err);
    }
  };

  // Prepare enriched cars with supplier finance data for modal
  const getEnrichedCars = () => {
    return cars.map(car => {
      const item = supplierItems.find(si => si.car_id === car.id);
      const currency = currencyList.find(c => c.id === car.currency_id);
      const totalCostDZD = (car.price || 0) * (currency?.exchange_rate_to_dzd || 1);
      const paidAmount = item?.payment_amount || 0;
      const remainingAmount = totalCostDZD - paidAmount;

      return {
        ...car,
        paidAmount,
        remainingAmount,
        totalCostDZD,
        supplierId: item?.supplier_id || null
      };
    });
  };

  const filteredCars = cars.filter((c) =>
    (c.model && c.model.toLowerCase().includes(search.toLowerCase())) ||
    (c.id && c.id.toString().includes(search.toLowerCase())) ||
    (c.country && c.country.toLowerCase().includes(search.toLowerCase()))
  );

  const totalStockValue = cars.reduce((total, car) => {
    const currency = currencyList.find(c => c.id === car.currency_id);
    const exchangeRate = currency?.exchange_rate_to_dzd || 1;
    return total + ((car.price || 0) * exchangeRate);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen font-main bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-main bg-gradient-to-br from-neutral-950 via-black to-neutral-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-20 md:w-28 flex flex-col items-center py-6 space-y-6 border-r border-neutral-800 bg-neutral-950/70 backdrop-blur-md fixed left-0 top-0 h-full">
        {[
          { id: "overview", icon: BarChart3, label: "Overview" },
          { id: "cars", icon: Car, label: "Cars" },
          { id: "fournisseurs", icon: CreditCard, label: "Fournisseurs" },
          { id: "commercials", icon: Users, label: "Commercials" },
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
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.09 }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="red"
          className="size-[3vh] flex mt-auto cursor-pointer"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </motion.svg>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 md:ml-28 p-8 space-y-8">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-semibold">Dashboard</h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Stat label="Caisse" value={`${Caisse.balance} DZD`} icon={CreditCard} />
                <Earnings label="Chiffre d'affaire" monthly={`${monthlyearnings} DZD`} yearly={`${yearlyearnings} DZD`} icon={TrendingUp} />
                <Stat label="Monthly Expenses" value={`${expenses.total_amount} DZD`} icon={TrendingDown} />
                <Stat label="Yearly Expenses" value={`${yearlyExpenses.total_expenses.toFixed(2)} DZD`} icon={TrendingDown} />
                <Stat label="Total Stock Value" value={`${totalStockValue.toFixed(2)} DZD`} icon={Car} />
                <Stat label="Total Cars" value={cars.length} icon={Car} />
                <Stat label="Total Clients" value={clients.length} icon={Users} />
                <Stat label="Total Orders" value={orders.length} icon={FilePlus} />
                <Stat label="Total Suppliers" value={fournisseurs.length} icon={Users} />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Recent Cars</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {cars.slice(0, 6).map((c) => (
                      <div key={c.id} className="flex items-center gap-4 p-3 bg-neutral-900/40 rounded-lg border border-neutral-800">
                        <div className="w-20 h-12 bg-neutral-800 rounded overflow-hidden flex items-center justify-center">
                          <Car className="w-8 h-8 text-neutral-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{c.model}</div>
                              <div className="text-sm text-neutral-400">{c.color} - {c.year}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-neutral-400">{c.country}</div>
                              <div className="text-sm text-emerald-400">{c.price?.toLocaleString()} DZD</div>
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
                    <button onClick={() => handleOpenAdd("Admin")} className="w-full p-3 rounded-lg text-left bg-emerald-500/10 hover:bg-emerald-500/20 transition">Add Car</button>
                    <button onClick={() => setTab("commercials")} className="w-full p-3 rounded-lg text-left bg-blue-500/10 hover:bg-blue-500/20 transition">Manage Commercials</button>
                    <button onClick={() => setTab("fournisseurs")} className="w-full p-3 rounded-lg text-left bg-purple-500/10 hover:bg-purple-500/20 transition">Manage Suppliers</button>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {tab === "currency" && (
  <motion.div key="currency" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <h2 className="text-2xl font-semibold mb-6">Taux de Change (DZD)</h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {[
        { code: 'dzd', name: 'Algerian Dinar', symbol: 'DZD' },
        { code: 'eur', name: 'Euro', symbol: 'EUR' },
        { code: 'usd', name: 'US Dollar', symbol: 'USD' },
        { code: 'cad', name: 'Canadian Dollar', symbol: 'CAD' },
        { code: 'aed', name: 'UAE Dirham', symbol: 'AED' },
      ].map((curr) => {
        const existing = currencyList.find(c => c.code.toLowerCase() === curr.code);
        const currentRate = currencies[curr.code] !== undefined 
          ? currencies[curr.code] 
          : (curr.code === 'dzd' ? 1 : 0);

        return (
          <div key={curr.code} className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 flex flex-col gap-3">
            <h3 className="text-lg font-semibold">{curr.name} ({curr.symbol})</h3>
            <input
              type="number"
              step="0.01"
              min="0"
              value={currentRate}
              onChange={(e) => handleCurrencyChange(curr.code, e.target.value)}
              className="bg-neutral-800 p-2 rounded-lg outline-none text-center text-white"
            />
            <span className="text-neutral-400 text-sm">
              1 {curr.symbol} = {currentRate} DZD
            </span>
            {existing && (
              <span className="text-neutral-500 text-xs">
                Last updated: {new Date(existing.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        );
      })}
    </div>
  </motion.div>
)}

          {/* Cars Tab */}
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
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Model</th>
                        <th className="py-3 px-3">Color</th>
                        <th className="py-3 px-3">Year</th>
                        <th className="py-3 px-3">Price</th>
                        <th className="py-3 px-3">Country</th>
                        <th className="py-3 px-3">Commercial</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCars.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="py-4 text-center text-neutral-500">No cars found</td>
                        </tr>
                      ) : (
                        filteredCars.map((car) => {
                          const commercial = commercials.find(c => c.id === car.commercial_id);
                          return (
                            <tr key={car.id} className="border-b border-neutral-800/40 hover:bg-white/5">
                              <td className="py-3 px-3 font-mono text-emerald-400">{car.id}</td>
                              <td className="py-3 px-3">{car.model}</td>
                              <td className="py-3 px-3">{car.color || '—'}</td>
                              <td className="py-3 px-3">{car.year || '—'}</td>
                              <td className="py-3 px-3">
                                {(car.price || 0).toLocaleString()} {currencyList.find(c => c.id === car.currency_id)?.code.toUpperCase() || 'DZD'}
                              </td>
                              <td className="py-3 px-3">{car.country || '—'}</td>
                              <td className="py-3 px-3">
                                {commercial ? `${commercial.name} ${commercial.surname}` : '—'}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <button onClick={() => handleEdit(car)} className="text-blue-400 mr-2">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(car.id)} className="text-red-400">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Fournisseurs Tab */}
          {tab === "fournisseurs" && (
            <motion.div key="fournisseurs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Fournisseurs & Finance</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Suppliers</h3>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-semibold">Fournisseurs</h2>
                      <button
                        onClick={() => setShowAddFournisseur(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                      >
                        Ajouter Fournisseur
                      </button>
                    </div>
                    {loadingFournisseurs ? (
                      <p className="text-gray-400">Chargement des fournisseurs...</p>
                    ) : fournisseurs.length === 0 ? (
                      <p className="text-gray-400">Aucun fournisseur trouvé.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fournisseurs.map((f) => (
                          <div
                            key={f.id}
                            className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 hover:border-purple-500 transition"
                          >
                            <h3 className="text-lg font-semibold text-purple-400">
                              {f.name || "Nom inconnu"}
                            </h3>
                            <p className="text-sm text-gray-400">Surname : {f.surname || "—"}</p>
                            <p className="text-sm text-gray-400">Téléphone : {f.phone_number || "—"}</p>
                            <p className="text-sm text-gray-400">Adresse : {f.address || "—"}</p>
                            <div className="flex justify-end mt-3 space-x-2">
                              <button
                                onClick={() => handleEditFournisseur(f)}
                                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteFournisseur(f.id)}
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Updated Supplier Finance Details */}
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Supplier Finance Details</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {fournisseurs.map((supplier) => {
                      const itemsForSupplier = supplierItems.filter(item => item.supplier_id === supplier.id);
                      if (itemsForSupplier.length === 0) return null;

                      return (
                        <div key={supplier.id} className="border border-neutral-800 rounded-lg p-3 bg-neutral-900/30">
                          <h4 className="font-medium text-purple-400 mb-2">
                            {supplier.name} {supplier.surname}
                          </h4>
                          <div className="space-y-2">
                            {itemsForSupplier.map((item) => {
                              const car = cars.find(c => c.id === item.car_id) || {};
                              const currency = currencyList.find(c => c.id === item.currency_id);
                              const totalCostDZD = (item.price || 0) * (currency?.exchange_rate_to_dzd || 1);
                              const paidDZD = item.payment_amount || 0;
                              const remainingDZD = totalCostDZD - paidDZD;

                              return (
                                <div key={item.supplier_item_id} className="bg-neutral-800/40 p-3 rounded">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-neutral-300 font-medium">{car.model || 'Unknown Car'}</span>
                                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Car ID: {car.id}</span>
                                  </div>
                                  <div className="text-sm mt-1">
                                    <div className="flex justify-between">
                                      <span className="text-neutral-400">Total Cost:</span>
                                      <span>{totalCostDZD.toLocaleString()} DZD</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-neutral-400">Paid:</span>
                                      <span className="text-emerald-400">{paidDZD.toLocaleString()} DZD</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-neutral-400">Remaining:</span>
                                      <span className={remainingDZD > 0 ? 'text-red-400' : 'text-green-400'}>
                                        {remainingDZD.toLocaleString()} DZD
                                      </span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                      <span className="text-neutral-400">Original Price:</span>
                                      <span>{(item.price || 0).toLocaleString()} {currency?.code.toUpperCase()}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="md:col-span-2">
  <h3 className="text-lg font-semibold mb-4">Monthly Expenses (Editable)</h3>
  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
    <div className="p-4 bg-neutral-900/40 rounded-lg">
      <div className="text-sm text-neutral-400">Purchases</div>
      <input
        type="number"
        step="0.01"
        value={expenses.purchases}
        onChange={(e) => setExpenses(prev => ({ ...prev, purchases: parseFloat(e.target.value) || 0 }))}
        className="w-full bg-transparent border-b border-neutral-600 focus:outline-none text-xl font-bold text-emerald-400"
      />
    </div>
    <div className="p-4 bg-neutral-900/40 rounded-lg">
      <div className="text-sm text-neutral-400">Transport</div>
      <input
        type="number"
        step="0.01"
        value={expenses.transport}
        onChange={(e) => setExpenses(prev => ({ ...prev, transport: parseFloat(e.target.value) || 0 }))}
        className="w-full bg-transparent border-b border-neutral-600 focus:outline-none text-xl font-bold text-blue-400"
      />
    </div>
    <div className="p-4 bg-neutral-900/40 rounded-lg">
      <div className="text-sm text-neutral-400">Other</div>
      <input
        type="number"
        step="0.01"
        value={expenses.other}
        onChange={(e) => setExpenses(prev => ({ ...prev, other: parseFloat(e.target.value) || 0 }))}
        className="w-full bg-transparent border-b border-neutral-600 focus:outline-none text-xl font-bold text-purple-400"
      />
    </div>
    <div className="p-4 bg-neutral-900/40 rounded-lg">
      <div className="text-sm text-neutral-400">Total</div>
      <div className="text-xl font-bold text-red-400">
        {(expenses.purchases + expenses.transport + expenses.other).toLocaleString()} DZD
      </div>
    </div>
    <div className="p-4 bg-neutral-900/40 rounded-lg flex flex-col justify-end">
      <button
        onClick={async () => {
          const now = new Date();
          try {
            const res = await fetch(`${API_BASE}/expenses/`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                year: now.getFullYear(),
                month: now.getMonth() + 1, // API expects 1-based
                purchases: expenses.purchases,
                transport: expenses.transport,
                other: expenses.other
              })
            });
            if (res.ok) {
              alert('Monthly expenses updated successfully!');
              // Optionally refresh
            } else {
              alert('Failed to update expenses');
            }
          } catch (err) {
            console.error('Update error:', err);
            alert('Network error');
          }
        }}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded text-white"
      >
        Save Monthly
      </button>
    </div>
  </div>

  {/* Optional: Yearly Edit (less common, but possible) */}
  <div className="mt-6 pt-4 border-t border-neutral-800">
    <h4 className="text-md font-medium mb-3">Yearly Summary (Read-only)</h4>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-3 bg-neutral-900/30 rounded">
        <div className="text-sm text-neutral-400">Purchases</div>
        <div className="text-lg font-bold text-emerald-400">{yearlyExpenses.total_purchases.toLocaleString()} DZD</div>
      </div>
      <div className="p-3 bg-neutral-900/30 rounded">
        <div className="text-sm text-neutral-400">Transport</div>
        <div className="text-lg font-bold text-blue-400">{yearlyExpenses.total_transport.toLocaleString()} DZD</div>
      </div>
      <div className="p-3 bg-neutral-900/30 rounded">
        <div className="text-sm text-neutral-400">Other</div>
        <div className="text-lg font-bold text-purple-400">{yearlyExpenses.total_other.toLocaleString()} DZD</div>
      </div>
      <div className="p-3 bg-neutral-900/30 rounded">
        <div className="text-sm text-neutral-400">Total</div>
        <div className="text-lg font-bold text-red-400">{yearlyExpenses.total_expenses.toLocaleString()} DZD</div>
      </div>
    </div>
  </div>

                </Card>
              </div>
            </motion.div>
          )}

          {/* Commercials Tab */}
          {tab === "commercials" && (
            <motion.div key="commercials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Commercials Management</h2>
                <button onClick={() => handleOpenAddCommercial("Admin")} className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  Ajouter un Commercial +
                </button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Name</th>
                        <th className="py-3 px-3">Phone</th>
                        <th className="py-3 px-3">Wilaya</th>
                        <th className="py-3 px-3">Address</th>
                        <th className="py-3 px-3">Cars Sold</th>
                        <th className="py-3 px-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commercials.map((cm) => {
                        const soldCars = cars.filter(car => car.commercial_id === cm.id).length;
                        return (
                          <tr
                            key={cm.id}
                            className="border-b border-neutral-800/40 hover:bg-emerald-500/5 cursor-pointer"
                            onClick={() => {
                              setSelectedCommercial(cm);
                              setShowCommercialCars(true);
                            }}
                          >
                            <td className="py-3 px-3 font-mono text-emerald-400">{cm.id}</td>
                            <td className="py-3 px-3">{cm.name} {cm.surname}</td>
                            <td className="py-3 px-3">{cm.phone_number}</td>
                            <td className="py-3 px-3">{cm.wilaya}</td>
                            <td className="py-3 px-3 text-sm text-neutral-400">{cm.address}</td>
                            <td className="py-3 px-3">{soldCars}</td>
                            <td className="py-3 px-3 text-sm text-neutral-400">
                              {new Date(cm.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Logs Tab */}
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

        {/* Modals */}
        <Modal open={showAddCar} onClose={() => setShowAddCar(false)} title={editingCar ? "Edit Car" : "Add Car"}>
          <form onSubmit={handleSubmitCar} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={carForm.model} onChange={(e) => setCarForm({ ...carForm, model: e.target.value })} placeholder="Model" className="bg-neutral-800 p-2 rounded" required />
              <input value={carForm.color} onChange={(e) => setCarForm({ ...carForm, color: e.target.value })} placeholder="Color" className="bg-neutral-800 p-2 rounded" />
              <input type="number" value={carForm.year} onChange={(e) => setCarForm({ ...carForm, year: e.target.value })} placeholder="Year" className="bg-neutral-800 p-2 rounded" />
              <input value={carForm.engine} onChange={(e) => setCarForm({ ...carForm, engine: e.target.value })} placeholder="Engine" className="bg-neutral-800 p-2 rounded" />
              <input value={carForm.power} onChange={(e) => setCarForm({ ...carForm, power: e.target.value })} placeholder="Power" className="bg-neutral-800 p-2 rounded" />
              <input value={carForm.fuelType} onChange={(e) => setCarForm({ ...carForm, fuelType: e.target.value })} placeholder="Fuel Type" className="bg-neutral-800 p-2 rounded" />
              <input type="number" step="0.01" value={carForm.milage} onChange={(e) => setCarForm({ ...carForm, milage: e.target.value })} placeholder="Mileage" className="bg-neutral-800 p-2 rounded" />
              <input type="text" value={carForm.price} onChange={(e) => setCarForm({ ...carForm, price: e.target.value })} placeholder="Price" className="bg-neutral-800 p-2 rounded" />
              <input type="text" value={carForm.commercial_comission} onChange={(e) => setCarForm({ ...carForm, commercial_comission: e.target.value })} placeholder="Commercial Commission %" className="bg-neutral-800 p-2 rounded" />
              <select value={carForm.currency_id} onChange={(e) => setCarForm({ ...carForm, currency_id: e.target.value })} className="bg-neutral-800 p-2 rounded" required>
                <option value="">Select Currency</option>
                {currencyList.map(curr => (
                  <option key={curr.id} value={curr.id}>{curr.name} ({curr.code.toUpperCase()})</option>
                ))}
              </select>
              <select value={carForm.commercial_id} onChange={(e) => setCarForm({ ...carForm, commercial_id: e.target.value })} className="bg-neutral-800 p-2 rounded" required>
                <option value="">Select Commercial</option>
                {commercials.map(cm => (
                  <option key={cm.id} value={cm.id}>{cm.name} {cm.surname}</option>
                ))}
              </select>
              <label className="flex flex-col gap-[.3vh]">Date d'achat
                <input type="date" value={carForm.shippingDate} onChange={(e) => setCarForm({ ...carForm, shippingDate: e.target.value })} className="bg-neutral-800 p-2 rounded" />
              </label>
              <label className="flex flex-col gap-[.3vh]">Date d'arrivée
                <input type="date" value={carForm.arrivingDate} onChange={(e) => setCarForm({ ...carForm, arrivingDate: e.target.value })} className="bg-neutral-800 p-2 rounded" />
              </label>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-neutral-800 px-3 py-2 rounded">
                <input type="file" accept="image/*" multiple onChange={(e) => setCarForm({ ...carForm, imageFiles: e.target.files })} className="hidden" />
                Upload Images
              </label>
              {carForm.imageFiles && carForm.imageFiles.length > 0 && (
                <span className="text-sm text-neutral-400">{carForm.imageFiles.length} file(s) selected</span>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddCar(false)} className="px-4 py-2 rounded bg-neutral-800/60">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-emerald-500/20 text-emerald-400">
                {editingCar ? 'Update Car' : 'Save Car'}
              </button>
            </div>
          </form>
        </Modal>

        <Modal open={showAddCommercial} onClose={() => setShowAddCommercial(false)} title="Add Commercial">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" name="name" placeholder="Name" value={CommercialForm.name} onChange={handleChange} className="bg-neutral-800 p-2 rounded" required />
              <input type="text" name="surname" placeholder="Surname" value={CommercialForm.surname} onChange={handleChange} className="bg-neutral-800 p-2 rounded" required />
              <input type="text" name="phone_number" placeholder="Phone Number" value={CommercialForm.phone_number} onChange={handleChange} className="bg-neutral-800 p-2 rounded" required />
              {!CommercialForm.commercial_id && (
                <input type="password" name="password" placeholder="Password" value={CommercialForm.password} onChange={handleChange} className="bg-neutral-800 p-2 rounded" required />
              )}
              <input type="text" name="wilaya" placeholder="Wilaya" value={CommercialForm.wilaya} onChange={handleChange} className="bg-neutral-800 p-2 rounded" required />
              <input type="text" name="address" placeholder="Address" value={CommercialForm.address} onChange={handleChange} className="bg-neutral-800 p-2 rounded" required />
            </div>
            {message && <p className={`text-sm ${message.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddCommercial(false)} className="px-4 py-2 rounded bg-neutral-800/60">Cancel</button>
              <button type="submit" disabled={commercialLoading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
                {commercialLoading ? 'Saving...' : CommercialForm.commercial_id ? 'Update Commercial' : 'Add Commercial'}
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          open={showAddFournisseur}
          onClose={() => setShowAddFournisseur(false)}
          title={fournisseurForm.id ? "Modifier Fournisseur" : "Ajouter Fournisseur"}
        >
          <form onSubmit={handleAddFournisseur} className="space-y-4">
            <input type="text" name="name" placeholder="Nom du fournisseur" value={fournisseurForm.name} onChange={handleChangeFournisseur} className="bg-neutral-800 p-2 w-full rounded" required />
            <input type="text" name="surname" placeholder="Surname" value={fournisseurForm.surname} onChange={handleChangeFournisseur} className="bg-neutral-800 p-2 w-full rounded" />
            <input type="text" name="phone_number" placeholder="Téléphone" value={fournisseurForm.phone_number} onChange={handleChangeFournisseur} className="bg-neutral-800 p-2 w-full rounded" />
            <input type="text" name="address" placeholder="Adresse" value={fournisseurForm.address} onChange={handleChangeFournisseur} className="bg-neutral-800 p-2 w-full rounded" />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddFournisseur(false)} className="px-4 py-2 rounded bg-neutral-800/60">Cancel</button>
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg">
                {fournisseurForm.id ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </form>
        </Modal>

        {/* Commercial Cars Modal with enriched data */}
        <CommercialCarsModal
          open={showCommercialCars}
          onClose={() => setShowCommercialCars(false)}
          commercial={selectedCommercial}
          cars={getEnrichedCars()}
          suppliers={fournisseurs}
          currencyList={currencyList}
        />
      </main>
    </div>
  );
}