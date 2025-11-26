// src/Pages/Commercials.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com";

const Commercials = () => {
  const [activeTab, setActiveTab] = useState("addClient");
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  const [newClient, setNewClient] = useState({
    name: "", surname: "", phone: "", password: "", wilaya: "", address: ""
  });

  const [newOrder, setNewOrder] = useState({
    client_id: "", car_id: "", delivery_status: "shipping"
  });

  // Separate search states
  const [searchOrders, setSearchOrders] = useState("");
  const [searchCars, setSearchCars] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedCarPriceInfo, setSelectedCarPriceInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit order
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editForm, setEditForm] = useState({ payment_amount: "", delivery_status: "" });

  // Request to admin
  const [requestModel, setRequestModel] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  const navigate = useNavigate();

  // Currency map for fast lookup
  const currencyMap = useMemo(() => {
    const map = new Map();
    currencies.forEach(c => c.id !== undefined && map.set(c.id, c));
    return map;
  }, [currencies]);

  const getCarPriceInfo = (car) => {
    if (!car?.price || car.currency_id === undefined) {
      return { originalPrice: null, currencyCode: "???", priceInDZD: null };
    }
    const currency = currencyMap.get(car.currency_id);
    const priceInDZD = currency ? car.price * currency.exchange_rate_to_dzd : null;
    return {
      originalPrice: car.price,
      currencyCode: currency?.code || "???",
      priceInDZD
    };
  };

  useEffect(() => {
    fetchClients();
    fetchOrders();
    fetchCars();
    fetchCurrencies();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/clients/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) return navigate('/commercialslogin');
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();
      setClients(data || []);
    } catch (err) {
      setError("Erreur lors du chargement des clients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/orders/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401) return navigate('/commercialslogin');
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCars = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/cars/all`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({})
      });
      if (res.status === 401) return navigate('/commercialslogin');
      if (!res.ok) throw new Error("Failed to fetch cars");
      const data = await res.json();
      setCars(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/currencies/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch currencies");
      const data = await res.json();
      setCurrencies(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.surname || !newClient.phone || !newClient.password || !newClient.wilaya || !newClient.address) {
      alert("Veuillez remplir tous les champs !");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/clients/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newClient.name,
          surname: newClient.surname,
          phone_number: newClient.phone,
          password: newClient.password,
          wilaya: newClient.wilaya,
          address: newClient.address,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("API Error:", err);
        throw new Error(err.detail || err.message || "Erreur serveur");
      }
      alert("Client ajouté avec succès!");
      setNewClient({ name: "", surname: "", phone: "", password: "", wilaya: "", address: "" });
      fetchClients();
    } catch (err) {
      console.error("Add Client Error:", err);
      alert("Erreur : " + (err.message || "Inconnu"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = async () => {
    if (!newOrder.client_id || !newOrder.car_id) {
      alert("Client et voiture requis");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newOrder),
      });
      if (!res.ok) throw new Error("Échec création commande");
      alert("Commande ajoutée !");
      setNewOrder({ client_id: "", car_id: "", delivery_status: "shipping" });
      fetchOrders();
    } catch (err) {
      alert("Erreur ajout commande");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (orderId) => {
    // Build the body - only include fields that have values
    const body = {
      order_id: orderId
    };
    
    if (editForm.payment_amount !== "") {
      body.payment_amount = parseFloat(editForm.payment_amount);
    }
    
    if (editForm.delivery_status) {
      body.delivery_status = editForm.delivery_status;
    }
    
    console.log("=== UPDATE ORDER DEBUG ===");
    console.log("Order ID:", orderId);
    console.log("Edit Form:", editForm);
    console.log("Request Body:", JSON.stringify(body, null, 2));
    console.log("API URL:", `${API_BASE_URL}/orders/`);
    
    const token = localStorage.getItem('authToken');
    console.log("Token exists:", !!token);
    
    try {
      setLoading(true);
      
      const res = await fetch(`${API_BASE_URL}/orders/`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(body),
      });
      
      console.log("Response status:", res.status);
      console.log("Response ok:", res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response text:", errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        console.error("Parsed error:", errorData);
        throw new Error(errorData.detail || errorData.message || `Erreur HTTP ${res.status}`);
      }
      
      const responseData = await res.json();
      console.log("Success response:", responseData);
      
      alert("Mise à jour réussie");
      setEditingOrderId(null);
      setEditForm({ payment_amount: "", delivery_status: "" });
      fetchOrders();
    } catch (err) {
      console.error("=== UPDATE ORDER ERROR ===");
      console.error("Error type:", err.name);
      console.error("Error message:", err.message);
      console.error("Full error:", err);
      
      if (err.message.includes("Failed to fetch")) {
        alert(`❌ ERREUR CORS - Le backend bloque les requêtes depuis votre navigateur.

Le backend doit ajouter le middleware CORS pour accepter les requêtes depuis http://localhost:5173

Demandez au développeur backend d'ajouter:
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

Payload envoyé: ${JSON.stringify(body, null, 2)}`);
      } else {
        alert("Erreur mise à jour: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm("Supprimer cette commande ?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/orders/?order_id=${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("SupDeletion échouée");
      alert("Commande supprimée");
      fetchOrders();
    } catch (err) {
      alert("Erreur suppression");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/commercialslogin');
  };

  const handleSendRequest = async () => {
    if (!requestModel.trim()) return alert("Modèle requis");
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`${API_BASE_URL}/requests/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ model: requestModel, details: requestDetails }),
      });
      setRequestSent(true);
      setRequestModel("");
      setRequestDetails("");
      setTimeout(() => setRequestSent(false), 5000);
      alert("Demande envoyée !");
    } catch (err) {
      alert("Échec envoi demande");
    }
  };

  // Grouped cars
  const groupedCars = useMemo(() => {
    const groups = [];
    cars.forEach(car => {
      let g = groups.find(g => g.model === car.model);
      if (!g) {
        g = { model: car.model, quantity: 0, colors: [] };
        groups.push(g);
      }
      g.quantity++;
      if (!g.colors.includes(car.color)) g.colors.push(car.color);
    });
    return groups;
  }, [cars]);

  const getRepresentativeCar = (model) => {
    return cars.find(c => c.model === model && c.price != null && c.currency_id != null) ||
           cars.find(c => c.model === model);
  };

  const getStatusText = (s) => ({
    shipping: "En expédition",
    arrived: "Arrivé",
    showroom: "En showroom"
  }[s] || s);

  // Filtered lists
  const filteredOrders = useMemo(() => {
    return orders.filter(o =>
      (o.client_name?.toLowerCase() || "").includes(searchOrders.toLowerCase()) ||
      (o.car_model?.toLowerCase() || "").includes(searchOrders.toLowerCase())
    );
  }, [orders, searchOrders]);

  const filteredGroupedCars = useMemo(() => {
    return groupedCars.filter(g =>
      g.model.toLowerCase().includes(searchCars.toLowerCase())
    );
  }, [groupedCars, searchCars]);

  return (
    <div className="h-screen w-screen font-main flex bg-gradient-to-br from-neutral-950 to-neutral-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 p-4 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex-1 space-y-3">
            <button onClick={() => setMenuOpen(false)} className="md:hidden mb-4 p-2 hover:bg-neutral-800 rounded">
              <svg className="w-6 h-6" fill="none" stroke="gray" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-8">Palmier Auto</h2>

            {[
              { id: "addClient", label: "Ajouter Client" },
              { id: "orders", label: "Commandes" },
              { id: "cars", label: "Voitures" },
              { id: "requests", label: "Demande Admin" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMenuOpen(false); }}
                className={`w-full text-left p-3 rounded-lg transition ${activeTab === tab.id ? 'bg-emerald-600' : 'hover:bg-neutral-800'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button onClick={handleLogout} className="w-full p-3 bg-red-600 hover:bg-red-700 rounded-lg transition">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 overflow-y-auto p-6 md:p-8">
        <button onClick={() => setMenuOpen(true)} className="md:hidden mb-6 p-2 bg-neutral-800 rounded-lg">
          <svg className="w-8 h-8" fill="none" stroke="gray" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Client Tab */}
        {activeTab === "addClient" && (
          <div className="space-y-8">
            <h1 className="text-4xl font-bold">Ajouter un Client</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleAddClient(); }} className="bg-neutral-900/80 p-8 rounded-2xl border border-neutral-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["name", "surname", "phone", "password", "wilaya", "address"].map(field => (
                  <input
                    key={field}
                    type={field === "password" ? "password" : "text"}
                    placeholder={field === "name" ? "Nom" : field === "surname" ? "Prénom" : field === "phone" ? "Téléphone" : field === "password" ? "Mot de passe" : field === "wilaya" ? "Wilaya" : "Adresse"}
                    value={newClient[field]}
                    onChange={e => setNewClient({ ...newClient, [field]: e.target.value })}
                    className="bg-neutral-800 p-4 rounded-lg outline-none"
                    required
                  />
                ))}
              </div>
              <button type="submit" disabled={loading} className="mt-8 w-full bg-emerald-600 py-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 transition">
                {loading ? "Ajout en cours..." : "Ajouter Client"}
              </button>
            </form>

            <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800">
              <h2 className="text-2xl font-semibold mb-4">Clients enregistrés</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {clients.length === 0 ? (
                  <p className="text-neutral-500">Aucun client</p>
                ) : (
                  clients.map(c => (
                    <div key={c.id} className="bg-neutral-800 p-4 rounded-lg">
                      <p className="font-medium text-lg">{c.name} {c.surname} <span className="text-emerald-400 text-sm">#{c.id}</span></p>
                      <p className="text-sm text-neutral-400">{c.phone_number} • {c.wilaya}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-8">
            <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800">
              <h2 className="text-2xl font-semibold mb-6">Nouvelle Commande</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select value={newOrder.client_id} onChange={e => setNewOrder({ ...newOrder, client_id: e.target.value })} className="bg-neutral-800 p-4 rounded-lg">
                  <option value="">Sélectionner un client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.surname}</option>)}
                </select>
                <select value={newOrder.car_id} onChange={e => setNewOrder({ ...newOrder, car_id: e.target.value })} className="bg-neutral-800 p-4 rounded-lg">
                  <option value="">Sélectionner une voiture</option>
                  {cars.map(car => <option key={car.id} value={car.id}>{car.model} - {car.color}</option>)}
                </select>
                <select value={newOrder.delivery_status} onChange={e => setNewOrder({ ...newOrder, delivery_status: e.target.value })} className="bg-neutral-800 p-4 rounded-lg">
                  <option value="shipping">En expédition</option>
                  <option value="arrived">Arrivé</option>
                  <option value="showroom">Showroom</option>
                </select>
                <button onClick={handleAddOrder} disabled={loading} className="bg-emerald-600 py-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50">
                  Ajouter
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Commandes</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
                <input
                  value={searchOrders}
                  onChange={e => setSearchOrders(e.target.value)}
                  placeholder="Rechercher..."
                  className="bg-neutral-800 pl-12 pr-4 py-3 rounded-lg w-64"
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
              {filteredOrders.map(order => (
                <div key={order.order_id} className="bg-neutral-900/90 p-6 rounded-2xl border border-neutral-800">
                  {editingOrderId === order.order_id ? (
                    <div className="space-y-4">
                      <input
                        type="number"
                        placeholder="Paiement (DZD)"
                        value={editForm.payment_amount}
                        onChange={e => setEditForm({ ...editForm, payment_amount: e.target.value })}
                        className="w-full bg-neutral-800 p-3 rounded-lg"
                      />
                      <select
                        value={editForm.delivery_status}
                        onChange={e => setEditForm({ ...editForm, delivery_status: e.target.value })}
                        className="w-full bg-neutral-800 p-3 rounded-lg"
                      >
                        <option value="shipping">En expédition</option>
                        <option value="arrived">Arrivé</option>
                        <option value="showroom">Showroom</option>
                      </select>
                      <div className="flex gap-3">
                        <button onClick={() => handleUpdateOrder(order.order_id)} className="flex-1 bg-blue-600 py-2 rounded-lg">Sauvegarder</button>
                        <button onClick={() => setEditingOrderId(null)} className="flex-1 bg-neutral-700 py-2 rounded-lg">Annuler</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">{order.car_model}</h3>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingOrderId(order.order_id)} className="text-blue-400 hover:text-blue-300">Edit</button>
                          <button onClick={() => handleDeleteOrder(order.order_id)} className="text-red-400 hover:text-red-300">Delete</button>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-400">Client: {order.client_name} {order.client_surname}</p>
                      <p className="text-sm text-neutral-400">Tel: {order.client_phone}</p>
                      <p className="text-sm mt-3">Statut: <span className="text-white font-medium">{getStatusText(order.delivery_status)}</span></p>
                      <p className="text-sm">Prix: <span className="text-green-400 font-medium">{order.price_dzd?.toLocaleString() || 0} DZD</span></p>
                      <p className="text-sm">Payé: <span className="text-blue-400 font-medium">{order.payment_amount?.toLocaleString() || 0} DZD</span></p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cars Tab */}
        {activeTab === "cars" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Voitures Disponibles</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
                <input value={searchCars} onChange={e => setSearchCars(e.target.value)} placeholder="Rechercher modèle..." className="bg-neutral-800 pl-12 pr-4 py-3 rounded-lg w-64" />
              </div>
            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-6">
              {filteredGroupedCars.map(g => {
                const rep = getRepresentativeCar(g.model);
                return (
                  <div
                    key={g.model}
                    onClick={() => rep && (setSelectedCar(rep), setSelectedCarPriceInfo(getCarPriceInfo(rep)), setIsModalOpen(true))}
                    className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 hover:scale-105 cursor-pointer transition"
                  >
                    <h3 className="text-xl font-bold mb-2">{g.model}</h3>
                    <p className="text-emerald-400 font-medium mb-4">{g.quantity} unité{g.quantity > 1 ? 's' : ''}</p>
                    <div className="flex flex-wrap gap-2">
                      {g.colors.map(c => (
                        <span key={c} className="bg-neutral-800 px-3 py-1 rounded-full text-xs">{c}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Demande à l'Admin</h2>
            {requestSent && <div className="mb-6 p-4 bg-green-600/20 border border-green-500 text-green-300 rounded-lg">Demande envoyée avec succès !</div>}
            <div className="bg-neutral-900/80 p-8 rounded-2xl border border-neutral-800 space-y-6">
              <input
                value={requestModel}
                onChange={e => setRequestModel(e.target.value)}
                placeholder="Modèle recherché"
                className="w-full bg-neutral-800 p-4 rounded-lg outline-none"
              />
              <textarea
                value={requestDetails}
                onChange={e => setRequestDetails(e.target.value)}
                placeholder="Détails supplémentaires..."
                className="w-full bg-neutral-800 p-4 rounded-lg h-32 resize-none outline-none"
              />
              <button onClick={handleSendRequest} className="w-full bg-emerald-600 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition">
                Envoyer la demande
              </button>
            </div>
          </div>
        )}

        {/* Car Detail Modal */}
        {isModalOpen && selectedCar && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
            <div className="bg-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 border border-neutral-700" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold">{selectedCar.model} ({selectedCar.year})</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-4xl text-neutral-400 hover:text-white">&times;</button>
              </div>
              <div className="space-y-4 text-lg">
                <p><span className="text-neutral-400">Couleur:</span> {selectedCar.color}</p>
                {selectedCarPriceInfo?.originalPrice && (
                  <p><span className="text-neutral-400">Prix:</span> {selectedCarPriceInfo.originalPrice.toLocaleString()} {selectedCarPriceInfo.currencyCode}</p>
                )}
                {selectedCarPriceInfo?.priceInDZD && (
                  <p className="text-2xl font-bold text-emerald-400">
                    Prix en DZD: {selectedCarPriceInfo.priceInDZD.toLocaleString()} DZD
                  </p>
                )}
                {selectedCar.engine && <p><span className="text-neutral-400">Moteur:</span> {selectedCar.engine}</p>}
                {selectedCar.power && <p><span className="text-neutral-400">Puissance:</span> {selectedCar.power}</p>}
                {selectedCar.fuel_type && <p><span className="text-neutral-400">Carburant:</span> {selectedCar.fuel_type}</p>}
                {selectedCar.milage != null && <p><span className="text-neutral-400">Kilométrage:</span> {selectedCar.milage.toLocaleString()} km</p>}
                {selectedCar.country && <p><span className="text-neutral-400">Origine:</span> {selectedCar.country}</p>}
              </div>
              <div className="mt-10 text-right">
                <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Commercials;