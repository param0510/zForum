"use client";
import OAuthStack from "@/components/client-side/OAuthStack";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const SignInModal = () => {
  const router = useRouter();
  return (
    <div className="fixed inset-0 bg-zinc-900/40 z-10">
      <div className="container flex items-center h-full max-w-lg mx-auto">
        <div className="relative bg-emerald-400/40 w-full h-fit py-20 px-2 rounded-lg">
          <div className="absolute top-4 right-4">
            <X onClick={router.back} className="cursor-pointer" />
          </div>

          <h3>Welcome</h3>
          <div>You are agreeing to our terms by continuing.</div>
          <OAuthStack />
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
