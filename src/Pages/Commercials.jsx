// src/Pages/Commercials.jsx
import React, { useState, useEffect, useMemo } from "react";
import { parseColors } from "../lib/utils";
import { useNavigate } from "react-router-dom";
import { Search, Plus, File, FileArchiveIcon, Car, LetterTextIcon, Printer, Upload, Trash2, Image as ImageIcon, Banknote } from "lucide-react";
import QrCode from "../assets/qr_client.png";
const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com";

// ✅ Fixed: Centralized API fetch function with proper error handling
// ✅ Fixed: Centralized API fetch function with proper error handling and redirects
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Force redirect to login if token is missing
    if (window.location.pathname !== '/commercialslogin') {
      window.location.href = '/commercialslogin';
    }
    throw new Error("No authentication token found. Please login again.");
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  // Only add Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 401: Unauthorized (Session expired/Invalid token)
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/commercialslogin';
      throw new Error("UNAUTHORIZED");
    }

    // 403: Forbidden (Role mismatch/Insufficient permissions)
    if (response.status === 403) {
      throw new Error("FORBIDDEN");
    }

    return response;
  } catch (error) {
    // Auto-redirect for any authentication-related error thrown above
    if (error.message === "UNAUTHORIZED" || error.message.includes("No authentication token found")) {
      if (window.location.pathname !== '/commercialslogin') {
        window.location.href = '/commercialslogin';
      }
    }
    console.error("API Fetch Error:", error);
    throw error;
  }
};

const Commercials = () => {
  const [activeTab, setActiveTab] = useState("addClient");
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [commercialsList, setCommercialsList] = useState([]);

  const [newClient, setNewClient] = useState({
    name: "",
    surname: "",
    phone: "",
    password: "",
    wilaya: "",
    address: "",
    nin: "",
    passport_number: ""
  });

  const [newOrder, setNewOrder] = useState({
    client_id: null,
    car_id: null,
    car_color: "",
    delivery_status: "shipping"
  });

  const [searchOrders, setSearchOrders] = useState("");
  const [searchCars, setSearchCars] = useState("");
  const [searchClients, setSearchClients] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedCarPriceInfo, setSelectedCarPriceInfo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editForm, setEditForm] = useState({ payment_amount: "", delivery_status: "" });

  const [requestModel, setRequestModel] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  // Paperwork/Images state
  const [selectedClientForImages, setSelectedClientForImages] = useState(null);
  const [clientImages, setClientImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [viewingImages, setViewingImages] = useState(false);

  // Contract generation
  const [showContractPrompt, setShowContractPrompt] = useState(false);
  const [lastOrderData, setLastOrderData] = useState(null);
  const [commercialInfo, setCommercialInfo] = useState(null);

  // Cash Register
  const [commercialCashRegister, setCommercialCashRegister] = useState(null);
  const [cashRequests, setCashRequests] = useState([]);
  const [newCashRequestAmount, setNewCashRequestAmount] = useState("");

  const navigate = useNavigate();

  const currencyMap = useMemo(() => {
    const map = new Map();
    currencies.forEach(c => c.id !== undefined && map.set(c.id, c));
    return map;
  }, [currencies]);

  const getCarPriceInfo = (car) => {
    if (!car?.price || car.currency_id === undefined) return { originalPrice: null, currencyCode: "???", priceInDZD: null };
    const currency = currencyMap.get(car.currency_id);
    const priceInDZD = currency ? car.price * currency.exchange_rate_to_dzd : null;
    return { originalPrice: car.price, currencyCode: currency?.code || "???", priceInDZD };
  };

  useEffect(() => {
    fetchClients();
    fetchOrders();
    fetchCars();
    fetchCurrencies();
    fetchCommercialInfo();
    fetchCommercialsList();
    fetchCashRegisterDetails();
  }, []);

  const fetchCommercialsList = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/commercials/`);
      if (res.ok) {
        const data = await res.json();
        setCommercialsList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.warn("Failed to fetch commercials list", err);
    }
  };

  // Cleanup object URLs when modal closes
  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts
      clientImages.forEach(img => {
        if (img.url && img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [clientImages]);

  const fetchCommercialInfo = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/commercials/commercial`, {
        method: "POST"
      });

      if (!res.ok) {
        if (res.status === 403) {
          console.warn("Commercial info not accessible - using default");
          return;
        }
        throw new Error("Failed to fetch commercial info");
      }

      const data = await res.json();
      console.log("Commercial info:", data);
      setCommercialInfo(data);
    } catch (err) {
      console.warn("Failed to fetch commercial info:", err);
    }
  };

  const fetchCashRegisterDetails = async () => {
    try {
      const regRes = await apiFetch(`${API_BASE_URL}/commercials_cash_registers/`);
      if (regRes.ok) {
        const regData = await regRes.json();
        // Handle both array response and single object response
        let register = null;
        if (Array.isArray(regData)) {
          register = regData.length > 0 ? regData[0] : null;
        } else if (regData && typeof regData === 'object' && !Array.isArray(regData)) {
          // Single object — only use it if it has a meaningful id or balance
          register = (regData.id !== undefined || regData.balance !== undefined) ? regData : null;
        }
        setCommercialCashRegister(register);
      }

      const reqRes = await apiFetch(`${API_BASE_URL}/cash_registers_requests/own`);
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setCashRequests(Array.isArray(reqData) ? reqData : []);
      }
    } catch (err) {
      console.error("Failed to fetch cash register data:", err);
    }
  };

  const handleCreateCashRequest = async () => {
    if (!newCashRequestAmount || isNaN(newCashRequestAmount) || Number(newCashRequestAmount) <= 0) {
      alert("Veuillez saisir un montant valide.");
      return;
    }
    try {
      const res = await apiFetch(`${API_BASE_URL}/cash_registers_requests/?amount=${parseFloat(newCashRequestAmount)}`, {
        method: "POST"
      });
      if (res.ok) {
        alert("✅ Demande de versement envoyée!");
        setNewCashRequestAmount("");
        fetchCashRegisterDetails();
      } else {
        throw new Error("Erreur serveur");
      }
    } catch (err) {
      alert("❌ Échec d'envoi de la demande: " + err.message);
    }
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`${API_BASE_URL}/commercials/clients`);

      if (!res.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        navigate('/commercialslogin');
        return;
      }
      setError("Erreur lors du chargement des clients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/orders/`);

      if (!res.ok) {
        if (res.status === 401) {
          navigate('/commercialslogin');
          return;
        }
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        navigate('/commercialslogin');
        return;
      }
      console.error(err);
    }
  };

  const fetchCars = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/cars/all`, {
        method: "POST",
        body: JSON.stringify({})
      });

      if (!res.ok) {
        if (res.status === 401) {
          navigate('/commercialslogin');
          return;
        }
        throw new Error("Failed to fetch cars");
      }

      const data = await res.json();
      setCars(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        navigate('/commercialslogin');
        return;
      }
      console.error(err);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const res = await apiFetch(`${API_BASE_URL}/currencies/`);

      if (!res.ok) throw new Error("Failed to fetch currencies");

      const data = await res.json();
      setCurrencies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FIXED: Fetch client images with multiple path format attempts
  const fetchClientImages = async (clientId) => {
    try {
      setLoading(true);
      const res = await apiFetch(`${API_BASE_URL}/clients/${clientId}/images`);

      if (!res.ok) {
        if (res.status === 401) {
          navigate('/commercialslogin');
          return;
        }
        throw new Error("Failed to fetch images");
      }

      const data = await res.json();
      console.log("Client images response:", data);

      // ✅ Extract image paths/IDs from response
      let imagePaths = [];

      if (Array.isArray(data)) {
        imagePaths = data.map((img, idx) => ({
          path: typeof img === 'string' ? img : (img.url || img.path || img.image_url),
          id: typeof img === 'object' ? (img.id || idx) : idx,
          created_at: typeof img === 'object' ? img.created_at : null
        }));
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.images)) {
          imagePaths = data.images.map((img, idx) => ({
            path: typeof img === 'string' ? img : (img.url || img.path || img.image_url),
            id: typeof img === 'object' ? (img.id || idx) : idx,
            created_at: typeof img === 'object' ? img.created_at : null
          }));
        } else if (data.url || data.path || data.image_url) {
          imagePaths = [{
            path: data.url || data.path || data.image_url,
            id: data.id || 0,
            created_at: data.created_at
          }];
        }
      }

      console.log("Image paths extracted:", imagePaths);

      // ✅ Fetch each image - try multiple path formats
      const imagePromises = imagePaths.map(async (imgInfo) => {
        try {
          const path = imgInfo.path;
          console.log("Original path from API:", path);

          // If already base64, use directly
          if (path && path.startsWith('data:')) {
            return {
              url: path,
              image_url: path,
              id: imgInfo.id,
              created_at: imgInfo.created_at
            };
          }

          // Try different URL formats
          const urlsToTry = [];

          // Format 1: /download_static_files/ + path (with leading slash)
          if (path.startsWith('/')) {
            urlsToTry.push(`${API_BASE_URL}/download_static_files${path}`);
          } else {
            urlsToTry.push(`${API_BASE_URL}/download_static_files/${path}`);
          }

          // Format 2: Direct path from API
          if (path.startsWith('/')) {
            urlsToTry.push(`${API_BASE_URL}${path}`);
          } else {
            urlsToTry.push(`${API_BASE_URL}/${path}`);
          }

          // Format 3: If path has /clients_images/, try without leading slash
          if (path.includes('clients_images/')) {
            const cleanPath = path.replace(/^\/+/, '');
            urlsToTry.push(`${API_BASE_URL}/download_static_files/${cleanPath}`);
          }

          console.log("Trying URLs:", urlsToTry);

          // Try each URL format until one works
          for (const downloadUrl of urlsToTry) {
            try {
              console.log(`Attempting: ${downloadUrl}`);
              const imgRes = await apiFetch(downloadUrl);

              if (imgRes.ok) {
                console.log(`✅ Success with: ${downloadUrl}`);
                const blob = await imgRes.blob();
                const objectUrl = URL.createObjectURL(blob);

                return {
                  url: objectUrl,
                  image_url: objectUrl,
                  id: imgInfo.id,
                  created_at: imgInfo.created_at,
                  originalPath: path,
                  successUrl: downloadUrl
                };
              } else {
                console.log(`❌ Failed (${imgRes.status}): ${downloadUrl}`);
              }
            } catch (error) {
              console.log(`❌ Error with ${downloadUrl}:`, error.message);
            }
          }

          console.error(`All URL formats failed for path: ${path}`);
          return null;
        } catch (error) {
          console.error("Error fetching individual image:", error);
          return null;
        }
      });

      const imagesArray = (await Promise.all(imagePromises)).filter(Boolean);

      console.log("Processed images with object URLs:", imagesArray);

      if (imagesArray.length === 0) {
        alert("⚠️ Aucune image n'a pu être chargée. Vérifiez les chemins d'accès.");
      }

      setClientImages(imagesArray);
      setViewingImages(true);
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        navigate('/commercialslogin');
        return;
      }
      alert("❌ Erreur lors du chargement des images: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed: Upload client image with proper auth
  const handleUploadClientImage = async (clientId, file) => {
    if (!file) {
      alert("⚠️ Veuillez sélectionner un fichier");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const res = await apiFetch(`${API_BASE_URL}/clients/images?client_id=${clientId}`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        if (res.status === 401) {
          navigate('/commercialslogin');
          return;
        }
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Upload failed");
      }

      alert("✅ Image téléchargée avec succès !");
      fetchClientImages(clientId);
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        navigate('/commercialslogin');
        return;
      }
      console.error("Upload Image Error:", err);
      alert("❌ Erreur téléchargement image :\n" + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // ✅ Fixed: Delete client image with proper auth
  const handleDeleteClientImage = async (clientId, imageId) => {
    if (!window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer cette image ?")) return;

    try {
      setLoading(true);
      const res = await apiFetch(`${API_BASE_URL}/clients/images?client_id=${clientId}&image_id=${imageId}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Delete failed");
      }

      alert("✅ Image supprimée avec succès !");
      fetchClientImages(clientId);
    } catch (err) {
      console.error("Delete Image Error:", err);
      alert("❌ Erreur suppression image :\n" + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed: Add client with proper auth
  const handleAddClient = async () => {
    const { name, surname, phone, password, wilaya, address, nin, passport_number } = newClient;

    if (!name || !surname || !phone || !password || !wilaya || !address || !nin || !passport_number) {
      alert("Veuillez remplir tous les champs (y compris le NIN et le numéro de passeport) !");
      return;
    }

    if (!nin || nin.trim() === '' || isNaN(Number(nin))) {
      alert("Le NIN doit être un nombre valide !");
      return;
    }

    if (!passport_number || passport_number.trim() === '' || isNaN(Number(passport_number))) {
      alert("Le numéro de passeport doit être un nombre valide !");
      return;
    }

    try {
      setLoading(true);
      const res = await apiFetch(`${API_BASE_URL}/clients/`, {
        method: "POST",
        body: JSON.stringify({
          name,
          surname,
          nin: nin.toString(),
          passport_number: passport_number.toString(),
          phone_number: phone,
          password,
          wilaya,
          address,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        let errMessage = "Erreur serveur inconnue";
        if (errData.detail && Array.isArray(errData.detail)) {
          errMessage = errData.detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join('\n');
        } else if (errData.detail) {
          errMessage = errData.detail;
        } else if (errData.message) {
          errMessage = errData.message;
        }
        throw new Error(errMessage);
      }

      alert("✅ Client ajouté avec succès !");
      setNewClient({ name: "", surname: "", phone: "", password: "", wilaya: "", address: "", nin: "", passport_number: "" });
      fetchClients();
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        navigate('/commercialslogin');
        return;
      }
      console.error("Add Client Error:", err);
      alert("❌ Erreur ajout client :\n" + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = async () => {
    const { client_id, car_id, car_color, delivery_status } = newOrder;

    const clientId = Number(client_id);
    const carId = Number(car_id);

    if (!clientId || !carId || !car_color) {
      alert("⚠️ Sélectionnez un client, une voiture et une couleur.");
      return;
    }

    const payload = {
      client_id: clientId,
      car_id: carId,
      car_color,
      delivery_status
    };

    try {
      setLoading(true);
      const res = await apiFetch(`${API_BASE_URL}/orders/`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          navigate('/commercialslogin');
          return;
        }
        let errData;
        try { errData = await res.json(); } catch { errData = { detail: await res.text() }; }

        if (Array.isArray(errData.detail)) {
          const errors = errData.detail
            .map(d => `${d.loc?.join('.')}: ${d.msg}`)
            .join('\n');
          throw new Error(`Validation échouée:\n${errors}`);
        }
        throw new Error(errData.detail || `HTTP ${res.status}`);
      }

      const createdOrder = await res.json();

      const client = clients.find(c => c.id === clientId);
      const car = cars.find(c => c.id === carId);

      const currency = currencyMap.get(car.currency_id);
      const exchangeRate = currency?.exchange_rate_to_dzd || null;
      const currencyCode = currency?.code || '???';
      const originalPrice = car.price || 0;

      const orderPriceDZD = createdOrder.price_dzd || (originalPrice * (exchangeRate || 0));

      const newOrderCommercialId = createdOrder.commercials_id || createdOrder.commercial_id || null;
      // Resolve the commercial who created this order (may be the logged-in user)
      const newOrderCommercial =
        commercialsList.find(c => c.id === newOrderCommercialId) ||
        (commercialInfo?.id === newOrderCommercialId ? commercialInfo : null);

      setLastOrderData({
        client,
        car,
        color: car_color,
        originalPrice: originalPrice,
        currencyCode: currencyCode,
        priceInDZD: orderPriceDZD,
        exchangeRate: exchangeRate,
        paymentAmount: createdOrder.payment_amount || 0,
        orderId: createdOrder.order_id || createdOrder.id,
        date: createdOrder.purchase_date ? new Date(createdOrder.purchase_date).toLocaleDateString('fr-DZ') : new Date().toLocaleDateString('fr-DZ'),
        commercialId: newOrderCommercialId,
        resolvedCommercial: newOrderCommercial,
      });

      alert("✅ Commande ajoutée !");
      setShowContractPrompt(true);
      setNewOrder({ client_id: null, car_id: null, car_color: "", delivery_status: "shipping" });
      fetchOrders();
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        navigate('/commercialslogin');
        return;
      }
      console.error("❌ Erreur commande:", err);
      alert("❌ Erreur:\n" + (err.message || "Échec réseau"));
    } finally {
      setLoading(false);
    }
  };

  const generateContract = () => {
    if (!lastOrderData) return;
    const { client, car, color, price, priceInDZD, paymentAmount, date, commercialId,
      resolvedCommercial } = lastOrderData;
    const totalPrice = priceInDZD ? Math.round(priceInDZD) : 0;
    const paidAmount = paymentAmount || 0;
    const remainingBalance = totalPrice - paidAmount;

    // resolvedCommercial is pre-fetched in handlePrintContract / handleAddOrder
    const orderCommercial = resolvedCommercial || null;

    const formattedTotal = totalPrice.toLocaleString('fr-DZ');
    const formattedPaid = paidAmount.toLocaleString('fr-DZ');
    const formattedRemaining = remainingBalance.toLocaleString('fr-DZ');
    const contractDate = date;

    const qrCodeSrc = QrCode;

    const contractHTML = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>اتفاقية بيع وشراء سيارة سياحية</title>
    <style>
        @page {
            size: A4;
            margin: 1cm;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Traditional Arabic', 'Arabic Typesetting', 'Amiri', Arial, sans-serif;
            line-height: 1.6;
            color: #000;
            background: #fff;
            direction: rtl;
            font-size: 12pt;
            padding: 0.5cm;
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
            position: relative;
        }
        .qr-code {
            position: absolute;
            top: 0;
            left: 0;
            width: 80px;
            height: 80px;
        }
        .qr-code img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .company-info {
            font-size: 10pt;
            text-align: center;
            margin-bottom: 5px;
        }
        h1 {
            font-size: 14pt;
            font-weight: bold;
            color: #000;
            margin: 10px 0;
        }
        .section {
            margin-bottom: 10px;
        }
        .section h2 {
            font-size: 12pt;
            font-weight: bold;
            color: #000;
            margin-bottom: 5px;
            text-decoration: underline;
        }
        .info-row {
            display: flex;
            padding: 3px 0;
        }
        .info-label {
            font-weight: bold;
            color: #000;
            min-width: 100px;
            margin-left: 8px;
        }
        .info-value {
            color: #000;
            flex: 1;
        }
        .terms-section {
            margin-top: 15px;
        }
        .term-item {
            padding: 5px 0;
        }
        .term-number {
            display: inline-block;
            font-weight: bold;
            margin-left: 5px;
        }
        .price-highlight {
            text-align: center;
            font-size: 13pt;
            font-weight: bold;
            margin: 15px 5px;
            padding: 8px;
            border: 1px solid #000;
        }
        .payment-details {
            background: #f5f5f5;
            padding: 10px;
            margin: 15px 0;
            border: 1px solid #000;
        }
        .payment-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 11pt;
        }
        .payment-row.total {
            font-weight: bold;
            font-size: 12pt;
            border-top: 2px solid #000;
            margin-top: 5px;
            padding-top: 8px;
        }
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            padding: 0 10px;
        }
        .signature-box {
            width: 45%;
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #000;
        }
        .signature-box h3 {
            font-size: 11pt;
            margin-bottom: 3px;
        }
        .signature-line {
            margin-top: 15px;
            color: #000;
            font-size: 10pt;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #000;
            font-size: 10pt;
            padding-top: 8px;
            border-top: 1px solid #000;
        }
        @media print {
            body {
                padding: 0.5cm;
                font-size: 11pt;
            }
            .no-print {
                display: none !important;
            }
            .qr-code {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="qr-code">
            <img src="${qrCodeSrc}" alt="QR Code" crossorigin="anonymous">
        </div>
        <div class="company-info">
            تجارة بالتجزئة للسيارات | شركة NB SUD | س ت رقم: ب0200015-18/05
        </div>
        <div class="company-info">
            العنوان: محل رقم 00 - م م رقم 200 - قسم 85 - المقر رقم 00 - مسكن 201ح
        </div>
        <h1>اتفاقية بيع وشراء سيارة سياحية</h1>
    </div>

    <div class="section">
        <div class="info-row">
            <div class="info-label">بتاريخ:</div>
            <div class="info-value">${contractDate}</div>
        </div>
        <div class="info-row">
            <div class="info-value">تم الاتفاق بدولة الجزائر بين الطرفين</div>
        </div>
    </div>

    <div class="section">
        <h2>الطرف الأول - بصفته الوكيل</h2>
        <div class="info-row">
            <div class="info-label">اسم الشركة:</div>
            <div class="info-value">شركة ن ب سود NB SUD</div>
        </div>
        <div class="info-row">
            <div class="info-label">معرف الممثل:</div>
            <div class="info-value">${orderCommercial?.id || commercialId || 'غير محدد'}</div>
        </div>
        <div class="info-row">
            <div class="info-label">الممثل:</div>
            <div class="info-value">${orderCommercial ? `${orderCommercial.surname} ${orderCommercial.name}` : 'غير محدد'}</div>
        </div>
        <div class="info-row">
            <div class="info-label">رقم الهاتف:</div>
            <div class="info-value">${orderCommercial?.phone_number || 'غير محدد'}</div>
        </div>
        <div class="info-row">
            <div class="info-label">العنوان:</div>
            <div class="info-value">${orderCommercial?.address || 'غير محدد'}</div>
        </div>
    </div>

    <div class="section">
        <h2>الطرف الثاني - بصفته المشتري</h2>
        <div class="info-row">
            <div class="info-label">الاسم الكامل:</div>
            <div class="info-value">${client.surname} ${client.name}</div>
        </div>
        <div class="info-row">
            <div class="info-label">رقم التعريف الوطني:</div>
            <div class="info-value">${client.nin}</div>
        </div>
        <div class="info-row">
            <div class="info-label">رقم جواز السفر:</div>
            <div class="info-value">${client.passport_number || 'غير محدد'}</div>
        </div>
        <div class="info-row">
            <div class="info-label">رقم الهاتف:</div>
            <div class="info-value">${client.phone_number}</div>
        </div>
        <div class="info-row">
            <div class="info-label">الولاية:</div>
            <div class="info-value">${client.wilaya}</div>
        </div>
        <div class="info-row">
            <div class="info-label">العنوان:</div>
            <div class="info-value">${client.address}</div>
        </div>
    </div>

    <div class="section">
        <h2>مواصفات السيارة</h2>
        <div class="info-row">
            <div class="info-label">الموديل:</div>
            <div class="info-value">${car.model}</div>
        </div>
        <div class="info-row">
            <div class="info-label">السنة:</div>
            <div class="info-value">${car.year || 'غير محدد'}</div>
        </div>
        <div class="info-row">
            <div class="info-label">اللون:</div>
            <div class="info-value">${color}</div>
        </div>
        ${car.engine ? `
        <div class="info-row">
            <div class="info-label">المحرك:</div>
            <div class="info-value">${car.engine}</div>
        </div>
        ` : ''}
    </div>

    <div class="price-highlight">
        ${lastOrderData.originalPrice && lastOrderData.currencyCode !== '???' ? `
        <div style="font-size: 11pt; margin-bottom: 8px;">
            السعر الأصلي: ${lastOrderData.originalPrice.toLocaleString('fr-DZ')} ${lastOrderData.currencyCode}
            ${lastOrderData.exchangeRate ? ` | سعر الصرف: ${Number(lastOrderData.exchangeRate).toLocaleString('fr-DZ')} دج` : ''}
        </div>
        ` : ''}
        المبلغ الإجمالي والنهائي: ${formattedTotal} دج 
        <br>
        <small style="font-size: 10pt;">(متضمناً جميع تكاليف النقل والتأمين دون حقوق الجمركة)</small>
    </div>

    <div class="payment-details">
        <h2 style="text-align: center; margin-bottom: 10px;">تفاصيل الدفع</h2>
        <div class="payment-row">
            <span>المبلغ الإجمالي:</span>
            <span>${formattedTotal} دج</span>
        </div>
        <div class="payment-row">
            <span>المبلغ المدفوع:</span>
            <span style="color: #059669;">${formattedPaid} دج</span>
        </div>
        <div class="payment-row total">
            <span>المبلغ المتبقي:</span>
            <span style="color: ${remainingBalance > 0 ? '#dc2626' : '#059669'};">${formattedRemaining} دج</span>
        </div>
    </div>

    <div class="terms-section section">
        <h2>شروط الاتفاقية</h2>
        <div class="term-item">
            <span class="term-number">1-</span>
            <span>يلتزم الطرف الأول بشراء وشحن السيارة باسم ومكان الطرف الثاني المسمى المشتري السيد/ة ${client.surname} ${client.name}.</span>
        </div>
        <div class="term-item">
            <span class="term-number">2-</span>
            <span>يتعهد المشتري بدفع المبلغ ${formattedTotal} دج في أجل أقصاه 3 أياماً من تاريخ العقد.</span>
        </div>
        <div class="term-item">
            <span class="term-number">3-</span>
            <span>يتعهد الطرف الأول بتجهيز السيارة إلى الشحن خلال 60 يوم عمل من تاريخ الدفع إلا في حالة القوة القاهرة والخارجة عن إرادة الوكيل كالتأخير في الشحن من البلد المورد أو تعطل الباخرة المخصصة للشحن أو إضراب الخ...</span>
        </div>
        <div class="term-item">
            <span class="term-number">4-</span>
            <span>يضمن الطرف الأول وصول البضاعة على نفس الحالة المتفق عليها وبنفس المواصفات. وأي اختلاف في ذلك يكون الطرف الأول مسؤول عن تعويض الطرف الثاني.</span>
        </div>
        <div class="term-item">
            <span class="term-number">5-</span>
            <span>يتعهد الطرف الأول بأن يقوم بتجهيز الأوراق وإرسالها للطرف الثاني خلال 63 يوم عمل من تاريخ استلام المورد لمستحقاته.</span>
        </div>
        <div class="term-item">
            <span class="term-number">6-</span>
            <span>مدة الشحن مفتوحة حسب شركة الشحن والطرف الأول غير مسؤول عنها.</span>
        </div>
        <div class="term-item">
            <span class="term-number">7-</span>
            <span>في حالة فسخ العقد من الطرف الأول يسلم الأموال سيارة في أجل أقل من 30 يوماً. أما في حالة فسخ من طرف ثاني تسلم الأموال سيارة بعد بيعها لزبون آخر مع تحمله لمصاريف تحويل الملكية.</span>
        </div>
    </div>

    <div class="signature-section">
        <div class="signature-box">
            <h3>الطرف الأول</h3>
            <p>مدير الشركة أو ممثله</p>
            <div class="signature-line">التوقيع والختم</div>
        </div>
        <div class="signature-box">
            <h3>الطرف الثاني</h3>
            <p>المشتري أو ممثله</p>
            <div class="signature-line">التوقيع</div>
        </div>
    </div>

    <div class="footer">
        <p>Palmier Auto - شركة موثوقة لبيع السيارات المستوردة</p>
        <p>هذا العقد محرر ومطبوع في نسختين، نسخة لكل طرف</p>
    </div>

    <div class="no-print" style="text-align: center; margin-top: 30px; padding: 20px;">
        <button onclick="window.print()" style="background: #2563eb; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 8px rgba(37,99,235,0.3);">
            🖨️ طباعة العقد
        </button>
    </div>
</body>
</html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(contractHTML);
      printWindow.document.close();

      printWindow.onload = function () {
        const qrImg = printWindow.document.querySelector('.qr-code img');
        if (qrImg) {
          qrImg.onload = function () {
            console.log('QR Code loaded successfully');
          };
          qrImg.onerror = function () {
            console.error('Failed to load QR code');
          };
        }
      };
    } else {
      alert("❌ لم يتمكن من فتح نافذة الطباعة. يرجى التحقق من إعدادات المتصفح.");
    }
  };

  const handleUpdateOrder = async (orderId) => {
    const body = { order_id: orderId };
    if (editForm.payment_amount !== "") body.payment_amount = parseFloat(editForm.payment_amount);
    if (editForm.delivery_status) body.delivery_status = editForm.delivery_status;

    try {
      setLoading(true);
      const res = await apiFetch(`${API_BASE_URL}/orders/`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        if (res.status === 401) {
          navigate('/commercialslogin');
          return;
        }
        const errorText = await res.text();
        let errorData;
        try { errorData = JSON.parse(errorText); } catch { errorData = { message: errorText }; }
        throw new Error(errorData.detail || errorData.message || `HTTP ${res.status}`);
      }

      const updatedOrder = await res.json();
      if (lastOrderData && lastOrderData.orderId === orderId) {
        const client = clients.find(c => c.id === updatedOrder.client_id);
        const car = cars.find(c => c.id === updatedOrder.car_id);

        setLastOrderData({
          ...lastOrderData,
          paymentAmount: updatedOrder.payment_amount || 0,
          priceInDZD: updatedOrder.price_dzd || lastOrderData.priceInDZD,
          client,
          car
        });
      }

      alert("✅ Mise à jour réussie");
      setEditingOrderId(null);
      setEditForm({ payment_amount: "", delivery_status: "" });
      fetchOrders();

      if (window.confirm("Voulez-vous régénérer le contrat avec les nouvelles informations?")) {
        generateContract();
      }
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        navigate('/commercialslogin');
        return;
      }
      console.error("Update Order Error:", err);
      alert("❌ Erreur mise à jour: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintContract = async (order) => {
    try {
      const client = clients.find(c => c.id === order.client_id);
      const car = cars.find(c => c.id === order.car_id);

      if (!client || !car) {
        alert("❌ Impossible de générer le contrat. Données manquantes.");
        return;
      }

      const orderPriceDZD = order.price_dzd || 0;
      const currency = currencyMap.get(car.currency_id);
      const exchangeRate = currency?.exchange_rate_to_dzd || null;
      const currencyCode = currency?.code || '???';
      const originalPrice = car.price || 0;

      const orderCommercialId = order.commercials_id || order.commercial_id || null;

      // Step 1: try the already-loaded list
      let resolvedCommercial = commercialsList.find(c => c.id === orderCommercialId) || null;

      // Step 2: if the logged-in commercial IS the creator, use their info directly
      if (!resolvedCommercial && commercialInfo?.id === orderCommercialId) {
        resolvedCommercial = commercialInfo;
      }

      // Step 3: fetch the specific commercial from the API (works even when
      //         the full list endpoint is restricted to admins)
      if (!resolvedCommercial && orderCommercialId != null) {
        try {
          const res = await apiFetch(`${API_BASE_URL}/commercials/?commercial_id=${orderCommercialId}`);
          if (res.ok) {
            const data = await res.json();
            // API may return a list or a single object
            resolvedCommercial = Array.isArray(data)
              ? data.find(c => c.id === orderCommercialId) || data[0] || null
              : data;
          }
        } catch (fetchErr) {
          console.warn("Could not fetch commercial by id:", fetchErr);
        }
      }

      setLastOrderData({
        client,
        car,
        color: order.car_color,
        originalPrice,
        currencyCode,
        priceInDZD: orderPriceDZD,
        exchangeRate,
        paymentAmount: order.payment_amount || 0,
        orderId: order.order_id,
        date: order.purchase_date
          ? new Date(order.purchase_date).toLocaleDateString('fr-DZ')
          : new Date().toLocaleDateString('fr-DZ'),
        commercialId: orderCommercialId,
        resolvedCommercial,
      });

      setTimeout(() => {
        generateContract();
      }, 100);

    } catch (err) {
      console.error("Print Contract Error:", err);
      alert("❌ Erreur lors de la génération du contrat");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer cette commande ?")) return;

    try {
      setLoading(true);
      const res = await apiFetch(`${API_BASE_URL}/orders/?order_id=${orderId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        if (res.status === 401) {
          navigate('/commercialslogin');
          return;
        }
        const errorText = await res.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        throw new Error(errorData.detail || errorData.message || `HTTP ${res.status}: Suppression échouée`);
      }

      alert("✅ Commande supprimée avec succès !");

      if (lastOrderData && lastOrderData.orderId === orderId) {
        setLastOrderData(null);
      }

      fetchOrders();
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        navigate('/commercialslogin');
        return;
      }
      console.error("Delete Order Error:", err);
      alert("❌ Erreur lors de la suppression:\n" + err.message);
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
      await apiFetch(`${API_BASE_URL}/requests/`, {
        method: "POST",
        body: JSON.stringify({ model: requestModel, details: requestDetails }),
      });
      setRequestSent(true);
      setRequestModel("");
      setRequestDetails("");
      setTimeout(() => setRequestSent(false), 5000);
      alert("✅ Demande envoyée !");
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        navigate('/commercialslogin');
        return;
      }
      alert("❌ Échec envoi demande");
    }
  };

  const getAvailableColors = (carId) => {
    if (!carId) return [];
    const car = cars.find(c => c.id === carId);
    if (car) return parseColors(car.color);

    const model = cars.find(c => c.id === carId)?.model;
    if (model) {
      const colors = cars
        .filter(c => c.model === model && c.quantity > 0)
        .flatMap(c => parseColors(c.color));
      return Array.from(new Set(colors));
    }
    return [];
  };

  const groupedCars = useMemo(() => {
    const groups = [];
    cars.forEach(car => {
      let g = groups.find(g => g.model === car.model);
      if (!g) {
        g = { model: car.model, quantity: 0, colors: [] };
        groups.push(g);
      }
      g.quantity++;
      const parsed = parseColors(car.color);
      parsed.forEach(col => { if (!g.colors.includes(col)) g.colors.push(col); });
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

  const filteredClients = useMemo(() => {
    return clients.filter(c =>
      (c.name?.toLowerCase() || "").includes(searchClients.toLowerCase()) ||
      (c.surname?.toLowerCase() || "").includes(searchClients.toLowerCase()) ||
      (c.phone_number?.toLowerCase() || "").includes(searchClients.toLowerCase())
    );
  }, [clients, searchClients]);

  return (
    <div className="h-screen w-screen font-main flex bg-gradient-to-br from-neutral-950 to-neutral-900 text-white overflow-hidden">

      {/* Contract Prompt Modal */}
      {showContractPrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-800 rounded-2xl max-w-md w-full p-8 border border-neutral-700">
            <h2 className="text-2xl font-bold mb-4 text-center">✅ Commande Ajoutée!</h2>
            <p className="text-neutral-300 mb-6 text-center">Voulez-vous générer le contrat maintenant?</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  generateContract();
                  setShowContractPrompt(false);
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Printer size={20} />
                Générer Contrat
              </button>
              <button
                onClick={() => setShowContractPrompt(false)}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 py-3 rounded-lg font-semibold"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Images Modal */}
      {viewingImages && selectedClientForImages && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 p-4" onClick={() => setViewingImages(false)}>
          <div className="bg-neutral-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 border border-neutral-700" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">Documents - {selectedClientForImages.name} {selectedClientForImages.surname}</h2>
                <p className="text-neutral-400 text-sm">NIN: {selectedClientForImages.nin} | Passeport: {selectedClientForImages.passport_number}</p>
              </div>
              <button onClick={() => setViewingImages(false)} className="text-4xl text-neutral-400 hover:text-white">&times;</button>
            </div>

            {clientImages.length === 0 ? (
              <p className="text-center text-neutral-400 py-8">Aucun document téléchargé</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {clientImages.map((img, idx) => {
                  const imageUrl = img.url || img.image_url || img.data || '';
                  let imageId = img.id || idx;

                  return (
                    <div key={idx} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Document ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-neutral-700"
                        onError={(e) => {
                          console.error('Image load error:', imageUrl);
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23374151" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" fill="%239CA3AF" text-anchor="middle" dy=".3em" font-size="14"%3EImage non disponible%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <button
                        onClick={() => handleDeleteClientImage(selectedClientForImages.id, imageId)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-20 w-64 bg-neutral-900 border-r border-neutral-800 p-4 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="flex-1 space-y-3">
            <button onClick={() => setMenuOpen(false)} className="md:hidden mb-4 p-2 hover:bg-neutral-800 rounded">
              <svg className="w-6 h-6" fill="none" stroke="gray" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl mb-8">Palmier Auto</h2>
            {[
              { id: "addClient", icon: Plus, label: "Ajouter Client" },
              { id: "orders", icon: File, label: "Commandes" },
              { id: "cars", icon: Car, label: "Voitures" },
              { id: "paperwork", icon: FileArchiveIcon, label: "Papiers Clients" },
              { id: "requests", icon: LetterTextIcon, label: "Demande Admin" },
              { id: "caisse", icon: Banknote, label: "Caisse" }
            ].map(({ label, id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setMenuOpen(false); }}
                className={`w-full flex gap-2 text-left p-3 rounded-lg transition ${activeTab === id ? 'bg-emerald-600' : 'hover:bg-neutral-800'}`}
              >
                <Icon className="h-6 w-6" />
                {label}
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
                <input
                  type="number"
                  placeholder="NIN (Numéro d'Identité)"
                  value={newClient.nin}
                  onChange={e => setNewClient({ ...newClient, nin: e.target.value })}
                  className="bg-neutral-800 p-4 rounded-lg outline-none"
                  required
                  min="1"
                />
                <input
                  type="number"
                  placeholder="Numéro de Passeport"
                  value={newClient.passport_number}
                  onChange={e => setNewClient({ ...newClient, passport_number: e.target.value })}
                  className="bg-neutral-800 p-4 rounded-lg outline-none"
                  required
                  min="1"
                />
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
                      <p className="text-sm text-neutral-400">NIN: {c.nin}</p>
                      <p className="text-sm text-neutral-400">Passeport: {c.passport_number || 'N/A'}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <select
                  value={newOrder.client_id ?? ""}
                  onChange={e => setNewOrder(prev => ({
                    ...prev,
                    client_id: e.target.value ? Number(e.target.value) : null
                  }))}
                  className="bg-neutral-800 p-4 rounded-lg"
                  required
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.surname}</option>
                  ))}
                </select>

                <select
                  value={newOrder.car_id ?? ""}
                  onChange={e => {
                    const carId = e.target.value ? Number(e.target.value) : null;
                    setNewOrder(prev => ({
                      ...prev,
                      car_id: carId,
                      car_color: ""
                    }));
                  }}
                  className="bg-neutral-800 p-4 rounded-lg"
                  required
                >
                  <option value="">Sélectionner une voiture</option>
                  {cars.filter(c => c.quantity > 0).map(car => (
                    <option key={car.id} value={car.id}>
                      {car.model} - {car.year} ({car.color})
                    </option>
                  ))}
                </select>

                {newOrder.car_id && (
                  <select
                    value={newOrder.car_color}
                    onChange={e => setNewOrder(prev => ({
                      ...prev,
                      car_color: e.target.value
                    }))}
                    className="bg-neutral-800 p-4 rounded-lg"
                    required
                  >
                    <option value="">Sélectionner la couleur</option>
                    {getAvailableColors(newOrder.car_id).map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                )}

                <select
                  value={newOrder.delivery_status}
                  onChange={e => setNewOrder(prev => ({
                    ...prev,
                    delivery_status: e.target.value
                  }))}
                  className="bg-neutral-800 p-4 rounded-lg"
                >
                  <option value="shipping">En expédition</option>
                  <option value="arrived">Arrivé</option>
                  <option value="showroom">Showroom</option>
                </select>

                <button
                  onClick={handleAddOrder}
                  disabled={loading}
                  className="bg-emerald-600 py-4 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50"
                >
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
                        <button
                          onClick={() => handleUpdateOrder(order.order_id)}
                          disabled={loading}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg disabled:opacity-50 transition-colors"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => handlePrintContract(order)}
                          disabled={loading}
                          className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-1"
                        >
                          <Printer size={16} />
                          Imprimer
                        </button>
                        <button
                          onClick={() => setEditingOrderId(null)}
                          className="flex-1 bg-neutral-700 hover:bg-neutral-600 py-2 rounded-lg transition-colors"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold">{order.car_model}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingOrderId(order.order_id);
                              setEditForm({
                                payment_amount: order.payment_amount?.toString() || "",
                                delivery_status: order.delivery_status || "shipping"
                              });
                            }}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.order_id)}
                            disabled={loading}
                            className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-400">Client: {order.client_name} {order.client_surname}</p>
                      <p className="text-sm text-neutral-400">Tel: {order.client_phone}</p>
                      <p className="text-sm mt-3">Statut: <span className="text-white font-medium">{getStatusText(order.delivery_status)}</span></p>
                      <p className="text-sm">Prix: <span className="text-green-400 font-medium">{order.price_dzd?.toLocaleString() || 0} DZD</span></p>
                      <p className="text-sm">Payé: <span className="text-blue-400 font-medium">{order.payment_amount?.toLocaleString() || 0} DZD</span></p>
                      <button
                        onClick={() => handlePrintContract(order)}
                        disabled={loading}
                        className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Printer size={18} />
                        Imprimer Contrat
                      </button>
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
                <input
                  value={searchCars}
                  onChange={e => setSearchCars(e.target.value)}
                  placeholder="Rechercher modèle..."
                  className="bg-neutral-800 pl-12 pr-4 py-3 rounded-lg w-64"
                />
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
                    {g.quantity && (
                      <p className="text-emerald-400 font-medium mb-4">{g.quantity} unité{g.quantity > 1 ? 's' : ''}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {g.colors.map(c => <span key={c} className="bg-neutral-800 px-3 py-1 rounded-full text-xs">{c}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Paperwork/Client Documents Tab */}
        {activeTab === "paperwork" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Documents Clients</h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-neutral-400" size={20} />
                <input
                  value={searchClients}
                  onChange={e => setSearchClients(e.target.value)}
                  placeholder="Rechercher client..."
                  className="bg-neutral-800 pl-12 pr-4 py-3 rounded-lg w-64"
                />
              </div>
            </div>

            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
              {filteredClients.map(client => (
                <div key={client.id} className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{client.name} {client.surname}</h3>
                    <p className="text-sm text-neutral-400">NIN: {client.nin}</p>
                    <p className="text-sm text-neutral-400">Passeport: {client.passport_number || 'N/A'}</p>
                    <p className="text-sm text-neutral-400">{client.phone_number}</p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 bg-neutral-800 p-3 rounded-lg cursor-pointer hover:bg-neutral-700 transition">
                      <Upload size={20} className="text-emerald-400" />
                      <span className="flex-1">Télécharger document</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingImage}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleUploadClientImage(client.id, file);
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>

                    <button
                      onClick={() => {
                        setSelectedClientForImages(client);
                        fetchClientImages(client.id);
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition"
                    >
                      <ImageIcon size={20} />
                      Voir documents
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <p className="text-center text-neutral-400 py-8">Aucun client trouvé</p>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Demande à l'Admin</h2>
            {requestSent && <div className="mb-6 p-4 bg-green-600/20 border border-green-500 text-green-300 rounded-lg">✅ Demande envoyée avec succès !</div>}
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

        {/* Caisse Tab */}
        {activeTab === "caisse" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Ma Caisse</h2>

            <div className="bg-neutral-900/80 p-8 rounded-2xl border border-neutral-800 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div>
                <p className="text-neutral-400 text-lg">Solde Actuel</p>
                <h3 className="text-4xl font-bold text-emerald-400">
                  {commercialCashRegister != null
                    ? (commercialCashRegister.balance ?? 0).toLocaleString()
                    : "—"} DZD
                </h3>
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                <input
                  type="number"
                  value={newCashRequestAmount}
                  onChange={e => setNewCashRequestAmount(e.target.value)}
                  placeholder="Montant (DZD)"
                  className="bg-neutral-800 p-4 rounded-lg outline-none w-full md:w-48"
                />
                <button
                  onClick={handleCreateCashRequest}
                  className="bg-emerald-600 px-6 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition"
                >
                  Verser
                </button>
              </div>
            </div>

            <div className="bg-neutral-900/80 p-8 rounded-2xl border border-neutral-800">
              <h3 className="text-2xl font-bold mb-6">Historique des versements</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-700 text-neutral-400">
                      <th className="p-4">Date</th>
                      <th className="p-4">Montant</th>
                      <th className="p-4">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashRequests.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="p-8 text-center text-neutral-500">Aucun versement trouvé</td>
                      </tr>
                    ) : (
                      cashRequests.map(req => (
                        <tr key={req.id} className="border-b border-neutral-800/50 hover:bg-white/5">
                          <td className="p-4">{new Date(req.created_at).toLocaleDateString('fr-DZ')}</td>
                          <td className="p-4 font-semibold">{req.amount?.toLocaleString()} DZD</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${req.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                              req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                              {req.status === 'pending' ? 'En attente' : req.status === 'approved' ? 'Approuvée' : req.status === 'rejected' ? 'Rejetée' : req.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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