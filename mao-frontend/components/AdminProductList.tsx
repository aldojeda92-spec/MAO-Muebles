"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { Product } from "../types";
import EditProductModal from "./EditProductModal"; // IMPORTAMOS EL MODAL

export default function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para controlar qué producto se está editando (null = modal cerrado)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const q = collection(db, "products");
    
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Product));
        
        productsData.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });

        setProducts(productsData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error crítico de Firestore:", err);
        setError("Acceso denegado a la base de datos.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const toggleAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        isAvailable: !currentStatus
      });
    } catch (error) {
      console.error("Error actualizando disponibilidad:", error);
      alert("Hubo un error al actualizar el estado.");
    }
  };

  if (loading) return <div className="text-forja font-sans animate-pulse p-4">Conectando...</div>;
  if (error) return <div className="text-red-700 p-4">{error}</div>;
  if (products.length === 0) return <div className="p-8 text-center text-forja/70">Catálogo vacío.</div>;

  return (
    <div className="mt-12 w-full overflow-x-auto relative">
      
      {/* RENDERIZADO DEL MODAL: Solo aparece si hay un producto seleccionado */}
      {editingProduct && (
        <EditProductModal 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
        />
      )}

      <h2 className="text-xl font-display font-black text-forja uppercase tracking-tighter mb-4">
        Inventario Activo
      </h2>
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-forja text-puro font-sans text-sm uppercase tracking-widest">
            <th className="p-4 w-16">Foto</th>
            <th className="p-4">SKU / Modelo</th>
            <th className="p-4">Precio</th>
            <th className="p-4">Estado</th>
            <th className="p-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="font-sans">
          {products.map((product) => (
            <tr key={product.id} className="border-b border-cemento hover:bg-cemento/30 transition-colors">
              <td className="p-4">
                <div className="w-12 h-12 bg-cemento overflow-hidden">
                  <img src={product.imageGeneral} alt={product.name} className="w-full h-full object-cover" />
                </div>
              </td>
              <td className="p-4 text-forja">
                <p className="font-bold">{product.name}</p>
                <p className="text-xs text-forja/60 truncate max-w-xs">{product.materials}</p>
              </td>
              <td className="p-4 font-bold text-forja">
                Gs. {product.price.toLocaleString("es-PY")}
              </td>
              <td className="p-4">
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${product.isAvailable ? 'bg-roble/20 text-roble' : 'bg-forja/10 text-forja/50'}`}>
                  {product.isAvailable ? 'En Stock' : 'Pausado'}
                </span>
              </td>
              <td className="p-4 text-right space-x-4">
                {/* BOTÓN DE EDICIÓN */}
                <button 
                  onClick={() => setEditingProduct(product)}
                  className="text-sm font-bold uppercase tracking-wider text-forja hover:text-roble transition-colors"
                >
                  Editar
                </button>

                <button 
                  onClick={() => toggleAvailability(product.id, product.isAvailable)}
                  className={`text-sm font-bold uppercase tracking-wider transition-colors ${product.isAvailable ? 'text-forja hover:text-roble' : 'text-roble hover:text-forja'}`}
                >
                  {product.isAvailable ? 'Pausar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}