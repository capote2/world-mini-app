"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export const SignIn = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        SESIÓN INICIADA COMO  {session?.user?.name?.slice(0, 10)} <br />
        <button onClick={() => signOut()}>CERRAR SESIÓN</button>
      </>
    );
  } else {
    return (
      <>
        NO HAS INICIADO SESIÓN 
        <br />
        <button onClick={() => signIn()}>INICIAR SESIÓN</button>
      </>
    );
  }
};
