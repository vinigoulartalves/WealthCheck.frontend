export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-white">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            WealthCheck
          </span>
          <h1 className="text-2xl font-semibold">Financial wellbeing, simplified.</h1>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a className="transition-colors hover:text-emerald-300" href="#features">
            Soluções
          </a>
          <a className="transition-colors hover:text-emerald-300" href="#benefits">
            Benefícios
          </a>
          <a className="transition-colors hover:text-emerald-300" href="#insights">
            Insights
          </a>
        </nav>
        <button className="group relative overflow-hidden rounded-full border border-emerald-400 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-emerald-200 transition duration-300 ease-out hover:text-black">
          <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-transform duration-300 ease-out group-hover:translate-y-0" />
          <span className="relative">Entrar</span>
        </button>
      </div>
    </header>
  );
}
