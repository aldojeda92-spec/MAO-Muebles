"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase/config";
import ProductForm from "../../../components/ProductForm";
import AdminProductList from "../../../components/AdminProductList"; // IMPORTAMOS LA TABLA

const MASTER_EMAIL = "aldojeda92@gmail.com";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-forja/10 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-black text-forja uppercase tracking-tighter">Inventario y Producción</h1>
            <p className="text-sm font-sans text-forja/70 mt-1">Sesión activa: <span className="font-bold">{user?.email}</span></p>
          </div>
          <button onClick={handleLogout} className="px-6 py-2 bg-forja text-puro font-sans text-sm font-medium transition-colors hover:bg-forja/90">
            Cerrar Sesión
          </button>
        </header>

        <main>
          {/* Módulo Superior: Formulario de Carga */}
          <div className="mb-12">
            <h2 className="text-xl font-display font-bold text-forja uppercase mb-4 text-center md:text-left">Inyectar Nuevo Producto</h2>
            <ProductForm />
          </div>

          {/* Módulo Inferior: Gestor de Catálogo en Tiempo Real */}
          <div className="border-t border-forja/10 pt-8">
            <AdminProductList />
          </div>
        </main>
      </div>
    </div>
  );
}