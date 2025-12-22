import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Car, Trash2, Edit, X, Upload, Image as ImageIcon } from "lucide-react";
import { parseColors } from "../lib/utils";

const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com";

const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("authToken");
  
  console.log("Making request to:", url);
  console.log("Token exists:", !!token);
  
  const headers = {
    ...(options.headers || {}),
  };
  
  if (token && !url.includes("/users/login")) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData - browser handles it
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      console.error("401 Unauthorized - Token may be invalid or expired");
      localStorage.removeItem("authToken");
      
      if (!url.includes("/users/login") && window.location.pathname !== "/marketinglogin") {
        const currentPath = window.location.pathname;
        const redirectParam = `?redirect=${encodeURIComponent(currentPath)}`;
        window.location.href = `/marketinglogin${redirectParam}`;
      }
      throw new Error("Session expired");
    }

    return response;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

const MarketingAgent = () => {
  const [cars, setCars] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currencyMap = useMemo(() => {
    const map = {};
    currencies.forEach((currency) => {
      map[currency.id] = currency;
    });
    return map;
  }, [currencies]);

  const [formData, setFormData] = useState({
    currency_id: "",
    model: "",
    description: "",
    color: [],
    year: "",
    engine: "",
    power: "",
    fuel_type: "",
    milage: "",
    country: "",
    quantity: "",
    price: "",
    wholesale_price: "",
    shipping_date: "",
    arriving_date: "",
    images: [],
  });

  const [filter, setFilter] = useState({
    model: "",
    color: "",
    yearFrom: "",
    yearTo: "",
    country: "",
  });

  const [selectedCar, setSelectedCar] = useState(null);
  
  const [editForm, setEditForm] = useState({
    car_id: "",
    currency_id: "",
    model: "",
    description: "",
    color: [],
    year: "",
    engine: "",
    power: "",
    fuel_type: "",
    milage: "",
    country: "",
    quantity: "",
    price: "",
    wholesale_price: "",
    shipping_date: "",
    arriving_date: "",
    images: [],
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("New");
  const [showFilter, setShowFilter] = useState(false);
  
  const [colorInput, setColorInput] = useState("");
  const [editColorInput, setEditColorInput] = useState("");

  // Image preview states
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editImagePreviews, setEditImagePreviews] = useState([]);

  const isFieldEmpty = (value) => value === "" || value == null;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found");
      window.location.href = "/marketinglogin";
      return;
    }
    
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await fetchCurrencies();
      await fetchCars();
      
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCars = async () => {
    try {
      console.log("Fetching cars...");
      const response = await apiFetch(`${API_BASE_URL}/cars/all`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch cars: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Cars fetched successfully:", Array.isArray(data) ? data.length : 0);
      const normalized = (Array.isArray(data) ? data : []).map(car => {
        const colors = parseColors(car.color);
        return { ...car, colors, color: colors[0] || car.color };
      });
      setCars(normalized);
    } catch (error) {
      console.error("Error fetching cars:", error);
      throw error;
    }
  };

  const fetchCurrencies = async () => {
    try {
      console.log("Fetching currencies...");
      const response = await apiFetch(`${API_BASE_URL}/currencies/`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch currencies: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Currencies fetched successfully:", data.length);
      setCurrencies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      throw error;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addColor = () => {
    if (colorInput.trim() && !formData.color.includes(colorInput.trim())) {
      setFormData({ ...formData, color: [...formData.color, colorInput.trim()] });
      setColorInput("");
    }
  };

  const removeColor = (colorToRemove) => {
    setFormData({ ...formData, color: formData.color.filter(c => c !== colorToRemove) });
  };

  const addEditColor = () => {
    if (editColorInput.trim() && !editForm.color.includes(editColorInput.trim())) {
      setEditForm({ ...editForm, color: [...editForm.color, editColorInput.trim()] });
      setEditColorInput("");
    }
  };

  const removeEditColor = (colorToRemove) => {
    setEditForm({ ...editForm, color: editForm.color.filter(c => c !== colorToRemove) });
  };

  // Handle image selection for new car
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Create preview URLs
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setImagePreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  // Remove image from new car form
  const removeImage = (index) => {
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      // Revoke the URL to free memory
      URL.revokeObjectURL(newPreviews[index].url);
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle image selection for edit car
  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Create preview URLs
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setEditImagePreviews(prev => [...prev, ...newPreviews]);
    setEditForm(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  // Remove image from edit car form
  const removeEditImage = (index) => {
    setEditImagePreviews(prev => {
      const newPreviews = [...prev];
      // Revoke the URL to free memory
      URL.revokeObjectURL(newPreviews[index].url);
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddCar = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "currency_id",
      "model",
      "year",
      "engine",
      "power",
      "fuel_type",
      "milage",
      "country",
      "quantity",
      "price",
      "wholesale_price",
      "shipping_date",
      "arriving_date",
    ];

    for (const field of requiredFields) {
      if (isFieldEmpty(formData[field])) {
        alert("Veuillez remplir tous les champs obligatoires");
        return;
      }
    }

    if (!formData.color || formData.color.length === 0) {
      alert("Veuillez ajouter au moins une couleur");
      return;
    }

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("currency_id", parseInt(formData.currency_id));
      formDataToSend.append("model", formData.model);
      
      if (formData.description) {
        formDataToSend.append("description", formData.description);
      }
      
      formData.color.forEach(color => {
        formDataToSend.append("color", color);
      });
      
      formDataToSend.append("year", parseInt(formData.year));
      formDataToSend.append("engine", formData.engine);
      formDataToSend.append("power", formData.power);
      formDataToSend.append("fuel_type", formData.fuel_type);
      formDataToSend.append("milage", parseFloat(formData.milage));
      formDataToSend.append("country", formData.country);
      formDataToSend.append("quantity", parseInt(formData.quantity));
      formDataToSend.append("price", parseFloat(formData.price));
      formDataToSend.append("wholesale_price", parseFloat(formData.wholesale_price));
      formDataToSend.append("shipping_date", formData.shipping_date);
      formDataToSend.append("arriving_date", formData.arriving_date);
      
      // Append all images
      formData.images.forEach(file => {
        formDataToSend.append("images", file);
      });

      console.log(`Adding car with ${formData.images.length} images`);

      const response = await apiFetch(`${API_BASE_URL}/cars/`, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Voiture ajoutée avec succès!");
        
        // Clean up preview URLs
        imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
        
        // Reset form
        setFormData({
          currency_id: "",
          model: "",
          description: "",
          color: [],
          year: "",
          engine: "",
          power: "",
          fuel_type: "",
          milage: "",
          country: "",
          quantity: "",
          price: "",
          wholesale_price: "",
          shipping_date: "",
          arriving_date: "",
          images: [],
        });
        setColorInput("");
        setImagePreviews([]);
        fetchCars();
      } else {
        const error = await response.json().catch(() => ({}));
        alert(`Erreur: ${error.detail ? JSON.stringify(error.detail) : "Échec de l'ajout"}`);
      }
    } catch (error) {
      console.error("Error adding car:", error);
      alert("Erreur réseau lors de l'ajout");
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette voiture ?")) return;

    try {
      const response = await apiFetch(`${API_BASE_URL}/cars/?car_id=${carId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Voiture supprimée !");
        fetchCars();
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Erreur réseau");
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const clearFilter = () => {
    setFilter({ model: "", color: "", yearFrom: "", yearTo: "", country: "" });
  };

  const filteredCars = cars.filter((car) => {
    if (filter.model && !car.model?.toLowerCase().includes(filter.model.toLowerCase())) return false;
    if (filter.color && !car.color?.toLowerCase().includes(filter.color.toLowerCase())) return false;
    if (filter.country && !car.country?.toLowerCase().includes(filter.country.toLowerCase())) return false;
    if (filter.yearFrom && Number(car.year) < Number(filter.yearFrom)) return false;
    if (filter.yearTo && Number(car.year) > Number(filter.yearTo)) return false;
    return true;
  });

  const selectCarToEdit = (car) => {
    setSelectedCar(car.id);
    const colors = parseColors(car.color);
    setEditForm({
      car_id: car.id,
      currency_id: car.currency_id || "",
      model: car.model || "",
      description: car.description || "",
      color: colors,
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
    setEditColorInput("");
    setEditImagePreviews([]);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append("car_id", editForm.car_id);
      
      if (editForm.currency_id && editForm.currency_id !== "") {
        formDataToSend.append("currency_id", parseInt(editForm.currency_id));
      }
      
      if (editForm.model && editForm.model.trim() !== "") {
        formDataToSend.append("model", editForm.model.trim());
      }
      
      if (editForm.description && editForm.description.trim() !== "") {
        formDataToSend.append("description", editForm.description.trim());
      }
      
      if (editForm.color && editForm.color.length > 0) {
        editForm.color.forEach(color => {
          formDataToSend.append("color", color);
        });
      }
      
      if (editForm.year && editForm.year !== "") {
        formDataToSend.append("year", parseInt(editForm.year));
      }
      
      if (editForm.engine && editForm.engine.trim() !== "") {
        formDataToSend.append("engine", editForm.engine.trim());
      }
      
      if (editForm.power && editForm.power.trim() !== "") {
        formDataToSend.append("power", editForm.power.trim());
      }
      
      if (editForm.fuel_type && editForm.fuel_type.trim() !== "") {
        formDataToSend.append("fuel_type", editForm.fuel_type.trim());
      }
      
      if (editForm.milage && editForm.milage !== "") {
        formDataToSend.append("milage", parseFloat(editForm.milage));
      }
      
      if (editForm.country && editForm.country.trim() !== "") {
        formDataToSend.append("country", editForm.country.trim());
      }
      
      if (editForm.quantity && editForm.quantity !== "") {
        formDataToSend.append("quantity", parseInt(editForm.quantity));
      }
      
      if (editForm.price && editForm.price !== "") {
        formDataToSend.append("price", parseFloat(editForm.price));
      }
      
      if (editForm.wholesale_price && editForm.wholesale_price !== "") {
        formDataToSend.append("wholesale_price", parseFloat(editForm.wholesale_price));
      }
      
      if (editForm.shipping_date && editForm.shipping_date !== "") {
        formDataToSend.append("shipping_date", editForm.shipping_date);
      }
      
      if (editForm.arriving_date && editForm.arriving_date !== "") {
        formDataToSend.append("arriving_date", editForm.arriving_date);
      }
      
      // Append all new images
      if (editForm.images && editForm.images.length > 0) {
        editForm.images.forEach(file => {
          formDataToSend.append("images", file);
        });
        console.log(`Editing car with ${editForm.images.length} new images`);
      }

      console.log("Editing car with ID:", editForm.car_id);

      const response = await apiFetch(`${API_BASE_URL}/cars/`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Voiture modifiée avec succès !");
        
        // Clean up preview URLs
        editImagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
        
        setSelectedCar(null);
        setEditColorInput("");
        setEditImagePreviews([]);
        fetchCars();
      } else {
        const contentType = response.headers.get("content-type");
        let errorDetails = "Échec de la modification";
        
        if (contentType && contentType.includes("application/json")) {
          try {
            const error = await response.json();
            console.error("Edit error response:", error);
            
            if (Array.isArray(error.detail)) {
              errorDetails = error.detail.map(e => `${e.loc.join('.')}: ${e.msg}`).join('\n');
            } else if (error.detail) {
              errorDetails = error.detail;
            } else if (error.message) {
              errorDetails = error.message;
            }
          } catch (parseError) {
            console.error("Failed to parse error JSON:", parseError);
          }
        } else {
          try {
            const errorText = await response.text();
            console.error("Edit error text:", errorText);
            errorDetails = errorText || `HTTP ${response.status}: ${response.statusText}`;
          } catch (textError) {
            errorDetails = `HTTP ${response.status}: ${response.statusText}`;
          }
        }
        
        alert(`Erreur lors de la modification:\n\n${errorDetails}`);
      }
    } catch (error) {
      console.error("Edit error:", error);
      alert("Erreur réseau: " + error.message);
    }
  };

  const handleCancelEdit = () => {
    // Clean up preview URLs
    editImagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    
    setSelectedCar(null);
    setEditColorInput("");
    setEditImagePreviews([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/marketinglogin";
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const switchTab = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
      editImagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">Chargement...</div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className={`fixed z-20 h-screen w-[15vw] max-md:w-[40vw] ${
          menuOpen ? "" : "ml-[-40vw]"
        } justify-between flex flex-col bg-neutral-900 border-r border-neutral-800 p-4 transition-all duration-300`}
      >
        <ul className="flex flex-col gap-[2vh]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="gray"
            onClick={toggleMenu}
            className="size-[3vh] cursor-pointer hover:scale-105 transition-all"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>

          <h2 className="text-xl mb-[4vh]">Palmier Auto</h2>
          <motion.li
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            onClick={() => switchTab("New")}
            className={`w-[90%] p-[2vh] text-[2vh] cursor-pointer ${
              activeTab === "New" ? "bg-emerald-600" : "bg-neutral-800 hover:bg-neutral-700"
            } rounded-lg text-center flex justify-start items-center gap-[0.2vw] transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
            <h1>Nouvelle voiture</h1>
          </motion.li>
          <motion.li
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 1 }}
            onClick={() => switchTab("Modify")}
            className={`w-[90%] p-[2vh] text-[2vh] cursor-pointer ${
              activeTab === "Modify" ? "bg-emerald-600" : "bg-neutral-800 hover:bg-neutral-700"
            } rounded-lg text-center flex justify-start items-center gap-[0.2vw] transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            <h1>Modifier les voitures</h1>
          </motion.li>
        </ul>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 1 }}
          onClick={handleLogout}
          className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-red-600 hover:bg-red-700 rounded-lg text-center flex justify-start items-center gap-[0.2vw] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[3vh]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          <h1>Logout</h1>
        </motion.div>
      </motion.div>

      {/* Main Content: New Tab */}
      {activeTab === "New" && (
        <div className="flex-1 px-[3vw] overflow-y-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.3}
            stroke="gray"
            onClick={toggleMenu}
            className="size-[5vh] cursor-pointer my-[2vh] hover:scale-110 transition-all"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>

          <motion.h1
            className="text-3xl font-bold mb-6 text-emerald-400"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Ajouter une voiture à l'inventaire
          </motion.h1>

          <motion.form
            onSubmit={handleAddCar}
            className="bg-neutral-900 rounded-2xl p-6 mb-10 border border-neutral-800 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                name="currency_id"
                value={formData.currency_id}
                onChange={handleChange}
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Sélectionner Devise *</option>
                {currencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>

              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Modèle *"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description (facultatif)"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              />
              
              <div className="md:col-span-3">
                <label className="block text-sm text-emerald-400 mb-2">Couleurs * (Ajoutez plusieurs couleurs)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                    placeholder="Entrez une couleur"
                    className="flex-1 bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="bg-emerald-600 hover:bg-emerald-700 px-4 rounded-xl"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                {formData.color.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.color.map((color, idx) => (
                      <span
                        key={idx}
                        className="bg-neutral-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          className="text-red-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <input
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Année *"
                type="number"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="engine"
                value={formData.engine}
                onChange={handleChange}
                placeholder="Moteur *"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="power"
                value={formData.power}
                onChange={handleChange}
                placeholder="Puissance *"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                placeholder="Type de carburant *"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="milage"
                value={formData.milage}
                onChange={handleChange}
                placeholder="Kilométrage *"
                type="number"
                step="0.01"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Quantité *"
                type="number"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Pays *"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Prix *"
                type="number"
                step="0.01"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="wholesale_price"
                value={formData.wholesale_price}
                onChange={handleChange}
                placeholder="Prix de gros *"
                type="number"
                step="0.01"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="shipping_date"
                value={formData.shipping_date}
                onChange={handleChange}
                type="date"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                name="arriving_date"
                value={formData.arriving_date}
                onChange={handleChange}
                type="date"
                className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              
              {/* Enhanced Image Upload Section */}
              <div className="md:col-span-3">
                <label className="block text-sm text-emerald-400 mb-2 flex items-center gap-2">
                  <ImageIcon size={18} />
                  Photos (Ajoutez plusieurs photos)
                </label>
                
                <div className="border-2 border-dashed border-neutral-700 rounded-xl p-4 hover:border-emerald-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload size={40} className="text-neutral-500 mb-2" />
                    <span className="text-sm text-neutral-400">
                      Cliquez pour ajouter des images ou glissez-les ici
                    </span>
                    <span className="text-xs text-neutral-500 mt-1">
                      PNG, JPG, WEBP jusqu'à 10MB chacune
                    </span>
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-emerald-400 mb-3 flex items-center gap-2">
                      <ImageIcon size={16} />
                      {imagePreviews.length} image{imagePreviews.length > 1 ? 's' : ''} sélectionnée{imagePreviews.length > 1 ? 's' : ''}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {imagePreviews.map((preview, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={preview.url}
                            alt={`preview ${i + 1}`}
                            className="w-full h-24 object-cover rounded-lg border-2 border-neutral-700 group-hover:border-emerald-500 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white shadow-lg transition-colors"
                            title="Supprimer cette image"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-lg truncate">
                            {preview.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 bg-emerald-600 hover:bg-emerald-700 transition px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-medium shadow-lg"
            >
              <Plus size={18} /> Ajouter la voiture
            </button>
          </motion.form>

          <motion.div
            className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
              <Car size={22} /> Voitures ajoutées ({cars.length})
            </h2>
            {cars.length === 0 ? (
              <p className="text-neutral-500">Aucune voiture ajoutée.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="border-b border-neutral-800 text-neutral-400 text-sm">
                    <tr>
                      <th className="p-2">Modèle</th>
                      <th className="p-2">Couleur</th>
                      <th className="p-2">Année</th>
                      <th className="p-2">Pays</th>
                      <th className="p-2">Prix</th>
                      <th className="p-2">Prix gros</th>
                      <th className="p-2">Devise</th>
                      <th className="p-2">Kilométrage</th>
                      <th className="p-2">Quantité</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <tr key={car.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                        <td className="p-2">{car.model}</td>
                        <td className="p-2">{car.color}</td>
                        <td className="p-2">{car.year}</td>
                        <td className="p-2">{car.country}</td>
                        <td className="p-2">{car.price}</td>
                        <td className="p-2">{car.wholesale_price}</td>
                        <td className="p-2">{currencyMap[car.currency_id]?.name || "Unknown"}</td>
                        <td className="p-2">{car.milage}</td>
                        <td className="p-2">{car.quantity}</td>
                        <td className="p-2 flex gap-2">
                          <button onClick={() => handleDelete(car.id)} className="text-red-400 hover:text-red-500">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Modify Tab */}
      {activeTab === "Modify" && (
        <div className="min-h-screen w-screen px-[3vw] py-[2vh] text-neutral-100 relative overflow-y-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.3}
            stroke="gray"
            onClick={toggleMenu}
            className="size-[5vh] cursor-pointer my-[2vh] hover:scale-110 transition-all"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>

          <div className="flex justify-between items-center mb-6">
            <div
              onClick={() => setShowFilter(true)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              <h1 className="text-sm font-sans">Filtrer</h1>
            </div>
            <h1 className="text-sm text-neutral-400">Total: {filteredCars.length}</h1>
          </div>

          {/* Filter Modal */}
          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="absolute top-[10vh] left-1/2 -translate-x-1/2 bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-lg z-30 w-[90%] md:w-[60%]"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-emerald-400">Filtrer les voitures</h2>
                  <button onClick={() => setShowFilter(false)} className="text-neutral-400 hover:text-red-500 transition">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    name="model"
                    value={filter.model}
                    onChange={handleFilterChange}
                    placeholder="Modèle"
                    className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    name="color"
                    value={filter.color}
                    onChange={handleFilterChange}
                    placeholder="Couleur"
                    className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    name="country"
                    value={filter.country}
                    onChange={handleFilterChange}
                    placeholder="Pays"
                    className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    name="yearFrom"
                    value={filter.yearFrom}
                    onChange={handleFilterChange}
                    placeholder="Année min"
                    type="number"
                    className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    name="yearTo"
                    value={filter.yearTo}
                    onChange={handleFilterChange}
                    placeholder="Année max"
                    type="number"
                    className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-5">
                  <button onClick={clearFilter} className="bg-neutral-700 hover:bg-neutral-600 transition px-4 py-2 rounded-xl text-sm">
                    Réinitialiser
                  </button>
                  <button onClick={() => setShowFilter(false)} className="bg-emerald-600 hover:bg-emerald-700 transition px-4 py-2 rounded-xl text-sm">
                    Appliquer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Modal */}
          <AnimatePresence>
            {selectedCar && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4"
                onClick={handleCancelEdit}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-emerald-400">Modifier la voiture</h2>
                    <button onClick={handleCancelEdit} className="text-neutral-400 hover:text-red-500 transition">
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveEdit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <select
                        name="currency_id"
                        value={editForm.currency_id}
                        onChange={handleEditChange}
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Sélectionner Devise</option>
                        {currencies.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.code})
                          </option>
                        ))}
                      </select>

                      <input
                        name="model"
                        value={editForm.model}
                        onChange={handleEditChange}
                        placeholder="Modèle"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      
                      <input
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        placeholder="Description"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      
                      <div className="md:col-span-3">
                        <label className="block text-sm text-emerald-400 mb-2">Couleurs (Modifiez ou ajoutez)</label>
                        <div className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={editColorInput}
                            onChange={(e) => setEditColorInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEditColor())}
                            placeholder="Entrez une couleur"
                            className="flex-1 bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={addEditColor}
                            className="bg-emerald-600 hover:bg-emerald-700 px-4 rounded-xl"
                          >
                            <Plus size={20} />
                          </button>
                        </div>
                        {editForm.color.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {editForm.color.map((color, idx) => (
                              <span
                                key={idx}
                                className="bg-neutral-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                              >
                                {color}
                                <button
                                  type="button"
                                  onClick={() => removeEditColor(color)}
                                  className="text-red-400 hover:text-red-500"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <input
                        name="year"
                        value={editForm.year}
                        onChange={handleEditChange}
                        placeholder="Année"
                        type="number"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="engine"
                        value={editForm.engine}
                        onChange={handleEditChange}
                        placeholder="Moteur"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="power"
                        value={editForm.power}
                        onChange={handleEditChange}
                        placeholder="Puissance"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="fuel_type"
                        value={editForm.fuel_type}
                        onChange={handleEditChange}
                        placeholder="Type de carburant"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="milage"
                        value={editForm.milage}
                        onChange={handleEditChange}
                        placeholder="Kilométrage"
                        type="number"
                        step="0.01"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="quantity"
                        value={editForm.quantity}
                        onChange={handleEditChange}
                        placeholder="Quantité"
                        type="number"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="country"
                        value={editForm.country}
                        onChange={handleEditChange}
                        placeholder="Pays"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="price"
                        value={editForm.price}
                        onChange={handleEditChange}
                        placeholder="Prix"
                        type="number"
                        step="0.01"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="wholesale_price"
                        value={editForm.wholesale_price}
                        onChange={handleEditChange}
                        placeholder="Prix de gros"
                        type="number"
                        step="0.01"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="shipping_date"
                        value={editForm.shipping_date}
                        onChange={handleEditChange}
                        type="date"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        name="arriving_date"
                        value={editForm.arriving_date}
                        onChange={handleEditChange}
                        type="date"
                        className="bg-neutral-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      
                      {/* Enhanced Image Upload Section for Edit */}
                      <div className="md:col-span-3">
                        <label className="block text-sm text-emerald-400 mb-2 flex items-center gap-2">
                          <ImageIcon size={18} />
                          Ajouter de nouvelles photos
                        </label>
                        
                        <div className="border-2 border-dashed border-neutral-700 rounded-xl p-4 hover:border-emerald-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleEditImageChange}
                            className="hidden"
                            id="edit-image-upload"
                          />
                          <label
                            htmlFor="edit-image-upload"
                            className="flex flex-col items-center justify-center cursor-pointer"
                          >
                            <Upload size={40} className="text-neutral-500 mb-2" />
                            <span className="text-sm text-neutral-400">
                              Cliquez pour ajouter de nouvelles images
                            </span>
                            <span className="text-xs text-neutral-500 mt-1">
                              Ces images seront ajoutées aux images existantes
                            </span>
                          </label>
                        </div>

                        {editImagePreviews.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-emerald-400 mb-3 flex items-center gap-2">
                              <ImageIcon size={16} />
                              {editImagePreviews.length} nouvelle{editImagePreviews.length > 1 ? 's' : ''} image{editImagePreviews.length > 1 ? 's' : ''}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                              {editImagePreviews.map((preview, i) => (
                                <div key={i} className="relative group">
                                  <img
                                    src={preview.url}
                                    alt={`preview ${i + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border-2 border-neutral-700 group-hover:border-emerald-500 transition-colors"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeEditImage(i)}
                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-white shadow-lg transition-colors"
                                    title="Supprimer cette image"
                                  >
                                    ×
                                  </button>
                                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 rounded-b-lg truncate">
                                    {preview.name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                      <button type="button" onClick={handleCancelEdit} className="bg-neutral-700 hover:bg-neutral-600 transition px-4 py-2 rounded-xl text-sm">
                        Annuler
                      </button>
                      <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 transition px-6 py-3 rounded-xl text-sm flex items-center gap-2 font-medium shadow-lg">
                        <Edit size={18} /> Enregistrer
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filtered Cars Table */}
          <motion.div
            className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-emerald-400 flex items-center gap-2">
              <Car size={22} /> Résultats du filtrage
            </h2>

            {filteredCars.length === 0 ? (
              <p className="text-neutral-500">Aucune voiture trouvée.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="border-b border-neutral-800 text-neutral-400 text-sm">
                    <tr>
                      <th className="p-2">Modèle</th>
                      <th className="p-2">Couleur</th>
                      <th className="p-2">Année</th>
                      <th className="p-2">Pays</th>
                      <th className="p-2">Prix</th>
                      <th className="p-2">Prix gros</th>
                      <th className="p-2">Devise</th>
                      <th className="p-2">Kilométrage</th>
                      <th className="p-2">Quantité</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCars.map((car) => (
                      <tr key={car.id} className="border-b border-neutral-800 hover:bg-neutral-800/50">
                        <td className="p-2">{car.model}</td>
                        <td className="p-2">{car.color}</td>
                        <td className="p-2">{car.year}</td>
                        <td className="p-2">{car.country}</td>
                        <td className="p-2">{car.price}</td>
                        <td className="p-2">{car.wholesale_price}</td>
                        <td className="p-2">{currencyMap[car.currency_id]?.name || "Unknown"}</td>
                        <td className="p-2">{car.milage}</td>
                        <td className="p-2">{car.quantity}</td>
                        <td className="p-2 flex gap-2">
                          <button onClick={() => selectCarToEdit(car)} className="text-emerald-400 hover:text-emerald-500">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(car.id)} className="text-red-400 hover:text-red-500">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MarketingAgent;