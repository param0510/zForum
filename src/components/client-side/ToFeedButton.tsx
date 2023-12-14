"use client";

import { ChevronLeft, Home, School2, Tv } from "lucide-react";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../custom/Button";

const ToFeedButton = () => {
  const pathname = usePathname();

  // if path is /c/view/mycomName, turn into /
  // if path is /c/view/mycomName/post/view?info=cligad6jf0003uhest4qqkeco, turn into /c/view/mycomName

  const subredditPath = getSubredditPath(pathname);

  return (
    <a href={subredditPath} className={buttonVariants({ variant: "ghost" })}>
      <ChevronLeft className="mr-1 h-4 w-4" />
      {subredditPath === "/" ? (
        <>
          Home
          <Home className="ml-1 h-4 w-4" />
        </>
      ) : (
        <>
          Community
          <Tv className="ml-1 h-4 w-4" />
        </>
      )}
    </a>
  );
};

const getSubredditPath = (pathname: string) => {
  const splitPath = pathname.split("/");

  if (splitPath.length === 4) return "/";
  else if (splitPath.length > 4)
    return `/${splitPath[1]}/${splitPath[2]}/${splitPath[3]}`;
  // default path, in case pathname does not match expected format
  else return "/";
};

export default ToFeedButton;
