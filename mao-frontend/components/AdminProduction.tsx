// components/AdminProduction.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { Material } from "../types";

export default function AdminProduction() {
  const [products, setProducts] = useState<any[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Cargamos productos y materiales en tiempo real
  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubMaterials = onSnapshot(collection(db, "materials"), (snap) => {
      setMaterials(snap.docs.map(d => ({ id: d.id, ...d.data() } as Material)));
    });
    return () => { unsubProducts(); unsubMaterials(); };
  }, []);

  // Lógica de Validación de Inventario
  const checkAvailability = (recipe: any[]) => {
    if (!recipe || recipe.length === 0) return { canProduce: false, missing: "Sin receta configurada" };
    
    for (const item of recipe) {
      const mat = materials.find(m => m.id === item.materialId);
      if (!mat) return { canProduce: false, missing: `Insumo borrado (${item.name})` };
      if (mat.currentStock < item.quantity) {
        return { canProduce: false, missing: `Falta ${item.name} (Disp: ${mat.currentStock})` };
      }
    }
    return { canProduce: true, missing: null };
  };

  // Descuento Atómico de Inventario
  const handleProduce = async (product: any) => {
    if (!window.confirm(`¿Confirmar producción de: ${product.name}? Se descontarán los insumos del stock.`)) return;
    
    setIsProcessing(true);
    try {
      const batch = writeBatch(db);
      
      product.recipe.forEach((item: any) => {
        const mat = materials.find(m => m.id === item.materialId);
        if (mat) {
          const matRef = doc(db, "materials", mat.id!);
          // Restamos la cantidad que dicta la receta
          batch.update(matRef, { currentStock: mat.currentStock - item.quantity });
        }
      });

      await batch.commit();
      alert("Producción registrada. Inventario descontado con éxito.");
    } catch (error) {
      console.error("Error en producción:", error);
      alert("Error al descontar insumos. Revisa tu conexión.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full bg-puro border border-forja/10 p-6 md:p-8">
      <div className="mb-8 border-b-4 border-forja pb-4">
        <h2 className="text-3xl font-display font-black text-forja uppercase tracking-tighter">
          Centro de Producción
        </h2>
        <p className="text-sm text-forja/70 uppercase tracking-widest mt-1">
          Descuento de inventario según recetas (BOM)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map(product => {
          const { canProduce, missing } = checkAvailability(product.recipe);
          
          return (
            <div key={product.id} className="flex flex-col md:flex-row justify-between items-start md:items-center bg-cemento/20 p-4 border-l-4 border-forja">
              <div className="mb-4 md:mb-0">
                <h3 className="font-bold text-lg text-forja uppercase">{product.name}</h3>
                <p className="text-xs text-forja/60 font-mono mt-1">
                  Costo Fab: Gs. {product.productionCost?.toLocaleString("es-PY") || 0}
                </p>
                {/* Mostramos la receta rápidamente */}
                <p className="text-xs text-forja mt-2">
                  <span className="font-bold uppercase">Requiere:</span> {product.recipe?.map((r:any) => `${r.quantity}x ${r.name}`).join(" | ") || "Ninguno"}
                </p>
              </div>

              <div className="flex flex-col items-end w-full md:w-auto">
                {!canProduce ? (
                  <div className="text-right">
                    <span className="bg-red-100 text-red-700 font-bold text-xs px-3 py-1 uppercase tracking-widest">
                      Bloqueado
                    </span>
                    <p className="text-xs text-red-600 font-bold mt-2">{missing}</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleProduce(product)}
                    disabled={isProcessing}
                    className="bg-roble text-puro font-bold uppercase tracking-widest px-6 py-3 hover:bg-roble/90 transition-colors text-sm w-full md:w-auto"
                  >
                    {isProcessing ? "Procesando..." : "Fabricar y Descontar"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
