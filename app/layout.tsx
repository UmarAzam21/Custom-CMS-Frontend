import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// next/font khud font files load/self-host karta hai aur ek CSS variable
// (--font-jakarta) generate karta hai jo asal loaded font ko point karti hai.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FilerNow Admin CMS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // jakarta.variable class html tag pe --font-jakarta ko sahi font se link karti hai
    <html lang="en" className={jakarta.variable}>
      <body className="font-jakarta antialiased">{children}</body>
    </html>
  );
}