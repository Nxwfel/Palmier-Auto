// src/Pages/Commercials.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, File, Car, LetterTextIcon, Printer, Download } from "lucide-react";

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
    address: "",
    nin: ""
  });

  const [newOrder, setNewOrder] = useState({
    client_id: null,
    car_id: null,
    car_color: "",
    delivery_status: "shipping"
  });

  const [searchOrders, setSearchOrders] = useState("");
  const [searchCars, setSearchCars] = useState("");
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

  // Contract generation
  const [showContractPrompt, setShowContractPrompt] = useState(false);
  const [lastOrderData, setLastOrderData] = useState(null);

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
    const { name, surname, phone, password, wilaya, address, nin } = newClient;
    if (!name || !surname || !phone || !password || !wilaya || !address || !nin) {
      alert("Veuillez remplir tous les champs (y compris le NIN) !");
      return;
    }
    const parsedNIN = parseInt(nin, 10);
    if (isNaN(parsedNIN) || parsedNIN <= 0) {
      alert("Le NIN doit être un nombre entier positif !");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/clients/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name,
          surname,
          nin: parsedNIN,
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
      setNewClient({ name: "", surname: "", phone: "", password: "", wilaya: "", address: "", nin: "" });
      fetchClients();
    } catch (err) {
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
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
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
      
      // Store order data for contract generation
      const client = clients.find(c => c.id === clientId);
      const car = cars.find(c => c.id === carId);
      const priceInfo = getCarPriceInfo(car);
      
      setLastOrderData({
        client,
        car,
        color: car_color,
        priceInDZD: priceInfo.priceInDZD,
        orderId: createdOrder.order_id || createdOrder.id,
        date: new Date().toLocaleDateString('fr-DZ')
      });

      alert("✅ Commande ajoutée !");
      setShowContractPrompt(true);
      setNewOrder({ client_id: null, car_id: null, car_color: "", delivery_status: "shipping" });
      fetchOrders();
    } catch (err) {
      console.error("❌ Erreur commande:", err);
      alert("❌ Erreur:\n" + (err.message || "Échec réseau"));
    } finally {
      setLoading(false);
    }
  };

    const generateContract = () => {
    if (!lastOrderData) return;
    const { client, car, color, priceInDZD, date } = lastOrderData;
    const formattedPrice = priceInDZD ? Math.round(priceInDZD).toLocaleString('fr-DZ') : "0";
    const contractDate = date; 
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
            margin: 1cm; /* Standard A4 margins */
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Traditional Arabic', 'Arabic Typesetting', 'Amiri', Arial, sans-serif; /* Arabic font stack */
            line-height: 1.6;
            color: #000;
            background: #fff;
            direction: rtl; /* Right-to-left for Arabic */
            font-size: 12pt; /* Standard document font size */
            padding: 0.5cm; /* Small padding inside the page */
        }
        .header {
            text-align: center;
            border-bottom: 1px solid #000; /* Simple black line */
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .company-info {
            font-size: 10pt; /* Smaller font for company details */
            text-align: center;
            margin-bottom: 5px;
        }
        h1 {
            font-size: 14pt; /* Adjusted font size for title */
            font-weight: bold;
            color: #000;
            margin: 10px 0;
        }
        .section {
            margin-bottom: 10px; /* Consistent spacing */
        }
        .section h2 {
            font-size: 12pt;
            font-weight: bold;
            color: #000;
            margin-bottom: 5px;
            text-decoration: underline; /* Simple underline instead of complex borders */
        }
        .info-row {
            display: flex;
            padding: 3px 0; /* Reduced padding */
        }
        .info-label {
            font-weight: bold;
            color: #000; /* Standard black for labels */
            min-width: 100px; /* Adjusted width */
            margin-left: 8px; /* Space between label and value */
        }
        .info-value {
            color: #000; /* Standard black for values */
            flex: 1;
        }
        .terms-section {
            margin-top: 15px;
        }
        .term-item {
            padding: 5px 0; /* Reduced padding for terms */
        }
        .term-number {
            display: inline-block;
            font-weight: bold;
            margin-left: 5px; /* Space after number */
        }
        .price-highlight {
            text-align: center;
            font-size: 13pt; /* Slightly larger font for price */
            font-weight: bold;
            margin: 15px 5px; /* Spacing with padding */
            padding: 8px; /* Inner padding */
            border: 1px solid #000; /* Simple solid border around price */
        }
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 30px; /* Space before signatures */
            padding: 0 10px; /* Padding for alignment */
        }
        .signature-box {
            width: 45%; /* Roughly half width */
            text-align: center;
            padding-top: 20px; /* Space for signature line */
            border-top: 1px solid #000; /* Signature line */
        }
        .signature-box h3 {
            font-size: 11pt;
            margin-bottom: 3px;
        }
        .signature-line {
            margin-top: 15px; /* Space above the line text */
            color: #000; /* Standard black */
            font-size: 10pt;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #000; /* Standard black */
            font-size: 10pt;
            padding-top: 8px;
            border-top: 1px solid #000; /* Simple black line */
        }
        @media print {
            body {
                padding: 0.5cm; /* Ensure padding is set for print */
                font-size: 11pt; /* Slightly smaller for printing if needed, adjust as necessary */
            }
             /* Ensure the print button is not printed */
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="header">
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
            <div class="info-value">${contractDate}</div> <!-- Use the date from lastOrderData -->
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
            <div class="info-label">الممثل:</div>
            <div class="info-value">السيد نخيلة ياسين</div>
        </div>
        <div class="info-row">
            <div class="info-label">بطاقة التعريف:</div>
            <div class="info-value">222210100000000000</div>
        </div>
        <div class="info-row">
            <div class="info-label">الصفة:</div>
            <div class="info-value">مدير الشركة</div>
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
        <div class="info-row">
            <div class="info-label">ناقل الحركة:</div>
            <div class="info-value">أوتوماتيك</div>
        </div>
        ${car.engine ? `
        <div class="info-row">
            <div class="info-label">المحرك:</div>
            <div class="info-value">${car.engine}</div>
        </div>
        ` : ''}
    </div>

    <div class="price-highlight">
        المبلغ الإجمالي والنهائي: ${formattedPrice} دج
        <br>
        <small style="font-size: 10pt;">(متضمناً جميع تكاليف النقل والتأمين دون حقوق الجمركة)</small>
    </div>

    <div class="terms-section section">
        <h2>شروط الاتفاقية</h2>
        <div class="term-item">
            <span class="term-number">1-</span>
            <span>يلتزم الطرف الأول بشراء وشحن السيارة باسم ومكان الطرف الثاني المسمى المشتري السيد/ة ${client.surname} ${client.name}.</span>
        </div>
        <div class="term-item">
            <span class="term-number">2-</span>
            <span>يتعهد المشتري بدفع المبلغ ${formattedPrice} دج في أجل أقصاه 30 أياماً من تاريخ العقد.</span>
        </div>
        <div class="term-item">
            <span class="term-number">3-</span>
            <span>يتعهد الطرف الأول بتجهيز السيارة إلى الشحن خلال 15 يوم عمل من تاريخ الدفع إلا في حالة القوة القاهرة والخارجة عن إرادة الوكيل كالتأخير في الشحن من البلد المورد أو تعطل الباخرة المخصصة للشحن أو إضراب الخ...</span>
        </div>
        <div class="term-item">
            <span class="term-number">4-</span>
            <span>يضمن الطرف الأول وصول البضاعة على نفس الحالة المتفق عليها وبنفس المواصفات. وأي اختلاف في ذلك يكون الطرف الأول مسؤول عن تعويض الطرف الثاني.</span>
        </div>
        <div class="term-item">
            <span class="term-number">5-</span>
            <span>يتعهد الطرف الأول بأن يقوم بتجهيز الأوراق وإرسالها للطرف الثاني خلال 48 يوم عمل من تاريخ استلام المورد بصين لمستحقاته.</span>
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
        <p> palmier Auto - شركة موثوقة لبيع السيارات المستوردة</p>
        <p>هذا العقد محرر ومطبوع في نسختين، نسخة لكل طرف</p>
    </div>

    <!-- Print Button (Hidden when printing) -->
     <div class="no-print" style="text-align: center; margin-top: 30px;">
        <button onclick="window.print()" style="background: #2563eb; color: white; padding: 8px 16px; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: bold;">
            طباعة العقد
        </button>
    </div>
</body>
</html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(contractHTML);
        printWindow.document.close();
        // Optional: Focus the new window
        // printWindow.focus();
    } else {
        alert("❌ لم يتمكن من فتح نافذة الطباعة. يرجى التحقق من إعدادات المتصفح.");
    }
  };

  const handleUpdateOrder = async (orderId) => {
    const body = { order_id: orderId };
    if (editForm.payment_amount !== "") body.payment_amount = parseFloat(editForm.payment_amount);
    if (editForm.delivery_status) body.delivery_status = editForm.delivery_status;

    const token = localStorage.getItem('authToken');
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/orders/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errorText = await res.text();
        let errorData;
        try { errorData = JSON.parse(errorText); } catch { errorData = { message: errorText }; }
        throw new Error(errorData.detail || errorData.message || `HTTP ${res.status}`);
      }
      alert("✅ Mise à jour réussie");
      setEditingOrderId(null);
      setEditForm({ payment_amount: "", delivery_status: "" });
      fetchOrders();
    } catch (err) {
      console.error("Update Order Error:", err);
      if (err.message.includes("Failed to fetch")) {
        alert(`❌ ERREUR CORS...\nPayload: ${JSON.stringify(body)}`);
      } else {
        alert("❌ Erreur mise à jour: " + err.message);
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
      if (!res.ok) throw new Error("Suppression échouée");
      alert("✅ Commande supprimée");
      fetchOrders();
    } catch (err) {
      alert("❌ Erreur suppression");
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
      alert("✅ Demande envoyée !");
    } catch (err) {
      alert("❌ Échec envoi demande");
    }
  };

  const getAvailableColors = (carId) => {
    if (!carId) return [];
    const car = cars.find(c => c.id === carId);
    if (car) return [car.color];

    const model = cars.find(c => c.id === carId)?.model;
    if (model) {
      const colors = [...new Set(
        cars.filter(c => c.model === model && c.quantity > 0).map(c => c.color)
      )];
      return colors;
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

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 p-4 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
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
              { id: "requests", icon: LetterTextIcon, label: "Demande Admin" }
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