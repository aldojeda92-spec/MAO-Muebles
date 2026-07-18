// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-forja text-cemento font-sans border-t-8 border-roble">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        
        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 border-b border-cemento/20 pb-12">
          
          {/* COLUMNA 1: Identidad Corporativa */}
          <div className="flex flex-col items-start">
            <h2 className="text-5xl font-display font-black text-puro uppercase tracking-tighter leading-none mb-1">
              MAO
            </h2>
            <p className="text-sm font-sans font-normal text-cemento uppercase tracking-widest mb-6">
              Muebles de madera y metal
            </p>
            <p className="text-sm text-cemento/80 max-w-xs leading-relaxed">
              Muebles diseñados para resistir y destacar. Fabricados a mano en Paraguay con materiales puros y estructura industrial sólida.
            </p>
          </div>

          {/* COLUMNA 2: Contacto Directo y Conversión */}
          <div className="flex flex-col items-start">
            <h3 className="text-xs font-bold text-puro uppercase tracking-widest mb-6 border-l-2 border-roble pl-3">
              Contacto Operativo
            </h3>
            <ul className="space-y-4 text-sm text-cemento/90">
              <li>
                <a 
                  href="https://wa.me/595994889020" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-roble transition-colors font-bold"
                >
                  <span className="text-roble">WA.</span> +595 994 889 020
                </a>
              </li>
              <li>
                <a 
                  href="mailto:aldojeda92@gmail.com" 
                  className="flex items-center gap-2 hover:text-puro transition-colors"
                >
                  <span className="text-cemento/50">EM.</span> aldojeda92@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 leading-relaxed">
                <span className="text-cemento/50">UB.</span> 
                Km 15 ruta 1- San Lorenzo,<br />Avenida de la Victoria.
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: Redes Sociales (Social Proof) */}
          <div className="flex flex-col items-start md:items-end">
            <h3 className="text-xs font-bold text-puro uppercase tracking-widest mb-6 border-l-2 md:border-l-0 md:border-r-2 border-roble pl-3 md:pl-0 md:pr-3">
              Redes Sociales
            </h3>
            <ul className="space-y-4 text-sm text-cemento/90 md:text-right">
              <li>
                <a 
                  href="https://instagram.com/mao.mueblespy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-puro transition-colors"
                >
                  Instagram @mao.mueblespy
                </a>
              </li>
              <li>
                <a 
                  href="https://facebook.com/maomuebles" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-puro transition-colors"
                >
                  Facebook: MAO Muebles
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cemento/50 font-bold uppercase tracking-wider">
            © {new Date().getFullYear()} MAO Muebles. Todos los derechos reservados.
          </p>
          <p className="text-[10px] text-cemento/30 uppercase tracking-widest">
            Diseño Industrial en Paraguay
          </p>
        </div>

      </div>
    </footer>
  );
}
