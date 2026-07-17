"use client";

import { useState } from "react";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    product.imageGeneral,
    product.imageFrontal,
    product.imageMacro
  ];

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  // Verificamos matemáticamente si hay un descuento activo
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  const handleWhatsAppClick = () => {
    const phoneNumber = "5959XXXXXXXX"; 
    
    // El texto cambia estratégicamente si el mueble está en oferta
    const introText = hasDiscount 
      ? `Hola MAO, quiero aprovechar la oferta del mueble: *${product.name}*.` 
      : `Hola MAO, me interesa el mueble: *${product.name}*.`;

    const message = `${introText}\n\nPrecio final: Gs. ${product.price.toLocaleString("es-PY")}\nMateriales: ${product.materials}\n\n¿Tienen disponibilidad para entrega?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  return (
    <article className="flex flex-col bg-puro border-2 border-forja/10 h-full group hover:border-forja/30 transition-colors">
      
      <div className="relative aspect-square w-full bg-cemento/20 overflow-hidden">
        {!product.isAvailable && (
          <div className="absolute top-0 left-0 w-full h-full bg-forja/80 z-20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-puro font-display font-black text-2xl uppercase tracking-widest border-4 border-puro p-4 rotate-[-10deg]">
              Pausado
            </span>
          </div>
        )}

        {/* Etiqueta de Promoción Visual (Flat Design) */}
        {hasDiscount && product.isAvailable && (
          <div className="absolute top-4 right-0 bg-roble text-puro text-xs font-sans font-bold uppercase tracking-widest px-4 py-2 z-10">
            En Oferta
          </div>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={images[currentImageIndex]} 
          alt={`${product.name} - Vista ${currentImageIndex + 1}`} 
          className="w-full h-full object-cover"
        />

        {product.isAvailable && (
          <>
            <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-forja text-puro flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" aria-label="Ver imagen anterior">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-forja text-puro flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Ver imagen siguiente">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((_, idx) => (
                <div key={idx} className={`h-2 w-2 transition-colors ${currentImageIndex === idx ? 'bg-roble' : 'bg-forja/30'}`} />
              ))}
            </div>
            <div className="absolute top-2 left-2 bg-puro text-forja text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-1 z-10">
              {currentImageIndex === 0 ? "General" : currentImageIndex === 1 ? "Frontal" : "Detalle"}
            </div>
          </>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        
        {/* BLOQUE DE HEADER ACTUALIZADO CON PRECIOS */}
        <header className="mb-4">
          <h3 className="text-xl font-display font-black text-forja uppercase tracking-tighter leading-none mb-2">
            {product.name}
          </h3>
          
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-sm font-sans text-forja/50 line-through">
                Gs. {product.originalPrice?.toLocaleString("es-PY")}
              </span>
            )}
            <p className={`text-2xl font-sans font-bold ${hasDiscount ? 'text-roble' : 'text-forja'}`}>
              Gs. {product.price.toLocaleString("es-PY")}
            </p>
          </div>
        </header>

        <div className="space-y-3 mb-6 flex-grow">
          <p className="text-sm font-sans text-forja/80 leading-relaxed">
            {product.description}
          </p>
          
          <div className="bg-cemento/20 p-3 border-l-2 border-forja/20">
            <p className="text-xs font-sans text-forja"><span className="font-bold uppercase tracking-wider">Estructura:</span> {product.materials}</p>
            <p className="text-xs font-sans text-forja mt-1"><span className="font-bold uppercase tracking-wider">Medidas:</span> {product.dimensions}</p>
          </div>
        </div>

        <button 
          onClick={handleWhatsAppClick}
          disabled={!product.isAvailable}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-roble text-puro font-sans font-bold uppercase tracking-widest py-4 transition-colors hover:bg-roble/90 disabled:bg-cemento disabled:text-forja/50"
        >
          {product.isAvailable ? (
            <>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/></svg>
              Consultar Proyecto
            </>
          ) : (
             "Mueble Agotado"
          )}
        </button>

      </div>
    </article>
  );
}