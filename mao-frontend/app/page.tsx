import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import { getActiveProducts } from "../lib/firebase/products";


export const dynamic = 'force-dynamic'; //agregado para evitar los deploys

// Server Component asíncrono para inyectar catálogo con SEO perfecto
export default async function Home() {
  const products = await getActiveProducts();

  return (
    <div className="flex flex-col min-h-screen bg-puro">
      
      {/* 1. INYECCIÓN DEL WORDMARK (IDENTIDAD CORPORATIVA) */}
      <Header />

      {/* 2. SECCIÓN HERO: Propuesta de Valor (Negro Forja) */}
      <section className="w-full bg-forja py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-puro uppercase tracking-tighter max-w-4xl leading-tight">
            Diseñados para resistir y destacar.
          </h2>
          <p className="mt-6 text-lg md:text-xl font-sans text-puro/80 max-w-2xl font-light">
            Estructuras sólidas, vetas naturales y soldaduras expuestas. 
            Fabricados a mano en Paraguay con honestidad en materiales puros.
          </p>
          <div className="mt-10 h-1 w-24 bg-roble"></div>
        </div>
      </section>

      {/* 3. SECCIÓN CATÁLOGO: Grilla de Inyección de Productos */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          
          <div className="mb-12 border-l-4 border-roble pl-5">
            <h3 className="text-3xl font-display font-black uppercase text-forja tracking-tight">
              Catálogo de Producción
            </h3>
            <p className="text-base font-sans text-forja/70 mt-2">
              Unidades en stock y configuraciones bajo pedido.
            </p>
          </div>

          {/* Renderizado Condicional del Inventario */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="w-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-forja/20 bg-cemento/10">
              <svg className="w-12 h-12 text-forja/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <p className="font-sans font-bold text-forja uppercase tracking-widest text-sm">
                Taller trabajando
              </p>
              <p className="font-sans text-forja/60 mt-2 text-sm">
                El inventario está siendo actualizado.
              </p>
            </div>
          )}

        </div>
      </section>
      
    </div>
  );
}
