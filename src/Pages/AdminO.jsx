import React, { useState, useEffect } from "react";
import { parseColors } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Car,
  Users,
  CreditCard,
  FilePlus,
  Trash2,
  Share2,
  Edit2,
  TrendingUp,
  TrendingDown,
  Clock,
  X,
  Package,
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

// ✅ FIXED: Now supports editable cars with full form
const CommercialCarsModal = ({ 
  open, 
  onClose, 
  commercial, 
  cars, 
  suppliers, 
  currencyList,
  supplierItems,
  onCarUpdate,
  onCarDelete
}) => {
  const [editingCarId, setEditingCarId] = useState(null);
  const [editCarForm, setEditCarForm] = useState(null);

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

const handleEditCar = (car) => {
    setEditingCarId(car.id);
    setEditCarForm({
      car_id: car.id,
      currency_id: car.currency_id || "",
      model: car.model || "",
      description: car.description || "",
      color: Array.isArray(car.color) ? car.color.join(", ") : (car.color || ""),
      year: car.year || "",
      engine: car.engine || "",
      power: car.power || "",
      fuel_type: car.fuel_type || "",
      milage: car.milage || "",
      country: car.country || "",
      quantity: car.quantity || "",
      price: car.price || "",
      wholesale_price: car.wholesale_price || "",
      shipping_date: car.shipping_date || "",
      arriving_date: car.arriving_date || "",
      images: [],
    });
  };


  const handleEditCarChange = (e) => {
    setEditCarForm({ ...editCarForm, [e.target.name]: e.target.value });
  };

  const handleSaveCarEdit = async () => {
    if (!editCarForm) return;
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("car_id", editCarForm.car_id);
      formDataToSend.append("currency_id", editCarForm.currency_id || "");
      formDataToSend.append("model", editCarForm.model || "");
      formDataToSend.append("description", editCarForm.description || "");
      
      // ✅ FIX: Handle colors as array
      const colorsArray = editCarForm.color.split(',').map(c => c.trim()).filter(c => c);
      colorsArray.forEach(color => {
        formDataToSend.append("color", color);
      });
      
      formDataToSend.append("year", editCarForm.year || "");
      formDataToSend.append("engine", editCarForm.engine || "");
      formDataToSend.append("power", editCarForm.power || "");
      formDataToSend.append("fuel_type", editCarForm.fuel_type || "");
      formDataToSend.append("milage", editCarForm.milage || "");
      formDataToSend.append("country", editCarForm.country || "");
      formDataToSend.append("quantity", editCarForm.quantity || "");
      formDataToSend.append("price", editCarForm.price || "");
      formDataToSend.append("wholesale_price", editCarForm.wholesale_price || "");
      formDataToSend.append("shipping_date", editCarForm.shipping_date || "");
      formDataToSend.append("arriving_date", editCarForm.arriving_date || "");
      editCarForm.images.forEach(file => {
        formDataToSend.append("images", file);
      });

      const response = await apiFetch(`https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com/cars/`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Car updated successfully!");
        setEditingCarId(null);
        setEditCarForm(null);
        onCarUpdate?.();
      } else {
        alert("Failed to update car");
      }
    } catch (error) {
      console.error("Edit error:", error);
      alert("Error updating car");
    }
  };

  const handleCancelEdit = () => {
    setEditingCarId(null);
    setEditCarForm(null);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative z-10 w-full max-w-4xl bg-neutral-900 rounded-2xl border border-neutral-800 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-neutral-900/95 p-6 border-b border-neutral-800">
              <h3 className="text-2xl font-semibold">
                Cars Sold by {commercial.name} {commercial.surname}
              </h3>
              <button onClick={onClose} className="p-2 rounded hover:bg-white/5">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {soldCars.length === 0 ? (
                <div className="text-center py-8 text-neutral-400">
                  <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No cars sold yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {soldCars.map((car) => {
                    if (editingCarId === car.id && editCarForm) {
                      // Edit Form
                      return (
                        <div key={car.id} className="bg-neutral-800/50 rounded-xl p-6 border border-emerald-500/30">
                          <h4 className="text-lg font-semibold text-emerald-400 mb-4">Edit Car #{car.id}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            <select
                              name="currency_id"
                              value={editCarForm.currency_id}
                              onChange={handleEditCarChange}
                              className="bg-neutral-700 p-2 rounded text-sm"
                            >
                              <option value="">Select Currency</option>
                              {currencyList.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name} ({c.code})
                                </option>
                              ))}
                            </select>
                            <input name="model" value={editCarForm.model} onChange={handleEditCarChange} placeholder="Model" className="bg-neutral-700 p-2 rounded text-sm" />
                            <input name="description" value={editCarForm.description} onChange={handleEditCarChange} placeholder="Description" className="bg-neutral-700 p-2 rounded text-sm" />
                            <input name="color" value={editCarForm.color} onChange={handleEditCarChange} placeholder="Colors (comma-separated)" className="bg-neutral-700 p-2 rounded text-sm" />
                            <input name="year" type="number" value={editCarForm.year} onChange={handleEditCarChange} placeholder="Year" className="bg-neutral-700 p-2 rounded text-sm" />
                            <input name="engine" value={editCarForm.engine} onChange={handleEditCarChange} placeholder="Engine" className="bg-neutral-700 p-2 rounded text-sm" />
                            <input name="power" value={editCarForm.power} onChange={handleEditCarChange} placeholder="Power" className="bg-neutral-700 p-2 rounded text-sm" />
                            <input name="fuel_type" value={editCarForm.fuel_type} onChange={handleEditCarChange} placeholder="Fuel Type" className="bg-neutral-700 p-2 rounded text-sm" />
                            <input name="milage" type="number" step="0.01" value={editCarForm.milage} onChange={handleEditCarChange} placeholder="Mileage" className="bg-neutral-700 p-2 rounded text-sm" />
                            <input name="quantity" type="number" value={editCarForm.quantity} onChange={handleEditCarChange} placeholder="Quantity" className="bg-neutral-700 p-2 rounded text-sm" />
                            <input name="country" value={editCarForm.country} onChange={handleEditCarChange} placeholder="Country" className="bg-neutral-700 p-2 rounded text-sm" />
                            <input name="price" type="number" step="0.01" value={editCarForm.price} onChange={handleEditCarChange} placeholder="Price" className="bg-neutral-700 p-2 rounded text-sm" />
                            <input name="wholesale_price" type="number" step="0.01" value={editCarForm.wholesale_price} onChange={handleEditCarChange} placeholder="Wholesale Price" className="bg-neutral-700 p-2 rounded text-sm" />
                            <input name="shipping_date" type="date" value={editCarForm.shipping_date} onChange={handleEditCarChange} className="bg-neutral-700 p-2 rounded text-sm" />
                            <input name="arriving_date" type="date" value={editCarForm.arriving_date} onChange={handleEditCarChange} className="bg-neutral-700 p-2 rounded text-sm" />
                          </div>
                          <div className="mb-4">
                            <label className="block text-xs text-neutral-400 mb-2">Add/Update Images (optional)</label>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files);
                                setEditCarForm(prev => ({ ...prev, images: files }));
                              }}
                              className="w-full bg-neutral-700 text-sm p-2 rounded file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-emerald-600 file:text-white"
                            />
                            {editCarForm.images.length > 0 && (
                              <p className="text-xs text-neutral-400 mt-2">{editCarForm.images.length} image(s) selected</p>
                            )}
                          </div>
                          <div className="flex justify-end gap-2">
                            <button onClick={handleCancelEdit} className="px-3 py-1.5 rounded bg-neutral-700 text-sm hover:bg-neutral-600">
                              Cancel
                            </button>
                            <button onClick={handleSaveCarEdit} className="px-3 py-1.5 rounded bg-emerald-600 text-sm hover:bg-emerald-700">
                              Save Changes
                            </button>
                          </div>
                        </div>
                      );
                    }

                    // Display View
                    const itemsForCar = supplierItems.filter(item => item.car_id === car.id);
                    const carCurrency = currencyList.find(c => c.id === car.currency_id);
                    const salePriceDZD = (car.price || 0) * (carCurrency?.exchange_rate_to_dzd || 1);
                    const displayColor = Array.isArray(car.color) ? car.color.join(', ') : car.color;

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
                                <span className="text-neutral-400">Colors:</span>
                                <span>{displayColor || 'N/A'}</span>
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
                        <div className="mt-4 pt-4 border-t border-neutral-700 flex justify-between items-center">
                          <div className="flex flex-wrap gap-2">
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">ID: {car.id}</span>
                            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">Country: {car.country || 'N/A'}</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleEditCar(car)} className="text-emerald-400 hover:text-emerald-300 text-sm px-2 py-1 rounded bg-emerald-500/10">
                              Edit
                            </button>
                            <button onClick={() => onCarDelete?.(car.id)} className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded bg-red-500/10">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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

// ✅ Centralized Auth-Aware Fetch (handles both JSON and FormData)
const apiFetch = async (url, options = {}) => {
  try {
    const token = localStorage.getItem("authToken");
    const headers = {
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...options.headers,
    };
    
    // Only set Content-Type for JSON, not for FormData (let browser handle it)
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    
    const response = await fetch(url, { 
      ...options, 
      headers,
      timeout: 30000 
    });
    
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/adminlogin";
      throw new Error("Unauthorized");
    }
    return response;
  } catch (error) {
    console.error("API Fetch Error:", {
      url,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};

export default function AdminSuperPanel() {
  const API_BASE = 'https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com';
  const [showEditOrder, setShowEditOrder] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [passwordModalType, setPasswordModalType] = useState(null);
  const [userPhoneForPassword, setUserPhoneForPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingSupplierItem, setEditingSupplierItem] = useState({});
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
  const [socials , setSocials] = useState([]);
  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/social_links/`); 
        const data = await response.json();
        setSocials(data);
      } 
      catch (err) {
        console.error("Error fetching social links:", err);
      }
    }
    fetchSocials();
  }
  ), [];
  const [socialsform , setSocialsform] = useState({
    facebook:"" , instagram:"" , whatsapp:""});
  
  const handleSocialsChange = (e) => {
    setSocialsform({ ...socialsform, [e.target.name]: e.target.value });
  }; 
  
  const SubmitSocials = async (e) => {
    e.preventDefault();
    try {
      const response = await apiFetch(`${API_BASE}/social_links/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialsform)
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ API Error:", errorData);
        throw new Error(errorData.detail || "Failed to update social links");
      }
      alert("✅ Social links updated successfully!");
    } catch (err) {
      console.error("Update social links error:", err);
      alert(`❌ Error: ${err.message}`);
    }
  };
  const [showAddCar, setShowAddCar] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  
  const initialCarForm = {
    model: "", 
    description: "",
    color: "", 
    year: "", 
    engine: "", 
    power: "", 
    fuelType: "", 
    milage: "",
    country: "", 
    price: "", 
    wholesale_price: "", 
    shippingDate: "", 
    arrivingDate: "",
    currency_id: "", 
    quantity: "", 
    imageFiles: [],
  };
  
  const [carForm, setCarForm] = useState(initialCarForm);
  const [CommercialForm, setCommercialForm] = useState({
    name: "", surname: "", phone_number: "", wilayas: [], address: ""
  });
  const [showAddCommercial, setShowAddCommercial] = useState(false);
  const [message, setMessage] = useState("");
  const [commercialLoading, setCommercialLoading] = useState(false);
  
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
  const [showEditAccountant, setShowEditAccountant] = useState(false);
  const [accountantLoading, setAccountantLoading] = useState(false);
  const [accountantMessage, setAccountantMessage] = useState("");
  const [wholesaleClients, setWholesaleClients] = useState([]);
  const [wholesaleOrders, setWholesaleOrders] = useState([]);

  const [wholesaleClientForm, setWholesaleClientForm] = useState({
    name: "", surname: "", phone_number: "", address: "", company_name: ""
  });
  const [wholesaleOrderForm, setWholesaleOrderForm] = useState({
    client_id: "", car_id: "", quantity: 1, delivery_status: "shipping"
  });

  const [showAddWholesaleClient, setShowAddWholesaleClient] = useState(false);
  const [showAddWholesaleOrder, setShowAddWholesaleOrder] = useState(false);
  const [showEditWholesaleOrder, setShowEditWholesaleOrder] = useState(false);
  const [showAddOrder , setShowAddOrder] = useState (false);
  
  // ✅ FIX: Updated client form with nin and passport_number
  const [clientForm, setClientForm] = useState({
    id: null,
    name: "", 
    surname: "", 
    nin: "", 
    passport_number: "",
    phone_number: "", 
    password: "", 
    wilaya: "", 
    address: ""
  });
  
  const [showEditClient, setShowEditClient] = useState(false);
  
  const pushLog = (actor, action) => {
    setLogs((p) => [{ id: Date.now(), actor, action, date: new Date().toISOString() }, ...p]);
  };
  
  const [orderForm, setOrderForm] = useState({
    id: null,
    client_id: "",
    car_id: "",
    car_color: "",
    delivery_status: "shipping",
    payment_amount: 0,
    status: true,
  });

  const [supplierItemForm, setSupplierItemForm] = useState({
    car_id: "",
    supplier_id: "",
    currency_id: "",
    price: 0
  });
  
  const getSupplierName = (supplierId) => {
    const supplier = fournisseurs.find(s => s.id === supplierId);
    return supplier ? `${supplier.name} ${supplier.surname}` : 'Unknown';
  };

  const handleAddSupplierItem = async (e) => {
    e.preventDefault();
    const { car_id, supplier_id, currency_id, price } = supplierItemForm;

    if (!car_id || !supplier_id || !currency_id || price === null || price === undefined) {
      alert("⚠️ All fields are required for adding a supplier item");
      return;
    }

    console.log("📦 Adding supplier item:", { car_id, supplier_id, currency_id, price });

    try {
      const response = await apiFetch(`${API_BASE}/suppliers_items/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_id: Number(car_id),
          supplier_id: Number(supplier_id),
          currency_id: Number(currency_id),
          price: Number(price)
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ API Error:", errorData);
        throw new Error(errorData.detail || "Failed to add supplier item");
      }

      setShowAddSupplierItem(false);
      setSupplierItemForm({ car_id: "", supplier_id: "", currency_id: "", price: 0 });
      pushLog("Admin", `Added new supplier item for car #${car_id} from supplier #${supplier_id}`);
      alert("✅ Supplier item added successfully!");
    } catch (err) {
      console.error("Add supplier item error:", err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [transactionStats, setTransactionStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netBalance: 0
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoadingTransactions(true);
      try {
        const enrichedTransactions = [];
        
        orders.forEach(order => {
          const client = clients.find(c => c.id === order.client_id);
          const car = cars.find(c => c.id === order.car_id);
          const currency = currencyList.find(c => c.id === car?.currency_id);
          const rate = currency?.exchange_rate_to_dzd || 1;
          const amount = (car?.price || 0) * rate;
          
          enrichedTransactions.push({
            id: `ORD-${order.order_id || order.id}`,
            type: 'order',
            description: `${car?.model || 'Car'} - ${car?.color}`,
            party_name: client ? `${client.name} ${client.surname}` : 'Unknown Client',
            amount: order.payment_amount || amount,
            status: order.payment_amount >= amount ? 'paid' : order.payment_amount > 0 ? 'partial' : 'unpaid',
            date: order.created_at || new Date().toISOString()
          });
        });
        
        wholesaleOrders.forEach(order => {
          const client = wholesaleClients.find(c => c.id === order.client_id);
          const car = cars.find(c => c.id === order.car_id);
          const currency = currencyList.find(c => c.id === car?.currency_id);
          const rate = currency?.exchange_rate_to_dzd || 1;
          const amount = (car?.wholesale_price || car?.price || 0) * order.quantity * rate;
          
          enrichedTransactions.push({
            id: `WHO-${order.order_id || order.id}`,
            type: 'wholesale',
            description: `${car?.model || 'Car'} x${order.quantity}`,
            party_name: client ? `${client.company_name || client.name}` : 'Unknown Client',
            amount: order.payment_amount || amount,
            status: order.payment_amount >= amount ? 'paid' : order.payment_amount > 0 ? 'partial' : 'unpaid',
            date: order.created_at || new Date().toISOString()
          });
        });
        
        supplierItems.forEach(item => {
          const supplier = fournisseurs.find(s => s.id === item.supplier_id);
          const car = cars.find(c => c.id === item.car_id);
          const currency = currencyList.find(c => c.id === item.currency_id);
          const rate = currency?.exchange_rate_to_dzd || 1;
          const totalCost = (item.price || 0) * rate;
          
          enrichedTransactions.push({
            id: `SUP-${item.supplier_item_id}`,
            type: 'supplier',
            description: `${car?.model || 'Car'} - Achat`,
            party_name: supplier ? `${supplier.name} ${supplier.surname}` : 'Unknown Supplier',
            amount: item.payment_amount || 0,
            status: item.payment_amount >= totalCost ? 'paid' : item.payment_amount > 0 ? 'partial' : 'unpaid',
            date: item.created_at || new Date().toISOString()
          });
        });
        
        enrichedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setTransactions(enrichedTransactions);
        
        const revenue = enrichedTransactions
          .filter(t => t.type === 'order' || t.type === 'wholesale')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = enrichedTransactions
          .filter(t => t.type === 'supplier')
          .reduce((sum, t) => sum + t.amount, 0);
        
        setTransactionStats({
          totalRevenue: revenue,
          totalExpenses: expenses,
          netBalance: revenue - expenses
        });
        
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setTransactions([]);
      } finally {
        setLoadingTransactions(false);
      }
    };
    
    if (orders.length || wholesaleOrders.length || supplierItems.length) {
      fetchTransactions();
    }
  }, [orders, wholesaleOrders, supplierItems, clients, wholesaleClients, cars, fournisseurs, currencyList]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${API_BASE}/orders/`;
      const payload = {
        client_id: Number(orderForm.client_id),
        car_id: Number(orderForm.car_id),
        car_color: String(orderForm.car_color),
        delivery_status: String(orderForm.delivery_status),
      };
      
      if (!payload.client_id || isNaN(payload.client_id)) {
        throw new Error("Veuillez sélectionner un client");
      }
      if (!payload.car_id || isNaN(payload.car_id)) {
        throw new Error("Veuillez sélectionner une voiture");
      }
      if (!payload.car_color) {
        throw new Error("Veuillez spécifier une couleur");
      }
      
      console.log("📤 Submitting order payload:", payload);
      
      const response = await apiFetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ API Error:", errorData);
        throw new Error(errorData.detail || "Erreur lors de l'ajout");
      }
      
      const data = await response.json();
      console.log("✅ Order created:", data);
      
      setShowAddOrder(false);
      setOrderForm({
        id: null,
        client_id: "",
        car_id: "",
        car_color: "",
        delivery_status: "shipping",
        payment_amount: 0,
        status: true,
      });
      
      console.log("🔄 Refreshing orders list...");
      const freshResponse = await apiFetch(`${API_BASE}/orders/`);
      if (freshResponse.ok) {
        const fresh = await freshResponse.json();
        console.log("✅ Orders refreshed, count:", fresh.length);
        setOrders(Array.isArray(fresh) ? fresh : [])
      } else {
        console.error("❌ Failed to refresh orders")
      }
      
      alert("✅ Commande ajoutée avec succès!")
    } catch (error) {
      console.error("❌ Error in handleOrderSubmit:", error);
      alert(error.message || "Erreur lors de l'ajout de la commande")
    }
  };

  const [showAddSupplierItem, setShowAddSupplierItem] = useState(false);

  const handleEditOrAddSupplierItem = (item = null) => {
    if (item) {
      setEditingSupplierItem(prev => ({
        ...prev,
        [item.supplier_item_id]: { price: item.price, payment_amount: item.payment_amount }
      }));
    } else {
      setSupplierItemForm({ car_id: "", supplier_id: "", currency_id: "", price: 0 });
      setShowAddSupplierItem(true);
    }
  };

  const handleDeleteSupplierItem = async (id) => {
    if (!window.confirm("Supprimer cet élément fournisseur ?")) return;
    try {
      const url = `${API_BASE}/suppliers_items/?supplier_item_id=${id}`;
      await apiFetch(url, { method: "DELETE" });
      pushLog("Admin", `Deleted supplier item #${id}`);
      alert("Deleted supplier item successfully ✅");
    } catch (err) {
      console.error("Erreur de suppression élément fournisseur:", err);
      alert(`❌ Error deleting supplier item: ${err.message}`);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm("Delete order?")) return;
    try {
      await apiFetch(`${API_BASE}/orders/?order_id=${id}`, { method: "DELETE" });
      setOrders(prev => prev.filter(o => o.order_id !== id));
    } catch (err) { 
      alert("Delete failed"); 
    }
  };

  const [carRequests, setCarRequests] = useState([]);
  
  useEffect(() => {
    const fetchCarRequests = async () => {
      try {
        const res = await apiFetch(`${API_BASE}/cars_requests/`);
        const data = await res.json();
        setCarRequests(Array.isArray(data) ? data : []);
      } catch (err) { 
        console.error("Car requests fetch error:", err); 
      }
    };
    fetchCarRequests();
  }, []);

  useEffect(() => {
    const fetchWholesaleClients = async () => {
      try {
        const res = await apiFetch(`${API_BASE}/wholesale_clients/`);
        const data = await res.json();
        setWholesaleClients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching wholesale clients:", err);
        setWholesaleClients([]);
      }
    };
    fetchWholesaleClients();
  }, []);

  const fetchWholesaleOrders = async () => {
    console.log("🔄 Starting fetchWholesaleOrders...");
    try {
      const url = `${API_BASE}/wholesale_orders/`;
      console.log("📍 Fetching from URL:", url);
      
      const res = await apiFetch(url);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Response not OK:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      const text = await res.text();
      const data = JSON.parse(text);
      
      if (Array.isArray(data)) {
        setWholesaleOrders(data);
      } else {
        setWholesaleOrders([]);
      }
    } catch (err) {
      setWholesaleOrders([]);
    }
  };

  useEffect(() => {
    fetchWholesaleOrders();
  }, []);

  const handleWholesaleClientSubmit = async (e) => {
    e.preventDefault();
    try {
      const isUpdate = !!wholesaleClientForm.id;
      const url = `${API_BASE}/wholesale_clients/`;
      const payload = {
        name: wholesaleClientForm.name,
        surname: wholesaleClientForm.surname,
        phone_number: wholesaleClientForm.phone_number,
        address: wholesaleClientForm.address,
        company_name: wholesaleClientForm.company_name,
      };

      if (isUpdate) {
        payload.id = wholesaleClientForm.id;
      }

      const res = await apiFetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.detail || "Failed to save wholesale client");
      }

      const fresh = await apiFetch(`${API_BASE}/wholesale_clients/`).then(r => r.json());
      setWholesaleClients(Array.isArray(fresh) ? fresh : []);

      if (!isUpdate) {
        let password = "";
        if (responseData.password) {
          password = responseData.password;
        } else if (responseData.detail?.includes("password:")) {
          password = responseData.detail.split("password:")[1]?.trim();
        }

        if (password) {
          setTempPassword(password);
          setUserPhoneForPassword(wholesaleClientForm.phone_number);
          setPasswordModalType("wholesale_client");
          setShowPasswordModal(true);
        } else {
          console.warn("Password not found in response for wholesale client", responseData);
        }
      }

      setWholesaleClientForm({ name: "", surname: "", phone_number: "", address: "", company_name: "" });
      setShowAddWholesaleClient(false);
      alert(`${isUpdate ? "Updated" : "Added"} wholesale client ✅`);

    } catch (err) {
      console.error("Wholesale client error:", err);
      alert("❌ " + (err.message || "Unknown error"));
    }
  };

  const handleDeleteWholesaleClient = async (id) => {
    if (!confirm("Delete this wholesale client?")) return;
    try {
      await apiFetch(`${API_BASE}/wholesale_clients/?client_id=${id}`, { method: "DELETE" });
      setWholesaleClients(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting wholesale client:", err);
      alert("❌ Failed to delete");
    }
  };

  const handleDeleteWholesaleOrder = async (id) => {
    if (!confirm("Delete this wholesale order?")) return;
    try {
      await apiFetch(`${API_BASE}/wholesale_orders/?order_id=${id}`, { method: "DELETE" });
      setWholesaleOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error("Error deleting wholesale order:", err);
      alert("❌ Failed to delete");
    }
  };

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

  const handleWholesaleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("wholesaleOrderForm avant validation:", wholesaleOrderForm);

      const clientId = Number(wholesaleOrderForm.client_id);
      if (isNaN(clientId) || clientId <= 0) {
        throw new Error("ID client invalide");
      }

      const carId = Number(wholesaleOrderForm.car_id);
      if (isNaN(carId) || carId <= 0) {
        throw new Error("ID voiture invalide");
      }

      const quantity = Number(wholesaleOrderForm.quantity);
      if (isNaN(quantity) || quantity < 1) {
        throw new Error("Quantité invalide");
      }

      const isUpdate = !!wholesaleOrderForm.id;
      const method = isUpdate ? 'PUT' : 'POST';
      const url = `${API_BASE}/wholesale_orders/`;

      let payload;
      
      if (isUpdate) {
        const orderId = Number(wholesaleOrderForm.id);
        if (isNaN(orderId) || orderId <= 0) {
          throw new Error("ID de commande en gros invalide pour la mise à jour");
        }
        
        payload = {
          order_id: orderId,
          client_id: clientId,
          car_id: carId,
          quantity: quantity,
          delivery_status: String(wholesaleOrderForm.delivery_status),
          payment_amount: wholesaleOrderForm.payment_amount === '' ? null : Number(wholesaleOrderForm.payment_amount),
          status: Boolean(wholesaleOrderForm.status),
        };
      } else {
        payload = {
          client_id: clientId,
          car_id: carId,
          quantity: quantity,
          delivery_status: String(wholesaleOrderForm.delivery_status),
        };
      }

      console.log(`📤 Payload final à envoyer (${method}):`, payload);

      const response = await apiFetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erreur serveur:", errorText);
        throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} wholesale order: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Réponse succès API:", data);

      setShowAddWholesaleOrder(false);
      setShowEditWholesaleOrder(false);
      setWholesaleOrderForm({ 
        id: null,
        client_id: "", 
        car_id: "", 
        quantity: 1, 
        delivery_status: "shipping",
        payment_amount: 0,
        status: true
      });

      console.log("🔄 Refreshing wholesale orders...");
      await fetchWholesaleOrders();
      
      alert(`✅ Commande en gros ${isUpdate ? 'mise à jour' : 'ajoutée'} avec succès !`);

    } catch (err) {
      console.error("❌ Erreur complète dans handleWholesaleOrderSubmit:", err);
      alert("❌ Erreur: " + err.message);
    }
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await apiFetch(`${API_BASE}/cars/all`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        const data = await response.json();
        const normalized = (Array.isArray(data) ? data : []).map(car => {
          const colors = parseColors(car.color);
          return { ...car, colors, color: colors[0] || car.color };
        });
        setCars(normalized);
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

  useEffect(() => { 
    fetchFournisseurs(); 
  }, []);

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

  const handledeleteCommercial = async (id) => {
    if (!window.confirm("Delete this commercial?")) return;
    try {
      await apiFetch(`${API_BASE}/commercials/?commercial_id=${id}`, { method: "DELETE" });
      setCommercials(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting commercial:", err);
      alert("❌ Failed to delete");
    }
  }

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
            { code: "dzd", name: "Algerian Dinar" },
            { code: "eur", name: "Euro" },
            { code: "usd", name: "US Dollar" },
            { code: "cad", name: "Canadian Dollar" },
            { code: "aed", name: "UAE Dirham"},
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

  const convertToDZD = (price, currency) => {
    if (!currency || currency.toLowerCase() === 'dzd') {
      return price;
    }
    const rate = currencies[currency.toLowerCase()];
    if (!rate) {
      console.warn(`Exchange rate not found for ${currency}`);
      return price;
    }
    return price * rate;
  };

  const handleEditOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${API_BASE}/orders/`;
      const payload = {
        order_id: Number(orderForm.id),
        status: Boolean(orderForm.status),
        payment_amount: Number(orderForm.payment_amount) || null,
        delivery_status: String(orderForm.delivery_status),
      };
      
      if (!payload.order_id || isNaN(payload.order_id)) {
        throw new Error("ID de commande invalide");
      }
      if (!['shipping', 'arrived', 'showroom'].includes(payload.delivery_status)) {
        throw new Error("Statut de livraison invalide");
      }
      
      const response = await apiFetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to update order");
      }
      
      setShowEditOrder(false);
      setOrderForm({
        id: null,
        client_id: "",
        car_id: "",
        car_color: "",
        delivery_status: "shipping",
        payment_amount: 0,
        status: true,
      });
      
      alert("Commande modifiée avec succès!");
      const fresh = await apiFetch(`${API_BASE}/orders/`).then(r => r.json());
      setOrders(Array.isArray(fresh) ? fresh : []);
    } catch (error) {
      console.error("Erreur complète:", error);
      alert(error.message || "Erreur lors de la modification");
    }
  };

  const handleEditWholesaleOrder = (order) => {
    setWholesaleOrderForm({
      id: order.order_id,
      client_id: order.client_id,
      car_id: order.car_id,
      quantity: order.quantity || 1,
      delivery_status: order.delivery_status || "shipping",
      payment_amount: order.payment_amount || 0,
      status: order.status !== undefined ? order.status : true,
    });
    setShowEditWholesaleOrder(true);
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

  // ✅ FIX: Updated handleSubmitCar to handle colors as array
  const handleSubmitCar = async (e) => {
    e.preventDefault();
    if (!carForm.model || !carForm.currency_id || !carForm.quantity) {
      alert("Model, Currency, and Quantity are required");
      return;
    }
    try {
      const formData = new FormData();
      
      if (editingCar) {
        formData.append('car_id', editingCar.id);
      }
      
      formData.append('model', carForm.model);
      formData.append('description', carForm.description || "");
      
      // ✅ FIX: Handle colors as array - split comma-separated input
      const colorsArray = carForm.color.split(',').map(c => c.trim()).filter(c => c);
      colorsArray.forEach(color => {
        formData.append('color', color);
      });
      
      formData.append('year', parseInt(carForm.year) || new Date().getFullYear());
      formData.append('quantity', parseInt(carForm.quantity) || 1);
      formData.append('engine', carForm.engine);
      formData.append('power', carForm.power);
      formData.append('fuel_type', carForm.fuelType);
      formData.append('milage', parseFloat(carForm.milage) || 0);
      formData.append('country', carForm.country);
      formData.append('price', parseFloat(carForm.price) || 0);
      formData.append('wholesale_price', parseFloat(carForm.wholesale_price) || 0);
      formData.append('shipping_date', carForm.shippingDate || new Date().toISOString().split('T')[0]);
      formData.append('arriving_date', carForm.arrivingDate || new Date().toISOString().split('T')[0]);
      formData.append('currency_id', parseInt(carForm.currency_id));
      
      if (carForm.imageFiles && carForm.imageFiles.length > 0) {
        Array.from(carForm.imageFiles).forEach(file => {
          formData.append('images', file);
        });
      }
      
      const url = `${API_BASE}/cars/`;
      const method = editingCar ? 'PUT' : 'POST';

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
      setEditingCar(null);
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
    const displayColor = Array.isArray(car.color) ? car.color.join(', ') : (car.color || "");
    setCarForm({
      model: car.model || "",
      description: car.description || "",
      color: displayColor,
      year: car.year || "",
      engine: car.engine || "",
      power: car.power || "",
      fuelType: car.fuel_type || "",
      milage: car.milage || "",
      country: car.country || "",
      price: car.price || "",
      wholesale_price: car.wholesale_price || "",
      shippingDate: car.shipping_date || "",
      arrivingDate: car.arriving_date || "",
      currency_id: car.currency_id || "",
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
      setCommercialForm(prev => ({ ...prev, wilayas: value.split(/[,;\n]/).map(w => w.trim()).filter(w => w) }));
    } else {
      setCommercialForm(prev => ({ ...prev, [name]: value }));
    }
  };

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
        requestBody.commercial_id = String(CommercialForm.commercial_id);
        requestBody.password = true;
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
        requestBody.marketer_id = String(marketerForm.marketer_id);
        requestBody.password = true;
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
        requestBody.accountant_id = String(accountantForm.accountant_id);
        requestBody.password = true;
      }

      console.log("Submitting accountant:", { method: isUpdate ? "PUT" : "POST", url, requestBody });

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
      console.error("❌ Accountant Submit Error:", error);
      setAccountantMessage("⚠️ Network error: " + (error.message || "Unknown error"));
    } finally {
      setAccountantLoading(false);
    }
  };

  const handleAccountantEdit = async (e) => {
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
        method: "PUT",
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
        setShowEditAccountant(false);
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

  const saveSupplierItemEdit = async (item) => {
    try {
      const editedData = editingSupplierItem[item.supplier_item_id];
      if (!editedData) {
        console.error("Aucune donnée éditée trouvée");
        return;
      }
      
      const payload = {
        supplier_item_id: Number(item.supplier_item_id),
        supplier_id: Number(item.supplier_id) || null,
        payment_amount: Number(editedData.payment_amount) || null,
        price: Number(editedData.price) || null,
      };
      
      if (!payload.supplier_item_id || isNaN(payload.supplier_item_id)) {
        throw new Error("ID de l'item invalide");
      }
      
      const response = await apiFetch(`${API_BASE}/suppliers_items/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = "Erreur lors de la mise à jour";
        if (errorData.detail && Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join("\n");
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
        throw new Error(errorMessage);
      }
      
      setEditingSupplierItem(prev => {
        const copy = { ...prev };
        delete copy[item.supplier_item_id];
        return copy;
      });
      
      alert("✅ Mise à jour réussie!");
    } catch (error) {
      console.error("❌ Update failed:", error);
      alert("❌ " + (error.message || "Échec de la mise à jour"));
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

  const filteredTransactions = transactions.filter(transaction => {
    if (transactionFilter === 'all') return true;
    if (transactionFilter === 'orders') return transaction.type === 'order';
    if (transactionFilter === 'wholesale') return transaction.type === 'wholesale';
    if (transactionFilter === 'suppliers') return transaction.type === 'supplier';
    return true;
  });

  const handleEditOrder = (order) => {
    setOrderForm({
      id: order.order_id || order.id,
      client_id: order.client_id,
      car_id: order.car_id,
      car_color: order.car_color,
      delivery_status: order.delivery_status,
      payment_amount: order.payment_amount || 0,
      status: order.status !== undefined ? order.status : true,
    });
    setShowEditOrder(true);
  };

  return (
    <div className="min-h-screen min-w-fit font-main bg-gradient-to-br from-neutral-950 via-black to-neutral-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-20 md:w-28 z-30 min-h-screen overflow-scroll flex flex-col items-center py-6 space-y-6 border-r border-neutral-800 bg-neutral-900/70 backdrop-blur-md fixed left-0 top-0 h-full">
        {[
          { id: "overview", icon: BarChart3, label: "Overview" },
          { id: "cars", icon: Car, label: "Cars" },
          { id: "fournisseurs", icon: CreditCard, label: "Fournisseurs" },
          { id: "supplierItems", icon: Package, label: "Éléments Fournisseurs" },
          { id: "commercials", icon: Users, label: "Commercials" },
          { id: "marketers", icon: Users, label: "Marketers" },
          { id: "accountants", icon: Users, label: "Accountants" },
          { id: "wholesale_clients", icon: Users, label: "Wholesale Clients" },
          { id: "wholesale_orders", icon: FilePlus, label: "Wholesale Orders" },
          { id: "clients_orders", icon: FilePlus, label: "Clients Orders" },
          { id: "currency", icon: DollarSign, label: "Currency" },
          { id: "car_requests", icon: FilePlus, label: "Car Requests" },
          { id: "social_media", icon: Share2, label: "Social Media" },
          { id: "transactions", icon: Clock, label: "transactions" },
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
      <main className="flex-1 ml-20 md:ml-28 p-8 space-y-8 min-w-fit overflow-scroll">
        <AnimatePresence mode="wait">
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-semibold">Tableau de Bord</h1>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Stat label="Caisse" value={`${Caisse.balance} DZD`} icon={CreditCard} />
                <Earnings label="Chiffre d'affaire" monthly={`${monthlyearnings} DZD`} yearly={`${yearlyearnings} DZD`} icon={TrendingUp} />
                <Stat label="Dépenses mensuelles" value={`${expenses.total_amount} DZD`} icon={TrendingDown} />
                <Stat label="Dépenses annuelles" value={`${yearlyExpenses.total_expenses.toFixed(2)} DZD`} icon={TrendingDown} />
                <Stat label="Valeur De stock" value={`${totalStockValue.toFixed(2)} DZD`} icon={Car} />
                <Stat label="Total Voitures" value={cars.length} icon={Car} />
                <Stat label="Total Clients" value={clients.length} icon={Users} />
                <Stat label="Total Orders" value={orders.length} icon={FilePlus} />
                <Stat label="Total Fournisseurs" value={fournisseurs.length} icon={Users} />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 ">
                  <h3 className="text-lg font-semibold mb-4">Voitures Recentes</h3>
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
                              <div className="text-sm text-emerald-400">{c.price?.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card>
                  <h3 className="text-lg font-semibold mb-3">Actions Rapides</h3>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => handleOpenAdd("Admin")} className="w-full p-3 rounded-lg text-left bg-emerald-500/10 hover:bg-emerald-500/20 transition">Ajouter une Voiture</button>
                    <button onClick={() => setTab("commercials")} className="w-full p-3 rounded-lg text-left bg-blue-500/10 hover:bg-blue-500/20 transition">Gérer les Commercials</button>
                    <button onClick={() => setTab("fournisseurs")} className="w-full p-3 rounded-lg text-left bg-purple-500/10 hover:bg-purple-500/20 transition">Gérer les fournisseurs</button>
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
                          Changement Récent: {new Date(existing.updated_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {tab === "cars" && (
            <motion.div key="cars" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} classname="min-w-fit">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Gestion des Voitures</h2>
                <div className="flex items-center gap-3">
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search car..." className="bg-neutral-800 px-3 py-2 rounded-lg text-sm text-white" />
                  <button onClick={() => handleOpenAdd("Admin")} className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400">Ajouter une voiture</button>
                </div>
              </div>
              <Card className="min-w-fit">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto overflow-x-scroll">
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
                          <td colSpan="8" className="py-4 text-center text-neutral-500">Aucune Voiture trouvé</td>
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
          {tab === "transactions" && (
  <motion.div key="transactions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-3xl font-semibold">Gestion des Transactions</h2>
      <div className="flex gap-2">
        <select
          value={transactionFilter}
          onChange={(e) => setTransactionFilter(e.target.value)}
          className="bg-neutral-800 px-3 py-2 rounded-lg text-sm"
        >
          <option value="all">Toutes les Transactions</option>
          <option value="orders">Commandes Clients</option>
          <option value="wholesale">Commandes Gros</option>
          <option value="suppliers">Paiements Fournisseurs</option>
        </select>
      </div>
    </div>
    
    <Card>
      {loadingTransactions ? (
        <div className="text-center py-8 text-neutral-400">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement des transactions...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/30">
              <div className="text-sm text-emerald-400 mb-1">Total Revenus</div>
              <div className="text-2xl font-bold text-emerald-400">
                {transactionStats.totalRevenue.toLocaleString()} DZD
              </div>
            </div>
            <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
              <div className="text-sm text-red-400 mb-1">Total Dépenses</div>
              <div className="text-2xl font-bold text-red-400">
                {transactionStats.totalExpenses.toLocaleString()} DZD
              </div>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
              <div className="text-sm text-blue-400 mb-1">Solde Net</div>
              <div className="text-2xl font-bold text-blue-400">
                {transactionStats.netBalance.toLocaleString()} DZD
              </div>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
              <div className="text-sm text-purple-400 mb-1">Transactions</div>
              <div className="text-2xl font-bold text-purple-400">
                {transactions.length}
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Client/Fournisseur</th>
                  <th className="py-3 px-3">Montant</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-neutral-500">
                      Aucune transaction trouvée
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction, i) => {
                    const isRevenue = transaction.type === 'order' || transaction.type === 'wholesale';
                    return (
                      <tr key={transaction.id || `trans-${i}`} className="border-b border-neutral-800/40 hover:bg-white/5">
                        <td className="py-3 px-3 font-mono text-emerald-400">
                          {transaction.id || `T-${i + 1}`}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            transaction.type === 'order' ? 'bg-blue-500/20 text-blue-400' :
                            transaction.type === 'wholesale' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {transaction.type === 'order' ? '🛒 Commande' :
                             transaction.type === 'wholesale' ? '📦 Gros' :
                             '💸 Fournisseur'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm">
                          {transaction.description}
                        </td>
                        <td className="py-3 px-3 text-sm text-neutral-400">
                          {transaction.party_name}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`font-semibold ${isRevenue ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isRevenue ? '+' : '-'}{transaction.amount.toLocaleString()} DZD
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            transaction.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                            transaction.status === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {transaction.status === 'paid' ? '✅ Payé' :
                             transaction.status === 'partial' ? '⏳ Partiel' :
                             '❌ Impayé'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm text-neutral-400">
                          {new Date(transaction.date).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  </motion.div>
)}

          {/* ✅ MAIN MODIFICATION: Fournisseurs Tab with Editable Payments & Prices */}
          {tab === "fournisseurs" && (
            <motion.div key="fournisseurs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Fournisseurs & Finance</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-4 max-md:gap-2">
                      <h2 className="text-2xl font-semibold">Fournisseurs</h2>
                      <button
                        onClick={() => setShowAddFournisseur(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg max-md:py-0 max-md:px-2"
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
                            <div className="flex flex-col gap-3  justify-center items-center mt-3 space-x-2">
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
                  <h3 className="text-lg font-semibold mb-4">Details Des Fournisseurs</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {fournisseurs.map((supplier) => {
                        const items = supplierItems.filter(item => item.supplier_id === supplier.id);

                        // 🔥 All totals now calculated in ORIGINAL CURRENCY
                        const totalOwed = items.reduce((sum, item) => sum + (item.price || 0), 0);
                        const totalPaid = items.reduce((sum, item) => sum + (item.payment_amount || 0), 0);
                        const remaining = totalOwed - totalPaid;

                        return (
                          <div key={supplier.id} className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 hover:border-purple-500 transition">
                            <h3 className="text-lg font-semibold text-purple-400">
                              {supplier.name} {supplier.surname}
                            </h3>
                            <p className="text-sm text-gray-400">📞 {supplier.phone_number || "—"} | 📍 {supplier.address || "—"}</p>

                            <div className="mt-3 p-3 bg-neutral-800/40 rounded-lg">
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="text-center">
                                  <div className="text-emerald-400 font-medium">
                                    {totalOwed.toLocaleString()} {items[0]?.currency_code || ""}
                                  </div>
                                  <div className="text-neutral-400">Total</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-blue-400 font-medium">
                                    {totalPaid.toLocaleString()} {items[0]?.currency_code || ""}
                                  </div>
                                  <div className="text-neutral-400">Payé</div>
                                </div>
                                <div className="text-center">
                                  <div className={`font-bold ${remaining > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {remaining.toLocaleString()} {items[0]?.currency_code || ""}
                                  </div>
                                  <div className="text-neutral-400">Restant</div>
                                </div>
                              </div>
                            </div>

                            {/* Editable Items */}
                            {items.length > 0 && (
                              <div className="mt-3">
                                <h4 className="text-sm font-medium text-purple-300 mb-2">Payement des voitures</h4>

                                <div className="space-y-3">
                                  {items.map((item) => {
                                    const car = cars.find(c => c.id === item.car_id) || {};
                                    const currency = currencyList.find(c => c.id === item.currency_id);

                                    const editablePrice =
                                      editingSupplierItem[item.supplier_item_id]?.price ??
                                      item.price ??
                                      0;

                                    const editablePaid =
                                      editingSupplierItem[item.supplier_item_id]?.payment_amount ??
                                      item.payment_amount ??
                                      0;

                                    const remainingItem = editablePrice - editablePaid;

                                    return (
                                      <div key={item.supplier_item_id} className="bg-neutral-800/30 p-3 rounded border border-neutral-700">
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <span className="font-medium text-emerald-400">{car.model || 'Car'} #{car.id}</span>
                                            <br />
                                            <span className="text-xs text-neutral-500">
                                              {currency?.code.toUpperCase()}
                                            </span>
                                          </div>

                                          <div className="text-right">
                                            <div className="text-xs text-neutral-400">Total</div>
                                            <div className="font-bold text-emerald-400">
                                              {editablePrice.toLocaleString()} {currency?.code.toUpperCase()}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Inputs */}
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                          <div>
                                            <label className="text-xs text-neutral-400 block mb-1">
                                              Prix ({currency?.code.toUpperCase()}):
                                            </label>
                                            <input
                                              type="number"
                                              min="0"
                                              value={editablePrice}
                                              onChange={(e) => {
                                                const val = parseFloat(e.target.value) || 0;
                                                setEditingSupplierItem(prev => ({
                                                  ...prev,
                                                  [item.supplier_item_id]: {
                                                    ...prev[item.supplier_item_id],
                                                    price: val
                                                  }
                                                }));
                                              }}
                                              className="w-full bg-neutral-700 text-white text-sm px-2 py-1 rounded"
                                            />
                                          </div>

                                          <div>
                                            <label className="text-xs text-neutral-400 block mb-1">
                                              Payé ({currency?.code.toUpperCase()}):
                                            </label>
                                            <input
                                              type="number"
                                              min="0"
                                              max={editablePrice}
                                              value={editablePaid}
                                              onChange={(e) => {
                                                const val = parseFloat(e.target.value) || 0;
                                                setEditingSupplierItem(prev => ({
                                                  ...prev,
                                                  [item.supplier_item_id]: {
                                                    ...prev[item.supplier_item_id],
                                                    payment_amount: val
                                                  }
                                                }));
                                              }}
                                              className="w-full bg-neutral-700 text-white text-sm px-2 py-1 rounded"
                                            />
                                          </div>
                                        </div>

                                        {/* Remaining */}
                                        <div className="mt-2 pt-2 border-t border-neutral-700 flex justify-between">
                                          <span className="text-xs text-neutral-400">Restant:</span>
                                          <span className={`font-bold ${remainingItem > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {remainingItem > 0
                                              ? `${remainingItem.toLocaleString()} ${currency?.code.toUpperCase()}`
                                              : '✅ Paid'}
                                          </span>
                                        </div>

                                        {/* Save / Cancel */}
                                        <div className="flex justify-end gap-2 mt-2">
                                          {(editingSupplierItem[item.supplier_item_id]?.price !== item.price ||
                                            editingSupplierItem[item.supplier_item_id]?.payment_amount !== item.payment_amount) && (
                                            <button
                                              onClick={() => saveSupplierItemEdit(item)}
                                              className="text-xs px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500"
                                            >
                                              Sauvgarder
                                            </button>
                                          )}

                                          {editingSupplierItem[item.supplier_item_id] && (
                                            <button
                                              onClick={() => {
                                                setEditingSupplierItem(prev => {
                                                  const updated = { ...prev };
                                                  delete updated[item.supplier_item_id];
                                                  return updated;
                                                });
                                              }}
                                              className="text-xs px-2 py-1 bg-neutral-600 hover:bg-neutral-500 rounded"
                                            >
                                              Annulé
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Buttons */}
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
                  <h3 className="text-lg font-semibold mb-4">Dependes Mensuelles (Modifiable)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* ... (existing expense UI remains unchanged) */}
                    <div className="p-4 bg-neutral-900/40 rounded-lg">
                      <div className="text-sm text-neutral-400">Achat</div>
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
                      <div className="text-sm text-neutral-400">Autres</div>
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
                        Sauvgarder
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-800">
                    <h4 className="text-md font-medium mb-3">Resumé Annuelles (Read-only)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-neutral-900/30 rounded">
                        <div className="text-sm text-neutral-400">Achats</div>
                        <div className="text-lg font-bold text-emerald-400">{yearlyExpenses.total_purchases.toLocaleString()} DZD</div>
                      </div>
                      <div className="p-3 bg-neutral-900/30 rounded">
                        <div className="text-sm text-neutral-400">Transport</div>
                        <div className="text-lg font-bold text-blue-400">{yearlyExpenses.total_transport.toLocaleString()} DZD</div>
                      </div>
                      <div className="p-3 bg-neutral-900/30 rounded">
                        <div className="text-sm text-neutral-400">Autres</div>
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

          {tab === "commercials" && (
            <motion.div key="commercials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Gestion des Commerciaux</h2>
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
                        <th className="py-3 px-3">Nom</th>
                        <th className="py-3 px-3">Num Tel</th>
                        <th className="py-3 px-3">Wilaya</th>
                        <th className="py-3 px-3">Address</th>
                        <th className="py-3 px-3">Voitures Vendu</th>
                        <th className="py-3 px-3">Crée</th>
                        <th className="py-3 px-3">Actions</th>
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
                            <td className="py-3 px-3">{cm.wilayas?.join(', ') || '—'}</td>
                            <td className="py-3 px-3 text-sm text-neutral-400">{cm.address}</td>
                            <td className="py-3 px-3">{soldCars}</td>
                            <td className="py-3 px-3 text-sm text-neutral-400">
                              {new Date(cm.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-3 text-sm text-neutral-400">
                              <button 
                              onClick={() => {handledeleteCommercial(cm.id)}}
                              className="text-red-500 hover:text-red-300"
                              >
                               Supprimer
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

          {tab === "marketers" && (
            <motion.div key="marketers" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold">Marketing Agents Management</h2>
                <button onClick={() => { setMarketerForm({ name: "", surname: "", phone_number: "", address: "" }); setShowAddMarketer(true); }} className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  Ajouter un Agent de Marketing +
                </button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Nom</th>
                        <th className="py-3 px-3">Num Tel</th>
                        <th className="py-3 px-3">Address</th>
                        <th className="py-3 px-3">Crée</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketers.map((marketer) => (
                        <tr key={marketer.id} className="border-b border-neutral-800/40 hover:bg-emerald-500/5">
                          <td className="py-3 px-3 font-mono text-emerald-400">{marketer.id}</td>
                          <td className="py-3 px-3">{marketer.name} {marketer.surname}</td>
                          <td className="py-3 px-3">{marketer.phone_number}</td>
                          <td className="py-3 px-3 text-sm text-neutral-400">{marketer.address}</td>
                          <td className="py-3 px-3 text-sm text-neutral-400">{new Date(marketer.created_at).toLocaleDateString()}</td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button onClick={() => { setMarketerForm({ ...marketer, marketer_id: marketer.id }); setShowAddMarketer(true); }} className="text-blue-400 hover:text-blue-300">Modifier</button>
                            <button onClick={() => handleDeleteMarketer(marketer.id)} className="text-red-400 hover:text-red-300">Supprimer</button>
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
                <h2 className="text-3xl font-semibold">Gestion des Comptable</h2>
                <button onClick={() => { setAccountantForm({ name: "", surname: "", phone_number: "", address: "" }); setShowAddAccountant(true); }} className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  Ajouter un Comptable +
                </button>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Nom</th>
                        <th className="py-3 px-3">Num Tel</th>
                        <th className="py-3 px-3">Address</th>
                        <th className="py-3 px-3">Crée</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accountants.map((accountant) => (
                        <tr key={accountant.id} className="border-b border-neutral-800/40 hover:bg-emerald-500/5">
                          <td className="py-3 px-3 font-mono text-emerald-400">{accountant.id}</td>
                          <td className="py-3 px-3">{accountant.name} {accountant.surname}</td>
                          <td className="py-3 px-3">{accountant.phone_number}</td>
                          <td className="py-3 px-3 text-sm text-neutral-400">{accountant.address}</td>
                          <td className="py-3 px-3 text-sm text-neutral-400">{new Date(accountant.created_at).toLocaleDateString()}</td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button onClick={() => { setAccountantForm({ ...accountant, accountant_id: accountant.id }); setShowEditAccountant(true); }} className="text-blue-400 hover:text-blue-300">Modifier</button>
                            <button onClick={() => handleDeleteAccountant(accountant.id)} className="text-red-400 hover:text-red-300">Supprimer</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}
          {tab === "wholesale_clients" && (
                      <motion.div key="wholesale_clients" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-3xl font-semibold">Clients Gros</h2>
                          <button 
                            onClick={() => { 
                              setWholesaleClientForm({ name: "", surname: "", phone_number: "", address: "", company_name: "" }); 
                              setShowAddWholesaleClient(true); 
                            }} 
                            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400"
                          >
                            Ajouter un client gros +
                          </button>
                        </div>
                        <Card>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                                  <th className="py-3 px-3">ID</th>
                                  <th className="py-3 px-3">Nom</th>
                                  <th className="py-3 px-3">Entreprise</th>
                                  <th className="py-3 px-3">Num Tel</th>
                                  <th className="py-3 px-3">Address</th>
                                  <th className="py-3 px-3">Crée</th>
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
                                        Modifier
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteWholesaleClient(client.id)} 
                                        className="text-red-400 hover:text-red-300"
                                      >
                                        Supprimer
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
          
                    {tab === "wholesale_orders" && (
                      <motion.div key="wholesale_orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="flex items-center justify-between mb-6">
                          <h2 className="text-3xl font-semibold">Gros Order</h2>
                          <button 
                            onClick={() => { 
                              setWholesaleOrderForm({ client_id: "", car_id: "", quantity: 1, delivery_status: "shipping", payment_amount: 0, status: true }); 
                              setShowAddWholesaleOrder(true); 
                            }} 
                            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400"
                          >
                            Ajouter un Ordre de Gros +
                          </button>
                        </div>
                        <Card>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                                  <th className="py-3 px-4 text-left">ID Commande</th>
                                  <th className="py-3 px-4 text-left">ID Client</th>
                                  <th className="py-3 px-4 text-left">ID Voiture</th>
                                  <th className="py-3 px-4 text-left">Qté</th>
                                  <th className="py-3 px-4 text-left">Statut Livraison</th>
                                  <th className="py-3 px-4 text-left">Total</th>
                                  <th className="py-3 px-4 text-left">Payé</th>
                                  <th className="py-3 px-4 text-center items-center justify-center">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {wholesaleOrders.map((order, i) => {
                                  const client = wholesaleClients.find(c => c.id === order.client_id) || {};
                                  const car = cars.find(c => c.id === order.car_id) || {};
                                  const currency = currencyList.find(c => c.id === car.currency_id);
                                  const rate = currency?.exchange_rate_to_dzd || 1;
                                  const value = car.price * order.quantity * rate;
                                  return (
                                    <tr key={order.id ?? `worder-${i}`} className="border-b border-neutral-800/40 hover:bg-emerald-500/5">
                                      <td className="py-3 px-3 font-mono text-emerald-400">{order.order_id}</td>
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
                                      <td className="py-3 px-3 text-purple-400">{value} DZD</td>
                                      <td className="py-3 px-3 text-blue-400">{order.payment_amount} DZD</td>
                                      <td className="py-3 px-3 max-md:flex max-md:flex-col max-md:items-center max-md:justify-end text-center space-x-2 max-md:gap-2">
                                        <button onClick={() => handleEditWholesaleOrder(order)} className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded mr-1">✏️</button>
                                        <button onClick={() => handleDeleteWholesaleOrder(order.order_id)} className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded">🗑️</button>
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
                          <h2 className="text-3xl font-semibold">Ordre Client</h2>
                          <button
                            onClick={() => {
                              setOrderForm({ client_id: "", car_id: "", quantity: 1, delivery_status: "shipping" });
                              setShowAddOrder(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400"
                          >
                            Ajouter un Ordre +
                          </button>
                        </div>
                        <Card>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="text-left text-neutral-400 text-sm border-b border-neutral-800">
                                  <th className="py-3 px-3">ID</th>
                                  <th className="py-3 px-3">Client</th>
                                  <th className="py-3 px-3">Num Tel</th>
                                  <th className="py-3 px-3">Address</th>
                                  <th className="py-3 px-3">Voiture</th>
                                  <th className="py-3 px-3">Total (DZD)</th>
                                  <th className="py-3 px-3">Payé (DZD)</th>
                                  <th className="py-3 px-3">Status</th>
                                  <th className="py-3 px-3">Crée</th>
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
                                  const totalValue = unitPrice ;
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
                                        <button onClick={() => handleEditOrder(order)}
                                        className="text-blue-400">Modifier</button>
                                        <button
                                          onClick={() => handleDeleteOrder(order.id || order.order_id)}
                                          className="text-red-400 hover:text-red-300"
                                        >
                                          Supprimer
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
          {tab === "car_requests" && (
  <motion.div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-3xl">Requetes</h2>
      {/* Optional: Add button to create request */}
    </div>
    <Card>
      <table className="w-full">
        <thead>...</thead>
        <tbody>
          {carRequests.map(req => {
            const client = clients.find(c => c.id === req.client_id) || {};
            return (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{client.name} {client.surname}</td>
                <td>{req.model} ({req.color})</td>
                <td>{req.year}</td>
                <td>{req.country}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${
                    req.status ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {req.status ? 'Accepted' : 'Pending'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  </motion.div>
)}

{tab === "social_media" && (
  <motion.div
    key="socialmedia"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4 }}
  >
    <h1 className="text-3xl font-main mb-6">Liens Sociaux</h1>
    <Card>
      <form onSubmit={SubmitSocials} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Facebook</label>
          <input
            type="text"
            value={socialsform.facebook}
            onChange={(e) => setSocialsform({...socialsform, facebook: e.target.value})}
            className="w-full p-2 border border-neutral-700 rounded bg-neutral-800 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Instagram</label>
          <input
            type="text"
            value={socialsform.instagram}
            onChange={(e) => setSocialsform({...socialsform, instagram: e.target.value})}
            className="w-full p-2 border border-neutral-700 rounded bg-neutral-800 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Whatsapp</label>
          <input
            type="text"
            value={socialsform.whatsapp}
            onChange={(e) => setSocialsform({...socialsform, twitter: e.target.value})}
            className="w-full p-2 border border-neutral-700 rounded bg-neutral-800 text-white"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
          Mettre à jour
        </button>
      </form>
    </Card>
  </motion.div>
)}

{tab === "supplierItems" && (
  <motion.div
    key="supplierItems"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4 }}
  >
    <h1 className="text-3xl font-main mb-6">Éléments Fournisseurs</h1>
    <button
      onClick={() => handleEditOrAddSupplierItem()}
      className="mb-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded"
    >
      ➕ Ajouter Élément
    </button>
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-neutral-700">
              <th className="py-3 px-4 text-left">ID Voiture</th>
              <th className="py-3 px-4 text-left">ID Fournisseur</th>
              <th className="py-3 px-4 text-left">Prix (Devise)</th>
              <th className="py-3 px-4 text-left">Prix (DZD)</th>
              <th className="py-3 px-4 text-left">Payé (DZD)</th>
              <th className="py-3 px-4 text-left">Reste (DZD)</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {supplierItems.map((item) => {
              const currency = currencyList.find(c => c.id === item.currency_id);
              const rate = currency?.exchange_rate_to_dzd || 1;
              const priceDZD = (item.price || 0) * rate;
              const paid = item.payment_amount || 0;
              const remaining = priceDZD - paid;

              const editablePrice = editingSupplierItem[item.supplier_item_id]?.price ?? item.price ?? 0;
              const editablePaid = editingSupplierItem[item.supplier_item_id]?.payment_amount ?? item.payment_amount ?? 0;
              const editablePriceDZD = editablePrice * rate;
              const editableRemaining = editablePriceDZD - editablePaid;

              return (
                <tr key={item.supplier_item_id} className="border-b border-neutral-800/50 hover:bg-white/5">
                  <td className="py-4 px-4">{item.car_id}</td>
                  <td className="py-4 px-4">{getSupplierName(item.supplier_id)}</td>
                  <td className="py-4 px-4">{(item.price || 0).toLocaleString()} {currency?.code.toUpperCase() || 'N/A'}</td>
                  <td className="py-4 px-4">{priceDZD.toLocaleString()} DZD</td>
                  <td className="py-4 px-4">{paid.toLocaleString()} DZD</td>
                  <td className={`py-4 px-4 font-medium ${remaining > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {remaining > 0 ? `${remaining.toLocaleString()} DZD` : '✅ Payé'}
                  </td>
                  <td className="py-4 px-4">

                        <button
                          onClick={() => handleDeleteSupplierItem(item.supplier_item_id)}
                          className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 rounded"
                        >
                          🗑️
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

<Modal 
  open={showAddOrder}
  onClose={() => setShowAddOrder(false)}
  title="Ajouter une Commande"
>
  <form onSubmit={handleOrderSubmit} className="space-y-4">
    {/* Client Selection */}
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        Client *
      </label>
      <select
        value={orderForm.client_id}
        onChange={(e) => setOrderForm({ ...orderForm, client_id: e.target.value })}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-emerald-500"
        required
      >
        <option value="">Sélectionner un client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name} {client.surname} - {client.phone_number}
          </option>
        ))}
      </select>
    </div>

{/* Car Selection */}
<div>
  <label className="block text-sm font-medium text-neutral-300 mb-2">
    Voiture *
  </label>
  <select
    value={orderForm.car_id}
    onChange={(e) => {
      const selectedCar = cars.find(c => c.id === Number(e.target.value));
      if (selectedCar) {
        const priceInDZD = convertToDZD(selectedCar.price, selectedCar.currency);
        setOrderForm({ 
          ...orderForm, 
          car_id: e.target.value,
          payment_amount: priceInDZD
        });
      }
    }}
    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-emerald-500"
    required
  >
    <option value="">Sélectionner une voiture</option>
    {cars.map((car) => {
      const priceInDZD = convertToDZD(car.price, car.currency);
      return (
        <option key={car.id} value={car.id}>
          {car.model} - {car.color} ({car.year}) - {priceInDZD?.toLocaleString()} DZD
        </option>
      );
    })}
  </select>
</div>
    {/* Car Color */}
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        Couleur de la voiture *
      </label>
      <input
        type="text"
        value={orderForm.car_color}
        onChange={(e) => setOrderForm({ ...orderForm, car_color: e.target.value })}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-emerald-500"
        placeholder="Ex: Rouge, Noir, Blanc..."
        required
      />
    </div>

    {/* Delivery Status */}
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        Statut de livraison *
      </label>
      <select
        value={orderForm.delivery_status}
        onChange={(e) => setOrderForm({ ...orderForm, delivery_status: e.target.value })}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-emerald-500"
        required
      >
        <option value="shipping">En cours de livraison</option>
        <option value="delivered">Livrée</option>
        <option value="pending">En attente</option>
        <option value="cancelled">Annulée</option>
      </select>
    </div>

    {/* Payment Amount */}
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        Montant du paiement *
      </label>
      <input
        type="number"
        value={orderForm.payment_amount}
        onChange={(e) => setOrderForm({ ...orderForm, payment_amount: Number(e.target.value) })}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-emerald-500"
        placeholder="0"
        min="0"
        required
      />
      <p className="text-xs text-neutral-500 mt-1">Montant en DZD</p>
    </div>

    {/* Status */}
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="orderStatus"
        checked={orderForm.status}
        onChange={(e) => setOrderForm({ ...orderForm, status: e.target.checked })}
        className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
      />
      <label htmlFor="orderStatus" className="text-sm text-neutral-300">
        Commande active
      </label>
    </div>

    {/* Buttons */}
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={() => {
          setShowAddOrder(false);
          setOrderForm({
            id: null,
            client_id: "",
            car_id: "",
            car_color: "",
            delivery_status: "shipping",
            payment_amount: 0,
            status: true,
          });
        }}
        className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors"
      >
        Annuler
      </button>
      <button
        type="submit"
        className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
      >
        Ajouter la commande
      </button>
    </div>
  </form>
</Modal>

<Modal 
  open={showEditOrder}
  onClose={() => {
    setShowEditOrder(false);
    setOrderForm({
      id: null,
      client_id: "",
      car_id: "",
      car_color: "",
      delivery_status: "shipping",
      payment_amount: 0,
      status: true,
    });
  }}
  title="Modifier la Commande"
>
  <form onSubmit={handleEditOrderSubmit} className="space-y-4">
    {/* Client Selection */}
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        Client *
      </label>
      <select
        value={orderForm.client_id}
        onChange={(e) => setOrderForm({ ...orderForm, client_id: e.target.value })}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-emerald-500"
        required
      >
        <option value="">Sélectionner un client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name} {client.surname} - {client.phone_number}
          </option>
        ))}
      </select>
    </div>

    {/* Car Selection */}
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        Voiture *
      </label>
      <select
        value={orderForm.car_id}
        onChange={(e) => {
          const selectedCar = cars.find(c => c.id === Number(e.target.value));
          if (selectedCar) {
            const priceInDZD = convertToDZD(selectedCar.price, selectedCar.currency);
            setOrderForm({ 
              ...orderForm, 
              car_id: e.target.value,
              payment_amount: priceInDZD
            });
          }
        }}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-emerald-500"
        required
      >
        <option value="">Sélectionner une voiture</option>
        {cars.map((car) => {
          const priceInDZD = convertToDZD(car.price, car.currency);
          return (
            <option key={car.id} value={car.id}>
              {car.model} - {car.color} ({car.year}) - {priceInDZD?.toLocaleString()} DZD
            </option>
          );
        })}
      </select>
    </div>

    {/* Car Color */}
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        Couleur de la voiture *
      </label>
      <input
        type="text"
        value={orderForm.car_color}
        onChange={(e) => setOrderForm({ ...orderForm, car_color: e.target.value })}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-emerald-500"
        placeholder="Ex: Rouge, Noir, Blanc..."
        required
      />
    </div>

    {/* Delivery Status - VALEURS CORRIGÉES */}
<div>
  <label className="block text-sm font-medium text-neutral-300 mb-2">
    Statut de livraison *
  </label>
  <select
    value={orderForm.delivery_status}
    onChange={(e) => setOrderForm({ ...orderForm, delivery_status: e.target.value })}
    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-emerald-500"
    required
  >
    <option value="shipping">En cours de livraison</option>
    <option value="arrived">Arrivée</option>
    <option value="showroom">En showroom</option>
  </select>
</div>

    {/* Payment Amount */}
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        Montant du paiement *
      </label>
      <input
        type="number"
        value={orderForm.payment_amount}
        onChange={(e) => setOrderForm({ ...orderForm, payment_amount: Number(e.target.value) })}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-neutral-100 focus:outline-none focus:border-emerald-500"
        placeholder="0"
        min="0"
        required
      />
      <p className="text-xs text-neutral-500 mt-1">Montant en DZD</p>
    </div>

    {/* Status */}
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="editOrderStatus"
        checked={orderForm.status}
        onChange={(e) => setOrderForm({ ...orderForm, status: e.target.checked })}
        className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
      />
      <label htmlFor="editOrderStatus" className="text-sm text-neutral-300">
        Commande active
      </label>
    </div>

    {/* Buttons */}
    <div className="flex gap-3 pt-4">
      <button
        type="button"
        onClick={() => {
          setShowEditOrder(false);
          setOrderForm({
            id: null,
            client_id: "",
            car_id: "",
            car_color: "",
            delivery_status: "shipping",
            payment_amount: 0,
            status: true,
          });
        }}
        className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition-colors"
      >
        Annuler
      </button>
      <button
        type="submit"
        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        Mettre à jour
      </button>
    </div>
  </form>
</Modal>
<Modal
  open={showAddSupplierItem}
  onClose={() => {
    setShowAddSupplierItem(false);
    setSupplierItemForm({ car_id: "", supplier_id: "", currency_id: "", price: 0 }); // Reset on close
  }}
  title="Ajouter un Élément Fournisseur"
>
  <form onSubmit={handleAddSupplierItem} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label className="text-sm text-neutral-400 block mb-1">Voiture</label>
        <select
          name="car_id"
          value={supplierItemForm.car_id}
          onChange={(e) => setSupplierItemForm({ ...supplierItemForm, car_id: e.target.value })}
          className="w-full bg-neutral-800 p-2 rounded text-sm"
          required
        >
          <option value="">Select Car</option>
          {cars.map((car) => (
            <option key={car.id} value={car.id}>
              {car.model} #{car.id} — {car.color} · {car.year}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm text-neutral-400 block mb-1">Fournisseur</label>
        <select
          name="supplier_id"
          value={supplierItemForm.supplier_id}
          onChange={(e) => setSupplierItemForm({ ...supplierItemForm, supplier_id: e.target.value })}
          className="w-full bg-neutral-800 p-2 rounded text-sm"
          required
        >
          <option value="">Select Supplier</option>
          {fournisseurs.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name} {supplier.surname}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm text-neutral-400 block mb-1">Devise</label>
        <select
          name="currency_id"
          value={supplierItemForm.currency_id}
          onChange={(e) => setSupplierItemForm({ ...supplierItemForm, currency_id: e.target.value })}
          className="w-full bg-neutral-800 p-2 rounded text-sm"
          required
        >
          <option value="">Select Currency</option>
          {currencyList.map((currency) => (
            <option key={currency.id} value={currency.id}>
              {currency.name} ({currency.code.toUpperCase()})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm text-neutral-400 block mb-1">Prix</label>
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Prix"
          value={supplierItemForm.price}
          onChange={(e) => setSupplierItemForm({ ...supplierItemForm, price: e.target.value })}
          className="w-full bg-neutral-800 p-2 rounded text-sm"
          required
        />
      </div>
    </div>
    <div className="flex justify-end gap-2 pt-4">
      <button type="button" onClick={() => setShowAddSupplierItem(false)} className="px-4 py-2 rounded bg-neutral-800/60 text-sm">Annuler</button>
      <button type="submit" className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white text-sm">➕ Ajouter Élément</button>
    </div>
  </form>
</Modal>

        
      <Modal open={showAddCar} onClose={() => setShowAddCar(false)} title={editingCar ? "Edit Car" : "Add Car"}>
        <form onSubmit={handleSubmitCar} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={carForm.currency_id} onChange={(e) => setCarForm({ ...carForm, currency_id: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" required>
              <option value="">Select Currency</option>
              {currencyList.map(curr => (
                <option key={curr.id} value={curr.id}>{curr.name} ({curr.code.toUpperCase()})</option>
              ))}
            </select>
            <input autoFocus value={carForm.model} onChange={(e) => setCarForm({ ...carForm, model: e.target.value })} placeholder="Model *" className="bg-neutral-800 p-2 rounded text-sm" required />
            <input value={carForm.color} onChange={(e) => setCarForm({ ...carForm, color: e.target.value })} placeholder="Colors (comma-separated)" className="bg-neutral-800 p-2 rounded text-sm" />
            
            {/* ✅ Added Description field - spans full width */}
            <textarea 
              value={carForm.description} 
              onChange={(e) => setCarForm({ ...carForm, description: e.target.value })} 
              placeholder="Description (optional)" 
              className="bg-neutral-800 p-2 rounded text-sm md:col-span-3 min-h-[80px]" 
              rows="3"
            />
            
            <input type="number" value={carForm.year} onChange={(e) => setCarForm({ ...carForm, year: e.target.value })} placeholder="Year" className="bg-neutral-800 p-2 rounded text-sm" />
            <input value={carForm.engine} onChange={(e) => setCarForm({ ...carForm, engine: e.target.value })} placeholder="Engine" className="bg-neutral-800 p-2 rounded text-sm" />
            <input value={carForm.power} onChange={(e) => setCarForm({ ...carForm, power: e.target.value })} placeholder="Power" className="bg-neutral-800 p-2 rounded text-sm" />
            <input value={carForm.fuelType} onChange={(e) => setCarForm({ ...carForm, fuelType: e.target.value })} placeholder="Fuel Type" className="bg-neutral-800 p-2 rounded text-sm" />
            <input type="number" step="0.01" value={carForm.milage} onChange={(e) => setCarForm({ ...carForm, milage: e.target.value })} placeholder="Mileage" className="bg-neutral-800 p-2 rounded text-sm" />
            <input value={carForm.country} onChange={(e) => setCarForm({ ...carForm, country: e.target.value })} placeholder="Country" className="bg-neutral-800 p-2 rounded text-sm" />
            <input type="number" step="0.01" value={carForm.price} onChange={(e) => setCarForm({ ...carForm, price: e.target.value })} placeholder="Price *" className="bg-neutral-800 p-2 rounded text-sm" required />
            <input type="number" step="0.01" value={carForm.wholesale_price} onChange={(e) => setCarForm({ ...carForm, wholesale_price: e.target.value })} placeholder="Wholesale Price" className="bg-neutral-800 p-2 rounded text-sm" />
            <input type="number" value={carForm.quantity} onChange={(e) => setCarForm({ ...carForm, quantity: e.target.value })} placeholder="Quantity *" className="bg-neutral-800 p-2 rounded text-sm" required />
            <label className="flex flex-col gap-1">
              <span className="text-xs text-neutral-400">Purchase Date</span>
              <input type="date" value={carForm.shippingDate} onChange={(e) => setCarForm({ ...carForm, shippingDate: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-neutral-400">Arrival Date</span>
              <input type="date" value={carForm.arrivingDate} onChange={(e) => setCarForm({ ...carForm, arrivingDate: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" />
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer bg-neutral-800 px-3 py-2 rounded text-sm">
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={(e) => setCarForm({ ...carForm, imageFiles: Array.from(e.target.files) })} 
                className="hidden" 
              />
              📸 Upload Images
            </label>
            {carForm.imageFiles && carForm.imageFiles.length > 0 && (
              <p className="text-xs text-neutral-400 mt-2">{carForm.imageFiles.length} file(s) selected</p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowAddCar(false)} className="px-4 py-2 rounded bg-neutral-800/60 text-sm">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-emerald-500/20 text-emerald-400 text-sm">
              {editingCar ? '✏️ Update Car' : '➕ Save Car'}
            </button>
          </div>
        </form>
      </Modal>

        <Modal open={showAddCommercial} onClose={() => setShowAddCommercial(false)} title={CommercialForm.commercial_id ? "Edit Commercial" : "Add Commercial"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" name="name" placeholder="Name" value={CommercialForm.name} onChange={handleChange} className="bg-neutral-800 p-2 rounded text-sm" required />
              <input type="text" name="surname" placeholder="Surname" value={CommercialForm.surname} onChange={handleChange} className="bg-neutral-800 p-2 rounded text-sm" required />
              <input type="text" name="phone_number" placeholder="Phone Number" value={CommercialForm.phone_number} onChange={handleChange} className="bg-neutral-800 p-2 rounded text-sm" required />
              <input type="text" name="address" placeholder="Address" value={CommercialForm.address} onChange={handleChange} className="bg-neutral-800 p-2 rounded text-sm" required />
              <label className="md:col-span-2 flex flex-col gap-1">
                <span className="text-xs text-neutral-400">Wilayas (comma-separated)</span>
                <input 
                  type="text" 
                  name="wilayas" 
                  placeholder="e.g. Algiers, Oran" 
                  value={CommercialForm.wilayas.join(', ')} 
                  onChange={handleChange} 
                  className="bg-neutral-800 p-2 rounded text-sm" 
                  required 
                />
              </label>
            </div>
            {message && <p className={`text-sm ${message.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddCommercial(false)} className="px-4 py-2 rounded bg-neutral-800/60 text-sm">Cancel</button>
              <button type="submit" disabled={commercialLoading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm">
                {commercialLoading ? '⏳ Saving...' : CommercialForm.commercial_id ? '✏️ Update Commercial' : '➕ Add Commercial'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Marketer Modal */}
        <Modal open={showAddMarketer} onClose={() => setShowAddMarketer(false)} title={marketerForm.marketer_id ? "Edit Marketer" : "Add Marketer"}>
          <form onSubmit={handleMarketerSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Name" value={marketerForm.name} onChange={(e) => setMarketerForm({ ...marketerForm, name: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" required />
              <input type="text" placeholder="Surname" value={marketerForm.surname} onChange={(e) => setMarketerForm({ ...marketerForm, surname: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" required />
              <input type="text" placeholder="Phone Number" value={marketerForm.phone_number} onChange={(e) => setMarketerForm({ ...marketerForm, phone_number: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" required />
              <input type="text" placeholder="Address" value={marketerForm.address} onChange={(e) => setMarketerForm({ ...marketerForm, address: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" required />
            </div>
            {marketerMessage && <p className={`text-sm ${marketerMessage.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{marketerMessage}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddMarketer(false)} className="px-4 py-2 rounded bg-neutral-800/60 text-sm">Cancel</button>
              <button type="submit" disabled={marketerLoading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm">
                {marketerLoading ? '⏳ Saving...' : marketerForm.marketer_id ? '✏️ Update Marketer' : '➕ Add Marketer'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Accountant Modal */}
        <Modal open={showAddAccountant} onClose={() => setShowAddAccountant(false)} title={accountantForm.accountant_id ? "Edit Accountant" : "Add Accountant"}>
          <form onSubmit={handleAccountantSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Name" value={accountantForm.name} onChange={(e) => setAccountantForm({ ...accountantForm, name: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" required />
              <input type="text" placeholder="Surname" value={accountantForm.surname} onChange={(e) => setAccountantForm({ ...accountantForm, surname: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" required />
              <input type="text" placeholder="Phone Number" value={accountantForm.phone_number} onChange={(e) => setAccountantForm({ ...accountantForm, phone_number: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" required />
              <input type="text" placeholder="Address" value={accountantForm.address} onChange={(e) => setAccountantForm({ ...accountantForm, address: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" required />
            </div>
            {accountantMessage && <p className={`text-sm ${accountantMessage.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{accountantMessage}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddAccountant(false)} className="px-4 py-2 rounded bg-neutral-800/60 text-sm">Cancel</button>
              <button type="submit" disabled={accountantLoading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm">
                {accountantLoading ? '⏳ Saving...' : accountantForm.accountant_id ? '✏️ Update Accountant' : '➕ Add Accountant'}
              </button>
            </div>
          </form>
        </Modal>

        <Modal open={showEditAccountant} onClose={() => setShowEditAccountant(false)} title={accountantForm.accountant_id ? "Edit Accountant" : "Add Accountant"}>
          <form onSubmit={handleAccountantSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Name" value={accountantForm.name} onChange={(e) => setAccountantForm({ ...accountantForm, name: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" required />
              <input type="text" placeholder="Surname" value={accountantForm.surname} onChange={(e) => setAccountantForm({ ...accountantForm, surname: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" required />
              <input type="text" placeholder="Phone Number" value={accountantForm.phone_number} onChange={(e) => setAccountantForm({ ...accountantForm, phone_number: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" required />
              <input type="text" placeholder="Address" value={accountantForm.address} onChange={(e) => setAccountantForm({ ...accountantForm, address: e.target.value })} className="bg-neutral-800 p-2 rounded text-sm" required />
            </div>
            {accountantMessage && <p className={`text-sm ${accountantMessage.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{accountantMessage}</p>}
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowEditAccountant(false)} className="px-4 py-2 rounded bg-neutral-800/60 text-sm">Cancel</button>
              <button type="submit" disabled={accountantLoading} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm">
                {accountantLoading ? '⏳ Saving...' : accountantForm.accountant_id ? '✏️ Update Accountant' : '➕ Add Accountant'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Dynamic Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-800 rounded-2xl w-full max-w-md border border-neutral-700">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {passwordModalType === "commercial" && "Identifiants du Commercial"}
                    {passwordModalType === "marketer" && "Identifiants du Marketer"}
                    {passwordModalType === "accountant" && "Identifiants de l'Accountant"}
                    {passwordModalType === "wholesale_client" && "Identifiants du Client Grossiste"}
                  </h2>
                  <button onClick={() => setShowPasswordModal(false)} className="text-neutral-400 hover:text-white text-2xl">&times;</button>
                </div>
                <p className="text-neutral-300 text-sm mb-4">
                  {passwordModalType === "commercial" && "Le commercial peut se connecter avec ces identifiants :"}
                  {passwordModalType === "marketer" && "Le marketer peut se connecter avec ces identifiants :"}
                  {passwordModalType === "accountant" && "L'accountant peut se connecter avec ces identifiants :"}
                  {passwordModalType === "wholesale_client" && "Le client grossiste peut se connecter avec ces identifiants :"}
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

        <Modal
          open={showAddFournisseur}
          onClose={() => setShowAddFournisseur(false)}
          title={fournisseurForm.id ? "Edit Supplier" : "Add Supplier"}
        >
          <form onSubmit={handleAddFournisseur} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" name="name" placeholder="Supplier Name" value={fournisseurForm.name} onChange={handleChangeFournisseur} className="bg-neutral-800 p-2 rounded text-sm" required />
              <input type="text" name="surname" placeholder="Surname" value={fournisseurForm.surname} onChange={handleChangeFournisseur} className="bg-neutral-800 p-2 rounded text-sm" />
              <input type="text" name="phone_number" placeholder="Phone Number" value={fournisseurForm.phone_number} onChange={handleChangeFournisseur} className="bg-neutral-800 p-2 rounded text-sm" />
              <input type="text" name="address" placeholder="Address" value={fournisseurForm.address} onChange={handleChangeFournisseur} className="bg-neutral-800 p-2 rounded text-sm" />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowAddFournisseur(false)} className="px-4 py-2 rounded bg-neutral-800/60 text-sm">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white text-sm">
                {fournisseurForm.id ? '✏️ Update Supplier' : '➕ Add Supplier'}
              </button>
            </div>
          </form>
        </Modal>

        {/* ✅ Wholesale Client Modal */}
<Modal 
  open={showAddWholesaleClient} 
  onClose={() => setShowAddWholesaleClient(false)} 
  title={wholesaleClientForm.id ? "Edit Wholesale Client" : "Add Wholesale Client"}
>
  <form onSubmit={handleWholesaleClientSubmit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input
        type="text"
        placeholder="Name"
        value={wholesaleClientForm.name}
        onChange={(e) => setWholesaleClientForm({ ...wholesaleClientForm, name: e.target.value })}
        className="bg-neutral-800 p-2 rounded text-sm"
        required
      />
      <input
        type="text"
        placeholder="Surname"
        value={wholesaleClientForm.surname}
        onChange={(e) => setWholesaleClientForm({ ...wholesaleClientForm, surname: e.target.value })}
        className="bg-neutral-800 p-2 rounded text-sm"
        required
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={wholesaleClientForm.phone_number}
        onChange={(e) => setWholesaleClientForm({ ...wholesaleClientForm, phone_number: e.target.value })}
        className="bg-neutral-800 p-2 rounded text-sm"
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={wholesaleClientForm.address}
        onChange={(e) => setWholesaleClientForm({ ...wholesaleClientForm, address: e.target.value })}
        className="bg-neutral-800 p-2 rounded text-sm"
      />
      <input
        type="text"
        placeholder="Company Name"
        value={wholesaleClientForm.company_name}
        onChange={(e) => setWholesaleClientForm({ ...wholesaleClientForm, company_name: e.target.value })}
        className="bg-neutral-800 p-2 rounded text-sm"
        required
      />
    </div>
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={() => setShowAddWholesaleClient(false)}
        className="px-4 py-2 rounded bg-neutral-800/60 text-sm"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 rounded bg-emerald-500/20 text-emerald-400 text-sm"
      >
        {wholesaleClientForm.id ? "✏️ Update Client" : "➕ Add Client"}
      </button>
    </div>
  </form>
</Modal>
{/* ✅ Wholesale Order Modal */}
<Modal 
  open={showAddWholesaleOrder} 
  onClose={() => setShowAddWholesaleOrder(false)} 
  title={"Ajouter une Commande Grossiste"}
>
  <form onSubmit={handleWholesaleOrderSubmit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* ✅ Client Selection - REQUIRED for CREATE */}
      <div className="md:col-span-2">
        <label className="block text-sm text-neutral-400 mb-1">Client Grossiste *</label>
        <select
          value={wholesaleOrderForm.client_id}
          onChange={(e) => setWholesaleOrderForm({ ...wholesaleOrderForm, client_id: e.target.value })}
          className="w-full bg-neutral-800 p-2 rounded text-sm"
          required
        >
          <option value="">Sélectionner un client grossiste</option>
          {wholesaleClients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.surname} ({c.company_name})
            </option>
          ))}
        </select>
      </div>

      <select
        value={wholesaleOrderForm.car_id}
        onChange={(e) => setWholesaleOrderForm({ ...wholesaleOrderForm, car_id: e.target.value })}
        className="bg-neutral-800 p-2 rounded text-sm"
        required
      >
        <option value="">Select Car</option>
        {cars.map((car) => (
          <option key={car.id} value={car.id}>
            {car.model} #{car.id} — {car.color} · {car.year}
          </option>
        ))}
      </select>
      
      <input
        type="number"
        min="1"
        placeholder="Quantity"
        value={wholesaleOrderForm.quantity}
        onChange={(e) => setWholesaleOrderForm({ ...wholesaleOrderForm, quantity: e.target.value })}
        className="bg-neutral-800 p-2 rounded text-sm"
        required
      />
      
      <select
        value={wholesaleOrderForm.delivery_status}
        onChange={(e) => setWholesaleOrderForm({ ...wholesaleOrderForm, delivery_status: e.target.value })}
        className="bg-neutral-800 p-2 rounded text-sm"
      >
        <option value="shipping">Shipping</option>
        <option value="arrived">Arrived</option>
        <option value="showroom">Showroom</option>
      </select>
    </div>
    
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={() => setShowAddWholesaleOrder(false)}
        className="px-4 py-2 rounded bg-neutral-800/60 text-sm"
      >
        Annuler
      </button>
      <button
        type="submit"
        className="px-4 py-2 rounded bg-emerald-500/20 text-emerald-400 text-sm"
      >
        ➕ Ajouter la commande
      </button>
    </div>
  </form>
</Modal>
<Modal 
  open={showEditWholesaleOrder} 
  onClose={() => setShowEditWholesaleOrder(false)} 
  title={"Modifier la Commande Grossiste"}
>
  <form onSubmit={handleWholesaleOrderSubmit} className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="md:col-span-2">
        <label className="block text-sm text-neutral-400 mb-1">Status</label>
        <select
          value={wholesaleOrderForm.status}
          onChange={(e) => setWholesaleOrderForm({ ...wholesaleOrderForm, status: e.target.value === 'true' })}
          className="w-full bg-neutral-800 p-2 rounded text-sm"
        >
          <option value="true">Active</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Payment Amount</label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Payment Amount"
          value={wholesaleOrderForm.payment_amount}
          onChange={(e) => setWholesaleOrderForm({ 
              ...wholesaleOrderForm, 
              payment_amount: e.target.value === '' ? null : parseFloat(e.target.value) 
            })}
          className="w-full bg-neutral-800 p-2 rounded text-sm"
        />
      </div>
      
      <div>
        <label className="block text-sm text-neutral-400 mb-1">Delivery Status</label>
        <select
          value={wholesaleOrderForm.delivery_status}
          onChange={(e) => setWholesaleOrderForm({ ...wholesaleOrderForm, delivery_status: e.target.value })}
          className="w-full bg-neutral-800 p-2 rounded text-sm"
        >
          <option value="shipping">Shipping</option>
          <option value="arrived">Arrived</option>
          <option value="showroom">Showroom</option>
        </select>
      </div>
    </div>
    
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={() => setShowEditWholesaleOrder(false)}
        className="px-4 py-2 rounded bg-neutral-800/60 text-sm"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 rounded bg-emerald-500/20 text-emerald-400 text-sm"
      >
        ✏️ Update Order
      </button>
    </div>
  </form>
</Modal>

        {/* ✅ Pass supplierItems + callbacks for edit/delete */}
        <CommercialCarsModal
          open={showCommercialCars}
          onClose={() => setShowCommercialCars(false)}
          commercial={selectedCommercial}
          cars={cars}
          suppliers={fournisseurs}
          currencyList={currencyList}
          supplierItems={supplierItems}
          onCarUpdate={() => {
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
              }
            };
            fetchCars();
          }}
          onCarDelete={(carId) => {
            const handleDelete = async (id) => {
              if (!window.confirm("Are you sure you want to delete this car?")) return;
              try {
                const response = await apiFetch(`${API_BASE}/cars/?car_id=${id}`, {
                  method: "DELETE",
                });
                if (response.ok) {
                  alert("Car deleted successfully!");
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
                    }
                  };
                  fetchCars();
                } else {
                  alert("Failed to delete car");
                }
              } catch (error) {
                console.error("Delete error:", error);
                alert("Error deleting car");
              }
            };
            handleDelete(carId);
          }}
          
        />
      </main>
    </div>
  );
}