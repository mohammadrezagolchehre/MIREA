'use client';

import { useCallback, useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  phone: string;
  firstName: string;
  lastName?: string;
  birthDate?: string;
};

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error ?? "Request failed");
  }
  return data as T;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) return null;
        const data = await readJson<{ user: AuthUser }>(response);
        return data.user;
      })
      .then((nextUser) => {
        if (active) setUser(nextUser);
      })
      .catch((error) => {
        console.warn("auth session error:", error);
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback((userData: AuthUser) => {
    setUser(userData);
    window.location.reload();
  }, []);

  const logout = useCallback(async () => {
    await readJson<{ success: boolean }>(
      await fetch("/api/auth/logout", { method: "POST" })
    );
    setUser(null);
    window.location.reload();
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<AuthUser>) => {
      const data = await readJson<{ user: AuthUser }>(
        await fetch("/api/auth/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })
      );
      setUser(data.user);
      return data.user;
    },
    []
  );

  return { user, loading, login, logout, updateProfile };
}
