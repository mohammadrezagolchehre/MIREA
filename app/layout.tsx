import type { Metadata } from "next";
import { EmotionProvider } from "../components/context/EmotionContext";
import BackgroundWrapper from "../components/ui/backgroundwrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "میرآ",
  description: "دستیار احساسی و ذهنی شما",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <EmotionProvider>
          <BackgroundWrapper />
          <div className="relative z-10 min-h-dvh">{children}</div>
        </EmotionProvider>
      </body>
    </html>
  );
}
