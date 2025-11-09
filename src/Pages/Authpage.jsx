import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Phone, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000"; // 👈 Adjust to your backend URL

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const endpoint = `${API_BASE_URL}/users/login`;
      const payload = {
        phone_number: phone,
        password: password,
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Login successful
        // Save token to localStorage (or use context/AuthProvider)
        localStorage.setItem("authToken", data.access_token); // adjust key based on actual response
        navigate("/dashboard");
      } else {
        // ❌ Handle error (e.g., invalid credentials)
        setError(data.detail || "Échec de la connexion. Vérifiez vos identifiants.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
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
            {isLogin ? "Bienvenue" : "Inscrivez-vous"}
          </motion.h1>
          <p className="text-gray-400 text-sm mt-2">
            {isLogin
              ? "Se connecter pour accéder à votre compte"
              : "Rejoignez-nous et gérez votre showroom plus intelligemment"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 text-red-300 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Nom Complet"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
              />
            </div>
          )}

          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Num Tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de Passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
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
                required={!isLogin}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
              />
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition shadow-lg ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
            } text-white`}
          >
            {loading ? "Chargement..." : isLogin ? "Se Connecter" : "S'inscrire"}
          </motion.button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-400">
          {isLogin ? (
            <>
              Vous n'avez pas de compte?{" "}
              <button
                onClick={toggleMode}
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Inscrivez-vous
              </button>
            </>
          ) : (
            <>
              Vous avez déjà un compte?{" "}
              <button
                onClick={toggleMode}
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Se connecter
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthPage;