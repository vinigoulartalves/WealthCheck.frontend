import Link from "next/link";

const sections = [
  {
    name: "Receitas",
    description: "Visualize entradas recorrentes, projeções de crescimento e acompanhe a evolução da receita mensal.",
    href: "/dashboard/receitas",
    accent: "from-emerald-500/20 via-emerald-500/10 to-transparent",
  },
  {
    name: "Despesas",
    description: "Controle gastos operacionais, compare períodos e identifique oportunidades de otimização.",
    href: "/dashboard/despesas",
    accent: "from-rose-500/20 via-rose-500/10 to-transparent",
  },
  {
    name: "Investimentos",
    description: "Monitore a carteira de investimentos, acompanhe a rentabilidade e alinhe alocações ao perfil de risco.",
    href: "/dashboard/investimentos",
    accent: "from-cyan-500/20 via-cyan-500/10 to-transparent",
  },
  {
    name: "Objetivos financeiros",
    description: "Defina metas, acompanhe percentuais atingidos e mantenha cada objetivo no radar do time.",
    href: "/dashboard/objetivosFinanceiros",
    accent: "from-amber-500/20 via-amber-500/10 to-transparent",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <header className="border-b border-white/10 bg-black/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">WealthCheck</p>
            <h1 className="mt-2 text-3xl font-semibold">Painel financeiro</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Acompanhe a saúde financeira da sua operação em tempo real, com indicadores prontos para suportar decisões
              estratégicas.
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-[0.65rem] uppercase tracking-[0.3em] text-emerald-300">Saldo consolidado</span>
              <strong className="mt-1 text-xl text-white">R$ 8.245.120</strong>
            </div>
            <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-[0.65rem] uppercase tracking-[0.3em] text-emerald-300">Metas atingidas</span>
              <strong className="mt-1 text-xl text-white">72%</strong>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <section className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.name}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-emerald-500/10 transition duration-300 ease-out hover:-translate-y-1 hover:border-emerald-400/60 hover:shadow-emerald-400/30"
            >
              <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${section.accent}`} />
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">{section.name}</h2>
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  {section.name === "Despesas" ? "controle" : section.name === "Investimentos" ? "carteira" : "monitoramento"}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-white/70">{section.description}</p>
              <Link
                href={section.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-300 transition hover:text-emerald-200"
              >
                Acessar {section.name.toLowerCase()}
                <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">Saúde financeira</span>
              <h2 className="mt-2 text-2xl font-semibold text-white">Indicadores em destaque</h2>
              <p className="mt-3 max-w-xl text-sm text-white/60">
                Personalize seu painel adicionando indicadores prioritários e recebendo alertas quando as métricas saírem do
                intervalo esperado.
              </p>
            </div>
            <div className="grid w-full gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Runway</p>
                <p className="mt-2 text-2xl font-semibold text-white">14 meses</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Margem EBITDA</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-300">+18,6%</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-5 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Índice de poupança</p>
                <p className="mt-2 text-2xl font-semibold text-emerald-300">32%</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
