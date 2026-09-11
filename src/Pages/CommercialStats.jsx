import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Search, 
  X, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Calendar
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart 
} from "recharts";
import { apiFetch } from "../lib/api";
import CommercialDeepDiveModal from "../Components/CommercialDeepDiveModal";
import Pagination from "../Components/Pagination";

const StatCard = ({ title, value, subtitle, icon: Icon, color = "emerald" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800 relative overflow-hidden`}
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl -mr-10 -mt-10`} />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div>
        <h3 className="text-neutral-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
        {subtitle && <p className={`text-${color}-400 text-sm mt-2`}>{subtitle}</p>}
      </div>
      <div className={`p-3 bg-${color}-500/20 text-${color}-400 rounded-xl`}>
        <Icon size={24} />
      </div>
    </div>
  </motion.div>
);

export default function CommercialStats({ API_BASE }) {
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [summary, setSummary] = useState(null);

  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const [timeline, setTimeline] = useState([]);
  const [timelinePeriod, setTimelinePeriod] = useState("month");

  const [loadingCommercials, setLoadingCommercials] = useState(true);
  const [commercials, setCommercials] = useState([]);
  const [pageCommercials, setPageCommercials] = useState(1);
  const [commercialsSearch, setCommercialsSearch] = useState("");

  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orders, setOrders] = useState([]);
  const [pageOrders, setPageOrders] = useState(1);
  const [ordersSearch, setOrdersSearch] = useState("");
  const [allCommercialsList, setAllCommercialsList] = useState([]);

  const [selectedCommercialId, setSelectedCommercialId] = useState(null);
  const [selectedCommercialData, setSelectedCommercialData] = useState(null);
  const [loadingDeepDive, setLoadingDeepDive] = useState(false);

  // Fetch Summary
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoadingSummary(true);
        const res = await apiFetch(`${API_BASE}/commercial_orders_stats/summary`);
        const baseSummary = await res.json();
        
        // Calculate amount recolte and active commercials from caisses
        const caissesRes = await apiFetch(`${API_BASE}/cash_register/`);
        const caissesData = await caissesRes.json();
        
        let totalRecolte = 0;
        let activeCount = 0;
        
        if (Array.isArray(caissesData)) {
          const now = new Date();
          caissesData.forEach(c => {
            const balance = c.balance || 0;
            if (balance > 0) {
              totalRecolte += balance;
              
              const createdAt = new Date(c.created_at);
              const diffMonths = (now.getFullYear() - createdAt.getFullYear()) * 12 + (now.getMonth() - createdAt.getMonth());
              
              if (diffMonths > 1 || (diffMonths === 1 && now.getDate() >= createdAt.getDate())) {
                activeCount++;
              }
            }
          });
        }
        
        setSummary({
          ...baseSummary,
          total_payments_collected: totalRecolte,
          total_outstanding_debt: (baseSummary.total_sales_dzd || 0) - totalRecolte,
          active_commercials_count: activeCount
        });
      } catch (err) {
        console.error("Error fetching summary:", err);
      } finally {
        setLoadingSummary(false);
      }
    };
    fetchSummary();
  }, [API_BASE]);

  // Fetch Timeline
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoadingTimeline(true);
        const res = await apiFetch(`${API_BASE}/commercial_orders_stats/timeline?period=${timelinePeriod}`);
        const data = await res.json();
        setTimeline(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching timeline:", err);
      } finally {
        setLoadingTimeline(false);
      }
    };
    fetchTimeline();
  }, [API_BASE, timelinePeriod]);

  // Fetch Commercials
  useEffect(() => {
    const fetchCommercials = async () => {
      try {
        setLoadingCommercials(true);
        const res = await apiFetch(`${API_BASE}/commercial_orders_stats/commercials`);
        const data = await res.json();
        setCommercials(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching commercials:", err);
      } finally {
        setLoadingCommercials(false);
      }
    };
    fetchCommercials();
  }, [API_BASE]);

  // Fetch Orders and Commercials (All and paginate on frontend)
  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        setLoadingOrders(true);
        const [ordersRes, commsRes] = await Promise.all([
          apiFetch(`${API_BASE}/orders/`),
          apiFetch(`${API_BASE}/commercials/`)
        ]);
        
        const ordersData = await ordersRes.json();
        const commsData = await commsRes.json();
        
        if (Array.isArray(ordersData)) {
          setOrders(ordersData);
        } else if (ordersData && ordersData.items) {
          setOrders(ordersData.items);
        }

        if (Array.isArray(commsData)) {
          setAllCommercialsList(commsData);
        } else if (commsData && commsData.items) {
          setAllCommercialsList(commsData.items);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrdersData();
  }, [API_BASE]);

  const filteredOrders = useMemo(() => {
    if (!ordersSearch.trim()) return orders;
    const lowerSearch = ordersSearch.toLowerCase();
    return orders.filter(o => 
      o.client_name?.toLowerCase().includes(lowerSearch) ||
      o.client_surname?.toLowerCase().includes(lowerSearch) ||
      o.car_model?.toLowerCase().includes(lowerSearch) ||
      (o.order_id || o.id)?.toString().includes(lowerSearch) ||
      allCommercialsList.find(c => c.id === o.commercial_id)?.name?.toLowerCase().includes(lowerSearch) ||
      allCommercialsList.find(c => c.id === o.commercial_id)?.surname?.toLowerCase().includes(lowerSearch)
    );
  }, [orders, ordersSearch, allCommercialsList]);

  // Fetch Deep Dive
  useEffect(() => {
    if (!selectedCommercialId) return;
    const fetchDeepDive = async () => {
      try {
        setLoadingDeepDive(true);
        const res = await apiFetch(`${API_BASE}/commercial_orders_stats/commercials/${selectedCommercialId}`);
        const data = await res.json();
        setSelectedCommercialData(data);
      } catch (err) {
        console.error("Error fetching deep dive:", err);
      } finally {
        setLoadingDeepDive(false);
      }
    };
    fetchDeepDive();
  }, [API_BASE, selectedCommercialId]);

  // Client-side pagination and filtering for Commercials
  const filteredCommercials = commercials.filter(c => 
    (c.name?.toLowerCase() || "").includes(commercialsSearch.toLowerCase()) || 
    (c.surname?.toLowerCase() || "").includes(commercialsSearch.toLowerCase())
  );
  
  const currentCommercials = filteredCommercials.slice((pageCommercials - 1) * 20, pageCommercials * 20);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <TrendingUp className="text-emerald-400" size={32} />
          Statistiques des Commerciaux
        </h1>
      </div>

      {/* Summary Cards */}
      {loadingSummary ? (
        <div className="text-center py-10 text-neutral-500">Chargement du résumé...</div>
      ) : summary ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total des Ventes (DZD)"
            value={summary.total_sales_dzd?.toLocaleString() || "0"}
            subtitle={`${summary.total_confirmed_orders || 0} confirmées, ${summary.total_pending_orders || 0} en attente`}
            icon={TrendingUp}
            color="emerald"
          />
          <StatCard
            title="Paiements Récoltés"
            value={summary.total_payments_collected?.toLocaleString() || "0"}
            subtitle={`${summary.total_fully_paid || 0} payées, ${summary.total_partially_paid || 0} partielles`}
            icon={CreditCard}
            color="blue"
          />
          <StatCard
            title="Dette / Reste à Payer"
            value={summary.total_outstanding_debt?.toLocaleString() || "0"}
            subtitle={`${summary.total_unpaid || 0} commandes impayées`}
            icon={BarChart3}
            color="red"
          />
        </div>
      ) : (
        <div className="text-center py-10 text-neutral-500">Aucune donnée trouvée</div>
      )}

      {/* Timeline Chart */}
      <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-emerald-400" /> Evolution des Ventes
          </h2>
          <div className="flex bg-neutral-800 p-1 rounded-lg">
            {["day", "week", "month", "year"].map((period) => (
              <button
                key={period}
                onClick={() => setTimelinePeriod(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timelinePeriod === period ? "bg-emerald-600 text-white" : "text-neutral-400 hover:text-white hover:bg-neutral-700"
                }`}
              >
                {period === "day" ? "Jour" : period === "week" ? "Semaine" : period === "month" ? "Mois" : "Année"}
              </button>
            ))}
          </div>
        </div>
        
        {loadingTimeline ? (
          <div className="h-72 flex items-center justify-center text-neutral-500">Chargement du graphique...</div>
        ) : timeline.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" stroke="#525252" tick={{fill: '#a3a3a3'}} />
                <YAxis stroke="#525252" tick={{fill: '#a3a3a3'}} />
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="total_sales_dzd" name="Ventes (DZD)" stroke="#10b981" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-neutral-500">Aucune donnée de vente pour cette période</div>
        )}
      </div>

      {/* Commercials Leaderboard */}
      <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="text-emerald-400" /> Classement des Commerciaux
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={commercialsSearch}
              onChange={(e) => setCommercialsSearch(e.target.value)}
              className="bg-neutral-800 pl-10 pr-4 py-2 rounded-lg text-sm w-64 outline-none border border-neutral-700 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {loadingCommercials ? (
          <div className="text-center py-10 text-neutral-500">Chargement du classement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 text-sm">
                  <th className="py-3 px-4 font-medium">Commercial</th>
                  <th className="py-3 px-4 font-medium">Ventes Totales</th>
                  <th className="py-3 px-4 font-medium">Commandes</th>
                  <th className="py-3 px-4 font-medium">Paiements Récoltés</th>
                  <th className="py-3 px-4 font-medium">Taux de Collecte</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCommercials.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-neutral-500">Aucun commercial trouvé</td>
                  </tr>
                ) : (
                  currentCommercials.map((c) => (
                    <tr key={c.commercial_id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white">{c.name} {c.surname}</div>
                        <div className="text-xs text-neutral-500">{c.phone_number}</div>
                      </td>
                      <td className="py-4 px-4 font-medium text-emerald-400">{c.total_sales_dzd?.toLocaleString() || 0} DZD</td>
                      <td className="py-4 px-4 text-neutral-300">{c.total_orders || 0}</td>
                      <td className="py-4 px-4 text-blue-400 font-medium">{c.collected_payments?.toLocaleString() || 0} DZD</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-neutral-800 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${c.collection_rate_percentage || 0}%` }}></div>
                          </div>
                          <span className="text-xs text-neutral-400 w-8">{Math.round(c.collection_rate_percentage || 0)}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button 
                          onClick={() => setSelectedCommercialId(c.commercial_id)}
                          className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                          title="Voir Détails"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <Pagination currentPage={pageCommercials} totalPages={Math.ceil(filteredCommercials.length / 20)} onPageChange={setPageCommercials} />
          </div>
        )}
      </div>

      {/* Comprehensive Orders Table */}
      <div className="bg-neutral-900/80 p-6 rounded-2xl border border-neutral-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-emerald-400" /> Historique Global des Commandes
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher une commande..." 
              value={ordersSearch}
              onChange={(e) => { setOrdersSearch(e.target.value); setPageOrders(1); }}
              className="bg-neutral-800 pl-10 pr-4 py-2 rounded-lg text-sm w-64 outline-none border border-neutral-700 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
        
        {loadingOrders ? (
          <div className="text-center py-10 text-neutral-500">Chargement des commandes...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 text-sm">
                  <th className="py-3 px-4 font-medium">ID Commande</th>
                  <th className="py-3 px-4 font-medium">Commercial</th>
                  <th className="py-3 px-4 font-medium">Client</th>
                  <th className="py-3 px-4 font-medium">Voiture</th>
                  <th className="py-3 px-4 font-medium">Montant (DZD)</th>
                  <th className="py-3 px-4 font-medium">Payé</th>
                  <th className="py-3 px-4 font-medium">Reste</th>
                  <th className="py-3 px-4 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-neutral-500">Aucune commande trouvée</td>
                  </tr>
                ) : (
                  filteredOrders.slice((pageOrders - 1) * 20, pageOrders * 20).map((o) => {
                    const remaining = (o.price_dzd || 0) - (o.payment_amount || 0);
                    const paymentStatus = remaining <= 0 ? 'fully_paid' : (o.payment_amount > 0 ? 'partially_paid' : 'unpaid');
                    const commercial = allCommercialsList.find(c => c.id === o.commercial_id);
                    const commercialDisplay = commercial ? `${commercial.name || ""} ${commercial.surname || ""}`.trim() : (o.commercial_id ? `ID: ${o.commercial_id}` : 'N/A');
                    
                    return (
                    <tr key={o.order_id || o.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-emerald-400 text-sm">#{o.order_id || o.id}</td>
                      <td className="py-3 px-4 text-sm">{commercialDisplay}</td>
                      <td className="py-3 px-4 text-sm">{o.client_name} {o.client_surname}</td>
                      <td className="py-3 px-4 text-sm">{o.car_model}</td>
                      <td className="py-3 px-4 font-medium text-white">{o.price_dzd?.toLocaleString() || 0}</td>
                      <td className="py-3 px-4 text-emerald-400">{o.payment_amount?.toLocaleString() || 0}</td>
                      <td className="py-3 px-4 text-red-400">{remaining?.toLocaleString() || 0}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          paymentStatus === 'fully_paid' ? 'bg-emerald-500/20 text-emerald-400' :
                          paymentStatus === 'partially_paid' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {paymentStatus === 'fully_paid' ? 'Payé' : paymentStatus === 'partially_paid' ? 'Partiel' : 'Impayé'}
                        </span>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            
            <Pagination currentPage={pageOrders} totalPages={Math.ceil(filteredOrders.length / 20)} onPageChange={setPageOrders} />
            
          </div>
        )}
      </div>

      <CommercialDeepDiveModal 
        commercialId={selectedCommercialId} 
        onClose={() => setSelectedCommercialId(null)} 
        API_BASE={API_BASE} 
      />
    </div>
  );
}
