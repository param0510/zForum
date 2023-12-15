"use client";

import { toast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "../custom/Button";
import { Icons } from "../custom/Icons";

const OAuthStack = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const oAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider);
    } catch (err) {
      toast({
        title: "Error",
        description: `There was an error logging in with ${provider}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Button
        className="w-full"
        disabled={isLoading}
        isLoading={isLoading}
        onClick={() => oAuthSignIn("google")}
        type="button"
        size="sm"
      >
        {/* isLoading is false - It will show the Google Icon */}
        {isLoading || <Icons.google className="mr-2 h-4 w-4" />}
        Google
      </Button>
    </div>
  );
};

export default OAuthStack;
