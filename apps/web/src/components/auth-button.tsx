"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export function AuthButton() {
  const { user, loading, signInWithGoogle, logout } = useAuth();

  if (loading) {
    return (
      <div className="h-10 w-24 rounded-[var(--radius-sm)] bg-archive/5 animate-pulse" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-paper/70 truncate max-w-[120px]">
          {user.displayName ?? user.email}
        </span>
        <Button variant="ghost" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Button variant="secondary" size="sm" onClick={signInWithGoogle}>
      Sign in with Google
    </Button>
  );
}
