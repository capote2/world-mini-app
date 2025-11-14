import { verifyCloudProof, IVerifyResponse, ISuccessResult } from "@worldcoin/minikit-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { payload, action, signal } = (await req.json()) as {
    payload: ISuccessResult; // <--- Aquí cambiamos IVerifyResponse por ISuccessResult
    action: string;
    signal: string;
  };

  // Tu App ID debe venir de las variables de entorno de Vercel
  const app_id = process.env.WLD_CLIENT_ID as `app_${string}`;
  const action_id = "verificar-humano";

  if (!app_id) {
    return NextResponse.json({ detail: "Falta configurar WLD_CLIENT_ID en Vercel" }, { status: 500 });
  }

  // Verificamos que la acción que envía el celular sea la correcta
  if (action !== action_id) {
     console.log(`Mismatch! Esperaba: ${action_id}, Recibí: ${action}`);
     return NextResponse.json({ detail: "Accion incorrecta" }, { status: 400 });
  }

  try {
    // Preguntamos a Worldcoin si la prueba es válida
    const verifyRes = await verifyCloudProof(
      payload,
      app_id,
      action,
      signal
    );

    if (verifyRes.success) {
      // ¡ÉXITO TOTAL! 
      return NextResponse.json({ status: 200, verifyRes });
    } else {
      // La prueba no es válida
      console.log("Error en verifyCloudProof:", verifyRes);
      return NextResponse.json(verifyRes, { status: 400 });
    }
  } catch (error) {
    console.error("Error interno:", error);
    return NextResponse.json({ detail: "Error interno del servidor" }, { status: 500 });
  }
}
