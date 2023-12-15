import OAuthStack from "@/components/client-side/OAuthStack";
import { Button } from "@/components/custom/Button";
import React from "react";

const SignInPage = () => {
  // return (
  //   <div className="absolute inset-0">
  //     <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-20">
  //       <Link
  //         href="/"
  //         className={cn(
  //           buttonVariants({ variant: "ghost" }),
  //           "-mt-20 self-start",
  //         )}
  //       >
  //         <ChevronLeft className="mr-2 h-4 w-4" />
  //         Home
  //       </Link>

  //       <SignIn />
  //     </div>
  //   </div>
  // );

  return (
    <>
      <h3>Welcome</h3>
      <div>You are agreeing to our terms by continuing.</div>
      <OAuthStack />
    </>
  );
};

export default SignInPage;
