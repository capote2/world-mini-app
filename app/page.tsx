"use client";

import Image from "next/image";
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

export default function Home() {
  // 1. MEMORIA: Estado para saber si el usuario está verificado y qué pestaña ve
  const [isVerified, setIsVerified] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // 2. LÓGICA: Función para iniciar la verificación
  const handleConnect = async () => {
    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit no instalado");
      return;
    }
    MiniKit.commands.verify({
      action: "verificar-humano",
      signal: "",
      // verification_level: "device" as any, // Mantenemos esto desactivado para evitar el error rojo
    });
  };

  // 3. ESCUCHA: Esperamos la respuesta de World ID
  useEffect(() => {
    if (!MiniKit.isInstalled()) return;

    MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, async (payload) => {
      if (payload.status === "error") {
        console.error("Error", payload);
      } else {
        // ¡ÉXITO! Activamos el interruptor para cambiar de pantalla
        setIsVerified(true);
      }
    });

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
    };
  }, []);

  // 4. PANTALLA B (LA APP REAL): Se muestra SOLO si isVerified es true
  if (isVerified) {
    return (
      <main className="flex min-h-screen flex-col bg-gray-50 justify-between">
        
        {/* CONTENIDO DINÁMICO */}
        <div className="flex-1 p-6 animate-fade-in">
          
          {/* Pestaña Inicio */}
          {activeTab === "home" && (
            <div className="flex flex-col items-center pt-10">
               <div className="bg-purple-100 p-4 rounded-full mb-4">
                 <Image src="/logo-pallium.png" alt="Logo" width={80} height={80} className="rounded-full" />
               </div>
               <h2 className="text-2xl font-bold text-gray-800">Hola, Humano</h2>
               <p className="text-gray-500 text-center mt-2">
                 Bienvenido al ecosistema Pallium.
               </p>
               
               <div className="mt-8 w-full grid grid-cols-2 gap-4">
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                   <h3 className="font-bold text-purple-600">Noticias</h3>
                   <p className="text-xs text-gray-400 mt-1">Sin novedades</p>
                 </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                   <h3 className="font-bold text-purple-600">Estado</h3>
                   <p className="text-xs text-green-500 mt-1">● Online</p>
                 </div>
               </div>
            </div>
          )}

          {/* Pestaña Billetera */}
          {activeTab === "wallet" && (
            <div className="pt-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Mi Billetera</h2>
              <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 rounded-3xl shadow-xl mb-6">
                <p className="text-gray-400 text-sm">Saldo Total</p>
                <h3 className="text-4xl font-bold mt-1">0.00 WLD</h3>
                <p className="text-xs text-gray-500 mt-4">Red: World Chain</p>
              </div>
            </div>
          )}

          {/* Pestaña Perfil */}
          {activeTab === "profile" && (
            <div className="pt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h2>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <span>Nivel de Verificación</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Device OK</span>
              </div>
            </div>
          )}
        </div>

        {/* MENÚ DE NAVEGACIÓN INFERIOR */}
        <div className="bg-white border-t border-gray-200 pb-8 pt-4 px-6 flex justify-around shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <button onClick={() => setActiveTab("home")} className={`flex flex-col items-center ${activeTab === "home" ? "text-purple-600" : "text-gray-400"}`}>
            <span className="text-xs mt-1 font-medium">Inicio</span>
          </button>
          <button onClick={() => setActiveTab("wallet")} className={`flex flex-col items-center ${activeTab === "wallet" ? "text-purple-600" : "text-gray-400"}`}>
            <span className="text-xs mt-1 font-medium">Billetera</span>
          </button>
          <button onClick={() => setActiveTab("profile")} className={`flex flex-col items-center ${activeTab === "profile" ? "text-purple-600" : "text-gray-400"}`}>
            <span className="text-xs mt-1 font-medium">Perfil</span>
          </button>
        </div>
      </main>
    );
  }

  // 5. PANTALLA A (LOGIN): Se muestra por defecto al inicio
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 bg-white">
      <div className="mb-8 animate-fade-in">
        <Image src="/logo-pallium.png" alt="Logo Pallium" width={200} height={200} priority className="drop-shadow-xl" />
      </div>
      <h1 className="text-5xl font-bold mb-4 text-center text-purple-600 tracking-tight">PALLIUM 2.0</h1>
      <p className="text-gray-500 text-center mb-16 text-lg font-medium max-w-xs mx-auto">
        ¡Bienvenido a Pallium, tu compañero en World Chain!
      </p>
      <button
        onClick={handleConnect}
        className="w-full max-w-xs bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-5 px-8 rounded-2xl text-xl shadow-lg transform transition-all hover:scale-105 flex items-center justify-center gap-3"
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
