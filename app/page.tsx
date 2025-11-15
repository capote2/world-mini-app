"use client";

import Image from "next/image";
import { MiniKit, ResponseEvent } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

export default function Home() {
  // 1. MEMORIA: Estados para la verificación y la navegación
  const [isVerified, setIsVerified] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // 2. LÓGICA CON DIAGNÓSTICO: Alertas para saber qué pasa
  const handleConnect = async () => {
    // Alerta 1: Confirmamos que el clic funciona
    alert("1. ¡Botón presionado!");

    if (!MiniKit.isInstalled()) {
      // Alerta 2: Error de entorno
      alert("2. ERROR: MiniKit no detectado. ¿Estás en World App?");
      return;
    }

    // Alerta 3: Todo listo para enviar comando
    alert("3. MiniKit detectado. Enviando comando verificar...");

    try {
      MiniKit.commands.verify({
        action: "verificar-humano",
        signal: "",
        // verification_level: "device" as any, // Dejamos esto comentado por seguridad
      });
    } catch (error) {
      alert("4. Error grave al enviar comando: " + JSON.stringify(error));
    }
  };

  // 3. ESCUCHA: Esperamos la respuesta de World ID
  useEffect(() => {
    if (!MiniKit.isInstalled()) return;

    MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, async (payload) => {
      if (payload.status === "error") {
        console.error("Error", payload);
        alert("Error en la verificación: " + JSON.stringify(payload));
      } else {
        // ¡ÉXITO! Cambiamos la pantalla
        setIsVerified(true);
      }
    });

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
    };
  }, []);

  // 4. PANTALLA B (BILLETERA): Se muestra si isVerified es true
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
               <p className="text-gray-500 text-center mt-2">Bienvenido al ecosistema Pallium.</p>
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

        {/* MENÚ INFERIOR */}
        <div className="bg-white border-t border-gray-200 pb-8 pt-4 px-6 flex justify-around shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <button onClick={() => setActiveTab("home")} className={`flex flex-col items-center ${activeTab === "home" ? "text-purple-600" : "text-gray-400"}`}><span className="text-xs mt-1 font-medium">Inicio</span></button>
          <button onClick={() => setActiveTab("wallet")} className={`flex flex-col items-center ${activeTab === "wallet" ? "text-purple-600" : "text-gray-400"}`}><span className="text-xs mt-1 font-medium">Billetera</span></button>
          <button onClick={() => setActiveTab("profile")} className={`flex flex-col items-center ${activeTab === "profile" ? "text-purple-600" : "text-gray-400"}`}><span className="text-xs mt-1 font-medium">Perfil</span></button>
        </div>
      </main>
    );
  }

  // 5. PANTALLA A (LOGIN): Pantalla inicial
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
        Conectar Billetera
      </button>
      <div className="absolute bottom-8 text-xs text-gray-400 font-medium">Powered by World Chain</div>
    </main>
  );
}
