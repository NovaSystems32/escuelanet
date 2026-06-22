import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instituto Santiago Ramón y Cajal — EscuelaNet",
  description: "Plataforma Educativa Digital · Educamos hoy, formamos el mañana",
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
