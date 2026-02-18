'use client';
import OptionChips from "./OptionChips";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

type Props = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

export default function ChatContainer({ messages, setMessages }: Props) {

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        text: "این پاسخ شبیه‌سازی AI است.",
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full">

      
      <div className="flex-1 overflow-y-auto px-4 py-6 ">
        <MessageList messages={messages} />
      </div>

      
      <div className="border-t border-white/20 backdrop-blur-md p-4 shrink-0">
        
        {messages.length === 0 && (
          <div className="mb-4">
            <OptionChips onSelect={handleSend} />
          </div>
        )}

        <MessageInput onSend={handleSend} />
      </div>



    </div>
  );
}
