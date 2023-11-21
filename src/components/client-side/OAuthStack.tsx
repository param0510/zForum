"use client";

import { Button } from "../custom/Button";
import { Icons } from "../custom/Icons";

const OAuthStack = () => {
  return (
    <div className="flex flex-col gap-2">
      <Button className="gap-1.5" onClick={() => console.log("google works")}>
        <Icons.google className="h-[80%]" /> Sign in
      </Button>
    </div>
  );
};

export default OAuthStack;
