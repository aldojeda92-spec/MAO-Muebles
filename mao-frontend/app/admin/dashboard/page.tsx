// app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase/config";

// TUS MÓDULOS EXISTENTES (Intactos)
import ProductForm from "../../../components/ProductForm";
import AdminProductList from "../../../components/AdminProductList"; 

// EL NUEVO ECOSISTEMA ERP INYECTADO
import AdminMaterials from "../../../components/AdminMaterials"; 
import AdminProduction from "../../../components/AdminProduction";
import AdminFinances from "../../../components/AdminFinances"; // <--- Bóveda Financiera

const MASTER_EMAIL = "aldojeda92@gmail.com";

// Definición de las pestañas disponibles
type TabOption = "catalogo" | "insumos" | "recetas" | "finanzas";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  
  // Estado para controlar la navegación modular (Iniciamos en catálogo)
  const [activeTab, setActiveTab] = useState<TabOption>("catalogo");

  // Tu lógica de autenticación original (sin tocar)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || currentUser.email !== MASTER_EMAIL) {
        router.push("/admin/login");
      } else {
        setUser(currentUser);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-puro">
        <p className="text-forja font-sans font-medium animate-pulse">Autenticando credenciales de MAO...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cemento/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER CORPORATIVO */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-forja pb-6 mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-display font-black text-forja uppercase tracking-tighter">
              Centro de Control Operativo
            </h1>
            <p className="text-sm font-sans text-forja/70 mt-1 uppercase tracking-widest">
              Sesión activa: <span className="font-bold text-forja">{user?.email}</span>
            </p>
          </div>
          <button 
            onClick={handleLogout} 
            className="px-6 py-2 bg-forja text-puro font-sans font-bold text-xs uppercase tracking-widest transition-colors hover:bg-forja/90"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* NAVEGACIÓN MODULAR (TABS) */}
        <nav className="flex gap-2 overflow-x-auto border-b border-forja/20 mb-8 pb-px">
          
          <button
            onClick={() => setActiveTab("catalogo")}
            className={`py-3 px-6 text-sm font-bold uppercase tracking-widest transition-colors border-b-4 whitespace-nowrap ${
              activeTab === "catalogo"
                ? "border-roble text-roble" // Acento Roble Tostado según manual
                : "border-transparent text-forja/60 hover:text-forja"
            }`}
          >
            Catálogo Web
          </button>
          
          <button
            onClick={() => setActiveTab("insumos")}
            className={`py-3 px-6 text-sm font-bold uppercase tracking-widest transition-colors border-b-4 whitespace-nowrap ${
              activeTab === "insumos"
                ? "border-roble text-roble" 
                : "border-transparent text-forja/60 hover:text-forja"
            }`}
          >
            Insumos (Costos)
          </button>
          
          <button
            onClick={() => setActiveTab("recetas")}
            className={`py-3 px-6 text-sm font-bold uppercase tracking-widest transition-colors border-b-4 whitespace-nowrap ${
              activeTab === "recetas"
                ? "border-roble text-roble" 
                : "border-transparent text-forja/60 hover:text-forja"
            }`}
          >
            Producción (BOM)
          </button>
          
          <button
            onClick={() => setActiveTab("finanzas")}
            className={`py-3 px-6 text-sm font-bold uppercase tracking-widest transition-colors border-b-4 whitespace-nowrap ${
              activeTab === "finanzas"
                ? "border-roble text-roble" 
                : "border-transparent text-forja/60 hover:text-forja"
            }`}
          >
            Finanzas
          </button>

        </nav>

        {/* RENDERIZADO CONDICIONAL DE MÓDULOS (FLAT ARCHITECTURE) */}
        <main>
          
          {/* PESTAÑA 1: Catálogo y Creación de Productos */}
          {activeTab === "catalogo" && (
            <div className="animate-fadeIn">
              <div className="mb-12">
                <h2 className="text-xl font-display font-bold text-forja uppercase mb-4 text-center md:text-left">
                  Inyectar Nuevo Producto
                </h2>
                <ProductForm />
              </div>
              <div className="border-t border-forja/10 pt-8">
                <AdminProductList />
              </div>
            </div>
          )}

          {/* PESTAÑA 2: Módulo de Costeo e Inventario Base */}
          {activeTab === "insumos" && (
            <div className="animate-fadeIn w-full">
               <AdminMaterials />
            </div>
          )}

          {/* PESTAÑA 3: Centro de Producción Operativa */}
          {activeTab === "recetas" && (
            <div className="animate-fadeIn w-full">
               <AdminProduction />
            </div>
          )}

          {/* PESTAÑA 4: Libro Mayor y Control Financiero */}
          {activeTab === "finanzas" && (
            <div className="animate-fadeIn w-full">
               <AdminFinances />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
