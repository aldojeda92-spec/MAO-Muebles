// components/AdminMaterials.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, serverTimestamp, doc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { Material, UnitOfMeasure } from "../types";

export default function AdminMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado inicial para la carga de insumos
  const [formData, setFormData] = useState({
    name: "",
    unit: "metros" as UnitOfMeasure,
    unitCost: "",
    currentStock: "",
    minStock: "5",
  });

  // Listener en tiempo real de la base de datos
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "materials"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Material));
      // Orden alfabético para encontrar insumos rápido
      data.sort((a, b) => a.name.localeCompare(b.name));
      setMaterials(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.unitCost || !formData.currentStock) return;
    
    setIsLoading(true);
    try {
      await addDoc(collection(db, "materials"), {
        name: formData.name.trim(),
        unit: formData.unit,
        unitCost: parseFloat(formData.unitCost),
        currentStock: parseFloat(formData.currentStock), // Permite decimales para cortes precisos
        minStock: parseFloat(formData.minStock),
        lastUpdated: serverTimestamp(),
      });
      // Resetear el formulario tras la carga
      setFormData({ name: "", unit: "metros", unitCost: "", currentStock: "", minStock: "5" });
    } catch (error) {
      console.error("Error al guardar material:", error);
      alert("Hubo un error al conectar con Firebase. Revisa la consola.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Eliminar este insumo? Las recetas que lo usen perderán la referencia de costo.")) {
      await deleteDoc(doc(db, "materials", id));
    }
  };

  return (
    <div className="w-full font-sans border-2 border-forja bg-puro p-6 md:p-8">
      <div className="mb-8 border-b-4 border-forja pb-4">
        <h2 className="text-3xl font-display font-black text-forja uppercase tracking-tighter">
          Ingreso de Insumos
        </h2>
        <p className="text-sm text-forja/70 uppercase tracking-widest mt-1">
          Control de Costos y Materia Prima
        </p>
      </div>

      {/* FORMULARIO DE CARGA */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-10 bg-cemento p-6">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-forja uppercase tracking-wider mb-2">Nombre del Insumo</label>
          <input 
            required 
            type="text" 
            placeholder="Ej: Tablón Paraíso 2''" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            className="w-full p-3 bg-puro border-2 border-forja/20 text-sm outline-none focus:border-roble transition-colors" 
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-forja uppercase tracking-wider mb-2">Unidad</label>
          <select 
            value={formData.unit} 
            onChange={(e) => setFormData({...formData, unit: e.target.value as UnitOfMeasure})} 
            className="w-full p-3 bg-puro border-2 border-forja/20 text-sm outline-none focus:border-roble transition-colors appearance-none"
          >
            <option value="metros">Metros</option>
            <option value="unidades">Unidades</option>
            <option value="tablas">Tablas</option>
            <option value="litros">Litros</option>
            <option value="kg">Kilogramos</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-forja uppercase tracking-wider mb-2">Costo Unit. (Gs)</label>
          <input 
            required 
            type="number" 
            min="0" 
            value={formData.unitCost} 
            onChange={(e) => setFormData({...formData, unitCost: e.target.value})} 
            className="w-full p-3 bg-puro border-2 border-forja/20 text-sm outline-none focus:border-roble transition-colors" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-forja uppercase tracking-wider mb-2">Stock Actual</label>
          <input 
            required 
            type="number" 
            min="0" 
            step="0.01" 
            value={formData.currentStock} 
            onChange={(e) => setFormData({...formData, currentStock: e.target.value})} 
            className="w-full p-3 bg-puro border-2 border-forja/20 text-sm outline-none focus:border-roble transition-colors" 
          />
        </div>

        <div className="flex items-end">
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-roble text-puro font-bold uppercase tracking-widest py-3 hover:bg-forja transition-colors disabled:opacity-50 text-sm"
          >
            {isLoading ? "..." : "+ Cargar"}
          </button>
        </div>
      </form>

      {/* TABLA DE INVENTARIO */}
      <div className="overflow-x-auto border-t-2 border-forja/10 pt-6">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-forja text-puro text-xs uppercase tracking-widest">
              <th className="p-4 font-normal">Material</th>
              <th className="p-4 font-normal">Costo / Unidad</th>
              <th className="p-4 font-normal">Stock Actual</th>
              <th className="p-4 font-normal text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm bg-puro">
            {materials.map((mat) => {
              const isLowStock = mat.currentStock <= mat.minStock;
              return (
                <tr key={mat.id} className="border-b border-cemento hover:bg-cemento/30 transition-colors">
                  <td className="p-4 font-bold text-forja">{mat.name}</td>
                  <td className="p-4 text-forja/80">Gs. {mat.unitCost.toLocaleString("es-PY")} / {mat.unit}</td>
                  <td className="p-4">
                    <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-forja'}`}>
                      {mat.currentStock} {mat.unit}
                    </span>
                    {isLowStock && (
                      <span className="ml-3 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                        Comprar
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(mat.id!)} 
                      className="text-forja/40 hover:text-red-600 uppercase font-bold text-xs tracking-wider transition-colors"
                    >
                      X Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
            {materials.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-forja/50 font-bold uppercase tracking-widest text-sm bg-cemento/20">
                  Inventario vacío. Inicia la carga de tu taller.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
