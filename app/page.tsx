'use client';

import { GlassAvatar } from "@/components/ui/glass-avatar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">
      
      <GlassAvatar glowEffect>
        <Avatar className="w-28 h-28">
          <AvatarImage src="https://i.pravatar.cc/300" />
          <AvatarFallback>LI</AvatarFallback>
        </Avatar>
      </GlassAvatar>

    </main>
  );
}
