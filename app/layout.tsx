// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster as SonnerToaster } from "sonner"; // Import Sonner's Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meu App com Auth",
  description: "Aplicação com autenticação",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <SonnerToaster richColors position="bottom-right" /> {/* Add SonnerToaster here */}
        </AuthProvider>
      </body>
    </html>
  );
}