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
  DollarSign,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Reusable UI
const Card = ({ children, className = "" }) => (
  <div className={`bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

// ✅ FIXED: Added supplierItems to props
const CommercialCarsModal = ({ 
  open, 
  onClose, 
  commercial, 
  cars, 
  suppliers, 
  currencyList,
  supplierItems  // ✅ Now passed in
}) => {
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
                  // ✅ FIXED: supplierItems is now available (passed as prop)
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

// ✅ Centralized Auth-Aware Fetch
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  // Handle 401 globally
  if (response.status === 401) {
    localStorage.removeItem("authToken");
    window.location.href = "/admin-login";
    throw new Error("Unauthorized");
  }

  return response;
};

export default function AdminSuperPanel() {
  const API_BASE = 'https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com';
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();
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
  const [editingPayment, setEditingPayment] = useState({});
  const [tempPassword, setTempPassword] = useState("");
  const [newCommercialPhone, setNewCommercialPhone] = useState("");

  // --- Auth-aware fetchers ---
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/earnings/monthly`);
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

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/earnings/yearly`);
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

  useEffect(() => {
    const fetchExpenses = async () => {
  try {
    const response = await apiFetch(`${API_BASE}/expenses/monthly`);
    const data = await response.json();

    // ✅ Safe fallback
    const safeData = data || {};
    setExpenses({
      total_amount: safeData.total_amount || 0,
      purchases: safeData.purchases || 0,
      transport: safeData.transport || 0,
      other: safeData.other || 0
    });
  } catch (err) {
    // fallback
    setExpenses({ total_amount: 0, purchases: 0, transport: 0, other: 0 });
  }
};
    fetchExpenses();
  }, []);

  useEffect(() => {
    const fetchYearlyExpenses = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/expenses/yearly`);
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

  useEffect(() => {
    const fetchCaisse = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/cash_register/`);
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

  const [showAddFournisseur, setShowAddFournisseur] = useState(false);
  const [loadingFournisseurs, setLoadingFournisseurs] = useState(false);
  const [fournisseurForm, setFournisseurForm] = useState({
    name: "", surname: "", phone_number: "", address: "",
  });

  const fetchFournisseurs = async () => {
    try {
      setLoadingFournisseurs(true);
      const res = await apiFetch(`${API_BASE}/suppliers/`);
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

      const res = await apiFetch(url, {
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
      await apiFetch(url, { method: "DELETE" });
      await fetchFournisseurs();
    } catch (err) {
      console.error("Erreur de suppression fournisseur:", err);
    }
  };

  useEffect(() => {
    const fetchSupplierItems = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/suppliers_items/`);
        if (!response.ok) throw new Error('Failed to fetch supplier items');
        const data = await response.json();
        console.log(data);
        setSupplierItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching supplier items:", err);
        setSupplierItems([]);
      }
    };
    fetchSupplierItems();
  }, []);

  useEffect(() => {
    const fetchCommercials = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/commercials/`);
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/orders/`);
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

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/clients/`);
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

  useEffect(() => {
  let isMounted = true;

  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`${API_BASE}/currencies/`);
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      if (!isMounted) return;

      setCurrencyList(Array.isArray(data) ? data : []);
      const currencyMap = {};
      data.forEach(curr => {
        currencyMap[curr.code] = curr.exchange_rate_to_dzd;
      });
      setCurrencies(currencyMap);

      // ✅ Only initialize missing currencies IF list is empty
      if (data.length === 0) {
        const defaultCurrencies = [
          { code: "dzd", name: "Algerian Dinar", rate: 1 },
          { code: "eur", name: "Euro", rate: 145 },
          { code: "usd", name: "US Dollar", rate: 135 },
          { code: "cad", name: "Canadian Dollar", rate: 98 },
          { code: "aed", name: "UAE Dirham", rate: 36.8 },
        ];

        // ✅ Sequential creation with 500ms delay
        for (let i = 0; i < defaultCurrencies.length; i++) {
          if (!isMounted) break;
          const curr = defaultCurrencies[i];
          await fetch(`${API_BASE}/currencies/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: curr.code,
              name: curr.name,
              exchange_rate_to_dzd: curr.rate
            })
          });
          // ⏳ Small delay to avoid 429
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Final re-fetch
        const finalRes = await fetch(`${API_BASE}/currencies/`);
        const finalData = await finalRes.json();
        if (isMounted) {
          setCurrencyList(Array.isArray(finalData) ? finalData : []);
        }
      }
    } catch (err) {
      console.error("Currency init error:", err);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchCurrencies();

  return () => { isMounted = false; }; // Cleanup
}, []); // ✅ Empty deps — runs once

  const handleCurrencyChange = async (code, value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;
    setCurrencies(prev => ({ ...prev, [code]: numericValue }));
    try {
      const existing = currencyList.find(c => c.code.toLowerCase() === code.toLowerCase());
      if (existing) {
        const response = await apiFetch(`${API_BASE}/currencies/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: existing.id,
            exchange_rate_to_dzd: numericValue
          })
        });
        if (!response.ok) throw new Error('Update failed');
      } else {
        const response = await apiFetch(`${API_BASE}/currencies/`, {
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
      setCurrencies(prev => {
        const copy = { ...prev };
        delete copy[code];
        return copy;
      });
    }
  };

  const [showAddCar, setShowAddCar] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const initialCarForm = {
    model: "", color: "", year: "", engine: "", power: "", fuelType: "", milage: "",
    country: "", commercial_comission: "", price: "", shippingDate: "", arrivingDate: "",
    currency_id: "", quantity:"", imageFiles: [],
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
    // commercial_id was removed from backend in some deployments.
    // Only require model and currency now.
    if (!carForm.model || !carForm.currency_id || !carForm.quantity) {
      alert("Model, Currency, and Quantity are required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('model', carForm.model);
      formData.append('color', carForm.color);
      formData.append('year', parseInt(carForm.year) || new Date().getFullYear());
    formData.append('quantity', parseInt(carForm.quantity) || 1);
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
      // Append commercial_id only when present (some backends don't expect it)
      if (carForm.commercial_id) {
        formData.append('commercial_id', parseInt(carForm.commercial_id));
      }
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

      // ✅ Auth header for FormData
      const token = localStorage.getItem("authToken");
      console.log(token);
      const response = await fetch(url, {
        method,
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      pushLog("Admin", `${editingCar ? 'Updated' : 'Added'} car ${carForm.model}`);
      setShowAddCar(false);
      setCarForm(initialCarForm);

      const carsResponse = await fetch(`${API_BASE}/cars/all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
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
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE}/cars/?car_id=${id}`, {
        method: 'DELETE',
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
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
  setTempPassword("");
  setNewCommercialPhone(CommercialForm.phone_number); // Save phone now

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

    if (isUpdate) {
      requestBody.commercial_id = CommercialForm.commercial_id;
    }

    const response = await fetch(url, {
      method: isUpdate ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    if (response.ok) {
      setMessage("Commercial saved successfully ✅");

      // ✅ Handle password ONLY on creation (not update)
      if (!isUpdate) {
        // Check if response has the expected format
        if (responseData.status === 200 && responseData.detail?.startsWith("password:")) {
          const password = responseData.detail.split("password:")[1];
          setTempPassword(password);
          setShowPasswordModal(true); // Show modal automatically
        } else {
          // Fallback: maybe backend changed format?
          console.warn("Password not found in expected format:", responseData);
        }
      }

      // Reset & refresh
      setCommercialForm({ name: "", surname: "", phone_number: "", wilaya: "", address: "" });
      setShowAddCommercial(false);
      const fresh = await fetch(`${API_BASE}/commercials/`).then(r => r.json());
      setCommercials(Array.isArray(fresh) ? fresh : []);

    } else {
      setMessage(`❌ Error: ${responseData.detail || "Failed to save commercial"}`);
    }
  } catch (error) {
    console.error("Network error:", error);
    setMessage("⚠️ Network error: " + error.message);
  } finally {
    setCommercialLoading(false);
  }
};

  const updateSupplierItemPayment = async (itemId, amount) => {
    try {
      const response = await apiFetch(`${API_BASE}/suppliers_items/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplier_item_id: itemId, payment_amount: parseFloat(amount) || 0 })
      });
      if (response.ok) {
        pushLog("Admin", `Updated payment for supplier item ${itemId}`);
        const itemsResponse = await apiFetch(`${API_BASE}/suppliers_items/`);
        const itemsData = await itemsResponse.json();
        setSupplierItems(Array.isArray(itemsData) ? itemsData : []);
      }
    } catch (err) {
      console.error("Error updating supplier item:", err);
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

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
        {/* ✅ Logout Button */}
        <motion.button
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.09 }}
          onClick={handleLogout}
          title="Logout"
          className="p-3 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut className="w-6 h-6" />
        </motion.button>
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

          {/* Currency Tab */}
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
                        <th className="py-3 px-3">Modéle</th>
                        <th className="py-3 px-3">Couleur</th>
                        <th className="py-3 px-3">Année</th>
                        <th className="py-3 px-3">Price</th>
                        <th className="py-3 px-3">Quantity</th>
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
                              <td className="py-3 px-3">{car.quantity || 1}</td>
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
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Supplier Finance Details</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {fournisseurs.map((supplier) => {
  // Filter supplier items linked to this supplier
  const items = supplierItems.filter(item => item.supplier_id === supplier.id);
  
  // Calculate totals
  const totalOwed = items.reduce((sum, item) => {
    const currency = currencyList.find(c => c.id === item.currency_id);
    const rate = currency?.exchange_rate_to_dzd || 1;
    return sum + ((item.price || 0) * rate);
  }, 0);
  
  const totalPaid = items.reduce((sum, item) => sum + (item.payment_amount || 0), 0);
  const remaining = totalOwed - totalPaid;

  return (
    <div key={supplier.id} className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 hover:border-purple-500 transition">
      <h3 className="text-lg font-semibold text-purple-400">
        {supplier.name} {supplier.surname}
      </h3>
      <p className="text-sm text-gray-400">📞 {supplier.phone_number || "—"} | 📍 {supplier.address || "—"}</p>

      {/* 💰 Summary Card */}
      <div className="mt-3 p-3 bg-neutral-800/40 rounded-lg">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-emerald-400 font-medium">{totalOwed.toLocaleString()} DZD</div>
            <div className="text-neutral-400">Total Owed</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-medium">{totalPaid.toLocaleString()} DZD</div>
            <div className="text-neutral-400">Paid</div>
          </div>
          <div className="text-center">
            <div className={`font-bold ${remaining > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {remaining.toLocaleString()} DZD
            </div>
            <div className="text-neutral-400">Remaining</div>
          </div>
        </div>
      </div>

      {/* 📋 Per-Item Payments */}
      {items.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-purple-300 mb-2">Car Purchases & Payments</h4>
          <div className="space-y-2">
            {items.map((item) => {
              const car = cars.find(c => c.id === item.car_id) || {};
              const currency = currencyList.find(c => c.id === item.currency_id);
              const totalCostDZD = (item.price || 0) * (currency?.exchange_rate_to_dzd || 1);
              const remainingItem = totalCostDZD - (item.payment_amount || 0);

              // Editable input value
              const editingValue = editingPayment[item.supplier_item_id] ?? item.payment_amount;

              return (
                <div key={item.supplier_item_id} className="flex items-center justify-between text-sm bg-neutral-800/30 p-2 rounded">
                  <div>
                    <span className="font-medium">{car.model || 'Car'} #{car.id}</span>
                    <span className="text-neutral-500 ml-2">{totalCostDZD.toLocaleString()} DZD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="100"
                      min="0"
                      max={totalCostDZD}
                      value={editingValue || ''}
                      onChange={(e) => setEditingPayment(prev => ({
                        ...prev,
                        [item.supplier_item_id]: parseFloat(e.target.value) || 0
                      }))}
                      className="w-24 bg-neutral-700 text-white text-right px-2 py-1 rounded text-xs"
                    />
                    <button
                      onClick={async () => {
                        const newAmount = editingValue || 0;
                        if (newAmount === (item.payment_amount || 0)) return;

                        try {
                          const res = await fetch(`${API_BASE}/suppliers_items/`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              supplier_item_id: item.supplier_item_id,
                              payment_amount: newAmount
                            })
                          });

                          if (res.ok) {
                            // Optimistic update
                            setSupplierItems(prev => 
                              prev.map(i => 
                                i.supplier_item_id === item.supplier_item_id 
                                  ? { ...i, payment_amount: newAmount } 
                                  : i
                              )
                            );
                            setEditingPayment(prev => {
                              const copy = { ...prev };
                              delete copy[item.supplier_item_id];
                              return copy;
                            });
                            pushLog("Admin", `Updated payment for supplier #${supplier.id} → ${newAmount} DZD`);
                          } else {
                            throw new Error('Update failed');
                          }
                        } catch (err) {
                          alert("❌ Failed to update payment");
                          console.error(err);
                        }
                      }}
                      className={`px-2 py-1 rounded text-xs ${
                        editingValue !== (item.payment_amount || 0)
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-neutral-600 cursor-not-allowed'
                      }`}
                      disabled={editingValue === (item.payment_amount || 0)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✏️ Action Buttons */}
      <div className="flex justify-end mt-3 space-x-2">
        <button
          onClick={() => handleEditFournisseur(supplier)}
          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Modifier
        </button>
        <button
          onClick={() => handleDeleteFournisseur(supplier.id)}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Supprimer
        </button>
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
                            const res = await apiFetch(`${API_BASE}/expenses/`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                year: now.getFullYear(),
                                month: now.getMonth() + 1,
                                purchases: expenses.purchases,
                                transport: expenses.transport,
                                other: expenses.other
                              })
                            });
                            if (res.ok) {
                              alert('Monthly expenses updated successfully!');
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
        </AnimatePresence>

        {/* Modals */}
        <Modal open={showAddCar} onClose={() => setShowAddCar(false)} title={editingCar ? "Edit Car" : "Add Car"}>
          <form onSubmit={handleSubmitCar} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={carForm.model} onChange={(e) => setCarForm({ ...carForm, model: e.target.value })} placeholder="Modèle" className="bg-neutral-800 p-2 rounded" required />
              <input value={carForm.color} onChange={(e) => setCarForm({ ...carForm, color: e.target.value })} placeholder="Couleur" className="bg-neutral-800 p-2 rounded" />
              <input type="number" value={carForm.year} onChange={(e) => setCarForm({ ...carForm, year: e.target.value })} placeholder="Année" className="bg-neutral-800 p-2 rounded" />
              <input value={carForm.engine} onChange={(e) => setCarForm({ ...carForm, engine: e.target.value })} placeholder="Moteur" className="bg-neutral-800 p-2 rounded" />
              <input value={carForm.power} onChange={(e) => setCarForm({ ...carForm, power: e.target.value })} placeholder="Puissance" className="bg-neutral-800 p-2 rounded" />
              <input value={carForm.fuelType} onChange={(e) => setCarForm({ ...carForm, fuelType: e.target.value })} placeholder="Type de carburant" className="bg-neutral-800 p-2 rounded" />
              <input type="number" step="0.01" value={carForm.milage} onChange={(e) => setCarForm({ ...carForm, milage: e.target.value })} placeholder="Kilometrage" className="bg-neutral-800 p-2 rounded" />
              <input type="text" value={carForm.price} onChange={(e) => setCarForm({ ...carForm, price: e.target.value })} placeholder="Prix" className="bg-neutral-800 p-2 rounded" />
              <input type="text" value={carForm.commercial_comission} onChange={(e) => setCarForm({ ...carForm, commercial_comission: e.target.value })} placeholder="Commission %" className="bg-neutral-800 p-2 rounded" />
              <input type="text" value={carForm.quantity} onChange={(e) => setCarForm({ ...carForm, quantity: e.target.value })} placeholder="quantité" className="bg-neutral-800 p-2 rounded" />
              <select value={carForm.currency_id} onChange={(e) => setCarForm({ ...carForm, currency_id: e.target.value })} className="bg-neutral-800 p-2 rounded" required>
                <option value="">Selectionnez un devise</option>
                {currencyList.map(curr => (
                  <option key={curr.id} value={curr.id}>{curr.name} ({curr.code.toUpperCase()})</option>
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
                <span className="text-sm text-neutral-400">{carForm.imageFiles.length} fichier(s) selectionnée</span>
              )}
            </div>
            <div className="flex justify-end gap-3 z-30 cursor-pointer">
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
        {/* Temporary Password Modal */}
{showPasswordModal && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
    <div className="bg-neutral-800 rounded-2xl w-full max-w-md border border-neutral-700">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-white">
            Identifiants du Commercial
          </h2>
          <button
            onClick={() => setShowPasswordModal(false)}
            className="text-neutral-400 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>

        <p className="text-neutral-300 text-sm mb-4">
          Le commercial peut se connecter avec ces identifiants :
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400">Téléphone</label>
            <code className="block mt-1 bg-neutral-900 px-3 py-2.5 rounded font-mono text-emerald-400">
              {newCommercialPhone}
            </code>
          </div>

          <div>
            <label className="text-xs text-neutral-400">Mot de passe temporaire</label>
            <div className="mt-1 flex">
              <code className="bg-neutral-900 px-3 py-2.5 rounded-l font-mono text-emerald-400 flex-1">
                {tempPassword}
              </code>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(tempPassword);
                  // Optional: show toast "Copied!"
                }}
                className="bg-emerald-600 hover:bg-emerald-500 px-4 rounded-r font-medium"
                title="Copier le mot de passe"
              >
                📋
              </button>
            </div>
            <p className="text-xs text-yellow-400 mt-2">
              ⚠️ Ce mot de passe ne sera plus affiché après fermeture.
            </p>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={() => setShowPasswordModal(false)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium"
          >
            J’ai copié le mot de passe
          </button>
        </div>
      </div>
    </div>
  </div>
)}

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

        {/* ✅ FIXED: Pass supplierItems */}
        <CommercialCarsModal
          open={showCommercialCars}
          onClose={() => setShowCommercialCars(false)}
          commercial={selectedCommercial}
          cars={getEnrichedCars()}
          suppliers={fournisseurs}
          currencyList={currencyList}
          supplierItems={supplierItems}  // ✅ Now passed
        />
      </main>
    </div>
  );
}