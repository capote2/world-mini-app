"use client";

import Image from "next/image";
// CORRECCIÓN 1: Quitamos VerificationLevel de aquí porque tu versión no lo encuentra
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js";
import { useEffect } from "react";

export default function Home() {

  const handleConnect = async () => {
    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit no está instalado");
      return;
    }

    MiniKit.commands.verify({
      action: "login-action",
      signal: "",
      // CORRECCIÓN 2: Usamos "as any" para obligar al código a aceptar "device"
      // Esto elimina el error rojo y permite entrar a usuarios sin Orb.
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
        // Aquí puedes agregar una alerta visual si quieres
        alert("¡Conectado exitosamente!");
      }
    });

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-white">

      {/* 1. LOGO */}
      <div className="mb-8 animate-fade-in">
        <Image
          src="/logo-pallium.png"
          alt="Logo Pallium"
          width={200}
          height={200}
          priority
          className="drop-shadow-xl"
        />
      </div>

      {/* 2. TÍTULO */}
      <h1 className="text-5xl font-bold mb-4 text-center text-purple-600 tracking-tight">
        PALLIUM
      </h1>

      <p className="text-gray-500 text-center mb-16 text-lg font-medium max-w-xs mx-auto">
        ¡Bienvenido a Pallium, tu compañero en World Chain!
      </p>

      {/* 3. BOTÓN AXO STYLE */}
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

      <div className="absolute bottom-8 text-xs text-gray-400 font-medium">
        Powered by World Chain
      </div>

    </main>
  );
}
