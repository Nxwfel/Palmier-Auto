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

// ✅ FIXED: Now supports editable supplier finances
const CommercialCarsModal = ({ 
  open, 
  onClose, 
  commercial, 
  cars, 
  suppliers, 
  currencyList,
  supplierItems  
}) => {
  if (!commercial) return null;
  const soldCars = cars.filter(car => car.commercial_id === commercial.id);
  
  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? `${supplier.name} ${supplier.surname}` : 'Unknown';
  };
  
  const convertToDZD = (price, currencyId) => {
    const currency = currencyList.find(c => c.id === currencyId);
    return price * (currency?.exchange_rate_to_dzd || 1);
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
                  // ✅ Use all supplier items (not just first)
                  const itemsForCar = supplierItems.filter(item => item.car_id === car.id);
                  const carCurrency = currencyList.find(c => c.id === car.currency_id);
                  const salePriceDZD = (car.price || 0) * (carCurrency?.exchange_rate_to_dzd || 1);

                  return (
                    <div key={car.id} className="bg-neutral-800/30 rounded-xl p-4 border border-neutral-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-emerald-400 mb-2">{car.model}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Sale Price:</span>
                              <span className="text-emerald-400">{salePriceDZD.toLocaleString()} DZD</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Year:</span>
                              <span>{car.year || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Color:</span>
                              <span>{car.color || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-purple-400 mb-2">Supplier Costs</h5>
                          {itemsForCar.length === 0 ? (
                            <p className="text-neutral-500 text-sm">No supplier records</p>
                          ) : (
                            <div className="space-y-2 text-sm">
                              {itemsForCar.map((item, i) => {
                                const supCurr = currencyList.find(c => c.id === item.currency_id);
                                const costDZD = (item.price || 0) * (supCurr?.exchange_rate_to_dzd || 1);
                                const paid = item.payment_amount || 0;
                                const remaining = costDZD - paid;
                                return (
                                  <div key={i} className="bg-neutral-900/30 p-2 rounded text-xs">
                                    <div><span className="text-neutral-400">Supplier:</span> {getSupplierName(item.supplier_id)}</div>
                                    <div><span className="text-neutral-400">Cost:</span> {(item.price || 0).toLocaleString()} {supCurr?.code.toUpperCase()} → <span className="text-purple-400">{costDZD.toLocaleString()} DZD</span></div>
                                    <div><span className="text-neutral-400">Paid:</span> <span className="text-blue-400">{paid.toLocaleString()} DZD</span></div>
                                    <div><span className="text-neutral-400">Remaining:</span> <span className={remaining > 0 ? 'text-red-400' : 'text-green-400'}>{remaining.toLocaleString()} DZD</span></div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-neutral-700">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">ID: {car.id}</span>
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Country: {car.country || 'N/A'}</span>
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
  if (response.status === 401) {
    localStorage.removeItem("authToken");
    window.location.href = "/adminlogin";
    throw new Error("Unauthorized");
  }
  return response;
};

export default function AdminSuperPanel() {
  const API_BASE = 'https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com';
  const [tempPassword, setTempPassword] = useState("");
  const [passwordModalType, setPasswordModalType] = useState(null); // "commercial", "marketer", "accountant"
  const [userPhoneForPassword, setUserPhoneForPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingSupplierItem, setEditingSupplierItem] = useState({}); // ✅ New state for editable supplier items
  const [generatedPassword, setGeneratedPassword] = useState("");
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
  const [marketers, setMarketers] = useState([]);
  const [accountants, setAccountants] = useState([]);
  const [logs, setLogs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [currencies, setCurrencies] = useState({});
  const [currencyList, setCurrencyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supplierItems, setSupplierItems] = useState([]);
  const [showCommercialCars, setShowCommercialCars] = useState(false);
  const [selectedCommercial, setSelectedCommercial] = useState(null);
  const [showAddFournisseur, setShowAddFournisseur] = useState(false);
  const [loadingFournisseurs, setLoadingFournisseurs] = useState(false);
  const [fournisseurForm, setFournisseurForm] = useState({
    name: "", surname: "", phone_number: "", address: "",
  });
  const [showAddCar, setShowAddCar] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const initialCarForm = {
    model: "", color: "", year: "", engine: "", power: "", fuelType: "", milage: "",
    country: "", commercial_comission: "", price: "", shippingDate: "", arrivingDate: "",
    currency_id: "", quantity: "", imageFiles: [],
  };
  const [carForm, setCarForm] = useState(initialCarForm);
  const [CommercialForm, setCommercialForm] = useState({
    name: "", surname: "", phone_number: "", wilayas: [], address: ""
  });
  const [showAddCommercial, setShowAddCommercial] = useState(false);
  const [message, setMessage] = useState("");
  const [commercialLoading, setCommercialLoading] = useState(false);
  
  // ✅ Marketer & Accountant States
  const [marketerForm, setMarketerForm] = useState({
    name: "", surname: "", phone_number: "", address: ""
  });
  const [showAddMarketer, setShowAddMarketer] = useState(false);
  const [marketerLoading, setMarketerLoading] = useState(false);
  const [marketerMessage, setMarketerMessage] = useState("");
  
  const [accountantForm, setAccountantForm] = useState({
    name: "", surname: "", phone_number: "", address: ""
  });
  const [showAddAccountant, setShowAddAccountant] = useState(false);
  const [accountantLoading, setAccountantLoading] = useState(false);
  const [accountantMessage, setAccountantMessage] = useState("");

  const pushLog = (actor, action) => {
    setLogs((p) => [{ id: Date.now(), actor, action, date: new Date().toISOString() }, ...p]);
  };

  // --- Data Fetchers ---
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/earnings/monthly`);
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
        const safeData = data || {};
        setExpenses({
          total_amount: safeData.total_amount || 0,
          purchases: safeData.purchases || 0,
          transport: safeData.transport || 0,
          other: safeData.other || 0
        });
      } catch (err) {
        setExpenses({ total_amount: 0, purchases: 0, transport: 0, other: 0 });
      }
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    const fetchYearlyExpenses = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/expenses/yearly`);
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
        const response = await apiFetch(`${API_BASE}/cars/all`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        const data = await response.json();
        setCars(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setCars([]);
      }
    };
    fetchCars();
  }, []);

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
        const data = await response.json();
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
        const data = await response.json();
        setCommercials(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching commercials:", err);
        setCommercials([]);
      }
    };
    fetchCommercials();
  }, []);

  // ✅ Fetch Marketers
  useEffect(() => {
    const fetchMarketers = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/marketers/`);
        const data = await response.json();
        setMarketers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching marketers:", err);
        setMarketers([]);
      }
    };
    fetchMarketers();
  }, []);

  // ✅ Fetch Accountants
  useEffect(() => {
    const fetchAccountants = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/accountants/`);
        const data = await response.json();
        setAccountants(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching accountants:", err);
        setAccountants([]);
      }
    };
    fetchAccountants();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/orders/`);
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
        const response = await apiFetch(`${API_BASE}/currencies/`);
        const data = await response.json();
        if (!isMounted) return;
        setCurrencyList(Array.isArray(data) ? data : []);
        const currencyMap = {};
        data.forEach(curr => {
          currencyMap[curr.code] = curr.exchange_rate_to_dzd;
        });
        setCurrencies(currencyMap);
        if (data.length === 0) {
          const defaultCurrencies = [
            { code: "dzd", name: "Algerian Dinar", rate: 1 },
            { code: "eur", name: "Euro", rate: 145 },
            { code: "usd", name: "US Dollar", rate: 135 },
            { code: "cad", name: "Canadian Dollar", rate: 98 },
            { code: "aed", name: "UAE Dirham", rate: 36.8 },
          ];
          for (let i = 0; i < defaultCurrencies.length; i++) {
            if (!isMounted) break;
            const curr = defaultCurrencies[i];
            await apiFetch(`${API_BASE}/currencies/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                code: curr.code,
                name: curr.name,
                exchange_rate_to_dzd: curr.rate
              })
            });
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          const finalRes = await apiFetch(`${API_BASE}/currencies/`);
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
    return () => { isMounted = false; };
  }, []);

  const handleCurrencyChange = async (code, value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;
    setCurrencies(prev => ({ ...prev, [code]: numericValue }));
    try {
      const existing = currencyList.find(c => c.code.toLowerCase() === code.toLowerCase());
      if (existing) {
        await apiFetch(`${API_BASE}/currencies/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: existing.id,
            exchange_rate_to_dzd: numericValue
          })
        });
      } else {
        await apiFetch(`${API_BASE}/currencies/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: code.toLowerCase(),
            name: { dzd: 'Algerian Dinar', eur: 'Euro', usd: 'US Dollar', cad: 'Canadian Dollar', aed: 'UAE Dirham' }[code] || code.toUpperCase(),
            exchange_rate_to_dzd: numericValue
          })
        });
        const fresh = await apiFetch(`${API_BASE}/currencies/`).then(r => r.json());
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

  const handleOpenAdd = (agent = "Admin") => {
    setCarForm(initialCarForm);
    setEditingCar(null);
    setShowAddCar(true);
    pushLog(agent, "Opened Add Car modal");
  };

  const handleOpenAddCommercial = (agent = "Admin") => {
    setCommercialForm({
      name: "", 
      surname: "", 
      phone_number: "", 
      wilayas: [], 
      address: ""
    });
    setShowAddCommercial(true);
    pushLog(agent, "Opened Add Commercial modal");
  };

  const handleSubmitCar = async (e) => {
    e.preventDefault();
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

      // Use apiFetch with FormData: don't set Content-Type so browser can set boundary
      const response = await apiFetch(url, {
        method,
        body: formData
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      pushLog("Admin", `${editingCar ? 'Updated' : 'Added'} car ${carForm.model}`);
      setShowAddCar(false);
      setCarForm(initialCarForm);
      const carsResponse = await apiFetch(`${API_BASE}/cars/all`, {
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
      const response = await apiFetch(`${API_BASE}/cars/?car_id=${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete car');
      setCars((p) => p.filter((c) => c.id !== id));
      pushLog("Admin", `Deleted car ${id}`);
    } catch (err) {
      console.error("Error deleting car:", err);
      alert("Error deleting car: " + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'wilayas') {
      // ✅ Split input into array
      setCommercialForm(prev => ({ ...prev, wilayas: value.split(/[,;\n]/).map(w => w.trim()).filter(w => w) }));
    } else {
      setCommercialForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // ✅ FIXED Commercial submit (wilayas as array + password fallback)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommercialLoading(true);
    setMessage("");
    setTempPassword("");
    setUserPhoneForPassword(CommercialForm.phone_number);
    try {
      const isUpdate = !!CommercialForm.commercial_id;
      const url = `${API_BASE}/commercials/`;
      const requestBody = {
        name: CommercialForm.name,
        surname: CommercialForm.surname,
        phone_number: CommercialForm.phone_number,
        wilayas: CommercialForm.wilayas,
        address: CommercialForm.address,
      };
      if (isUpdate) {
        requestBody.commercial_id = CommercialForm.commercial_id;
      }

      const response = await apiFetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const responseData = await response.json();
      if (response.ok) {
        setMessage("Commercial saved successfully ✅");
        if (!isUpdate) {
          // ✅ Flexible password extraction
          let password = "";
          if (responseData.password) {
            password = responseData.password;
          } else if (responseData.detail?.startsWith("password:")) {
            password = responseData.detail.split("password:")[1];
          } else {
            const pwdRes = await apiFetch(`${API_BASE}/commercials/random_password`);
            const pwdData = await pwdRes.json();
            password = pwdData.password || pwdData.detail || "temp123";
          }
          setTempPassword(password);
                   setPasswordModalType("commercial");
          setShowPasswordModal(true);
        }
        setCommercialForm({ name: "", surname: "", phone_number: "", wilayas: [], address: "" });
        setShowAddCommercial(false);
        const fresh = await apiFetch(`${API_BASE}/commercials/`).then(r => r.json());
        setCommercials(Array.isArray(fresh) ? fresh : []);
      } else {
        setMessage(`❌ Error: ${responseData.detail || "Failed to save commercial"}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setMessage("⚠️ Network error: " + error.message);
    } finally {
      setCommercialLoading(false);
    }
  };

  // ✅ Handle Marketer Submit
  const handleMarketerSubmit = async (e) => {
    e.preventDefault();
    setMarketerLoading(true);
    setMarketerMessage("");
    setTempPassword("");
    setUserPhoneForPassword(marketerForm.phone_number);
    try {
      const isUpdate = !!marketerForm.marketer_id;
      const url = `${API_BASE}/marketers/`;
      const requestBody = {
        name: marketerForm.name,
        surname: marketerForm.surname,
        phone_number: marketerForm.phone_number,
        address: marketerForm.address,
      };
      if (isUpdate) {
        requestBody.marketer_id = marketerForm.marketer_id;
      }

      const response = await apiFetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const responseData = await response.json();
      if (response.ok) {
        setMarketerMessage("Marketer saved successfully ✅");
        if (!isUpdate) {
          let password = "";
          if (responseData.password) {
            password = responseData.password;
          } else if (responseData.detail?.startsWith("password:")) {
            password = responseData.detail.split("password:")[1];
          } else {
            password = "temp123";
          }
          setTempPassword(password);
          setPasswordModalType("marketer");
          setShowPasswordModal(true);
        }
        setMarketerForm({ name: "", surname: "", phone_number: "", address: "" });
        setShowAddMarketer(false);
        const fresh = await apiFetch(`${API_BASE}/marketers/`).then(r => r.json());
        setMarketers(Array.isArray(fresh) ? fresh : []);
      } else {
        setMarketerMessage(`❌ Error: ${responseData.detail || "Failed to save marketer"}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setMarketerMessage("⚠️ Network error: " + error.message);
    } finally {
      setMarketerLoading(false);
    }
  };

  // ✅ Handle Accountant Submit
  const handleAccountantSubmit = async (e) => {
    e.preventDefault();
    setAccountantLoading(true);
    setAccountantMessage("");
    setTempPassword("");
    setUserPhoneForPassword(accountantForm.phone_number);
    try {
      const isUpdate = !!accountantForm.accountant_id;
      const url = `${API_BASE}/accountants/`;
      const requestBody = {
        name: accountantForm.name,
        surname: accountantForm.surname,
        phone_number: accountantForm.phone_number,
        address: accountantForm.address,
      };
      if (isUpdate) {
        requestBody.accountant_id = accountantForm.accountant_id;
      }

      const response = await apiFetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const responseData = await response.json();
      if (response.ok) {
        setAccountantMessage("Accountant saved successfully ✅");
        if (!isUpdate) {
          let password = "";
          if (responseData.password) {
            password = responseData.password;
          } else if (responseData.detail?.startsWith("password:")) {
            password = responseData.detail.split("password:")[1];
          } else {
            password = "temp123";
          }
          setTempPassword(password);
          setPasswordModalType("accountant");
          setShowPasswordModal(true);
        }
        setAccountantForm({ name: "", surname: "", phone_number: "", address: "" });
        setShowAddAccountant(false);
        const fresh = await apiFetch(`${API_BASE}/accountants/`).then(r => r.json());
        setAccountants(Array.isArray(fresh) ? fresh : []);
      } else {
        setAccountantMessage(`❌ Error: ${responseData.detail || "Failed to save accountant"}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setAccountantMessage("⚠️ Network error: " + error.message);
    } finally {
      setAccountantLoading(false);
    }
  };

  // ✅ Delete Marketer
  const handleDeleteMarketer = async (id) => {
    if (!window.confirm("Delete this marketer?")) return;
    try {
      await apiFetch(`${API_BASE}/marketers/?marketer_id=${id}`, {
        method: 'DELETE'
      });
      setMarketers(marketers.filter(m => m.id !== id));
    } catch (err) {
      console.error("Error deleting marketer:", err);
      alert("Error deleting marketer");
    }
  };

  // ✅ Delete Accountant
  const handleDeleteAccountant = async (id) => {
    if (!window.confirm("Delete this accountant?")) return;
    try {
      await apiFetch(`${API_BASE}/accountants/?accountant_id=${id}`, {
        method: 'DELETE'
      });
      setAccountants(accountants.filter(a => a.id !== id));
    } catch (err) {
      console.error("Error deleting accountant:", err);
      alert("Error deleting accountant");
    }
  };

  // ✅ NEW: Save editable supplier item (price + paid)
  const saveSupplierItemEdit = async (item) => {
    const editState = editingSupplierItem[item.supplier_item_id];
    if (!editState) return;

    const newPrice = editState.price ?? item.price;
    const newPaid = editState.payment_amount ?? item.payment_amount;

    // Skip if no change
    const priceChanged = newPrice !== item.price;
    const paidChanged = newPaid !== item.payment_amount;
    if (!priceChanged && !paidChanged) return;

    // Optimistic update
    const originalItem = { ...item };
    setSupplierItems(prev => 
      prev.map(i => 
        i.supplier_item_id === item.supplier_item_id 
          ? { ...i, price: newPrice, payment_amount: newPaid } 
          : i
      )
    );
    setEditingSupplierItem(prev => {
      const copy = { ...prev };
      delete copy[item.supplier_item_id];
      return copy;
    });

    try {
      const response = await apiFetch(`${API_BASE}/suppliers_items/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          supplier_item_id: item.supplier_item_id,
          ...(priceChanged && { price: newPrice }),
          ...(paidChanged && { payment_amount: newPaid })
        })
      });
      if (!response.ok) throw new Error('Update failed');
      pushLog("Admin", `Updated supplier item #${item.supplier_item_id}`);
    } catch (err) {
      console.error("Update failed — reverting:", err);
      setSupplierItems(prev => 
        prev.map(i => 
          i.supplier_item_id === item.supplier_item_id 
            ? originalItem 
            : i
        )
      );
      alert("❌ Failed to save changes. Reverted.");
    }
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
      <aside className="w-20 md:w-28 flex flex-col items-center py-6 space-y-6 border-r border-neutral-800 bg-neutral-900/70 backdrop-blur-md fixed left-0 top-0 h-full">
        {[
          { id: "overview", icon: BarChart3, label: "Overview" },
          { id: "cars", icon: Car, label: "Cars" },
          { id: "fournisseurs", icon: CreditCard, label: "Fournisseurs" },
          { id: "commercials", icon: Users, label: "Commercials" },
          { id: "marketers", icon: Users, label: "Marketers" },
          { id: "accountants", icon: Users, label: "Accountants" },
          { id: "wholesale_clients", icon: Users, label: "Wholesale Clients" },
          { id: "wholesale_orders", icon: FilePlus, label: "Wholesale Orders" },
          { id: "clients_orders", icon: FilePlus, label: "Clients Orders" },
          { id: "currency", icon: DollarSign, label: "Currency" },
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
                <Stat label="Wholesale Orders" value={wholesaleOrders.length} icon={FilePlus} />
                <Stat 
                  label="Wholesale Value" 
                  value={`${getTotalWholesaleValue().toLocaleString()} DZD`} 
                  icon={DollarSign} 
                />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Recent Cars</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {cars.slice(0, 6).map((c, i) => (
                      <div key={c.id ?? `recent-${i}`} className="flex items-center gap-4 p-3 bg-neutral-900/40 rounded-lg border border-neutral-800">
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
                              <div className="text-sm text-emerald-400">{(c.price || 0).toLocaleString()} DZD</div>
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
                    <button onClick={() => setTab("wholesale_clients")} className="w-full p-3 rounded-lg text-left bg-purple-500/10 hover:bg-purple-500/20 transition">Wholesale Clients</button>
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
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {tab === "cars" && (
            <motion.div key="cars" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Cars Management</h2>
                <div className="flex items-center gap-3">
                  <input 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="Search car..." 
                    className="bg-neutral-800 px-3 py-2 rounded-lg text-sm" 
                  />
                  <button 
                    onClick={() => handleOpenAdd("Admin")} 
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400"
                  >
                    Add Car
                  </button>
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
                        <th className="py-3 px-3">Prix (DZD)</th>
                        <th className="py-3 px-3">Prix Gros (DZD)</th>
                        <th className="py-3 px-3">Qtt</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCars.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="py-4 text-center text-neutral-500">No cars found</td>
                        </tr>
                      ) : (
                        filteredCars.map((car, i) => {
                          const currency = currencyList.find(c => c.id === car.currency_id);
                          const rate = currency?.exchange_rate_to_dzd || 1;
                          const priceDZD = (car.price || 0) * rate;
                          const wholesaleDZD = (car.wholesale_price || 0) * rate;
                          return (
                            <tr key={car.id ?? `car-${i}`} className="border-b border-neutral-800/40 hover:bg-white/5">
                              <td className="py-3 px-3 font-mono text-emerald-400">{car.id}</td>
                              <td className="py-3 px-3">{car.model}</td>
                              <td className="py-3 px-3">{car.color || '—'}</td>
                              <td className="py-3 px-3">{car.year || '—'}</td>
                              <td className="py-3 px-3 text-emerald-400">{priceDZD.toLocaleString()}</td>
                              <td className="py-3 px-3 text-purple-400">{wholesaleDZD.toLocaleString()}</td>
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

          {tab === "fournisseurs" && (
            <motion.div key="fournisseurs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Fournisseurs & Finance</h2>
                <button
                  onClick={() => setShowAddFournisseur(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600/20 text-purple-400"
                >
                  Ajouter Fournisseur +
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Suppliers</h3>
                  {fournisseurs.length === 0 ? (
                    <p className="text-gray-400">Aucun fournisseur trouvé.</p>
                  ) : (
                    <div className="space-y-4">
                      {fournisseurs.map((f, i) => (
                        <div key={f.id ?? `f-${i}`} className="bg-neutral-900 rounded-xl p-4 border border-neutral-800">
                          <h3 className="text-lg font-semibold text-purple-400">
                            {f.name} {f.surname}
                          </h3>
                          <p className="text-sm text-gray-400">📞 {f.phone_number || "—"}</p>
                          <p className="text-sm text-gray-400">📍 {f.address || "—"}</p>
                          <div className="flex justify-end mt-3 space-x-2">
                            <button onClick={() => handleEditFournisseur(f)} className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs">
                              Modifier
                            </button>
                            <button onClick={() => handleDeleteFournisseur(f.id)} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs">
                              Supprimer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
                <Card>
                  <h3 className="text-lg font-semibold mb-4">Supplier Finance</h3>
                  <div className="space-y-4">
                    {fournisseurs.map((supplier, i) => {
                      const items = supplierItems.filter(item => item.supplier_id === supplier.id);
                      const totalOwed = items.reduce((sum, item) => {
                        const currency = currencyList.find(c => c.id === item.currency_id);
                        const rate = currency?.exchange_rate_to_dzd || 1;
                        return sum + ((item.price || 0) * rate);
                      }, 0);
                      const totalPaid = items.reduce((sum, item) => sum + (item.payment_amount || 0), 0);
                      return (
                        <div key={supplier.id ?? `sup-${i}`} className="bg-neutral-900 rounded-xl p-4">
                          <h3 className="text-lg font-semibold text-purple-400">
                            {supplier.name} {supplier.surname}
                          </h3>
                          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <div className="text-emerald-400">{totalOwed.toLocaleString()} DZD</div>
                              <div>Total Owed</div>
                            </div>
                            <div className="text-center">
                              <div className="text-blue-400">{totalPaid.toLocaleString()} DZD</div>
                              <div>Paid</div>
                            </div>
                            <div className="text-center">
                              <div className={`font-bold ${totalOwed > totalPaid ? 'text-red-400' : 'text-green-400'}`}>
                                {(totalOwed - totalPaid).toLocaleString()} DZD
                              </div>
                              <div>Remaining</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {tab === "commercials" && (
            <motion.div key="commercials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Commercials Management</h2>
                <button 
                  onClick={() => handleOpenAddCommercial("Admin")} 
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400"
                >
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
                        <th className="py-3 px-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commercials.map((cm, i) => {
                        const soldCars = cars.filter(car => car.commercial_id === cm.id).length;
                        return (
                          <tr key={cm.id ?? `cm-${i}`} className="border-b border-neutral-800/40 hover:bg-emerald-500/5">
                            <td className="py-3 px-3 font-mono text-emerald-400">{cm.id}</td>
                            <td className="py-3 px-3">{cm.name} {cm.surname}</td>
                            <td className="py-3 px-3">{cm.phone_number}</td>
                            <td className="py-3 px-3">{cm.wilayas?.join(', ')}</td>
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

          {tab === "marketers" && (
            <motion.div key="marketers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Marketing Agents</h2>
                <button 
                  onClick={() => { setMarketerForm({ name: "", surname: "", phone_number: "", address: "" }); setShowAddMarketer(true); }} 
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400"
                >
                  Add Marketer +
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
                        <th className="py-3 px-3">Created</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketers.map((m, i) => (
                        <tr key={m.id ?? `mark-${i}`} className="border-b border-neutral-800/40 hover:bg-emerald-500/5">
                          <td className="py-3 px-3 font-mono text-emerald-400">{m.id}</td>
                          <td className="py-3 px-3">{m.name} {m.surname}</td>
                          <td className="py-3 px-3">{m.phone_number}</td>
                          <td className="py-3 px-3 text-sm text-neutral-400">
                            {new Date(m.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button onClick={() => { setMarketerForm(m); setShowAddMarketer(true); }} className="text-blue-400 hover:text-blue-300">Edit</button>
                            <button onClick={() => handleDeleteMarketer(m.id)} className="text-red-400 hover:text-red-300">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {tab === "accountants" && (
            <motion.div key="accountants" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Accountants</h2>
                <button 
                  onClick={() => { setAccountantForm({ name: "", surname: "", phone_number: "", address: "" }); setShowAddAccountant(true); }} 
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400"
                >
                  Add Accountant +
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
                        <th className="py-3 px-3">Created</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accountants.map((a, i) => (
                        <tr key={a.id ?? `acc-${i}`} className="border-b border-neutral-800/40 hover:bg-emerald-500/5">
                          <td className="py-3 px-3 font-mono text-emerald-400">{a.id}</td>
                          <td className="py-3 px-3">{a.name} {a.surname}</td>
                          <td className="py-3 px-3">{a.phone_number}</td>
                          <td className="py-3 px-3 text-sm text-neutral-400">
                            {new Date(a.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button onClick={() => { setAccountantForm(a); setShowAddAccountant(true); }} className="text-blue-400 hover:text-blue-300">Edit</button>
                            <button onClick={() => handleDeleteAccountant(a.id)} className="text-red-400 hover:text-red-300">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ✅ NEW: Wholesale Clients Tab */}
          {tab === "wholesale_clients" && (
            <motion.div key="wholesale_clients" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Wholesale Clients</h2>
                <button 
                  onClick={() => { 
                    setWholesaleClientForm({ name: "", surname: "", phone_number: "", address: "", company_name: "" }); 
                    setShowAddWholesaleClient(true); 
                  }} 
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400"
                >
                  Add Wholesale Client +
                </button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Name</th>
                        <th className="py-3 px-3">Company</th>
                        <th className="py-3 px-3">Phone</th>
                        <th className="py-3 px-3">Address</th>
                        <th className="py-3 px-3">Created</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wholesaleClients.map((client, i) => (
                        <tr key={client.id ?? `wclient-${i}`} className="border-b border-neutral-800/40 hover:bg-emerald-500/5">
                          <td className="py-3 px-3 font-mono text-emerald-400">{client.id}</td>
                          <td className="py-3 px-3">{client.name} {client.surname}</td>
                          <td className="py-3 px-3 text-sm font-medium text-purple-400">{client.company_name || '—'}</td>
                          <td className="py-3 px-3">{client.phone_number}</td>
                          <td className="py-3 px-3 text-sm text-neutral-400">{client.address}</td>
                          <td className="py-3 px-3 text-sm text-neutral-400">
                            {new Date(client.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button 
                              onClick={() => { 
                                setWholesaleClientForm(client); 
                                setShowAddWholesaleClient(true); 
                              }} 
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteWholesaleClient(client.id)} 
                              className="text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ✅ NEW: Wholesale Orders Tab */}
          {tab === "wholesale_orders" && (
            <motion.div key="wholesale_orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Wholesale Orders</h2>
                <button 
                  onClick={() => { 
                    setWholesaleOrderForm({ client_id: "", car_id: "", quantity: 1, delivery_status: "shipping" }); 
                    setShowAddWholesaleOrder(true); 
                  }} 
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400"
                >
                  Add Wholesale Order +
                </button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Client</th>
                        <th className="py-3 px-3">Car</th>
                        <th className="py-3 px-3">Qty</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Value (DZD)</th>
                        <th className="py-3 px-3">Created</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wholesaleOrders.map((order, i) => {
                        const client = wholesaleClients.find(c => c.id === order.client_id) || {};
                        const car = cars.find(c => c.id === order.car_id) || {};
                        const currency = currencyList.find(c => c.id === car.currency_id);
                        const rate = currency?.exchange_rate_to_dzd || 1;
                        const value = order.quantity * (car.wholesale_price || 0) * rate;
                        return (
                          <tr key={order.id ?? `worder-${i}`} className="border-b border-neutral-800/40 hover:bg-emerald-500/5">
                            <td className="py-3 px-3 font-mono text-emerald-400">{order.id}</td>
                            <td className="py-3 px-3">
                              {client.name} {client.surname}
                              <div className="text-xs text-purple-400">{client.company_name}</div>
                            </td>
                            <td className="py-3 px-3">
                              {car.model || '—'} #{car.id}
                              <div className="text-xs text-neutral-500">{car.color} · {car.year}</div>
                            </td>
                            <td className="py-3 px-3">{order.quantity}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-1 rounded text-xs ${
                                order.delivery_status === 'showroom' ? 'bg-green-500/20 text-green-400' :
                                order.delivery_status === 'arrived' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {order.delivery_status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-purple-400">{value.toLocaleString()}</td>
                            <td className="py-3 px-3 text-sm text-neutral-400">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-3 text-right space-x-2">
                              <button 
                                onClick={() => { 
                                  setWholesaleOrderForm({
                                    order_id: order.id,
                                    client_id: order.client_id,
                                    car_id: order.car_id,
                                    quantity: order.quantity,
                                    delivery_status: order.delivery_status
                                  }); 
                                  setShowAddWholesaleOrder(true); 
                                }} 
                                className="text-blue-400 hover:text-blue-300"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteWholesaleOrder(order.id)} 
                                className="text-red-400 hover:text-red-300"
                              >
                                Delete
                              </button>
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
          {tab === "clients_orders" && (
            <motion.div key="clients_orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Clients Orders</h2>
                <button
                  onClick={() => {
                    setOrderForm({ client_id: "", car_id: "", quantity: 1, delivery_status: "shipping" });
                    setShowAddOrder(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400"
                >
                  Add Order +
                </button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Client</th>
                        <th className="py-3 px-3">Phone</th>
                        <th className="py-3 px-3">Address</th>
                        <th className="py-3 px-3">Car</th>
                        <th className="py-3 px-3">Unit Price (DZD)</th>
                        <th className="py-3 px-3">Qty</th>
                        <th className="py-3 px-3">Total (DZD)</th>
                        <th className="py-3 px-3">Paid (DZD)</th>
                        <th className="py-3 px-3">Delivery</th>
                        <th className="py-3 px-3">Created</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, i) => {
                        const client = clients.find(c => c.id === order.client_id) || {};
                        const car = cars.find(c => c.id === order.car_id) || {};
                        const currency = currencyList.find(c => c.id === car.currency_id);
                        const rate = currency?.exchange_rate_to_dzd || 1;
                        const unitPrice = car.price ? (car.price * rate) : (order.price_dzd || 0);
                        const totalValue = (order.quantity || 0) * unitPrice;
                        const paid = order.payment_amount || 0;
                        return (
                          <tr key={(order.id || order.order_id) ?? `corder-${i}`} className="border-b border-neutral-800/40 hover:bg-emerald-500/5">
                            <td className="py-3 px-3 font-mono text-emerald-400">{order.id || order.order_id}</td>
                            <td className="py-3 px-3">
                              {client.name} {client.surname}
                              <div className="text-xs text-neutral-400">{client.company_name || ''}</div>
                            </td>
                            <td className="py-3 px-3 text-sm text-neutral-400">{client.phone_number || order.client_phone || '—'}</td>
                            <td className="py-3 px-3 text-xs text-neutral-400">{client.address || '—'}</td>
                            <td className="py-3 px-3">
                              {car.model || '—'} #{car.id || order.car_id}
                              <div className="text-xs text-neutral-500">{car.color} · {car.year}</div>
                            </td>
                            <td className="py-3 px-3 text-purple-400">{Number(unitPrice || 0).toLocaleString()}</td>
                            <td className="py-3 px-3">{order.quantity}</td>
                            <td className="py-3 px-3 text-purple-400">{Number(totalValue || 0).toLocaleString()}</td>
                            <td className="py-3 px-3 text-blue-400">{Number(paid).toLocaleString()}</td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-1 rounded text-xs ${
                                order.delivery_status === 'showroom' ? 'bg-green-500/20 text-green-400' :
                                order.delivery_status === 'arrived' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {order.delivery_status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-sm text-neutral-400">
                              {order.created_at ? new Date(order.created_at).toLocaleString() : '—'}
                            </td>
                            <td className="py-3 px-3 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setOrderForm({
                                    order_id: order.id || order.order_id,
                                    client_id: order.client_id,
                                    car_id: order.car_id,
                                    quantity: order.quantity,
                                    delivery_status: order.delivery_status,
                                  });
                                  setShowAddOrder(true);
                                }}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id || order.order_id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Delete
                              </button>
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
      </main>

      {/* === MODALS === */}
      <Modal open={showAddCar} onClose={() => setShowAddCar(false)} title={editingCar ? "Edit Car" : "Add Car"}>
        <form onSubmit={handleSubmitCar} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input autoFocus value={carForm.model} onChange={(e) => setCarForm({ ...carForm, model: e.target.value })} placeholder="Modèle" className="bg-neutral-800 p-2 rounded" required />
            <input value={carForm.color} onChange={(e) => setCarForm({ ...carForm, color: e.target.value })} placeholder="Couleur" className="bg-neutral-800 p-2 rounded" />
            <input type="number" value={carForm.year} onChange={(e) => setCarForm({ ...carForm, year: e.target.value })} placeholder="Année" className="bg-neutral-800 p-2 rounded" />
            <input value={carForm.engine} onChange={(e) => setCarForm({ ...carForm, engine: e.target.value })} placeholder="Moteur" className="bg-neutral-800 p-2 rounded" />
            <input value={carForm.power} onChange={(e) => setCarForm({ ...carForm, power: e.target.value })} placeholder="Puissance" className="bg-neutral-800 p-2 rounded" />
            <input value={carForm.fuelType} onChange={(e) => setCarForm({ ...carForm, fuelType: e.target.value })} placeholder="Type de carburant" className="bg-neutral-800 p-2 rounded" />
            <input type="number" step="0.01" value={carForm.milage} onChange={(e) => setCarForm({ ...carForm, milage: e.target.value })} placeholder="Kilometrage" className="bg-neutral-800 p-2 rounded" />
            <input type="number" value={carForm.price} onChange={(e) => setCarForm({ ...carForm, price: e.target.value })} placeholder="Prix" className="bg-neutral-800 p-2 rounded" />
            <input type="number" value={carForm.wholesale_price} onChange={(e) => setCarForm({ ...carForm, wholesale_price: e.target.value })} placeholder="Prix Gros" className="bg-neutral-800 p-2 rounded" />
            <input type="number" value={carForm.quantity} onChange={(e) => setCarForm({ ...carForm, quantity: e.target.value })} placeholder="quantité" className="bg-neutral-800 p-2 rounded" />
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
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={(e) => setCarForm({ ...carForm, imageFiles: Array.from(e.target.files) })} 
                className="hidden" 
              />
              Upload Images
            </label>
            {carForm.imageFiles && carForm.imageFiles.length > 0 && (
              <span className="text-sm text-neutral-400">{carForm.imageFiles.length} fichier(s) sélectionné(s)</span>
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
            <input autoFocus type="text" name="name" placeholder="Name" value={CommercialForm.name} onChange={handleChange} className="bg-neutral-800 p-2 rounded" required />
            <input type="text" name="surname" placeholder="Surname" value={CommercialForm.surname} onChange={handleChange} className="bg-neutral-800 p-2 rounded" required />
            <input type="text" name="phone_number" placeholder="Phone Number" value={CommercialForm.phone_number} onChange={handleChange} className="bg-neutral-800 p-2 rounded" required />
            <input 
              type="text" 
              name="wilayas" 
              placeholder="Wilayas (e.g. Algiers, Oran)" 
              value={CommercialForm.wilayas.join(', ')} 
              onChange={handleChange} 
              className="bg-neutral-800 p-2 rounded" 
              required 
            />
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

      <Modal open={showAddMarketer} onClose={() => setShowAddMarketer(false)} title={marketerForm.marketer_id ? "Edit Marketer" : "Add Marketer"}>
        <form onSubmit={handleMarketerSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input autoFocus type="text" placeholder="Name" value={marketerForm.name} onChange={(e) => setMarketerForm({ ...marketerForm, name: e.target.value })} className="bg-neutral-800 p-2 rounded" required />
            <input type="text" placeholder="Surname" value={marketerForm.surname} onChange={(e) => setMarketerForm({ ...marketerForm, surname: e.target.value })} className="bg-neutral-800 p-2 rounded" required />
            <input type="text" placeholder="Phone Number" value={marketerForm.phone_number} onChange={(e) => setMarketerForm({ ...marketerForm, phone_number: e.target.value })} className="bg-neutral-800 p-2 rounded" required />
            <input type="text" placeholder="Address" value={marketerForm.address} onChange={(e) => setMarketerForm({ ...marketerForm, address: e.target.value })} className="bg-neutral-800 p-2 rounded" required />
          </div>
          {marketerMessage && <p className={`text-sm ${marketerMessage.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{marketerMessage}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddMarketer(false)} className="px-4 py-2 rounded bg-neutral-800/60">Cancel</button>
            <button type="submit" disabled={marketerLoading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
              {marketerLoading ? 'Saving...' : marketerForm.marketer_id ? 'Update Marketer' : 'Add Marketer'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={showAddAccountant} onClose={() => setShowAddAccountant(false)} title={accountantForm.accountant_id ? "Edit Accountant" : "Add Accountant"}>
        <form onSubmit={handleAccountantSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input autoFocus type="text" placeholder="Name" value={accountantForm.name} onChange={(e) => setAccountantForm(prev => ({ ...prev, name: e.target.value }))} className="bg-neutral-800 p-2 rounded" required />
            <input type="text" placeholder="Surname" value={accountantForm.surname} onChange={(e) => setAccountantForm(prev => ({ ...prev, surname: e.target.value }))} className="bg-neutral-800 p-2 rounded" required />
            <input type="text" placeholder="Phone Number" value={accountantForm.phone_number} onChange={(e) => setAccountantForm(prev => ({ ...prev, phone_number: e.target.value }))} className="bg-neutral-800 p-2 rounded" required />
            <input type="text" placeholder="Address" value={accountantForm.address} onChange={(e) => setAccountantForm(prev => ({ ...prev, address: e.target.value }))} className="bg-neutral-800 p-2 rounded" required />
          </div>
          {accountantMessage && <p className={`text-sm ${accountantMessage.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{accountantMessage}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddAccountant(false)} className="px-4 py-2 rounded bg-neutral-800/60">Cancel</button>
            <button type="submit" disabled={accountantLoading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
              {accountantLoading ? 'Saving...' : accountantForm.accountant_id ? 'Update Accountant' : 'Add Accountant'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ✅ Wholesale Client Modal */}
      <Modal 
        open={showAddWholesaleClient} 
        onClose={() => setShowAddWholesaleClient(false)} 
        title={wholesaleClientForm.client_id ? "Edit Wholesale Client" : "Add Wholesale Client"}
      >
        <form onSubmit={handleWholesaleClientSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input 
              autoFocus
              type="text" 
              placeholder="Name" 
              value={wholesaleClientForm.name} 
              onChange={(e) => setWholesaleClientForm({ ...wholesaleClientForm, name: e.target.value })} 
              className="bg-neutral-800 p-2 rounded" 
              required 
            />
            <input 
              type="text" 
              placeholder="Surname" 
              value={wholesaleClientForm.surname} 
              onChange={(e) => setWholesaleClientForm({ ...wholesaleClientForm, surname: e.target.value })} 
              className="bg-neutral-800 p-2 rounded" 
              required 
            />
            <input 
              type="text" 
              placeholder="Phone Number" 
              value={wholesaleClientForm.phone_number} 
              onChange={(e) => setWholesaleClientForm({ ...wholesaleClientForm, phone_number: e.target.value })} 
              className="bg-neutral-800 p-2 rounded" 
              required 
            />
            <input 
              type="text" 
              placeholder="Company Name" 
              value={wholesaleClientForm.company_name} 
              onChange={(e) => setWholesaleClientForm({ ...wholesaleClientForm, company_name: e.target.value })} 
              className="bg-neutral-800 p-2 rounded" 
              required 
            />
            <input 
              type="text" 
              placeholder="Address" 
              value={wholesaleClientForm.address} 
              onChange={(e) => setWholesaleClientForm({ ...wholesaleClientForm, address: e.target.value })} 
              className="bg-neutral-800 p-2 rounded" 
              required 
            />
          </div>
          {wholesaleClientMessage && (
            <p className={`text-sm ${wholesaleClientMessage.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
              {wholesaleClientMessage}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setShowAddWholesaleClient(false)} 
              className="px-4 py-2 rounded bg-neutral-800/60"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={wholesaleClientLoading} 
              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
            >
              {wholesaleClientLoading 
                ? 'Saving...' 
                : wholesaleClientForm.client_id 
                  ? 'Update Client' 
                  : 'Add Client'}
            </button>
          </div>
        </form>
      </Modal>
      
      {/* ✅ Client Order Modal */}
      <Modal
        open={showAddOrder}
        onClose={() => setShowAddOrder(false)}
        title={orderForm.order_id ? "Edit Order" : "Add Order"}
      >
        <form onSubmit={handleOrderSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              autoFocus
              value={orderForm.client_id}
              onChange={(e) => setOrderForm({ ...orderForm, client_id: e.target.value })}
              className="bg-neutral-800 p-2 rounded"
              required
            >
              <option value="">Select Client *</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.surname}
                </option>
              ))}
            </select>

            <select
              value={orderForm.car_id}
              onChange={(e) => setOrderForm({ ...orderForm, car_id: e.target.value })}
              className="bg-neutral-800 p-2 rounded"
              required
            >
              <option value="">Select Car *</option>
              {cars.map(c => (
                <option key={c.id} value={c.id}>
                  {c.model} #{c.id} ({c.color}, {c.year}) — {c.price ? `${c.price} DZD` : '?'}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantity"
              min="1"
              value={orderForm.quantity}
              onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
              className="bg-neutral-800 p-2 rounded"
              required
            />

            <select
              value={orderForm.delivery_status}
              onChange={(e) => setOrderForm({ ...orderForm, delivery_status: e.target.value })}
              className="bg-neutral-800 p-2 rounded"
            >
              <option value="shipping">🚚 Shipping</option>
              <option value="arrived">📦 Arrived</option>
              <option value="showroom">🏬 In Showroom</option>
            </select>
          </div>
          {orderMessage && (
            <p className={`text-sm ${orderMessage.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{orderMessage}</p>
          )}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddOrder(false)} className="px-4 py-2 rounded bg-neutral-800/60">Cancel</button>
            <button type="submit" disabled={orderLoading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
              {orderLoading ? 'Saving...' : orderForm.order_id ? 'Update Order' : 'Add Order'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ✅ Wholesale Order Modal */}
      <Modal 
        open={showAddWholesaleOrder} 
        onClose={() => setShowAddWholesaleOrder(false)} 
        title={wholesaleOrderForm.order_id ? "Edit Wholesale Order" : "Add Wholesale Order"}
      >
        <form onSubmit={handleWholesaleOrderSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select 
              value={wholesaleOrderForm.client_id} 
              onChange={(e) => setWholesaleOrderForm({ ...wholesaleOrderForm, client_id: e.target.value })}
              className="bg-neutral-800 p-2 rounded" 
              required
            >
              <option value="">Select Client *</option>
              {wholesaleClients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.surname} ({c.company_name})
                </option>
              ))}
            </select>
            <select 
              value={wholesaleOrderForm.car_id} 
              onChange={(e) => setWholesaleOrderForm({ ...wholesaleOrderForm, car_id: e.target.value })}
              className="bg-neutral-800 p-2 rounded" 
              required
            >
              <option value="">Select Car *</option>
              {cars.map(c => (
                <option key={c.id} value={c.id}>
                  {c.model} #{c.id} ({c.color}, {c.year}) — {c.wholesale_price ? `${c.wholesale_price} DZD` : '?'} 
                </option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="Quantity" 
              min="1"
              value={wholesaleOrderForm.quantity} 
              onChange={(e) => setWholesaleOrderForm({ ...wholesaleOrderForm, quantity: e.target.value })}
              className="bg-neutral-800 p-2 rounded" 
              required 
            />
            <select 
              value={wholesaleOrderForm.delivery_status} 
              onChange={(e) => setWholesaleOrderForm({ ...wholesaleOrderForm, delivery_status: e.target.value })}
              className="bg-neutral-800 p-2 rounded"
            >
              <option value="shipping">🚚 Shipping</option>
              <option value="arrived">📦 Arrived</option>
              <option value="showroom">🏬 In Showroom</option>
            </select>
          </div>
          {wholesaleOrderMessage && (
            <p className={`text-sm ${wholesaleOrderMessage.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
              {wholesaleOrderMessage}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setShowAddWholesaleOrder(false)} 
              className="px-4 py-2 rounded bg-neutral-800/60"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={wholesaleOrderLoading} 
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              {wholesaleOrderLoading 
                ? 'Saving...' 
                : wholesaleOrderForm.order_id 
                  ? 'Update Order' 
                  : 'Add Order'}
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

      {/* ✅ Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded-2xl w-full max-w-md border border-neutral-700">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-white">
                  {passwordModalType === "commercial" && "Identifiants du Commercial"}
                  {passwordModalType === "marketer" && "Identifiants du Marketer"}
                  {passwordModalType === "accountant" && "Identifiants de l'Accountant"}
                  {passwordModalType === "wholesale_client" && "Identifiants du Client Gros"}
                </h2>
                <button onClick={() => setShowPasswordModal(false)} className="text-neutral-400 hover:text-white text-2xl">&times;</button>
              </div>
              <p className="text-neutral-300 text-sm mb-4">
                {passwordModalType === "commercial" && "Le commercial peut se connecter avec ces identifiants :"}
                {passwordModalType === "marketer" && "Le marketer peut se connecter avec ces identifiants :"}
                {passwordModalType === "accountant" && "L'accountant peut se connecter avec ces identifiants :"}
                {passwordModalType === "wholesale_client" && "Le client en gros peut se connecter avec ces identifiants :"}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-400">Téléphone</label>
                  <code className="block mt-1 bg-neutral-900 px-3 py-2.5 rounded font-mono text-emerald-400">
                    {userPhoneForPassword}
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
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 px-4 rounded-r font-medium"
                      title="Copier"
                    >
                      📋
                    </button>
                  </div>
                  <p className="text-xs text-yellow-400 mt-2">⚠️ Ce mot de passe ne sera plus affiché après fermeture.</p>
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
    </div>
  );
}