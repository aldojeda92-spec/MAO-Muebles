"use client";

import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase/config";

// --- 1. INYECCIÓN: Importación del nuevo módulo ---
import RecipeBuilder from "./RecipeBuilder";

export default function ProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    materials: "",
    dimensions: "",
    price: "",
    imageGeneral: "",
    imageFrontal: "",
    imageMacro: "",
  });

// --- 2. INYECCIÓN: Estado para el costo industrial (BOM) [CORREGIDO PARA TYPESCRIPT] ---
  // Añadimos <{ items: any[], finalProductionCost: number }> para evitar el error never[]
  const [recipeData, setRecipeData] = useState<{
    items: any[];
    finalProductionCost: number;
  }>({
    items: [],
    finalProductionCost: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validación estricta del Manual de Marca
    if (!formData.imageGeneral.startsWith("http") || !formData.imageFrontal.startsWith("http") || !formData.imageMacro.startsWith("http")) {
      setErrorMsg("Las 3 tomas fotográficas son obligatorias para cumplir el estándar de calidad MAO.");
      return;
    }
    
    setIsLoading(true);

    try {
      const uploadPromise = addDoc(collection(db, "products"), {
        name: formData.name,
        description: formData.description,
        materials: formData.materials,
        dimensions: formData.dimensions,
        price: Number(formData.price),
        imageGeneral: formData.imageGeneral,
        imageFrontal: formData.imageFrontal,
        imageMacro: formData.imageMacro,
        isAvailable: true,
        createdAt: serverTimestamp(),
        
        // --- 3. INYECCIÓN: Payload de Costos y Receta ---
        recipe: recipeData.items,
        productionCost: recipeData.finalProductionCost,
      });

      // Filtro Anti-Cuelgues: Si Firebase no responde en 10 seg, forzamos error
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("TIMEOUT_FIREBASE")), 10000)
      );

      await Promise.race([uploadPromise, timeoutPromise]);

      alert("Mueble inyectado correctamente con sus 3 tomas reglamentarias y estructura de costos.");
      
      // Reseteo de campos comerciales
      setFormData({ name: "", description: "", materials: "", dimensions: "", price: "", imageGeneral: "", imageFrontal: "", imageMacro: "" });
      
      // --- 4. INYECCIÓN: Reseteo del módulo de costos ---
      setRecipeData({ items: [], finalProductionCost: 0 });
      
    } catch (error: any) {
      console.error("Error inyectando catálogo:", error);
      if (error.message === "TIMEOUT_FIREBASE") {
        setErrorMsg("La red expiró. Revisa que tu archivo .env.local esté correcto y no tengas bloqueadores de anuncios.");
      } else {
        setErrorMsg(`Error del servidor: ${error.message}`);
      }
    } finally {
      // El botón siempre se destraba
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto flex flex-col gap-6 bg-puro p-8 border border-forja/10">
      
      {errorMsg && (
        <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 mb-2">
          <p className="font-sans text-red-700 font-bold text-sm">{errorMsg}</p>
        </div>
      )}

      {/* --- BLOQUE COMERCIAL (Intacto) --- */}
      <div>
        <label className="block text-sm font-sans font-bold text-forja uppercase tracking-wider mb-2">Nombre del Mueble</label>
        <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-cemento/30 border-none font-sans text-forja focus:ring-2 focus:ring-roble outline-none" placeholder="Ej. Mesa Comedor Industrial" />
      </div>

      <div>
        <label className="block text-sm font-sans font-bold text-forja uppercase tracking-wider mb-2">Descripción (Para WhatsApp)</label>
        <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-cemento/30 border-none font-sans text-forja focus:ring-2 focus:ring-roble outline-none resize-none h-24" placeholder="Directo y transparente. Ej. Base estructural soldada..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-sans font-bold text-forja uppercase tracking-wider mb-2">Estructura / Materiales</label>
          <input required type="text" value={formData.materials} onChange={(e) => setFormData({...formData, materials: e.target.value})} className="w-full p-3 bg-cemento/30 border-none font-sans text-forja focus:ring-2 focus:ring-roble outline-none" placeholder="Ej. Caño 80x40 y Madera maciza" />
        </div>
        <div>
          <label className="block text-sm font-sans font-bold text-forja uppercase tracking-wider mb-2">Dimensiones</label>
          <input required type="text" value={formData.dimensions} onChange={(e) => setFormData({...formData, dimensions: e.target.value})} className="w-full p-3 bg-cemento/30 border-none font-sans text-forja focus:ring-2 focus:ring-roble outline-none" placeholder="Ej. 200cm x 90cm x 75cm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-sans font-bold text-forja uppercase tracking-wider mb-2">Precio de Venta (Gs.)</label>
        <input required type="number" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-cemento/30 border-none font-sans text-forja focus:ring-2 focus:ring-roble outline-none" placeholder="Ej. 2500000" />
      </div>

      {/* BLOQUE ESTRICTO DE FOTOGRAFÍA MAO */}
      <div className="border-t border-forja/10 pt-6 mt-2 space-y-4">
        <h3 className="text-sm font-display font-black text-forja uppercase tracking-widest">Dirección de Fotografía Requerida</h3>
        
        <div>
          <label className="block text-xs font-sans font-bold text-forja uppercase tracking-wider mb-1">1. Toma General (3/4 perfil) [URL]</label>
          <input required type="url" value={formData.imageGeneral} onChange={(e) => setFormData({...formData, imageGeneral: e.target.value})} className="w-full p-3 bg-cemento/30 border-none font-sans text-forja text-sm focus:ring-2 focus:ring-roble outline-none" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-xs font-sans font-bold text-forja uppercase tracking-wider mb-1">2. Toma Frontal (Vista directa) [URL]</label>
          <input required type="url" value={formData.imageFrontal} onChange={(e) => setFormData({...formData, imageFrontal: e.target.value})} className="w-full p-3 bg-cemento/30 border-none font-sans text-forja text-sm focus:ring-2 focus:ring-roble outline-none" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-xs font-sans font-bold text-forja uppercase tracking-wider mb-1">3. Toma MACRO (Soldadura/Vetas) [URL]</label>
          <input required type="url" value={formData.imageMacro} onChange={(e) => setFormData({...formData, imageMacro: e.target.value})} className="w-full p-3 bg-cemento/30 border-none font-sans text-forja text-sm focus:ring-2 focus:ring-roble outline-none" placeholder="https://..." />
        </div>
      </div>

      {/* --- 5. INYECCIÓN: BLOQUE INDUSTRIAL (BOM) --- */}
      <div className="border-t-4 border-forja pt-8 mt-4">
        <div className="mb-4">
          <h3 className="text-2xl font-display font-black text-forja uppercase tracking-tighter leading-none">
            Ingeniería de Costos
          </h3>
          <p className="text-xs font-sans text-forja/70 uppercase tracking-widest mt-1">
            Gestión interna de rentabilidad
          </p>
        </div>
        
        {/* El componente hijo que calcula la receta */}
        <RecipeBuilder 
          onUpdateRecipe={(items, totalCost) => {
            setRecipeData({ items, finalProductionCost: totalCost });
          }} 
        />

        {/* Panel de Rentabilidad en Vivo */}
        {recipeData.finalProductionCost > 0 && formData.price && (
          <div className="mt-4 p-5 bg-forja text-puro border-l-8 border-roble flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-cemento/60">
                Costo Base (Materiales + Overhead)
              </p>
              <p className="text-2xl font-black">
                Gs. {Math.round(recipeData.finalProductionCost).toLocaleString("es-PY")}
              </p>
            </div>
            
            <div className="sm:text-right border-t sm:border-t-0 border-cemento/20 pt-3 sm:pt-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-roble">
                Margen Bruto de Ganancia
              </p>
              <p className={`text-lg font-black ${
                (Number(formData.price) - recipeData.finalProductionCost) > 0 ? "text-green-400" : "text-red-400"
              }`}>
                Gs. {Math.round(Number(formData.price) - recipeData.finalProductionCost).toLocaleString("es-PY")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* --- BOTÓN DE SUMBIT (Intacto) --- */}
      <button type="submit" disabled={isLoading} className="mt-8 w-full bg-roble text-puro font-sans font-bold uppercase tracking-widest py-4 transition-colors hover:bg-roble/90 disabled:bg-cemento disabled:text-forja flex justify-center items-center text-sm shadow-sm">
        {isLoading ? "Inyectando a Base de Datos..." : "Publicar Mueble"}
      </button>

    </form>
  );
}
