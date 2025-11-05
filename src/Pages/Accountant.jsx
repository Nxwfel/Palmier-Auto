
import React, { useState, useEffect } from "react";
import { motion , AnimatePresence } from "framer-motion";
import {
  Car,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const API_BASE_URL = "https://showroomd38d7382d23h8dio3d46wqdxasjdl.onrender.com"; // Replace with your actual API URL

const Accountant = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activetab , setActivetab] = useState('Jour');
  const [selectedCommercial, setSelectedCommercial] = useState(null);
  const [commercial , setCommercial] = useState([]);
  const [Clients , setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [expenses, setExpenses] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCommercials(),
        fetchClients(),
        fetchOrders(),
        fetchCars(),
        fetchExpenses(),
        fetchEarnings()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommercials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/commercials/`);
      const data = await response.json();
      
      // Transform data to match component structure
      const transformedCommercials = data.map(c => ({
        id: c.id,
        nom: `${c.name} ${c.surname}`,
        localisation: c.wilaya,
        day_transactions: "0", // Will be calculated from orders
        phone_number: c.phone_number,
        activities: [] // Will be populated from orders
      }));
      
      setCommercial(transformedCommercials);
    } catch (error) {
      console.error("Error fetching commercials:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/`);
      const data = await response.json();
      setClients(data.map(c => ({
        id: c.id,
        name: `${c.name} ${c.surname}`,
        phone: c.phone_number,
        wilaya: c.wilaya
      })));
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchCars = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cars/all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await response.json();
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/monthly`);
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const fetchEarnings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/earnings/monthly`);
      const data = await response.json();
      setEarnings(data);
    } catch (error) {
      console.error("Error fetching earnings:", error);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggletab = (tab) => 
    {setActivetab(tab)
     setMenuOpen(!menuOpen)
    }
  ;

  // Calculate statistics from real data
  const getTodayOrders = () => {
    const today = new Date().toISOString().split('T')[0];
    return orders.filter(order => 
      order.purchase_date && order.purchase_date.startsWith(today)
    );
  };

  const todayOrders = getTodayOrders();
  const totalCarsEntered = cars.length;
  const totalCarsSold = orders.filter(o => o.status === "completed").length;
  const totalRevenue = orders
    .filter(o => o.status === "completed")
    .reduce((sum, order) => sum + (order.payment_amount || 0), 0);

  const stats = [
    { title: "Voitures Entrées", value: totalCarsEntered, icon: <Car />, color: "bg-blue-600" },
    { title: "Voitures Vendues", value: totalCarsSold, icon: <TrendingUp />, color: "bg-green-600" },
    { title: "Chiffre Affaire", value: `${totalRevenue.toLocaleString()} DZD`, icon: <DollarSign />, color: "bg-emerald-600" },
  ];

  // Cars entered (all cars in inventory)
  const carsEntered = cars.map(car => ({
    id: car.id,
    model: car.model,
    distributor: car.country || "N/A",
    color: car.color,
    year: car.year
  }));

  // Cars sold (completed orders)
  const carsSold = orders
    .filter(o => o.status === "completed")
    .map(order => {
      const car = cars.find(c => c.id === order.car_id);
      return {
        id: order.order_id,
        model: order.car_model,
        price: `${order.price_dzd?.toLocaleString()} DZD`,
        commercial: order.client_name || "N/A",
        profit: car ? `${(car.commercial_comission || 0).toLocaleString()} DZD` : "N/A"
      };
    });

  // Calculate daily transactions per commercial
  const commercialWithStats = commercial.map(c => {
    const commercialOrders = todayOrders.filter(o => {
      const car = cars.find(car => car.id === o.car_id);
      return car && car.commercial_id === c.id;
    });
    
    const activities = orders
      .filter(o => {
        const car = cars.find(car => car.id === o.car_id);
        return car && car.commercial_id === c.id;
      })
      .map(o => ({
        type: o.status === "completed" ? "Vente" : "En cours",
        car: o.car_model,
        client: `${o.client_name} ${o.client_surname}`,
        amount: `${o.price_dzd?.toLocaleString()} DZD`,
        date: o.purchase_date ? new Date(o.purchase_date).toLocaleDateString() : "N/A",
        status: o.delivery_status === "showroom" ? "Complété" : "En cours"
      }));

    return {
      ...c,
      day_transactions: commercialOrders.length.toString(),
      activities
    };
  });

  // Get client purchases
  const clientsWithPurchases = Clients.map(client => {
    const clientOrders = orders.filter(o => o.client_id === client.id);
    const lastOrder = clientOrders[clientOrders.length - 1];
    
    return {
      ...client,
      purchase: lastOrder?.car_model || "Aucun achat",
      amount: lastOrder ? `${lastOrder.price_dzd?.toLocaleString()} DZD` : "0 DZD"
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-2xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen font-main bg-neutral-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0  }}
        className={`fixed z-20 h-screen w-[15vw] max-md:w-[40vw] ${menuOpen ? '' : 'ml-[-40vw]'} justify-between flex flex-col bg-neutral-900 border-r border-neutral-800 p-4 transition-all duration-300`}
      >
          
        <ul className="flex flex-col gap-[2vh]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="gray" onClick={toggleMenu} className="size-[3vh] cursor-pointer hover:scale-105 transition-all">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>

          <h2 className="text-xl mb-[4vh]">Palmier Auto</h2>
                    <motion.li
          initial={{scale:1}}
          whileHover={{scale:1.05}}
          whileTap={{scale:1}}
          onClick={() => toggletab('Jour')}
          className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-emerald-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
            <h1>Nouvelles du jour
            </h1>
          </motion.li>
          <motion.li
          initial={{scale:1}}
          whileHover={{scale:1.05}}
          whileTap={{scale:1}}
          onClick={() => toggletab('Commercials')}
          className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-emerald-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="size-[3vh]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
            <h1>Commercials</h1>
          </motion.li>
          <motion.li
          initial={{scale:1}}
          whileHover={{scale:1.05}}
          whileTap={{scale:1}}
          onClick={() => toggletab('Finance')}
          className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-emerald-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="currentColor" className="size-[3vh]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            <h1>Finance</h1>
          </motion.li>
        </ul>
                  <motion.div
          initial={{scale:1}}
          whileHover={{scale:1.05}}
          whileTap={{scale:1}}

          className="w-[90%] p-[2vh] text-[2vh] cursor-pointer bg-red-600 rounded-lg text-center flex justify-start items-center gap-[0.2vw]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[3vh]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>

            <h1>Logout</h1>
          </motion.div>

      </motion.div>

      {/* Main Content */}
      {activetab === 'Jour' && (
        <div className="flex-1 flex flex-col p-6 space-y-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="gray" onClick={toggleMenu} className="size-[5vh] cursor-pointer my-[2vh] hover:scale-110 transition-all">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
          <div className="flex flex-col justify-center items-center w-full h-fit">
            <h1 className="text-[10vh] text-white mb-[5vh]">Nouvelles du jour</h1>
            <div className="flex">
              <div className="grid grid-cols-3 gap-[3vw] max-md:grid-cols-1">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`px-[2vw] py-10 rounded-2xl ${s.color} bg-opacity-20 border border-neutral-800 flex flex-col gap-2`}
            >
              <div className="flex justify-between items-center gap-[2vw]">
                <div className="text-[5vh] font-light">{s.title}</div>
                <div className="text-3xl">{s.icon}</div>
              </div>
              <div className="text-[6vh] font-bold">{s.value}</div>
            </motion.div>
          ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {activetab === 'Finance' && (
        <div className="flex-1 flex flex-col p-6 space-y-6 ">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="gray" onClick={toggleMenu} className="size-[5vh] cursor-pointer my-[2vh] hover:scale-110 transition-all">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
        </svg>

        {/* Header */}
          <h1 className="text-[10vh] font-semibold">Finance Générale</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-2xl ${s.color} bg-opacity-20 border border-neutral-800 flex flex-col gap-2`}
            >
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">{s.title}</div>
                <div className="text-2xl">{s.icon}</div>
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Cars Entered */}
        <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
          <h2 className="text-xl font-semibold mb-4">Voitures Entrées</h2>
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-2">Modèle</th>
                <th className="p-2">Pays</th>
                <th className="p-2">Couleur</th>
                <th className="p-2">Année</th>
              </tr>
            </thead>
            <tbody>
              {carsEntered.slice(0, 10).map((c) => (
                <tr key={c.id} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                  <td className="p-2">{c.model}</td>
                  <td className="p-2">{c.distributor}</td>
                  <td className="p-2">{c.color}</td>
                  <td className="p-2">{c.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Cars Sold */}
        <div className="bg-neutral-900 rounded-2xl p-4 border border-neutral-800">
          <h2 className="text-xl font-semibold mb-4">Voitures Vendues</h2>
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="p-2">Modèle</th>
                <th className="p-2">Prix de Vente</th>
                <th className="p-2">Client</th>
                <th className="p-2">Commission</th>
              </tr>
            </thead>
            <tbody>
              {carsSold.map((c) => (
                <tr key={c.id} className="border-b border-neutral-800 hover:bg-neutral-800/30">
                  <td className="p-2">{c.model}</td>
                  <td className="p-2">{c.price}</td>
                  <td className="p-2">{c.commercial}</td>
                  <td className="p-2 text-emerald-400">{c.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
      )}
      {activetab === 'Commercials' && (
        <div className="flex flex-col p-6 w-screen min-h-screen justify-center items-start">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.3} stroke="gray" onClick={toggleMenu} className="size-[5vh] cursor-pointer my-[2vh] hover:scale-110 transition-all">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
          <h1 className="text-[10vh] font-semibold mb-[5vh]">Commercials</h1>
          {/* Context */}
          <div className="flex gap-6 min-h-screen w-screen justify-center items-center">
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-[5vw]">
             {commercialWithStats.map((commercial , index) => (
              <motion.div 
              key={index}
              initial={{opacity: 0, y: 10 ,scale:1 ,backgroundColor: '#171717'}}
              whileHover={{scale:1.02 , backgroundColor: '#262626'}}
              whileTap={{scale:1}}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCommercial(commercial)}
              className="h-[45vw] w-[40vw] max-md:w-[90%] max-md:h-fit p-10 flex flex-col justify-start items-center cursor-pointer bg-neutral-900 border border-neutral-700 rounded-xl">
                <h1 className="border-b border-b-neutral-700 text-[7vh]">{commercial.nom}</h1>
                <div className="w-full h-fit justify-start mt-[10vh] pl-[5vw] pb-10 border-b border-b-neutral-600">
                <h1 className="text-neutral-500 text-[3vh]">Localisation: <span className="text-white">{commercial.localisation}</span></h1>
                <h1 className="text-neutral-500 text-[3vh]">Vente d'Aujourd'hui: <span className="text-white">{commercial.day_transactions}</span></h1>
                </div>
                <div className="w-full ">
                  <h1 className="text-neutral-500 text-[3vh] mt-5 mb-2">Clients Récents:</h1>
                  <div className="max-h-[15vh] overflow-y-scroll">
                  {clientsWithPurchases.slice(0, 5).map((client , idx) => (
                    <div key={idx} className="flex justify-between items-center mb-2 border-b border-b-neutral-600 hover:bg-neutral-800/30 p-2">
                      <h1 className="text-white font-thin text-[2.5vh]">{client.name}</h1>
                      <h1 className="text-neutral-400 text-[2vh]">{client.purchase} - {client.amount}</h1>
                    </div>
                  ))}
                  </div>
                </div>
              </motion.div> 
            ))}
            {/* Activity Details Modal */}
            <AnimatePresence>
              {selectedCommercial && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                  onClick={() => setSelectedCommercial(null)}
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-neutral-900 p-8 rounded-xl border border-neutral-700 w-[80vw] max-h-[80vh] overflow-y-auto"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-[4vh] font-semibold">{selectedCommercial.nom} - Activités</h2>
                      <svg onClick={() => setSelectedCommercial(null)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer hover:text-neutral-400 transition-colors">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="space-y-4">
                      {selectedCommercial.activities && selectedCommercial.activities.length > 0 ? (
                        selectedCommercial.activities.map((activity, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 bg-neutral-800 rounded-lg border border-neutral-700"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                  activity.status === 'Complété' ? 'bg-green-500/20 text-green-300' : 
                                  'bg-yellow-500/20 text-yellow-300'
                                }`}>
                                  {activity.status}
                                </span>
                                <h3 className="text-xl font-medium mt-2">{activity.type}</h3>
                                <p className="text-neutral-400">Client: {activity.client}</p>
                                {activity.car && <p className="text-neutral-400">Voiture: {activity.car}</p>}
                                {activity.amount && <p className="text-emerald-400">{activity.amount}</p>}
                              </div>
                              <span className="text-neutral-500 text-sm">{activity.date}</span>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-neutral-400 text-center py-8">Aucune activité enregistrée</p>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Accountant;