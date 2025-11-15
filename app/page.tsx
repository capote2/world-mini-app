"use client";

import Image from "next/image";
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);

  const handleConnect = async () => {
    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit no instalado");
      return;
    }

    MiniKit.commands.verify({
      action: "verificar-humano", // <--- ¡CORREGIDO! Ahora sí coincide con tu portal.
      signal: "",
      verification_level: "device" as any,
    });
  };

  useEffect(() => {
    if (!MiniKit.isInstalled()) return;

    MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, async (payload) => {
      if (payload.status === "error") {
        console.error("Error en verificación", payload);
      } else {
        console.log("¡Verificación Exitosa!", payload);
        // Al recibir el éxito, cambiamos la pantalla
        setIsVerified(true);
      }
    });

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
    };
  }, []);

  // --- PANTALLA DE BIENVENIDA (DASHBOARD) ---
  if (isVerified) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center animate-fade-in">
          <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            {/* Icono de Palomita */}
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Acceso Concedido!</h2>
          <p className="text-gray-500 mb-8">Bienvenido al panel de control de Pallium.</p>
          
          <button className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold shadow-md hover:bg-purple-700 transition-all">
            Entrar al Mercado
          </button>
        </div>
      </main>
    );
  }

  // --- PANTALLA DE INICIO (LOGIN) ---
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-white">
      <div className="mb-8 animate-fade-in">
        <Image src="/logo-pallium.png" alt="Logo Pallium" width={200} height={200} priority className="drop-shadow-xl" />
      </div>
      <h1 className="text-5xl font-bold mb-4 text-center text-purple-600 tracking-tight">PALLIUM</h1>
      <p className="text-gray-500 text-center mb-16 text-lg font-medium max-w-xs mx-auto">
        ¡Bienvenido a Pallium, tu compañero en World Chain!
      </p>
      <button
        onClick={handleConnect}
        className="w-full max-w-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-5 px-8 rounded-2xl text-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <path d="M21 15H16C15.4477 15 15 15.4477 15 16V18C15 18.5523 15.4477 19 16 19H21C21.5523 19 22 18.5523 22 18V16C22 15.4477 21.5523 15 21 15Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="2"/>
        </svg>
        Conectar Billetera
      </button>
      <div className="absolute bottom-8 text-xs text-gray-400 font-medium">Powered by World Chain</div>
    </main>
  );
}
