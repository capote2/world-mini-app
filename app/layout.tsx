import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";

// Hemos eliminado "NextAuthProvider" porque causaba conflictos y no se usa.

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pallium",
  description: "Tu compañero seguro en World Chain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // Herramienta de depuración (solo visible en desarrollo)
  const ErudaProvider = dynamic(
    () => import("../components/Eruda").then((c) => c.ErudaProvider),
    {
      ssr: false,
    }
  );

  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Eliminamos el bloqueo de NextAuth. Ahora la app respira. */}
        <ErudaProvider>
          <MiniKitProvider>
            {children}
          </MiniKitProvider>
        </ErudaProvider>
      </body>
    </html>
  );
}
