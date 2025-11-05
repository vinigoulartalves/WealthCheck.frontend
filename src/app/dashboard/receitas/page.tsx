import Link from "next/link";

const revenueStreams = [
  { name: "Assinaturas premium", value: "R$ 320.400", trend: "+12%", badge: "recorrente" },
  { name: "Consultorias enterprise", value: "R$ 185.900", trend: "+8%", badge: "serviços" },
  { name: "Comissões de investimento", value: "R$ 92.700", trend: "+5%", badge: "variável" },
];

export default function RevenuePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">Receitas</p>
            <h1 className="mt-2 text-3xl font-semibold">Entradas consolidadas</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Analise a composição das entradas, identifique sazonalidades e antecipe fluxos futuros para manter o caixa saudável.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:border-emerald-300 hover:text-emerald-200"
          >
            ← Voltar ao painel
          </Link>
        </div>

        <div className="mt-12 grid gap-6">
          {revenueStreams.map((stream) => (
            <article key={stream.name} className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white/60">
                    {stream.badge}
                  </span>
                  <h2 className="mt-3 text-2xl font-semibold text-white">{stream.name}</h2>
                  <p className="mt-2 text-sm text-white/70">
                    Expanda este fluxo acompanhando conversões, upgrades e indicadores de retenção diretamente no CRM.
                  </p>
                </div>
                <div className="flex flex-col items-end text-right">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Total do mês</span>
                  <strong className="mt-2 text-3xl text-white">{stream.value}</strong>
                  <span className="mt-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">{stream.trend} vs. mês anterior</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
