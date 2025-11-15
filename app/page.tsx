import Image from "next/image";
import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      <Image
        src="/logo-pallium.png"
        alt="Logo Pallium"
        width={150}
        height={150}
        priority
      />
      <h1 className="text-2xl font-bold mb-4">Mi Primera Mini App</h1>
      <SignIn />
      <VerifyBlock />
      <PayBlock />
    </main>
  );
}
