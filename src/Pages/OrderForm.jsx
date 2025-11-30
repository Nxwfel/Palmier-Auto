// src/Pages/OrderForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com";

const OrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  // Get car and selected color from location state (passed from CarDetails)
  const car = state.car || null;
  const selectedColor = state.selectedColor || null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to auth if not logged in, passing the car data
      navigate('/auth', { state: { from: location.pathname, car, selectedColor } });
    }
    // If no car data was passed, redirect back
    if (!car || !selectedColor) {
      setError('Informations sur la voiture manquantes.');
      // Optionally navigate back or to a default page
      // navigate(-1); // Go back
    }
  }, []); // Only run once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!car || !selectedColor) {
      setError('Impossible de soumettre la commande sans les détails de la voiture.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      // Shouldn't happen if useEffect worked correctly, but good safety check
      navigate('/auth', { state: { from: location.pathname, car, selectedColor } });
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare the order data
      // delivery_status is now hardcoded to "shipping" as per requirement
      const orderData = {
        client_id: JSON.parse(atob(token.split('.')[1])).user_id, // Decode token to get user ID
        car_id: car.id,
        car_color: selectedColor.name,
        delivery_status: "shipping" // Default status, hardcoded as requested
      };

      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the JWT token
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erreur lors de la création de la commande');
      }

      const result = await response.json();
      console.log('Commande créée avec succès:', result);
      
      // Optionally navigate to a success page or show a success message
      alert(`Commande pour la ${car.model} (${selectedColor.name}) créée avec succès!`);
      navigate('/'); // Redirect to home or a confirmation page

    } catch (err) {
      console.error('Erreur lors de la soumission de la commande:', err);
      setError(err.message || 'Une erreur est survenue lors de la création de la commande.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
        <p className="text-gray-600 max-w-md">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
        >
          Retour
        </button>
      </div>
    );
  }

  if (!car || !selectedColor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900 flex flex-col items-center py-12 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-800 mb-6">
          Formulaire de Commande
        </h1>

        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800">Détails de la commande</h2>
          <p className="text-gray-600 mt-1">{car.model} - {car.year}</p>
          <p className="text-gray-600">Couleur: <span style={{ color: selectedColor.hex, fontWeight: 'bold' }}>{selectedColor.name}</span></p>
          <p className="text-gray-600 mt-1">Prix: {(car.priceInDZD / 1_000_000).toFixed(1).replace('.', ',')} M DZD</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Removed the delivery_status select field */}
        
        <form onSubmit={handleSubmit}>
          {/* Removed the delivery_status field */}
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-gray-700 font-medium mb-2">
              Notes (Optionnel)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Informations supplémentaires..."
            ></textarea>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
            } text-white`}
          >
            {loading ? 'Traitement...' : 'Passer la commande'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default OrderForm;