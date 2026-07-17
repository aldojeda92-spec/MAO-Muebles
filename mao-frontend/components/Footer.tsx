export default function Footer() {
  return (
    <footer className="w-full bg-forja text-puro mt-auto">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-display font-black tracking-tighter">MAO</h2>
          <p className="text-sm font-sans text-puro/70 mt-2 max-w-xs">
            Muebles diseñados para resistir y destacar. Honestidad en materiales puros.
          </p>
        </div>
        
        <div className="text-center md:text-right font-sans text-sm text-puro/70 space-y-2">
          <p className="uppercase tracking-widest text-xs font-bold text-puro/50">Fabricación Nacional</p>
          <p>Hecho a mano en Paraguay</p>
          <p>© {new Date().getFullYear()} MAO Muebles.</p>
        </div>
      </div>
    </footer>
  );
}