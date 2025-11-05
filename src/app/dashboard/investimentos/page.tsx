import Link from "next/link";

const portfolios = [
  {
    name: "Renda fixa",
    allocation: "42%",
    performance: "+0,9% no mês",
    description: "Títulos pós-fixados e híbridos com liquidez tática para equilibrar fluxo de caixa.",
  },
  {
    name: "Multimercado",
    allocation: "28%",
    performance: "+1,6% no mês",
    description: "Fundos descorrelacionados que suavizam a volatilidade da carteira.",
  },
  {
    name: "Bolsa global",
    allocation: "20%",
    performance: "+3,1% no mês",
    description: "Exposição internacional a setores de tecnologia e saúde com hedge cambial parcial.",
  },
  {
    name: "Venture capital",
    allocation: "10%",
    performance: "Carry projetado 25% a.a.",
    description: "Apostas estratégicas em fintechs early-stage alinhadas ao core business.",
  },
];

export default function InvestmentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">Investimentos</p>
            <h1 className="mt-2 text-3xl font-semibold">Carteira diversificada</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Acompanhe a distribuição por classe de ativo, comparativos com benchmarks e métricas de risco da carteira.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:border-emerald-300 hover:text-emerald-200"
          >
            ← Voltar ao painel
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {portfolios.map((portfolio) => (
            <article key={portfolio.name} className="rounded-3xl border border-cyan-500/30 bg-cyan-500/10 p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white/60">
                      Alocação
                    </span>
                    <h2 className="mt-3 text-2xl font-semibold text-white">{portfolio.name}</h2>
                    <p className="mt-2 text-sm text-white/70">{portfolio.description}</p>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Peso</span>
                    <strong className="mt-1 text-3xl text-white">{portfolio.allocation}</strong>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-emerald-200">
                  {portfolio.performance}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
