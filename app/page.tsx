'use client';

import { useAuth } from "../hooks/UseAuth";
import DashboardView from "@/components/ui/home/DashboardView";
import GuestView from "@/components/ui/home/GuestView";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-cyan-400/40 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  return user ? <DashboardView user={user} /> : <GuestView />;
}