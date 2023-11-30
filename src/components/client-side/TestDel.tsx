"use client";

import { useSession } from "next-auth/react";
import { useRef } from "react";
import { buttonVariants } from "../custom/Button";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export default function TestDel() {
  const { data: session } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  console.log(session);
  const imgUploadFn = () => {
    if (!inputRef.current) {
      return;
    }
    console.log(inputRef.current);
    ourFileRouter.imageUploader;
  };

  const actionTest = () => {
    console.log();
  };

  return (
    <div>
      <p>Try uploading here:</p>
      <UploadButton<OurFileRouter>
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("File UPloaded successfully:", res);
        }}
        onUploadError={(e) => {
          console.log("Oops error:", e);
        }}
      />
    </div>
  );

  // other return
  return (
    <>
      <form onSubmit={actionTest} encType="multipart/form-data">
        <input
          ref={inputRef}
          type="file"
          onSelectCapture={(e) => ourFileRouter.imageUploader}
        />
        <button className={buttonVariants()} value={"submit"}>
          submit Form
        </button>{" "}
        <button
          onClick={(e) => {
            e.preventDefault();
            imgUploadFn();
          }}
        >
          submit
        </button>
      </form>
    </>
  );
}

import { UploadButton } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";
