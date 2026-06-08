'use client';

import MessageBubble from "./MessageBubble";
import { Message } from "../../../app/types/message";

type Props = {
  messages: Message[];
  onEdit?: (id: string, content: string) => void;
};

export default function MessageList({ messages, onEdit }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}