// src/Pages/OrderForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com".trim();

const OrderForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  // Get car and selected color from location state (passed from CarDetails)
  const car = state.car || null;
  const selectedColor = state.selectedColor || null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Removed the useEffect that checks auth on mount
  // User can access the page without being logged in

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!car || !selectedColor) {
      setError('Impossible de soumettre la commande sans les détails de la voiture.');
      return;
    }

    // ✅ Check authentication ONLY when submitting the order
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to auth if not logged in, passing the car data
      navigate('/auth', { state: { from: location.pathname, car, selectedColor } });
      return;
    }

    setLoading(true);
    setError('');

    try {
      // ✅ Safely extract client_id from the JWT token payload
      let clientId;
      try {
        console.log("Attempting to decode token..."); // ✅ Debug log
        console.log("Raw token (first 50 chars):", token.substring(0, 50)); // ✅ Debug log

        const tokenParts = token.split('.');
        console.log("Token parts length:", tokenParts.length); // ✅ Debug log

        if (tokenParts.length !== 3) {
          console.error("Token structure invalide: wrong number of parts");
          throw new Error('Token structure invalide');
        }

        // Safely decode the payload
        const payloadString = atob(tokenParts[1]);
        console.log("Decoded payload string:", payloadString); // ✅ Debug log

        const payload = JSON.parse(payloadString);
        console.log("Decoded token payload:", payload); // ✅ Debug log - This should print the object

        // ✅ The user_id is nested inside the 'subject' object, not at the root level
        clientId = payload.subject?.user_id;

        console.log("Found user_id in payload.subject:", clientId, "Type:", typeof clientId); // ✅ Debug log

        if (clientId === undefined || clientId === null) {
          console.error("user_id manquant dans le token payload.subject");
          throw new Error('ID utilisateur manquant dans le token');
        }

        // Ensure client ID is a number if it's expected by the backend
        if (typeof clientId === 'string' && !isNaN(clientId)) {
          clientId = parseInt(clientId, 10);
          console.log("Parsed user_id to number:", clientId); // ✅ Debug log
        }

        if (typeof clientId !== 'number' || isNaN(clientId)) {
          console.error("user_id invalide dans le token (not a number):", clientId);
          throw new Error('ID utilisateur invalide dans le token');
        }

        console.log("Final extracted client ID:", clientId); // ✅ Debug log
      } catch (decodeErr) {
        console.error('Erreur de décodage du token (inner):', decodeErr);
        console.error('Raw token (inner, first 50 chars):', token.substring(0, 50)); // ✅ Debug log
        throw new Error('Token d\'authentification invalide');
      }

      // ✅ Prepare the order data with the correct client_id
      const orderData = {
        client_id: clientId, // ✅ Use the extracted client ID from the token
        car_id: car.id,
        car_color: selectedColor.name,
        delivery_status: "shipping" // Default status, hardcoded as requested
      };

      console.log("Sending order ", orderData); // ✅ Debug log

      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the JWT token for authentication
        },
        body: JSON.stringify(orderData)
      });

      console.log("Response status:", response.status); // ✅ Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error response:", errorData); // ✅ Debug log
        
        // ✅ Improved error handling to extract message properly
        let errorMessage = 'Erreur lors de la création de la commande';
        if (errorData && typeof errorData === 'object') {
          if (Array.isArray(errorData)) {
            // Handle validation errors array
            errorMessage = errorData.map(err => err.msg).join(', ');
          } else if (errorData.detail) {
            errorMessage = typeof errorData.detail === 'string' 
              ? errorData.detail 
              : JSON.stringify(errorData.detail);
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else {
            errorMessage = JSON.stringify(errorData);
          }
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Commande créée avec succès:', result);
      
      // ✅ Navigate to account page and add a query parameter to trigger refresh
      navigate('/account?refresh=true'); // Redirect to account page after success

    } catch (err) {
      console.error('Erreur lors de la soumission de la commande (outer):', err);
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
          <p className="text-gray-600 mt-1">Prix: {(car.priceInDZD / 1_000_0).toFixed(1).replace('.', ',')} M DZD</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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