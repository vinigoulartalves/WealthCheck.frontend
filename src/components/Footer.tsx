const footerLinks = [
  {
    title: "Produto",
    links: [
      { label: "Plataforma", href: "#features" },
      { label: "App Mobile", href: "#" },
      { label: "Integrações", href: "#" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Quem somos", href: "#" },
      { label: "Carreiras", href: "#" },
      { label: "Imprensa", href: "#" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "Central de suporte", href: "#" },
      { label: "Política de privacidade", href: "#" },
      { label: "Termos de uso", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black pt-16 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 text-black">
              WC
            </span>
            WealthCheck
          </div>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Controle suas finanças, acompanhe investimentos e tome decisões seguras com insights inteligentes e personalizados.
          </p>
        </div>
        {footerLinks.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white/70">
              {section.title}
            </h3>
            <ul className="space-y-2 text-sm text-white/60">
              {section.links.map((link) => (
                <li key={link.label}>
                  <a className="transition-colors hover:text-emerald-300" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 bg-black/40 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} WealthCheck. Todos os direitos reservados.
      </div>
    </footer>
  );
}
