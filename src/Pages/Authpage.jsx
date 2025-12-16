// src/Pages/AuthPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Phone, User, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com".trim();

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [nin, setNin] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false); // ✅ NEW: Track signup success

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSignupSuccess(false); // Reset success state

    if (!isLogin) {
      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        setLoading(false);
        return;
      }
      if (!nin || !wilaya || !address || !fullName) {
        setError("Tous les champs sont requis pour l'inscription.");
        setLoading(false);
        return;
      }
    }

    try {
      let response;

      if (isLogin) {
        // ✅ LOGIN FLOW
        console.log("📡 Attempting login...");
        response = await fetch(`${API_BASE_URL}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: phone, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          const msg = data.detail || data.message || "Erreur inconnue";
          setError(msg);
          setLoading(false);
          return;
        }

        if (!data.access_token) {
          setError("Token manquant dans la réponse.");
          setLoading(false);
          return;
        }

        console.log("✅ Login successful!");
        
        // Store token and role in localStorage
        const token = data.access_token;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", "client");

        // Auto-redirect to saved "from" route if exists, else to /account
        const from = location.state?.from || "/account";
        navigate(from);

      } else {
        // ✅ SIGNUP FLOW
        console.log("📡 Attempting signup...");
        const [name, ...surnameParts] = fullName.trim().split(" ");
        const surname = surnameParts.join(" ") || name;

        const payload = {
          name,
          surname,
          nin: parseInt(nin, 10),
          phone_number: phone,
          password,
          wilaya,
          address,
        };

        response = await fetch(`${API_BASE_URL}/clients/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          const msg = data.detail || data.message || "Erreur inconnue";
          setError(msg);
          setLoading(false);
          return;
        }

        // ✅ SIGNUP SUCCESS - Show success message and redirect to login
        console.log("✅ Signup successful!");
        setSignupSuccess(true);
        setLoading(false);
        
        // Clear form fields
        setFullName("");
        setNin("");
        setWilaya("");
        setAddress("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        
        // Switch to login mode after 2 seconds
        setTimeout(() => {
          setSignupSuccess(false);
          setIsLogin(true);
        }, 2000);
      }
      
    } catch (err) {
      console.error("❌ Auth error:", err);
      setError("Erreur réseau. Réessayez ultérieurement.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-[90%] max-w-md bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-xl"
      >
        <div className="text-center mb-6">
          <motion.h1
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent"
          >
            {isLogin ? "Connexion" : "Inscription"}
          </motion.h1>
          <p className="text-gray-400 text-sm mt-2">
            {isLogin
              ? "Connectez-vous avec vos identifiants"
              : "Créez un compte client"}
          </p>
        </div>

        {/* ✅ Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* ✅ NEW: Success Message */}
        {signupSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-300 rounded-lg text-center"
          >
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <p className="font-semibold">Inscription réussie ! ✅</p>
            <p className="text-sm mt-1">Redirection vers la connexion...</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Nom Complet"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={signupSuccess}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                <input
                  type="number"
                  placeholder="NIN (Numéro d'Identité)"
                  value={nin}
                  onChange={(e) => setNin(e.target.value)}
                  required
                  min="1"
                  disabled={signupSuccess}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Wilaya"
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  required
                  disabled={signupSuccess}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Adresse"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  disabled={signupSuccess}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </>
          )}

          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Numéro de téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={signupSuccess}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={signupSuccess}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={signupSuccess}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={signupSuccess}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          )}

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading || signupSuccess}
            className={`w-full py-3 rounded-xl font-semibold transition shadow-lg ${
              loading || signupSuccess
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
            } text-white`}
          >
            {loading ? "Chargement..." : signupSuccess ? "Succès ✓" : isLogin ? "Se Connecter" : "S'inscrire"}
          </motion.button>
        </form>

        {/* ✅ Hide toggle buttons during success message */}
        {!signupSuccess && (
          <div className="text-center mt-6 text-sm text-gray-400">
            {isLogin ? (
              <>
                Pas encore de compte ?{" "}
                <button onClick={() => setIsLogin(false)} className="text-emerald-400 hover:text-emerald-300 font-medium">
                  S'inscrire
                </button>
              </>
            ) : (
              <>
                Déjà inscrit ?{" "}
                <button onClick={() => setIsLogin(true)} className="text-emerald-400 hover:text-emerald-300 font-medium">
                  Se connecter
                </button>
              </>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AuthPage;