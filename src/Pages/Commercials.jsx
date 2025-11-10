import React, { useState, useEffect, useMemo } from "react";

import { Search } from "lucide-react";

const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com";

const Commercials = () => {
  const [activeTab, setActiveTab] = useState("addClient");
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [newClient, setNewClient] = useState({ 
    name: "", 
    surname: "",
    phone: "", 
    password: "",
    wilaya: "",
    address: "" 
  });
  const [newOrder, setNewOrder] = useState({ 
    client_id: "", 
    car_id: "", 
    delivery_status: "shipping" 
  });
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedCarPriceInfo, setSelectedCarPriceInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit states
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editForm, setEditForm] = useState({ 
    payment_amount: "", 
    delivery_status: "" 
  });

  // Build currency map for fast lookup
  const currencyMap = useMemo(() => {
    const map = new Map();
    currencies.forEach(c => {
      if (c.id !== undefined) map.set(c.id, c);
    });
    return map;
  }, [currencies]);

  // Helper to compute car prices
  const getCarPriceInfo = (car) => {
    if (!car || !car.price || car.currency_id === undefined) {
      return { originalPrice: car?.price || null, currencyCode: "???", priceInDZD: null };
    }
    const currency = currencyMap.get(car.currency_id);
    const priceInDZD = currency ? car.price * currency.exchange_rate_to_dzd : null;
    return {
      originalPrice: car.price,
      currencyCode: currency?.code || "???",
      priceInDZD
    };
  };

  // Fetch data on mount
  useEffect(() => {
    fetchClients();
    fetchOrders();
    fetchCars();
    fetchCurrencies();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/clients/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch clients");
      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError("Erreur lors du chargement des clients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cars/all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error("Failed to fetch cars");
      const data = await response.json();
      setCars(data);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/currencies/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch currencies");
      const data = await response.json();
      setCurrencies(data);
    } catch (err) {
      console.error("Error fetching currencies:", err);
    }
  };

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.surname || !newClient.phone || !newClient.password || !newClient.wilaya || !newClient.address) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/clients/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClient.name,
          surname: newClient.surname,
          phone_number: newClient.phone,
          password: newClient.password,
          wilaya: newClient.wilaya,
          address: newClient.address,
        }),
      });

      if (!response.ok) throw new Error("Failed to add client");

      alert("Client ajouté avec succès!");
      setNewClient({ name: "", surname: "", phone: "", password: "", wilaya: "", address: "" });
      fetchClients();
    } catch (err) {
      alert("Erreur lors de l'ajout du client");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = async () => {
    if (!newOrder.client_id || !newOrder.car_id) {
      alert("Veuillez sélectionner un client et une voiture !");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error("Échec de la création de la commande");

      alert("Commande ajoutée avec succès !");
      setNewOrder({ client_id: "", car_id: "", delivery_status: "shipping" });
      fetchOrders();
    } catch (err) {
      alert("Erreur lors de l'ajout de la commande");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (orderId) => {
    try {
      setLoading(true);
      const body = {
        order_id: orderId,
        ...(editForm.payment_amount !== "" && { payment_amount: parseFloat(editForm.payment_amount) }),
        ...(editForm.delivery_status && { delivery_status: editForm.delivery_status }),
      };

      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Échec de la mise à jour");

      alert("Commande mise à jour !");
      setEditingOrderId(null);
      setEditForm({ payment_amount: "", delivery_status: "" });
      fetchOrders();
    } catch (err) {
      alert("Erreur lors de la mise à jour");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Êtes-vous sûr de supprimer cette commande ?")) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/orders/?order_id=${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Échec de la suppression");

      alert("Commande supprimée !");
      fetchOrders();
    } catch (err) {
      alert("Erreur lors de la suppression");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggletab = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  // Group cars by model for display
  const groupedCars = cars.reduce((acc, car) => {
    const existing = acc.find(c => c.model === car.model);
    if (existing) {
      existing.quantity += 1;
      if (!existing.colors.includes(car.color)) {
        existing.colors.push(car.color);
      }
    } else {
      acc.push({
        model: car.model,
        quantity: 1,
        colors: [car.color],
      });
    }
    return acc;
  }, []);

  const getStatusText = (deliveryStatus) => {
    switch (deliveryStatus) {
      case "shipping": return "En expédition";
      case "arrived": return "Arrivé";
      case "showroom": return "En showroom";
      default: return deliveryStatus;
    }
  };

  return (
    <div className="h-screen w-screen font-main flex bg-gradient-to-br from-neutral-950 to-neutral-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed z-20 h-screen w-64 ${menuOpen ? 'translate-x-0' : '-translate-x-64'} md:translate-x-0 flex flex-col bg-neutral-900 border-r border-neutral-800 p-4 transition-transform duration-300`}>
        <div className="flex flex-col gap-4">
          <button onClick={toggleMenu} className="md:hidden self-start p-2 hover:bg-neutral-800 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          </button>

          <h2 className="text-2xl font-bold mb-6">Palmier Auto</h2>
          
          <button
            onClick={() => toggletab('addClient')}
            className={`w-full p-3 text-left rounded-lg flex items-center gap-3 transition ${activeTab === 'addClient' ? 'bg-emerald-600' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
            </svg>
            <span className="text-sm">Ajouter un client</span>
          </button>
          
          <button
            onClick={() => toggletab('orders')}
            className={`w-full p-3 text-left rounded-lg flex items-center gap-3 transition ${activeTab === 'orders' ? 'bg-emerald-600' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
            <span className="text-sm">Commandes</span>
          </button>
          
          <button
            onClick={() => toggletab('cars')}
            className={`w-full p-3 text-left rounded-lg flex items-center gap-3 transition ${activeTab === 'cars' ? 'bg-emerald-600' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 256 256">
              <path fill="#fff" d="M240 112h-10.8l-27.78-62.5A16 16 0 0 0 186.8 40H69.2a16 16 0 0 0-14.62 9.5L26.8 112H16a8 8 0 0 0 0 16h8v80a16 16 0 0 0 16 16h24a16 16 0 0 0 16-16v-16h96v16a16 16 0 0 0 16 16h24a16 16 0 0 0 16-16v-80h8a8 8 0 0 0 0-16ZM69.2 56h117.6l24.89 56H44.31ZM64 208H40v-16h24Zm128 0v-16h24v16Zm24-32H40v-48h176ZM56 152a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16H64a8 8 0 0 1-8-8Zm112 0a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16h-16a8 8 0 0 1-8-8Z"></path>
            </svg>
            <span className="text-sm">Voiture Disponible</span>
          </button>
          
          <button
            onClick={() => toggletab('requests')}
            className={`w-full p-3 text-left rounded-lg flex items-center gap-3 transition ${activeTab === 'requests' ? 'bg-emerald-600' : 'bg-neutral-800 hover:bg-neutral-700'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            <span className="text-sm">Demande Client</span>
          </button>
        </div>

        <button className="mt-auto w-full p-3 text-left rounded-lg flex items-center gap-3 bg-red-600 hover:bg-red-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          <span className="text-sm">Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 overflow-y-auto p-8">
        <button onClick={toggleMenu} className="md:hidden mb-4 p-2 hover:bg-neutral-800 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="gray" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
        </button>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* ADD CLIENT */}
        {activeTab === "addClient" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-semibold">Ajouter un Client</h1>
            
            <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800">
              <h2 className="text-xl font-semibold mb-4">Nouveau Client</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="bg-neutral-800 p-3 rounded-lg outline-none"
                />
                <input
                  type="text"
                  placeholder="Prénom"
                  value={newClient.surname}
                  onChange={(e) => setNewClient({ ...newClient, surname: e.target.value })}
                  className="bg-neutral-800 p-3 rounded-lg outline-none"
                />
                <input
                  type="text"
                  placeholder="Téléphone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="bg-neutral-800 p-3 rounded-lg outline-none"
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={newClient.password}
                  onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                  className="bg-neutral-800 p-3 rounded-lg outline-none"
                />
                <input
                  type="text"
                  placeholder="Wilaya"
                  value={newClient.wilaya}
                  onChange={(e) => setNewClient({ ...newClient, wilaya: e.target.value })}
                  className="bg-neutral-800 p-3 rounded-lg outline-none"
                />
                <input
                  type="text"
                  placeholder="Adresse"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  className="bg-neutral-800 p-3 rounded-lg outline-none"
                />
              </div>
              <button
                onClick={handleAddClient}
                disabled={loading}
                className="mt-4 w-full bg-emerald-600 py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Chargement..." : "Ajouter Client"}
              </button>
            </div>

            <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800">
              <h2 className="text-xl font-semibold mb-4">Clients Enregistrés</h2>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {loading ? (
                  <p className="text-neutral-500">Chargement...</p>
                ) : clients.length === 0 ? (
                  <p className="text-neutral-500">Aucun client ajouté.</p>
                ) : (
                  clients.map((c) => (
                    <div key={c.id} className="bg-neutral-800 p-4 rounded-xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-lg">{c.name} {c.surname}</p>
                          <p className="text-sm text-neutral-400">{c.phone_number}</p>
                          <p className="text-xs text-neutral-500 mt-1">{c.wilaya} - {c.address}</p>
                        </div>
                        <span className="text-green-400 text-sm">#{c.id}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div>
            {/* Add Order Form */}
            <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Ajouter une Commande</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={newOrder.client_id}
                  onChange={(e) => setNewOrder({ ...newOrder, client_id: e.target.value })}
                  className="bg-neutral-800 p-3 rounded-lg outline-none"
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.surname} ({client.phone_number})
                    </option>
                  ))}
                </select>

                <select
                  value={newOrder.car_id}
                  onChange={(e) => setNewOrder({ ...newOrder, car_id: e.target.value })}
                  className="bg-neutral-800 p-3 rounded-lg outline-none"
                >
                  <option value="">Sélectionner une voiture</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.model} - {car.color} ({car.year})
                    </option>
                  ))}
                </select>

                <select
                  value={newOrder.delivery_status}
                  onChange={(e) => setNewOrder({ ...newOrder, delivery_status: e.target.value })}
                  className="bg-neutral-800 p-3 rounded-lg outline-none"
                >
                  <option value="shipping">En expédition</option>
                  <option value="arrived">Arrivé</option>
                  <option value="showroom">En showroom</option>
                </select>

                <button
                  onClick={handleAddOrder}
                  disabled={loading}
                  className="bg-emerald-600 py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? "Chargement..." : "Ajouter Commande"}
                </button>
              </div>
            </div>

            {/* Orders List */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">Commandes</h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-neutral-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="bg-neutral-800 pl-10 pr-3 py-2 rounded-lg outline-none text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
              {orders
                .filter(
                  (o) =>
                    (o.client_name && o.client_name.toLowerCase().includes(search.toLowerCase())) ||
                    (o.car_model && o.car_model.toLowerCase().includes(search.toLowerCase()))
                )
                .map((order) => (
                  <div key={order.order_id} className="p-6 bg-neutral-900/90 rounded-2xl border border-neutral-800">
                    {editingOrderId === order.order_id ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{order.car_model}</h3>
                          <button
                            onClick={() => setEditingOrderId(null)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Annuler
                          </button>
                        </div>

                        <div>
                          <label className="text-sm text-neutral-400">Paiement (DZD)</label>
                          <input
                            type="number"
                            defaultValue={order.payment_amount || ""}
                            onChange={(e) => setEditForm({ ...editForm, payment_amount: e.target.value })}
                            className="w-full bg-neutral-800 p-2 rounded mt-1 text-sm"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-neutral-400">Statut</label>
                          <select
                            defaultValue={order.delivery_status}
                            onChange={(e) => setEditForm({ ...editForm, delivery_status: e.target.value })}
                            className="w-full bg-neutral-800 p-2 rounded mt-1 text-sm"
                          >
                            <option value="shipping">En expédition</option>
                            <option value="arrived">Arrivé</option>
                            <option value="showroom">En showroom</option>
                          </select>
                        </div>

                        <button
                          onClick={() => handleUpdateOrder(order.order_id)}
                          className="w-full bg-blue-600 py-2 rounded text-sm hover:bg-blue-700"
                        >
                          Sauvegarder
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">{order.car_model}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingOrderId(order.order_id);
                                setEditForm({
                                  payment_amount: order.payment_amount || "",
                                  delivery_status: order.delivery_status || "shipping",
                                });
                              }}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.order_id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-400">Client: {order.client_name} {order.client_surname}</p>
                        <p className="text-sm text-neutral-400">Téléphone: {order.client_phone}</p>
                        <p className="text-sm mt-2">
                          <span className="text-neutral-400">Statut:</span>{" "}
                          <span className="text-white">{getStatusText(order.delivery_status)}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-neutral-400">Prix:</span>{" "}
                          <span className="text-green-400">{order.price_dzd?.toLocaleString() || 0} DZD</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-neutral-400">Payé:</span>{" "}
                          <span className="text-blue-400">{order.payment_amount?.toLocaleString() || 0} DZD</span>
                        </p>
                      </>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* REQUESTS */}
        {activeTab === "requests" && (
          <div>
            <h2 className="text-3xl font-semibold mb-6">Demande à l'Admin</h2>
            <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 max-w-2xl">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Modèle non disponible"
                  className="w-full bg-neutral-800 p-3 rounded-lg outline-none"
                />
                <textarea
                  placeholder="Détails ou remarques..."
                  className="w-full bg-neutral-800 p-3 rounded-lg outline-none h-40 resize-none"
                ></textarea>
                <button className="w-full bg-emerald-600 py-3 rounded-lg hover:bg-green-700 font-medium transition">
                  Envoyer la demande
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CARS */}
        {activeTab === "cars" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">Voitures Disponibles</h2>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-neutral-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher un modèle..."
                  className="bg-neutral-800 pl-10 pr-3 py-2 rounded-lg outline-none text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
              {groupedCars
                .filter((car) =>
                  car.model.toLowerCase().includes(search.toLowerCase())
                )
                .map((groupedCar, index) => {
                  const representativeCar = cars.find(c => c.model === groupedCar.model && c.color === groupedCar.colors[0]);
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (representativeCar) {
                          setSelectedCar(representativeCar);
                          setSelectedCarPriceInfo(getCarPriceInfo(representativeCar));
                          setIsModalOpen(true);
                        }
                      }}
                      className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 hover:scale-105 hover:bg-neutral-800 cursor-pointer transition"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-lg">{groupedCar.model}</h3>
                        <span className="text-green-500 font-medium">
                          {groupedCar.quantity} unités
                        </span>
                      </div>
                      <p className="text-neutral-400 text-sm mb-2">
                        Couleurs disponibles :
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {groupedCar.colors.map((color, i) => (
                          <span
                            key={i}
                            className="bg-neutral-800 px-3 py-1 rounded-full text-sm border border-neutral-700"
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Car Detail Modal */}
        {isModalOpen && selectedCar && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-neutral-700">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCar.model} <span className="text-emerald-400">({selectedCar.year})</span>
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-neutral-400 hover:text-white text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-neutral-400">Couleur:</span>{" "}
                      <span className="text-white ml-1">{selectedCar.color}</span>
                    </div>
                    {selectedCarPriceInfo && (
                      <>
                        <div>
                          <span className="text-neutral-400">Prix ({selectedCarPriceInfo.currencyCode}):</span>{" "}
                          <span className="text-white ml-1">
                            {selectedCarPriceInfo.originalPrice?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                        {selectedCarPriceInfo.priceInDZD !== null && (
                          <div className="md:col-span-2 pt-2 border-t border-neutral-700">
                            <span className="text-neutral-400">Prix en DZD:</span>{" "}
                            <span className="text-green-400 ml-1 font-medium">
                              {selectedCarPriceInfo.priceInDZD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {selectedCar.engine && (
                    <div>
                      <span className="text-neutral-400">Moteur:</span>{" "}
                      <span className="text-white ml-1">{selectedCar.engine}</span>
                    </div>
                  )}

                  {selectedCar.power && (
                    <div>
                      <span className="text-neutral-400">Puissance:</span>{" "}
                      <span className="text-white ml-1">{selectedCar.power}</span>
                    </div>
                  )}

                  {selectedCar.fuel_type && (
                    <div>
                      <span className="text-neutral-400">Carburant:</span>{" "}
                      <span className="text-white ml-1">{selectedCar.fuel_type}</span>
                    </div>
                  )}

                  {selectedCar.milage !== undefined && (
                    <div>
                      <span className="text-neutral-400">Kilométrage:</span>{" "}
                      <span className="text-white ml-1">{selectedCar.milage} km</span>
                    </div>
                  )}

                  {selectedCar.country && (
                    <div>
                      <span className="text-neutral-400">Origine:</span>{" "}
                      <span className="text-white ml-1">{selectedCar.country}</span>
                    </div>
                  )}

                  {selectedCar.shipping_date && (
                    <div>
                      <span className="text-neutral-400">Date d'expédition:</span>{" "}
                      <span className="text-white ml-1">{selectedCar.shipping_date}</span>
                    </div>
                  )}

                  {selectedCar.arriving_date && (
                    <div>
                      <span className="text-neutral-400">Date d'arrivée:</span>{" "}
                      <span className="text-white ml-1">{selectedCar.arriving_date}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Commercials;