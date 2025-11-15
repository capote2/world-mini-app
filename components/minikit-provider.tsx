"use client"; // Required for Next.js

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install("app_20a69bf928da734a591cc3df47f9674a"); // ID Actualizado
    console.log(MiniKit.isInstalled());
  }, []);

  return <>{children}</>;
}
