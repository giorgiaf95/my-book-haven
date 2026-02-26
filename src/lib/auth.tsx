import { createContext, useContext, useEffect, useMemo, useState } from "react";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => { ok: boolean; message?: string };
  register: (input: RegisterInput) => { ok: boolean; message?: string };
  updateProfile: (input: { name: string; email: string }) => { ok: boolean; message?: string };
  logout: () => void;
};

const USERS_KEY = "bixblion-users";
const SESSION_KEY = "bixblion-auth-user";

const AuthContext = createContext<AuthContextValue | null>(null);

function sanitizeUser(user: StoredUser): AuthUser {
  return { id: user.id, name: user.name, email: user.email };
}

function readUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function seedUsersIfMissing() {
  const existing = readUsers();
  if (existing.length > 0) return;
  writeUsers([
    {
      id: "u-local-1",
      name: "Lettore Demo",
      email: "demo@bixblion.app",
      password: "demo12345",
    },
  ]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    seedUsersIfMissing();
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as AuthUser;
      if (parsed?.email) setUser(parsed);
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const found = readUsers().find((u) => u.email.toLowerCase() === normalizedEmail);
        if (!found || found.password !== password) {
          return { ok: false, message: "Credenziali non valide" };
        }
        const sessionUser = sanitizeUser(found);
        setUser(sessionUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        return { ok: true };
      },
      register: ({ name, email, password }) => {
        const normalizedEmail = email.trim().toLowerCase();
        const users = readUsers();
        if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
          return { ok: false, message: "Email già registrata" };
        }
        const created: StoredUser = {
          id: `u-local-${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          password,
        };
        users.push(created);
        writeUsers(users);
        const sessionUser = sanitizeUser(created);
        setUser(sessionUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        return { ok: true };
      },
      updateProfile: ({ name, email }) => {
        if (!user) return { ok: false, message: "Utente non autenticato" };
        const normalizedEmail = email.trim().toLowerCase();
        const cleanName = name.trim();
        const users = readUsers();
        const emailInUse = users.some(
          (storedUser) => storedUser.id !== user.id && storedUser.email.toLowerCase() === normalizedEmail
        );
        if (emailInUse) {
          return { ok: false, message: "Email già utilizzata da un altro account" };
        }
        const updatedUsers = users.map((storedUser) =>
          storedUser.id === user.id
            ? { ...storedUser, name: cleanName, email: normalizedEmail }
            : storedUser
        );
        writeUsers(updatedUsers);
        const updatedSession: AuthUser = { ...user, name: cleanName, email: normalizedEmail };
        setUser(updatedSession);
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
        return { ok: true };
      },
      logout: () => {
        setUser(null);
        localStorage.removeItem(SESSION_KEY);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve essere usato dentro AuthProvider");
  }
  return context;
}
