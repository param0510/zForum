import { uploadFiles, useUploadThing } from "@/lib/uploadthing";
import EditorJS from "@editorjs/editorjs";

import { FC, MutableRefObject, useCallback, useEffect } from "react";

import "@/styles/editor.css";
import { Session } from "next-auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

console.log("This is Editor.tsx");

interface EditorProps {
  // may be use this as a callback to transfer the editorRef back to the parent - Check the master code?
  // getData: () => OutputData | any | undefined;
  editorRef: MutableRefObject<{ editor: EditorJS } | undefined>;
  session: Session | null;
  router: AppRouterInstance;
}

const Editor: FC<EditorProps> = ({ editorRef, session, router }) => {
  // const editorRef = useRef<{ editor: EditorJS }>();

  // memoized the intialization func for the editor
  const initializeEditor = useCallback(async () => {
    // dynamic import instead of using -> {import HeaderTool from "@editorjs/header";} (at the top of the module)
    const HeaderTool = (await import("@editorjs/header")).default;
    const EmbedTool = (await import("@editorjs/embed")).default;
    const CodeBoxTool = (await import("@bomdi/codebox")).default;
    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "Post your content here>>>",
      tools: {
        header: {
          class: HeaderTool,
          inlineToolbar: true,
        },
        embed: EmbedTool,
        table: (await import("@editorjs/table")).default,
        link: {
          class: (await import("@editorjs/link")).default,
          config: {
            endpoint: "/api/editorjs/link",
          },
        },
        list: {
          class: (await import("@editorjs/list")).default,
          inlineToolbar: true,
        },
        image: {
          class: (await import("@editorjs/image")).default,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                try {
                  const files: File[] = [file];
                  // console.log("this is file", file);
                  // returns an array of response object for each upload in the form of a promise, so we destructure the array and just take the first one as we are only uploading 1 file
                  const [res] = await uploadFiles(files, "imageUploader");

                  if (res) {
                    // returning an object in the format acceptable by the image tool to render the image
                    return {
                      success: 1,
                      file: {
                        url: res.fileUrl,
                      },
                    };
                  }
                } catch (err) {
                  console.error("Error uploading file to Uploadthing Server");
                  if (!session) {
                    console.error("Image upload failed: Unauthorized user");
                    router.push("/sign-in");
                  }
                  return {
                    success: 0,
                    // file: {},
                  };
                }
              },
            },
          },
        },
        inlineCode: (await import("@editorjs/inline-code")).default,
        code: {
          // Basic Code Tool
          // class: (await import("@editorjs/code")).default,
          // Advanced Code Tool
          class: CodeBoxTool,
          config: {
            themeURL:
              "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/styles/dracula.min.css",
            themeName: "dracula",
            useDefaultTheme: "dark",
          },
        },
      },
      autofocus: true,
      inlineToolbar: true,
      onReady: () => {
        editorRef.current = { editor };
      },
    });
  }, []);

  useEffect(() => {
    if (editorRef.current?.editor) {
      // Editor already exists shouldn't be mounted again.
      return;
    }
    // if the editor is not mounted - initalize it
    initializeEditor();
    // destructor for useEffect
    return () => {
      // destroying the editorjs instance
      editorRef.current?.editor?.destroy();
      editorRef.current = undefined;
    };
  }, []);

  return (
    <>
      <div
        id="editorjs"
        // I defined the 'reset-preflight' class inside the tailwind.config.ts -> plugins: []
        className="reset-preflight-h1:text-3xl min-h-[300px] bg-white/10 text-black placeholder:text-emerald-500 prose-h2:text-2xl"
      />
    </>
  );
};

export default Editor;
