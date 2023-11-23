"use client";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Button } from "../custom/Button";
import { Icons } from "../custom/Icons";

const OAuthStack = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const oAuthSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: `${window.location.origin}` });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <Button className="gap-1.5" isLoading={isLoading} onClick={oAuthSignIn}>
        {/* isLoading is false - It will show the Google Icon */}
        {isLoading || <Icons.google className="h-[80%]" />}
        Sign in
      </Button>
    </div>
  );
};

export default OAuthStack;
