import EditorJS, { OutputData } from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import Code from "@editorjs/code";
import Link from "@editorjs/link";
import List from "@editorjs/list";
import Table from "@editorjs/table";

import {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "./Button";

// import "@/styles/globals.css";

interface EditorProps {
  // may be use this as a callback to transfer the editorRef back to the parent - Check the master code?
  // getData: () => OutputData | any | undefined;
  editorRef: MutableRefObject<{ editor: EditorJS } | undefined>;
}

const Editor: FC<EditorProps> = ({ editorRef }) => {
  // const editorRef = useRef<{ editor: EditorJS }>();

  // memoized the intialization func for the editor
  const initializeEditor = useCallback(() => {
    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "Post your content here>>>",
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
        },
        embed: Embed,
        table: Table,
        link: Link,
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: Image,
        // inlineCode: InlineCode,
        code: Code,
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
        className="reset-preflight-h1:text-3xl bg-white/10 text-black placeholder:text-emerald-500 prose-h2:text-2xl"
      />
    </>
  );
};

export default Editor;
