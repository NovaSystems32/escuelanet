import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EscuelaNet — Plataforma Educativa Digital",
  description: "Sistema de gestión escolar integral",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
