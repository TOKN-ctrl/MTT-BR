import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MTT Bankroll Manager",
  description: "Tournament-only poker bankroll risk, logging, planning, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
