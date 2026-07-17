"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { Product } from "../types";

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function EditProductModal({ product, onClose }: EditProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    materials: product.materials,
    dimensions: product.dimensions,
    price: product.price.toString(),
    // Cargamos el precio original si existe, si no, lo dejamos en blanco
    originalPrice: product.originalPrice ? product.originalPrice.toString() : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const productRef = doc(db, "products", product.id);
      
      await updateDoc(productRef, {
        name: formData.name,
        description: formData.description,
        materials: formData.materials,
        dimensions: formData.dimensions,
        price: Number(formData.price),
        // Si hay un número, lo guarda. Si está vacío, guarda 0 para apagar la promoción
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : 0,
      });

      onClose();
    } catch (error: any) {
      console.error("Error al actualizar:", error);
      setErrorMsg("Error al guardar los cambios.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-forja/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-puro w-full max-w-2xl border-2 border-forja/20 overflow-y-auto max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-forja/10 bg-cemento/20">
          <h2 className="text-2xl font-display font-black text-forja uppercase tracking-tighter">
            Editar & Promocionar
          </h2>
          <button onClick={onClose} className="text-forja/50 hover:text-forja transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {errorMsg && (
            <div className="w-full bg-red-50 border-l-4 border-red-500 p-3 mb-2">
              <p className="font-sans text-red-700 font-bold text-sm">{errorMsg}</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-sans font-bold text-forja uppercase tracking-wider mb-1">Nombre</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-cemento/30 border-none font-sans text-forja text-sm focus:ring-2 focus:ring-roble outline-none" />
          </div>

          <div>
            <label className="block text-xs font-sans font-bold text-forja uppercase tracking-wider mb-1">Descripción</label>
            <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-cemento/30 border-none font-sans text-forja text-sm focus:ring-2 focus:ring-roble outline-none resize-none h-24" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-sans font-bold text-forja uppercase tracking-wider mb-1">Estructura</label>
              <input required type="text" value={formData.materials} onChange={(e) => setFormData({...formData, materials: e.target.value})} className="w-full p-3 bg-cemento/30 border-none font-sans text-forja text-sm focus:ring-2 focus:ring-roble outline-none" />
            </div>
            <div>
              <label className="block text-xs font-sans font-bold text-forja uppercase tracking-wider mb-1">Dimensiones</label>
              <input required type="text" value={formData.dimensions} onChange={(e) => setFormData({...formData, dimensions: e.target.value})} className="w-full p-3 bg-cemento/30 border-none font-sans text-forja text-sm focus:ring-2 focus:ring-roble outline-none" />
            </div>
          </div>

          {/* MÓDULO DE PRECIOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-forja/10 pt-5 mt-2">
            <div>
              <label className="block text-xs font-sans font-bold text-forja uppercase tracking-wider mb-1">
                Precio de Venta (Gs.)
              </label>
              <input required type="number" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-roble/10 border-none font-sans text-forja font-bold text-sm focus:ring-2 focus:ring-roble outline-none" />
            </div>
            <div>
              <label className="block text-xs font-sans font-bold text-forja/60 uppercase tracking-wider mb-1">
                Precio Original (Tachado) Opcional
              </label>
              <input type="number" min="0" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: e.target.value})} placeholder="Ej. Dejar vacío si no hay oferta" className="w-full p-3 bg-cemento/30 border-none font-sans text-forja text-sm focus:ring-2 focus:ring-roble outline-none" />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button type="button" onClick={onClose} disabled={isLoading} className="w-1/3 bg-cemento text-forja font-sans font-bold uppercase tracking-widest py-4 transition-colors hover:bg-cemento/80">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="w-2/3 bg-roble text-puro font-sans font-bold uppercase tracking-widest py-4 transition-colors hover:bg-roble/90 disabled:bg-cemento disabled:text-forja">
              {isLoading ? "Guardando..." : "Actualizar Mueble"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}