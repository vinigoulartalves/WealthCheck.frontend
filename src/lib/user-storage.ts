export interface StoredUser {
  id?: number | string;
  nome?: string;
  email?: string;
  [key: string]: unknown;
}

const STORAGE_KEY = "wealthcheck.currentUser";

export function storeCurrentUser(user: StoredUser) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Não foi possível armazenar o usuário localmente.", error);
  }
}

export function loadCurrentUser(): StoredUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue);

    if (parsedValue && typeof parsedValue === "object") {
      return parsedValue as StoredUser;
    }

    return null;
  } catch (error) {
    console.error("Não foi possível interpretar os dados do usuário armazenado.", error);
    return null;
  }
}

export function clearStoredUser() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Não foi possível remover o usuário armazenado.", error);
  }
}

export function extractUserId(user: StoredUser | null): number | null {
  if (!user) {
    return null;
  }

  const { id } = user;

  if (typeof id === "number" && Number.isFinite(id)) {
    return id;
  }

  if (typeof id === "string") {
    const trimmed = id.trim();

    if (!trimmed) {
      return null;
    }

    const numericId = Number(trimmed);

    if (Number.isFinite(numericId)) {
      return numericId;
    }
  }

  return null;
}
