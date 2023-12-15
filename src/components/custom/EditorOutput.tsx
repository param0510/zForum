"use client"; // required as 'editorjs-react-render' doesn't support ssr
import Output, { CodeBoxOutput, LinkToolOutput } from "editorjs-react-renderer";
// import { CodeBoxOutput, LinkToolOutput } from "editorjs-react-renderer";
import { FC } from "react";
import CustomImageRenderer from "../renderers/CustomImageRenderer";
import { toast } from "@/hooks/use-toast";
// import dynamic from "next/dynamic";

// const Output = dynamic(
//   async () => (await import("editorjs-react-renderer")).default,
//   { ssr: false },
// );
interface EditorOutputProps {
  data: string;
}

const customRenderers = {
  image: CustomImageRenderer,
  code: CodeBoxOutput,
  link: LinkToolOutput,
};
const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const EditorOutput: FC<EditorOutputProps> = ({ data }) => {
  var content = null;
  try {
    content = (
      <Output
        data={JSON.parse(data)}
        style={style}
        className="text-sm"
        renderers={customRenderers}
      />
    );
  } catch (error) {
    toast({
      title: "EdiorJs Oops!",
      description: "Something went wrong",
      variant: "destructive",
    });
    content = null;
  }
  return content;
};

export default EditorOutput;
