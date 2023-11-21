import OAuthStack from "@/components/client-side/OAuthStack";
import { Button } from "@/components/custom/Button";
import React from "react";

const SignIn = () => {
  return (
    <>
      <h3>Welcome</h3>
      <div>You are agreeing to our terms by continuing.</div>
      <OAuthStack />
    </>
  );
};

export default SignIn;
