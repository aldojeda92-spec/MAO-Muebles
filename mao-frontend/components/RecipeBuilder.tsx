// components/RecipeBuilder.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { Material } from "../types";

export default function RecipeBuilder({ onUpdateRecipe }: { onUpdateRecipe: (recipe: any[], totalCost: number) => void }) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [recipe, setRecipe] = useState<any[]>([]);
  const [overheadPercent, setOverheadPercent] = useState(40); // 40% por defecto

  // Cargar materiales disponibles del módulo 2.1
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "materials"), (snapshot) => {
      setMaterials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Material)));
    });
    return () => unsubscribe();
  }, []);

  const addMaterial = (material: Material) => {
    const newRecipe = [...recipe, { materialId: material.id, name: material.name, quantity: 1, unitCost: material.unitCost }];
    setRecipe(newRecipe);
    calculateCosts(newRecipe, overheadPercent);
  };

  const calculateCosts = (currentRecipe: any[], overhead: number) => {
    const materialSubtotal = currentRecipe.reduce((acc, item) => acc + (item.quantity * item.unitCost), 0);
    const totalCost = materialSubtotal * (1 + overhead / 100);
    onUpdateRecipe(currentRecipe, totalCost);
  };

  return (
    <div className="bg-cemento p-6 border-2 border-forja/20">
      <h3 className="text-lg font-black text-forja uppercase mb-4">Estructura de Costos (BOM)</h3>
      
      {/* Selector de Insumos */}
      <div className="mb-6">
        <label className="text-xs font-bold uppercase text-forja/70">Añadir insumo a la receta:</label>
        <select onChange={(e) => {
            const mat = materials.find(m => m.id === e.target.value);
            if(mat) addMaterial(mat);
        }} className="w-full p-2 border border-forja bg-puro">
          <option>Seleccionar material...</option>
          {materials.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
        </select>
      </div>

      {/* Lista de Receta */}
      <div className="space-y-2 mb-6">
        {recipe.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center bg-puro p-2 border-l-4 border-roble">
            <span className="font-bold text-sm text-forja">{item.name}</span>
            <input 
              type="number" 
              className="w-16 p-1 border text-right"
              value={item.quantity}
              onChange={(e) => {
                const updated = [...recipe];
                updated[idx].quantity = parseFloat(e.target.value);
                setRecipe(updated);
                calculateCosts(updated, overheadPercent);
              }}
            />
          </div>
        ))}
      </div>

      {/* Control de Overhead */}
      <div className="pt-4 border-t border-forja/20">
        <label className="text-xs font-bold uppercase text-forja">Factor de Overhead (Mano de obra + Energía %)</label>
        <input 
          type="number" 
          value={overheadPercent} 
          onChange={(e) => {
            setOverheadPercent(parseFloat(e.target.value));
            calculateCosts(recipe, parseFloat(e.target.value));
          }}
          className="w-full p-2 border border-forja"
        />
      </div>
    </div>
  );
}
