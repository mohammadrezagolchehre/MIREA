import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import { EmotionProvider } from "../components/context/EmotionContext";
import BackgroundWrapper from "../components/ui/backgroundwrapper";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-vazir",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="fa" >
      <body className={vazir.className}>
        <EmotionProvider>
          <BackgroundWrapper />
          {children}
        </EmotionProvider>
      </body>
    </html>
  );
}