import type { Metadata } from "next";
import { VT323, Press_Start_2P } from "next/font/google";
import "./globals.css";

// Old terminal font (Windows 3.1 / DOS style)
const vt323 = VT323({
  weight: "400",
  variable: "--font-terminal",
  subsets: ["latin"],
});

// Pixel font for headlines
const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CLORACLE | AI PREDICTION ORACLE",
  description: "AI-powered predictions for Polymarket events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${vt323.variable} ${pressStart.variable} antialiased bg-white`}>
        {/* Grid Background */}
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(78, 205, 196, 0.1) 2px, transparent 2px),
              linear-gradient(90deg, rgba(78, 205, 196, 0.1) 2px, transparent 2px),
              linear-gradient(rgba(255, 107, 74, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 107, 74, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px, 120px 120px, 30px 30px, 30px 30px',
            zIndex: 0
          }}
        />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
