// src/Pages/CarDetails.jsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import gsap from "gsap";

// ✅ CRITICAL: No trailing spaces!
const API_BASE_URL = "https://showrommsys282yevirhdj8ejeiajisuebeo9oai.onrender.com".trim(); // Removed trailing spaces

const CarDetails = () => {
  const { id } = useParams(); // ✅ Get car ID from URL
  const navigate = useNavigate();
  const location = useLocation();

  const [car, setCar] = useState(null);
  const [images, setImages] = useState([]); // Full image list: [{ url: "...", color?: "bleu" }, ...]
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const containerRef = useRef(null);
  const previewRef = useRef(null);

  // 🔁 Fetch car + images on mount
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch car
        const carRes = await fetch(`${API_BASE_URL}/cars/all`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: parseInt(id, 10) }),
        });
        if (!carRes.ok) throw new Error("Voiture non trouvée");
        const carData = await carRes.json();
        const car = Array.isArray(carData) ? carData[0] : carData;
        if (!car) throw new Error("Voiture non trouvée");

        // 2. Fetch currencies (for DZD conversion)
        const currencyRes = await fetch(`${API_BASE_URL}/currencies/`);
        const currencies = await currencyRes.json();
        const currency = currencies.find((c) => c.id === car.currency_id);
        const exchangeRate = currency?.exchange_rate_to_dzd || 1;
        const priceInDZD = car.price * exchangeRate;

        // 3. Fetch images
        const imageRes = await fetch(`${API_BASE_URL}/cars/${car.id}/images`);
        let imagePaths = [];
        if (imageRes.ok) {
          const imageData = await imageRes.json();
          imagePaths = Array.isArray(imageData.images) ? imageData.images : [];
        }

        // Resolve image URLs + infer color from filename if possible (e.g., "1_bleu_1.png")
        const resolvedImages = imagePaths.map((path) => {
          let color = null;
          try {
            const fileName = path.split("/").pop();
            const match = fileName.match(/_(\w+)_\d+\./);
            if (match) color = match[1].toLowerCase();
          } catch {}
          return {
            url: new URL(path.trim(), API_BASE_URL).href,
            color: color,
          };
        });

        // 4. Build color options — normalize string/JSON/array values
        const parseColors = (val) => {
          if (!val) return ["N/A"];
          if (Array.isArray(val)) return val.filter(Boolean);
          if (typeof val === "string") {
            try {
              const parsed = JSON.parse(val);
              if (Array.isArray(parsed)) return parsed.filter(Boolean);
              if (typeof parsed === "string") val = parsed;
            } catch {}
            const cleaned = val.replace(/^\[|\]$/g, "").replace(/['"]/g, "");
            return cleaned.split(",").map((s) => s.trim()).filter(Boolean);
          }
          return [String(val)];
        };

        const rawColors = parseColors(car.color);
        const colorOptions = Array.from(new Set(rawColors)).map((name) => ({
          name: name || "N/A",
          hex: getColorHexByName(name),
        }));

        setCar({ ...car, priceInDZD, currency });
        setImages(resolvedImages);
        setColors(colorOptions);
        setSelectedColor(colorOptions[0] || null);
        setCurrentImageIndex(0);
      } catch (err) {
        console.error("Erreur chargement voiture:", err);
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🎨 Color → Hex map
  const getColorHexByName = useCallback((name) => {
    const map = {
      "bleu": "#A7C7E7",
      "bleu glacier": "#A7C7E7",
      "noir": "#111827",
      "noir mat": "#111827",
      "gris": "#D1D5DB",
      "gris argenté": "#D1D5DB",
      "rouge": "#DC2626",
      "rouge passion": "#DC2626",
      "blanc": "#F9FAFB",
      "argent": "#E5E7EB",
      "noir laqué": "#0A0A0A",
      "bleu nuit": "#1E3A8A",
    };
    return map[name?.toLowerCase()?.trim()] || "#6B7280";
  }, []);

  // 🖼️ Filter images by selected color (fallback: all)
  const filteredImages = useMemo(() => {
    if (!selectedColor || !images.length) return images;
    const colorKey = selectedColor.name.toLowerCase();
    const matched = images.filter((img) => img.color === colorKey);
    return matched.length > 0 ? matched : images;
  }, [images, selectedColor]);

  // 🖼️ Current image
  const currentImage = filteredImages[currentImageIndex] || images[0] || null;

  // 🔁 Next/Prev image
  const nextImage = () => {
    if (filteredImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };
  const prevImage = () => {
    if (filteredImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  // 🛒 Buy handler - now just navigates to order page without checking auth
  const handleBuy = () => {
    if (!car) return;
    if (!selectedColor) {
      alert("Veuillez sélectionner une couleur.");
      return;
    }
    // ✅ Removed token check - let OrderForm handle it
    // Navigate to the new /order route
    navigate("/order", { state: { car, selectedColor } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Voiture non trouvée</h2>
        <p className="text-gray-600 max-w-md">{error || "Cette voiture n'existe plus."}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-gradient-to-b from-gray-100 to-gray-200 text-gray-900 flex flex-col items-center py-12 px-6 overflow-hidden"
    >
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-7xl flex justify-between items-center mb-10"
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">
          Palmier Auto — <span className="text-blue-600">{car.model}</span>
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Retour
        </button>
      </motion.div>

      {/* MAIN CONTENT */}
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* LEFT: IMAGE GALLERY */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="relative bg-gray-200 rounded-2xl overflow-hidden shadow-lg aspect-video">
            <AnimatePresence mode="wait">
              {currentImage ? (
                <motion.img
                  key={currentImage.url}
                  src={currentImage.url}
                  alt={`${car.model} ${car.year} - ${selectedColor?.name || ""}`}
                  className="w-full h-full object-contain bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  onError={(e) => {
                    console.warn("Image failed:", currentImage.url);
                    e.target.src = "/placeholder-car.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-500">Aucune image</span>
                </div>
              )}
            </AnimatePresence>

            {/* Arrows (only if >1 image) */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Dots */}
            {filteredImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {filteredImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full ${
                      i === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Voir image ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Color preview badge */}
            <div className="absolute top-4 left-4 bg-emerald-600 text-white px-2 py-1 rounded text-xs font-medium">
              {selectedColor?.name || "Couleur"}
            </div>
          </div>

          {/* Thumbnail Grid (max 4) */}
          {filteredImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {filteredImages.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    idx === currentImageIndex ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Miniature ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/placeholder-car.jpg")}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Color preview block */}
          <div
            ref={previewRef}
            className="w-full h-16 rounded-xl flex items-center justify-center shadow-inner transition-all"
            style={{ backgroundColor: selectedColor?.hex || "#E5E7EB" }}
          >
            <span
              className={`text-lg font-semibold ${
                ["#111827", "#0A0A0A", "#1E3A8A"].includes((selectedColor?.hex || "").toLowerCase())
                  ? "text-white"
                  : "text-black"
              }`}
            >
              Aperçu couleur : {selectedColor?.name || "—"}
            </span>
          </div>
        </div>

        {/* RIGHT: INFO & ACTIONS */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {car.model} <span className="text-gray-600">{car.year}</span>
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {car.engine && `${car.engine} • `} {car.power} • {car.fuel_type}
              {car.country && ` • Origine: ${car.country}`}
            </p>

            {/* ✅ NEW: DESCRIPTION SECTION */}
            {car.description && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1.5 text-blue-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  Description
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {car.description}
                </p>
              </motion.div>
            )}

            {/* PRICE DISPLAY */}
            <motion.h3
              className="text-4xl font-bold text-gray-900 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {car.priceInDZD
                ? `${(car.priceInDZD / 1_000_000).toFixed(1).replace('.', ',')} Millions DZD`
                : "Prix indisponible"}
            </motion.h3>

            {/* COLORS */}
            {colors.length > 0 && (
              <div className="mt-6">
                <p className="text-gray-700 font-medium mb-2">Couleurs disponibles</p>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <motion.button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      whileHover={{ scale: 1.1 }}
                      className={`h-10 w-10 rounded-full border-2 flex items-center justify-center shadow-md ${
                        selectedColor?.name === c.name
                          ? "ring-2 ring-gray-800 scale-110"
                          : "ring-1 ring-gray-300"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={`Sélectionner la couleur ${c.name}`}
                    >
                      {selectedColor?.name === c.name && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* SPECS */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Caractéristiques</h4>
              <div className="space-y-2">
                {
                  [
                    ["Année", car.year],
                    ["Kilométrage", `${car.milage?.toLocaleString()} km`],
                    ["Puissance", car.power || "—"],
                    ["Moteur", car.engine || "—"],
                    ["Carburant", car.fuel_type || "—"],
                    ["Quantité", car.quantity != null ? car.quantity : 0],
                    ["Pays d'origine", car.country || "—"],
                  ]
                  .filter(([, v]) => v && v !== "—")
                  .map(([label, value], i) => (
                    <div key={i} className="flex justify-between py-1">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* BUY BUTTON */}
          <motion.button
            onClick={handleBuy}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:from-emerald-700 hover:to-teal-700"
          >
            Réserver cette voiture
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;