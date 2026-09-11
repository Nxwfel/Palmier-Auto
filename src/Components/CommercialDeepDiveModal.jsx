import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { apiFetch } from "../lib/api";

export default function CommercialDeepDiveModal({ commercialId, onClose, API_BASE }) {
  const [loadingDeepDive, setLoadingDeepDive] = useState(false);
  const [selectedCommercialData, setSelectedCommercialData] = useState(null);

  useEffect(() => {
    if (!commercialId) return;
    const fetchDeepDive = async () => {
      try {
        setLoadingDeepDive(true);
        const res = await apiFetch(`${API_BASE}/commercial_orders_stats/commercials/${commercialId}`);
        const data = await res.json();
        setSelectedCommercialData(data);
      } catch (err) {
        console.error("Error fetching deep dive:", err);
      } finally {
        setLoadingDeepDive(false);
      }
    };
    fetchDeepDive();
  }, [API_BASE, commercialId]);

  if (!commercialId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                Profil Détaillé du Commercial
              </h2>
              <p className="text-neutral-400 mt-1">ID: #{commercialId}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {loadingDeepDive ? (
            <div className="py-20 text-center text-neutral-500">Chargement des détails...</div>
          ) : selectedCommercialData ? (
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-neutral-800/50 p-4 rounded-xl">
                  <div className="text-sm text-neutral-400">Nom Complet</div>
                  <div className="font-semibold mt-1">{selectedCommercialData.stats?.name} {selectedCommercialData.stats?.surname}</div>
                </div>
                <div className="bg-neutral-800/50 p-4 rounded-xl">
                  <div className="text-sm text-neutral-400">Téléphone</div>
                  <div className="font-semibold mt-1">{selectedCommercialData.stats?.phone_number || 'N/A'}</div>
                </div>
                <div className="bg-neutral-800/50 p-4 rounded-xl">
                  <div className="text-sm text-neutral-400">Wilayas</div>
                  <div className="font-semibold mt-1">{selectedCommercialData.stats?.wilayas?.join(", ") || 'N/A'}</div>
                </div>
                <div className="bg-neutral-800/50 p-4 rounded-xl">
                  <div className="text-sm text-neutral-400">Clients Distincts</div>
                  <div className="font-semibold mt-1">{selectedCommercialData.stats?.unique_clients_count || 0}</div>
                </div>
              </div>

              {/* Financial Metrics */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Indicateurs de Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-xl">
                    <div className="text-emerald-400/80 text-sm">Chiffre d'Affaires Généré</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-2">{selectedCommercialData.stats?.total_sales_dzd?.toLocaleString() || 0} DZD</div>
                    <div className="text-xs text-emerald-400/60 mt-1">{selectedCommercialData.stats?.total_orders || 0} commandes</div>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-xl">
                    <div className="text-blue-400/80 text-sm">Paiements Récoltés</div>
                    <div className="text-2xl font-bold text-blue-400 mt-2">{selectedCommercialData.stats?.total_paid_dzd?.toLocaleString() || 0} DZD</div>
                    <div className="text-xs text-blue-400/60 mt-1">Taux: {Math.round(selectedCommercialData.stats?.payment_rate_percentage || 0)}%</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-xl">
                    <div className="text-red-400/80 text-sm">Reste à Payer (Dette)</div>
                    <div className="text-2xl font-bold text-red-400 mt-2">{selectedCommercialData.stats?.total_remaining_dzd?.toLocaleString() || 0} DZD</div>
                    <div className="text-xs text-red-400/60 mt-1">{selectedCommercialData.stats?.pending_orders || 0} commandes en attente</div>
                  </div>
                </div>
              </div>
              
              {selectedCommercialData.top_cars && selectedCommercialData.top_cars.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Meilleures Ventes (Véhicules)</h3>
                  <div className="bg-neutral-800/30 rounded-xl overflow-hidden border border-neutral-800">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-neutral-800/50">
                        <tr>
                          <th className="py-3 px-4">Modèle</th>
                          <th className="py-3 px-4">Unités Vendues</th>
                          <th className="py-3 px-4">Revenu Généré (DZD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCommercialData.top_cars.map((car, idx) => (
                          <tr key={idx} className="border-b border-neutral-800/30">
                            <td className="py-3 px-4">{car.model}</td>
                            <td className="py-3 px-4 font-medium text-emerald-400">{car.units_sold}</td>
                            <td className="py-3 px-4 text-neutral-300">{car.total_sales_dzd?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedCommercialData.recent_orders && selectedCommercialData.recent_orders.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Dernières Commandes</h3>
                  <div className="space-y-3">
                    {selectedCommercialData.recent_orders.map((o, idx) => (
                      <div key={idx} className="bg-neutral-800/30 p-4 rounded-xl border border-neutral-800 flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-white">{o.car?.model}</div>
                          <div className="text-xs text-neutral-500 mt-1">Date: {new Date(o.purchase_date).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-400 font-medium">{o.price_dzd?.toLocaleString()} DZD</div>
                          <div className="text-xs text-neutral-400 mt-1">{o.delivery_status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="py-20 text-center text-neutral-500">Aucune donnée trouvée.</div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
