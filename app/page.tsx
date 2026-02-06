'use client';

import { GlassAvatar } from "@/components/ui/glass-avatar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center liora-bg">
      
      <GlassAvatar glowEffect>
        <Avatar className="w-28 h-28">
          <AvatarImage src="https://i.pravatar.cc/300" />
          <AvatarFallback>LI</AvatarFallback>
        </Avatar>
      </GlassAvatar>

    </main>
  );
}
