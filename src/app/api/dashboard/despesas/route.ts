import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

function sanitizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

function buildRemoteUrl(path: string) {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured");
  }

  return `${sanitizeBaseUrl(API_BASE_URL)}${path}`;
}

export async function GET(request: NextRequest) {
  if (!API_BASE_URL) {
    return NextResponse.json({ error: "A URL base da API não está configurada." }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("idUsuario");

  const query = userId ? `?idUsuario=${encodeURIComponent(userId)}` : "";

  try {
    const response = await fetch(buildRemoteUrl(`/despesas${query}`), {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Falha ao consultar despesas na API remota.", response.status, response.statusText);
      return NextResponse.json({ error: "Não foi possível carregar as despesas." }, { status: 502 });
    }

    const despesas = (await response.json()) as unknown;

    if (!Array.isArray(despesas)) {
      console.error("Estrutura inesperada recebida da API de despesas.", despesas);
      return NextResponse.json({ error: "Não foi possível carregar as despesas." }, { status: 502 });
    }

    if (!userId) {
      return NextResponse.json({ despesas });
    }

    const numericUserId = Number(userId);

    if (!Number.isFinite(numericUserId)) {
      return NextResponse.json({ error: "Identificador de usuário inválido." }, { status: 400 });
    }

    const filteredDespesas = despesas.filter((item) => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const candidateUserId = (item as { idUsuario?: unknown }).idUsuario;

      if (typeof candidateUserId === "number") {
        return candidateUserId === numericUserId;
      }

      if (typeof candidateUserId === "string") {
        const parsed = Number(candidateUserId.trim());
        return Number.isFinite(parsed) && parsed === numericUserId;
      }

      return false;
    });

    return NextResponse.json({ despesas: filteredDespesas });
  } catch (error) {
    console.error("Erro inesperado ao consultar despesas.", error);
    return NextResponse.json({ error: "Não foi possível carregar as despesas." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json({ error: "A URL base da API não está configurada." }, { status: 500 });
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch (error) {
    console.error("Falha ao interpretar o corpo da requisição de criação de despesa.", error);
    return NextResponse.json({ error: "Formato de requisição inválido." }, { status: 400 });
  }

  if (typeof body.idUsuario !== "number" && typeof body.idUsuario !== "string") {
    return NextResponse.json({ error: "Informe o usuário vinculado à despesa." }, { status: 400 });
  }

  try {
    const response = await fetch(buildRemoteUrl("/despesas"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    let payload: unknown = null;

    if (response.status !== 204) {
      try {
        payload = await response.json();
      } catch (error) {
        console.error("Falha ao interpretar a resposta da criação de despesa.", error);
      }
    }

    if (!response.ok) {
      console.error("Falha ao criar despesa na API remota.", response.status, response.statusText, payload);
      return NextResponse.json(
        {
          error: (payload as { error?: string } | null)?.error ?? "Não foi possível criar a despesa.",
        },
        { status: response.status === 422 ? 422 : 502 },
      );
    }

    const status = response.status === 204 ? 200 : response.status;

    return NextResponse.json(payload ?? { sucesso: true }, { status });
  } catch (error) {
    console.error("Erro inesperado ao criar despesa.", error);
    return NextResponse.json({ error: "Não foi possível criar a despesa." }, { status: 502 });
  }
}
