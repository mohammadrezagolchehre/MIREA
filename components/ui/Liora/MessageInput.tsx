'use client';

import { useState } from "react";
import { Send } from "lucide-react";
import { GlassTextarea } from "@/components/glass-textarea";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
type MessageInputProps = {
  onSend: (text: string) => void;
};

export default function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");


  const isMultiline = message.includes("\n") || message.length > 32;

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);  
    setMessage("");  
  };

return (
  <div className="w-full max-w-xl mx-auto relative">

    {isMultiline ? (
      <GlassTextarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={2}
        className="pr-12"
        placeholder="اینجا برامون بنویس"
        autoFocus
      />
    ) : (
      <GlassInput
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="pr-12"
        placeholder="اینجا برامون بنویس"
        autoFocus
      />
    )}

    <GlassButton
      variant="primary"
      size="icon"
      onClick={handleSend}
      disabled={!message.trim()}
      className="absolute left-2 bottom-6"
    >
      <Send size={16} />
    </GlassButton>

  </div>
);

}
