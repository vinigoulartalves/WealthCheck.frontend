"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Receita } from "@/interfaces/receita.interface";
import { extractUserId, loadCurrentUser, type StoredUser } from "@/lib/user-storage";

interface ReceitaListItem extends Receita {
  pathId: string;
}

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

function normalizeReceita(raw: unknown): ReceitaListItem | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const candidate = raw as {
    id?: unknown;
    idReceita?: unknown;
    idUsuario?: unknown;
    valor?: unknown;
    data?: unknown;
    descricao?: unknown;
    categoria?: unknown;
  };

  const rawId = candidate.id ?? candidate.idReceita;

  const numericId =
    typeof rawId === "number"
      ? rawId
      : typeof rawId === "string"
        ? Number(rawId)
        : undefined;

  const pathId =
    typeof rawId === "string"
      ? rawId.trim()
      : Number.isFinite(numericId)
        ? String(numericId)
        : "";

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

  if (!pathId) {
    return null;
  }

  return {
    id: Number.isFinite(numericId) ? (numericId as number) : undefined,
    idUsuario: numericUserId as number,
    valor: numericValor as number,
    data: typeof candidate.data === "string" ? candidate.data : "",
    descricao: typeof candidate.descricao === "string" ? candidate.descricao : "",
    categoria: typeof candidate.categoria === "string" ? candidate.categoria : "",
    pathId,
  };
}

export default function RevenuePage() {
  const [currentUser, setCurrentUser] = useState<StoredUser | null>(null);
  const [receitas, setReceitas] = useState<ReceitaListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(loadCurrentUser());
    setIsUserLoaded(true);
  }, []);

  const userId = useMemo(() => extractUserId(currentUser), [currentUser]);

  const userName = useMemo(() => {
    if (!currentUser) {
      return null;
    }

    const possibleName =
      typeof currentUser.nome === "string"
        ? currentUser.nome
        : typeof (currentUser as { name?: unknown }).name === "string"
          ? ((currentUser as { name?: string }).name as string)
          : null;

    return possibleName?.trim() ? possibleName : null;
  }, [currentUser]);

  const loadReceitas = useCallback(
    async (idUsuario: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/dashboard/receitas?idUsuario=${idUsuario}`);
        const payload = (await response.json()) as { receitas?: unknown; error?: string };

        if (!response.ok) {
          setError(payload?.error ?? "Não foi possível carregar as receitas.");
          setReceitas([]);
          return;
        }

        const normalized = Array.isArray(payload?.receitas)
          ? (payload.receitas.map((item) => normalizeReceita(item)).filter(Boolean) as ReceitaListItem[])
          : [];

        const ordered = normalized
          .slice()
          .sort((a, b) => {
            const aTime = Date.parse(a.data);
            const bTime = Date.parse(b.data);

            if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
              return 0;
            }

            if (Number.isNaN(aTime)) {
              return 1;
            }

            if (Number.isNaN(bTime)) {
              return -1;
            }

            return bTime - aTime;
          });

        setReceitas(ordered);
      } catch (loadError) {
        console.error("Falha ao consultar receitas cadastradas.", loadError);
        setError("Não foi possível carregar as receitas.");
        setReceitas([]);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (userId) {
      void loadReceitas(userId);
    }
  }, [userId, loadReceitas]);

  const totalReceitas = useMemo(() => receitas.reduce((sum, receita) => sum + receita.valor, 0), [receitas]);

  async function handleDelete(receita: ReceitaListItem) {
    if (!receita?.pathId) {
      setError("Não foi possível identificar a receita selecionada.");
      return;
    }

    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        `Deseja realmente excluir a receita "${receita.descricao || "Sem descrição"}"?`,
      );

      if (!confirmed) {
        return;
      }
    }

    setDeletingId(receita.pathId);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard/receitas/${encodeURIComponent(receita.pathId)}`, {
        method: "DELETE",
      });

      const payload = await response.json().catch(() => null as { error?: string } | null);

      if (!response.ok) {
        setError(payload?.error ?? "Não foi possível excluir a receita.");
        return;
      }

      setReceitas((previous) => previous.filter((item) => item.pathId !== receita.pathId));
    } catch (deleteError) {
      console.error("Falha ao excluir receita.", deleteError);
      setError("Não foi possível excluir a receita.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">Receitas</p>
            <h1 className="mt-2 text-3xl font-semibold">
              {userName ? `Receitas de ${userName}` : "Entradas consolidadas"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Acompanhe as entradas cadastradas, organize por categoria e mantenha visibilidade sobre o fluxo de caixa.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <Link
              href="/dashboard/receitas/novo"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-200 transition hover:bg-emerald-500/20"
            >
              + Nova receita
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 transition hover:border-emerald-300 hover:text-emerald-200"
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
            Para visualizar e gerenciar as receitas, acesse sua conta.
          </div>
        ) : isLoading ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-white/60">
            Carregando receitas cadastradas...
          </div>
        ) : receitas.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-white/60">
            Nenhuma receita cadastrada até o momento. Utilize o botão acima para registrar uma nova entrada.
          </div>
        ) : (
          <div className="mt-12 flex flex-col gap-6">
            <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">Total do período</span>
              <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(totalReceitas)}</p>
            </div>

            <ul className="flex flex-col gap-4">
              {receitas.map((receita) => {
                const hasValidId = Boolean(receita.pathId);

                return (
                  <li
                    key={`${receita.pathId}-${receita.data}`}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-emerald-400/60 hover:bg-emerald-500/5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-semibold text-white">{receita.descricao || "Sem descrição"}</h2>
                          {receita.categoria ? (
                            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-emerald-200">
                              {receita.categoria}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-3 text-sm text-white/70">Data: {formatDate(receita.data)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-4">
                        <span className="text-2xl font-semibold text-emerald-200">{formatCurrency(receita.valor)}</span>
                        <div className="flex gap-2">
                          <Link
                            href={hasValidId ? `/dashboard/receitas/${encodeURIComponent(receita.pathId)}/editar` : "#"}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-emerald-300 hover:text-emerald-200 disabled:opacity-60"
                            aria-disabled={!hasValidId}
                            onClick={(event) => {
                              if (!hasValidId) {
                                event.preventDefault();
                              }
                            }}
                          >
                            Editar
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(receita)}
                            disabled={deletingId === receita.pathId || !hasValidId}
                            className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-200 transition hover:border-rose-300 hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {deletingId === receita.pathId ? "Excluindo..." : "Excluir"}
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
