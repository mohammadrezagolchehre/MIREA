'use client';

import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number;
};

export default function TypewriterText({ text, speed = 380 }: Props) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) return;

    const words = text.split(" ");
    let index = 0;

    setDisplayedText("");

    const typeNextWord = () => {
      if (index >= words.length) return;

      setDisplayedText(prev =>
        prev ? prev + " " + words[index] : words[index]
      );

      const currentWord = words[index];
      index++;

      
      const isSentenceEnd = /[.!؟]/.test(currentWord);
      const delay = isSentenceEnd ? 700 : speed;

      setTimeout(typeNextWord, delay);
    };

    typeNextWord();
  }, [text, speed]);

  return (
    <span>
      {displayedText}
    </span>
  );
}