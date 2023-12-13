"use client"; // required as 'editorjs-react-render' doesn't support ssr
import { CodeBoxOutput, LinkToolOutput } from "editorjs-react-renderer";
import { FC } from "react";
import CustomImageRenderer from "../renderers/CustomImageRenderer";
import dynamic from "next/dynamic";

// import dynamic from "next/dynamic";
// Making a dynamic import for Editorjs react renderer
// const Output = dynamic(
//   async () => (await import("editorjs-react-renderer")).default,
//   {
//     ssr: false,
//   },
// );

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false },
);

interface EditorOutputProps {
  data: any;
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
  return (
    <div>
      <Output
        data={data}
        style={style}
        className="text-sm"
        renderers={customRenderers}
      />
    </div>
  );
};

export default EditorOutput;
