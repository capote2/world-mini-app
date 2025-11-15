"use client";
import {
  MiniKit,
  VerificationLevel,
  MiniAppVerifyActionErrorPayload,
  IVerifyResponse,
} from "@worldcoin/minikit-js";
import { useCallback, useState } from "react";

export type VerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel;
};

const verifyPayload: VerifyCommandInput = {
  action: "verificar-humano",
  signal: "",
  verification_level: VerificationLevel.Orb,
};

export const VerifyBlock = () => {
  const [handleVerifyResponse, setHandleVerifyResponse] = useState<
    MiniAppVerifyActionErrorPayload | IVerifyResponse | null
  >(null);

  const handleVerify = useCallback(async () => {
    

    // --- 2. MODO REAL (Para la App) ---
    const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

    // Manejo de errores reales
    if (finalPayload.status === "error") {
      console.log("Command error");
      console.log(finalPayload);
      setHandleVerifyResponse(finalPayload);
      return finalPayload;
    }

    // Verificar la prueba en el backend (opcional)
    const verifyResponse = await fetch("/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: finalPayload,
        action: verifyPayload.action,
        signal: verifyPayload.signal,
      }),
    });

    const verifyResponseJson = await verifyResponse.json();

    if (verifyResponseJson.status === 200) {
      console.log("Verification success!");
      console.log(finalPayload);
    }

    setHandleVerifyResponse(verifyResponseJson);
    return verifyResponseJson;
  }, []);

  return (
    <div>
      <h1>VERIFICAR IDENTIDAD</h1>
      <button className="bg-green-500 p-4" onClick={handleVerify}>
        VERIFICAR QUE SOY HUMANO
      </button>
      {/* Aquí mostramos el resultado si existe */}
      {handleVerifyResponse && (
        <div className="mt-4 p-2 bg-gray-800 text-white text-xs break-all rounded">
          <p>Estado: {(handleVerifyResponse as any).status}</p>
          {/* <pre>{JSON.stringify(handleVerifyResponse, null, 2)}</pre> */}
        </div>
      )}
    </div>
  );
}