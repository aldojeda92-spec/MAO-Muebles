export default function Header() {
  return (
    // Barra superior pegajosa (sticky) con fondo Blanco Puro y borde sutil
    <header className="w-full bg-puro border-b border-forja/10 py-5 sticky top-0 z-40">
      <div className="container mx-auto px-4 flex flex-col items-center md:items-start">
        
        {/* WORDMARK MAO */}
        <div className="flex flex-col items-center md:items-start select-none">
          {/* Elemento Principal: Montserrat Black */}
          <h1 className="text-5xl md:text-6xl font-display font-black text-forja uppercase tracking-tighter leading-none">
            MAO
          </h1>
          
          {/* Tagline: Inter Light */}
          <p className="text-xs md:text-sm font-sans font-light text-forja/70 uppercase tracking-[0.2em] mt-1">
            Muebles de madera y metal
          </p>
        </div>

      </div>
    </header>
  );
}