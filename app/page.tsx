'use client';

import { GlassAvatar } from "@/components/ui/glass-avatar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ChatContainer from "@/components/ui/Liora/ChatContainer";

export default function Home() {
  return (
<main className="relative min-h-screen flex flex-col justify-center items-center liora-bg px-4">
  
     <header className="absolute top-6 right-6 z-20">
      <div className="flex gap-3">
        <button className="btn-login">
            ورود
        </button>

        <button className="btn-register">
            ثبت‌نام
         </button>
      </div>
    </header>
    <ChatContainer />
    <div className="liora-vintage" />


    <div className="mb-10 z-10">

    </div>


    <div className="w-full z-10">
    
    </div>
</main>

  );
}
