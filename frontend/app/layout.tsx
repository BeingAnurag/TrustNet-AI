import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrustNet AI",
  description: "AI-powered answer evaluation and hallucination detection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
