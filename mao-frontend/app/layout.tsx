import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google"; // Fuentes corporativas
import "./globals.css";
import Footer from '@/components/Footer'; // Asegúrate de que la ruta coincida con tu estructura

// Cargamos las tipografías estrictas del manual de identidad
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MAO - Muebles de madera y metal",
  description: "Diseñados para resistir y destacar. Estructuras sólidas, vetas naturales y soldaduras expuestas. Fabricados a mano en Paraguay.",
  keywords: ["muebles industriales", "muebles de metal y madera", "Paraguay", "Asunción", "mesas industriales", "estanterías metal"],
  authors: [{ name: "MAO Muebles" }],
  openGraph: {
    title: "MAO - Muebles de madera y metal",
    description: "Honestidad en materiales puros. Descubre nuestro catálogo de producción.",
    url: "https://mao-muebles.com", // REEMPLAZAR CON TU DOMINIO REAL LUEGO
    siteName: "MAO Muebles",
    images: [
      {
        // Esta es la imagen que saldrá en la vista previa de WhatsApp
        url: "https://tu-dominio.com/ruta-a-tu-logo-o-foto-portada.jpg", 
        width: 1200,
        height: 630,
        alt: "MAO Muebles Industriales",
      },
    ],
    locale: "es_PY",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${inter.variable} font-sans antialiased bg-puro`}>
        {children}
        <body>
  <main>
    {children}
  </main>
  <Footer /> {/* <-- Inyección del Footer aquí */}
</body>
      </body>
    </html>
  );
}
