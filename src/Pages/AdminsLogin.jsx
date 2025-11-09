import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Phone, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Correct API URL — NO trailing spaces
      const response = await fetch("https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber, // ← matches OpenAPI "loginUser" schema
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Save JWT token (FastAPI typically returns { "access_token": "...", "token_type": "bearer" })
        localStorage.setItem("authToken", data.access_token);
        navigate("/admin");
      } else {
        // ✅ Handle FastAPI-style errors (your spec uses Pydantic validation)
        setError(data.detail || "Numéro de téléphone ou mot de passe incorrect");
      }
    } catch (err) {
      setError("Erreur réseau. Veuillez vérifier votre connexion.");
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen font-main text-white bg-neutral-900 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-[90%] max-w-md bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent"
          >
            Se connecter
          </motion.h1>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Numéro de téléphone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
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
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-emerald-400">
              Contacter l'administrateur en cas de problème de connexion
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-semibold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;