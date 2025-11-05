import Link from "next/link";

const goals = [
  {
    name: "Reserva de emergência corporativa",
    progress: 0.74,
    deadline: "Dez 2025",
    description: "Construir colchão equivalente a 12 meses de despesas operacionais críticas.",
  },
  {
    name: "Expansão LatAm",
    progress: 0.52,
    deadline: "Jul 2026",
    description: "Financiar a abertura de escritórios no Chile e México com equipe local.",
  },
  {
    name: "Nova jornada de clientes",
    progress: 0.38,
    deadline: "Mar 2025",
    description: "Lançar plataforma self-service com onboarding automatizado e trilhas educacionais.",
  },
];

function formatProgress(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">Objetivos financeiros</p>
            <h1 className="mt-2 text-3xl font-semibold">Trilhe metas estratégicas</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Conecte metas financeiras com OKRs, visualize o avanço em tempo real e alinhe times para acelerar entregas.
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
          {goals.map((goal) => (
            <article key={goal.name} className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-white/60">
                      Prazo
                    </span>
                    <h2 className="mt-3 text-2xl font-semibold text-white">{goal.name}</h2>
                    <p className="mt-2 text-sm text-white/70">{goal.description}</p>
                  </div>
                  <div className="flex flex-col items-end text-right">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Conclusão prevista</span>
                    <strong className="mt-1 text-base text-white">{goal.deadline}</strong>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                    <span>Progresso</span>
                    <span className="text-emerald-200">{formatProgress(goal.progress)}</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500"
                      style={{ width: formatProgress(goal.progress) }}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
