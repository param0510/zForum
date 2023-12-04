import { type OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react/hooks";

export const { uploadFiles, useUploadThing } =
  generateReactHelpers<OurFileRouter>();
