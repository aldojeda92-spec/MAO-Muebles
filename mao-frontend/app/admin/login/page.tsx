"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../../lib/firebase/config";
import { useRouter } from "next/navigation";

// Definimos la cuenta maestra como única autorizada
const MASTER_EMAIL = "aldojeda92@gmail.com";

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Validación de Seguridad de Capa 1: Filtro Frontend
      if (user.email !== MASTER_EMAIL) {
        await auth.signOut(); // Expulsamos al usuario inmediatamente
        setError("Acceso denegado. Esta cuenta no tiene privilegios de administrador.");
        return;
      }

      // Si es el maestro, lo redirigimos al panel
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError("Error al intentar iniciar sesión. Verifica tu conexión.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-puro px-4">
      <div className="w-full max-w-md bg-cemento/20 p-8 border border-forja/10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-black text-forja tracking-tighter">MAO</h1>
          <p className="text-sm font-sans text-forja/70 uppercase tracking-widest mt-2">
            Panel de Control
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-sm font-sans font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-roble text-puro font-sans font-medium py-4 transition-colors hover:bg-roble/90 active:bg-roble/80"
        >
          {/* SVG genérico de usuario/candado */}
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C9.243 2 7 4.243 7 7v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7zm7 12H8v-4h8v4z"/>
          </svg>
          Acceder con cuenta maestra
        </button>
      </div>
    </div>
  );
}