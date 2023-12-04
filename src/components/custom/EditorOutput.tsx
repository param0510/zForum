import Output, { CodeBoxOutput, LinkToolOutput } from "editorjs-react-renderer";

// import dynamic from "next/dynamic";

// Making a dynamic import for Editorjs react renderer
// const Output = dynamic(async () => (
//     (await import('editorjs-react-renderer')).default
// ), {
//     ssr: false
// })

import { FC } from "react";
import CustomImageRenderer from "../renderers/CustomImageRenderer";

interface EditorOutputProps {
  data: string;
}

const customRenderers = {
  image: CustomImageRenderer,
  code: CodeBoxOutput,
  link: LinkToolOutput,
};

const EditorOutput: FC<EditorOutputProps> = ({ data }) => {
  return (
    <div>
      <Output data={JSON.parse(data)} renderers={customRenderers} />
    </div>
  );
};

export default EditorOutput;
