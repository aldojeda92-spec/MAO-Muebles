// components/AdminFinances.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase/config";
import { FinancialTransaction, TransactionType } from "../types";

export default function AdminFinances() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para el formulario de carga
  const [formData, setFormData] = useState({
    type: "ingreso" as TransactionType,
    amount: "",
    description: "",
    category: "Ventas",
  });

  // Listener del Libro Mayor
  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FinancialTransaction)));
    });
    return () => unsubscribe();
  }, []);

  // Lógica Matemática
  const totalIngresos = transactions.filter(t => t.type === 'ingreso').reduce((acc, curr) => acc + curr.amount, 0);
  const totalEgresos = transactions.filter(t => t.type === 'egreso').reduce((acc, curr) => acc + curr.amount, 0);
  const balanceNeto = totalIngresos - totalEgresos;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;
    
    setIsLoading(true);
    try {
      await addDoc(collection(db, "transactions"), {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        category: formData.category,
        date: serverTimestamp(),
      });
      setFormData({ ...formData, amount: "", description: "" });
    } catch (error) {
      console.error("Error financiero:", error);
      alert("Error al registrar movimiento. Revisa reglas de Firebase.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-puro border border-forja/10 p-6 md:p-8 font-sans">
      
      {/* HEADER FINANCIERO */}
      <div className="mb-8 border-b-4 border-forja pb-4">
        <h2 className="text-3xl font-display font-black text-forja uppercase tracking-tighter">
          Flujo de Caja
        </h2>
        <p className="text-sm text-forja/70 uppercase tracking-widest mt-1">
          Libro Mayor y Control de Rentabilidad
        </p>
      </div>

      {/* KPIs DE RENDIMIENTO (DASHBOARD) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-forja text-puro p-6 border-l-4 border-green-500">
          <p className="text-xs font-bold uppercase tracking-widest text-cemento/60 mb-2">Ingresos Brutos</p>
          <p className="text-2xl font-black">Gs. {totalIngresos.toLocaleString("es-PY")}</p>
        </div>
        <div className="bg-forja text-puro p-6 border-l-4 border-red-500">
          <p className="text-xs font-bold uppercase tracking-widest text-cemento/60 mb-2">Egresos / Costos</p>
          <p className="text-2xl font-black">Gs. {totalEgresos.toLocaleString("es-PY")}</p>
        </div>
        <div className={`p-6 border-l-8 ${balanceNeto >= 0 ? 'bg-green-50 border-green-600 text-green-900' : 'bg-red-50 border-red-600 text-red-900'}`}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Caja Neta Actual</p>
          <p className="text-3xl font-black">Gs. {balanceNeto.toLocaleString("es-PY")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* COLUMNA IZQUIERDA: INYECCIÓN DE DATOS */}
        <div className="lg:col-span-1 bg-cemento/20 p-6 border border-forja/10">
          <h3 className="text-lg font-black text-forja uppercase tracking-tighter mb-4">Registrar Movimiento</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setFormData({...formData, type: 'ingreso', category: 'Ventas'})} className={`py-2 text-xs font-bold uppercase tracking-widest border-2 transition-colors ${formData.type === 'ingreso' ? 'bg-forja text-puro border-forja' : 'border-forja/20 text-forja/50'}`}>+ Ingreso</button>
              <button type="button" onClick={() => setFormData({...formData, type: 'egreso', category: 'Insumos'})} className={`py-2 text-xs font-bold uppercase tracking-widest border-2 transition-colors ${formData.type === 'egreso' ? 'bg-forja text-puro border-forja' : 'border-forja/20 text-forja/50'}`}>- Egreso</button>
            </div>

            <div>
              <label className="block text-xs font-bold text-forja uppercase mb-1">Categoría</label>
              <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-puro border-none text-sm outline-none focus:ring-2 focus:ring-roble">
                {formData.type === 'ingreso' ? (
                  <>
                    <option value="Ventas">Ventas de Muebles</option>
                    <option value="Capital">Inyección de Capital (Socio)</option>
                    <option value="Otros Ingresos">Otros Ingresos</option>
                  </>
                ) : (
                  <>
                    <option value="Insumos">Compra de Insumos (Materiales)</option>
                    <option value="Marketing">Publicidad (Ads/Redes)</option>
                    <option value="Operativa">Gastos Operativos (Luz, Herramientas)</option>
                    <option value="Retiros">Retiro de Ganancias</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-forja uppercase mb-1">Monto (Gs.)</label>
              <input required type="number" min="0" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full p-3 bg-puro border-none outline-none focus:ring-2 focus:ring-roble" placeholder="Ej. 1500000" />
            </div>

            <div>
              <label className="block text-xs font-bold text-forja uppercase mb-1">Descripción / Concepto</label>
              <input required type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-puro border-none outline-none focus:ring-2 focus:ring-roble" placeholder="Ej. Mesa Comedor Cliente Juan" />
            </div>

            <button type="submit" disabled={isLoading} className="mt-2 bg-roble text-puro font-bold uppercase tracking-widest py-4 hover:bg-forja transition-colors text-sm disabled:opacity-50">
              {isLoading ? "Registrando..." : "Afectar Caja"}
            </button>
          </form>
        </div>

        {/* COLUMNA DERECHA: HISTORIAL */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-black text-forja uppercase tracking-tighter mb-4">Libro Diario (Historial)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-forja text-puro text-xs uppercase tracking-widest">
                  <th className="p-3 font-normal">Fecha</th>
                  <th className="p-3 font-normal">Concepto</th>
                  <th className="p-3 font-normal">Categoría</th>
                  <th className="p-3 font-normal text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="text-sm text-forja bg-puro">
                {transactions.map((t, idx) => (
                  <tr key={t.id || idx} className="border-b border-cemento/50 hover:bg-cemento/20 transition-colors">
                    <td className="p-3 text-xs opacity-70">
                      {t.date?.toDate ? t.date.toDate().toLocaleDateString('es-PY') : 'Justo ahora'}
                    </td>
                    <td className="p-3 font-bold">{t.description}</td>
                    <td className="p-3 text-xs"><span className="bg-cemento px-2 py-1 uppercase tracking-wider">{t.category}</span></td>
                    <td className={`p-3 text-right font-black ${t.type === 'ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'ingreso' ? '+' : '-'} Gs. {t.amount.toLocaleString("es-PY")}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr><td colSpan={4} className="p-8 text-center text-forja/50 uppercase text-xs font-bold tracking-widest">Aún no hay movimientos en caja.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
