import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

interface RemoteUser {
  id?: string | number;
  email?: string;
  senha?: string;
  password?: string;
  [key: string]: unknown;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function sanitizeBaseUrl(url: string) {
  return url.replace(/\/$/, "");
}

export async function POST(request: Request) {
  if (!API_BASE_URL) {
    return NextResponse.json(
      { error: "A URL base da API não está configurada." },
      { status: 500 },
    );
  }

  let body: { email?: string; password?: string };

  try {
    body = await request.json();
  } catch (error) {
    console.error("Falha ao interpretar o payload enviado para o login.", error);
    return NextResponse.json({ error: "Formato de requisição inválido." }, { status: 400 });
  }

  const email = body?.email?.trim();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Informe email e senha para continuar." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${sanitizeBaseUrl(API_BASE_URL)}/usuarios`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Resposta inesperada da API remota de usuários.", response.status, response.statusText);
      return NextResponse.json(
        { error: "Não foi possível validar as credenciais no momento." },
        { status: 502 },
      );
    }

    const users = (await response.json()) as unknown;

    if (!Array.isArray(users)) {
      console.error("A API de usuários retornou uma estrutura inesperada.", users);
      return NextResponse.json(
        { error: "Não foi possível validar as credenciais no momento." },
        { status: 502 },
      );
    }

    const normalizedEmail = normalizeEmail(email);

    const matchedUser = users.find((rawUser): rawUser is RemoteUser => {
      if (!rawUser || typeof rawUser !== "object") {
        return false;
      }

      const candidateEmail =
        typeof (rawUser as RemoteUser).email === "string"
          ? normalizeEmail((rawUser as RemoteUser).email as string)
          : null;

      return candidateEmail === normalizedEmail;
    });

    if (!matchedUser) {
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }

    const remotePassword =
      typeof matchedUser.senha === "string"
        ? matchedUser.senha
        : typeof matchedUser.password === "string"
          ? matchedUser.password
          : null;

    if (remotePassword !== password) {
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }

    const safeUser = Object.fromEntries(
      Object.entries(matchedUser).filter(([key]) => key !== "senha" && key !== "password"),
    );

    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error("Erro inesperado ao validar usuário.", error);
    return NextResponse.json(
      { error: "Não foi possível validar as credenciais no momento." },
      { status: 502 },
    );
  }
}
