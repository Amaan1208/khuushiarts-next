import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import CircleTransitionProvider from "./components/CircleTransition";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "KhuushiArts — The Floating Gallery",
  description: "An interactive 3D floating art gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full bg-[#ede0c4] text-[#2C2520]">
        <CircleTransitionProvider>{children}</CircleTransitionProvider>
      </body>
    </html>
  );
}
