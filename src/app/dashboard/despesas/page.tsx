"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Despesa } from "@/interfaces/despesa.interface";
import { extractUserId, loadCurrentUser, type StoredUser } from "@/lib/user-storage";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function normalizeDespesaId(value: unknown): number | string | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return undefined;
    }

    const numeric = Number(trimmed);

    return Number.isFinite(numeric) ? numeric : trimmed;
  }

  return undefined;
}

function resolveDespesaId(candidate: {
  id?: unknown;
  idDespesa?: unknown;
  despesaId?: unknown;
  id_despesa?: unknown;
  despesa_id?: unknown;
}) {
  const possibleIds = [candidate.id, candidate.idDespesa, candidate.despesaId, candidate.id_despesa, candidate.despesa_id];

  for (const value of possibleIds) {
    const normalized = normalizeDespesaId(value);

    if (normalized != null) {
      return normalized;
    }
  }

  return undefined;
}

function normalizeDespesa(raw: unknown): Despesa | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const candidate = raw as {
    id?: unknown;
    idDespesa?: unknown;
    despesaId?: unknown;
    id_despesa?: unknown;
    despesa_id?: unknown;
    idUsuario?: unknown;
    valor?: unknown;
    data?: unknown;
    descricao?: unknown;
    categoria?: unknown;
  };

  const numericUserId =
    typeof candidate.idUsuario === "number"
      ? candidate.idUsuario
      : typeof candidate.idUsuario === "string"
        ? Number(candidate.idUsuario)
        : null;

  const numericValor =
    typeof candidate.valor === "number"
      ? candidate.valor
      : typeof candidate.valor === "string"
        ? Number(candidate.valor.replace(/\./g, "").replace(",", "."))
        : null;

  if (!Number.isFinite(numericUserId) || !Number.isFinite(numericValor)) {
    return null;
  }

  return {
    id: resolveDespesaId(candidate),
    idUsuario: numericUserId as number,
    valor: numericValor as number,
    data: typeof candidate.data === "string" ? candidate.data : "",
    descricao: typeof candidate.descricao === "string" ? candidate.descricao : "",
    categoria: typeof candidate.categoria === "string" ? candidate.categoria : "",
  };
}

export default function DespesasPage() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(loadCurrentUser());
    setIsUserLoaded(true);
  }, []);

  const userId = useMemo(() => extractUserId(currentUser), [currentUser]);
  const userName = useMemo(
    () => (currentUser && typeof currentUser.nome === "string" ? currentUser.nome : ""),
    [currentUser],
  );

  const loadDespesas = useCallback(async (idUsuario: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard/despesas?idUsuario=${encodeURIComponent(String(idUsuario))}`);
      const payload = (await response.json()) as { despesas?: unknown; error?: string };

      if (!response.ok) {
        setError(payload?.error ?? "Não foi possível carregar as despesas.");
        return;
      }

      const normalized = Array.isArray(payload?.despesas)
        ? (payload.despesas.map((item) => normalizeDespesa(item)).filter(Boolean) as Despesa[])
        : [];

      setDespesas(normalized);
    } catch (loadError) {
      console.error("Falha ao consultar despesas cadastradas.", loadError);
      setError("Não foi possível carregar as despesas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    void loadDespesas(userId);
  }, [loadDespesas, userId]);

  const totalDespesas = useMemo(
    () => despesas.reduce((sum, despesa) => sum + despesa.valor, 0),
    [despesas],
  );

  const handleDelete = useCallback(
    async (despesa: Despesa) => {
      const despesaId = despesa?.id != null ? String(despesa.id).trim() : "";

      if (!despesaId) {
        setError("Não foi possível identificar a despesa selecionada.");
        return;
      }

      const shouldDelete = window.confirm(
        `Deseja realmente excluir a despesa "${despesa.descricao || "Sem descrição"}"?`,
      );

      if (!shouldDelete) {
        return;
      }

      setDeletingId(despesaId);
      setError(null);

      try {
        const response = await fetch(`/api/dashboard/despesas/${encodeURIComponent(despesaId)}`, {
          method: "DELETE",
        });
        const payload = response.status === 204 ? null : ((await response.json()) as { error?: string } | null);

        if (!response.ok) {
          setError(payload?.error ?? "Não foi possível excluir a despesa.");
          return;
        }

        setDespesas((previous) =>
          previous.filter((item) => {
            const itemId = item?.id != null ? String(item.id).trim() : "";

            return itemId !== despesaId;
          }),
        );

        if (userId) {
          void loadDespesas(userId);
        }
      } catch (deleteError) {
        console.error("Falha ao excluir despesa.", deleteError);
        setError("Não foi possível excluir a despesa.");
      } finally {
        setDeletingId(null);
      }
    },
    [loadDespesas, userId],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-300">Despesas</p>
            <h1 className="mt-2 text-3xl font-semibold">
              {userName ? `Despesas de ${userName}` : "Saídas consolidadas"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Acompanhe os gastos cadastrados, categorize despesas e identifique oportunidades de otimização do orçamento.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Link
              href="/dashboard/despesas/novo"
              className="inline-flex items-center gap-2 rounded-full border border-rose-400 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-rose-200 transition hover:bg-rose-500/20"
            >
              + Nova despesa
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:border-rose-300 hover:text-rose-200"
            >
              ← Voltar ao painel
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-8 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
        ) : null}

        {!isUserLoaded ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-white/60">
            Carregando dados do usuário...
          </div>
        ) : !userId ? (
          <div className="mt-12 rounded-3xl border border-amber-500/30 bg-amber-500/10 px-6 py-10 text-center text-sm text-amber-100">
            Para visualizar e gerenciar as despesas, acesse sua conta.
          </div>
        ) : isLoading ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-white/60">
            Carregando despesas cadastradas...
          </div>
        ) : despesas.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-white/60">
            Nenhuma despesa cadastrada até o momento. Utilize o botão acima para registrar um novo gasto.
          </div>
        ) : (
          <div className="mt-12 flex flex-col gap-6">
            <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-6">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">Total do período</span>
              <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(totalDespesas)}</p>
            </div>

            <ul className="flex flex-col gap-4">
              {despesas.map((despesa) => {
                const despesaId = despesa?.id != null ? String(despesa.id).trim() : "";
                const isDeleting = deletingId === despesaId;

                return (
                  <li
                    key={`${despesa.id ?? despesa.descricao}-${despesa.data}`}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-rose-400/60 hover:bg-rose-500/5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-semibold text-white">{despesa.descricao || "Sem descrição"}</h2>
                          {despesa.categoria ? (
                            <span className="rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-rose-200">
                              {despesa.categoria}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-sm text-white/70">Data: {formatDate(despesa.data)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <span className="text-2xl font-semibold text-rose-200">{formatCurrency(despesa.valor)}</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(despesa)}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-200 transition hover:border-rose-300 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isDeleting ? "Excluindo..." : "Excluir"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
