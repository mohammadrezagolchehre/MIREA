'use client';

import { useAuth } from "../hooks/UseAuth";
import DashboardView from "@/components/ui/home/DashboardView";
import GuestView from "@/components/ui/home/GuestView";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center" >
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400/40 border-t-cyan-400" />
      </div>
    );
  }

  return user ? <DashboardView user={user} /> : <GuestView />;
}
