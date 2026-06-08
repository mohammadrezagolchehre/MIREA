'use client';

import GuestView from "../components/ui/home/GuestView";
import DashboardView from "../components/ui/home/DashboardView"

export default function Home() {
  const isLoggedIn = false;

  return (
    <>
      {isLoggedIn ? (
        <DashboardView />
      ) : (
        <GuestView />
      )}
    </>
  );
}