"use client";
import { useRef } from "react";
import { Button } from "../custom/Button";
import Editor from "../custom/Editor";
import EditorJS from "@editorjs/editorjs";
import axios from "axios";

export const CreatePost = () => {
  const editorRef = useRef<{ editor: EditorJS }>();

  const getData = () => {
    return editorRef.current?.editor
      ?.save()
      .then((data) => console.log(data))
      .catch((e) => console.log(e));
  };
  const getMeta = async () => {
    const resp = await axios.get("/api/editorjs/link");
  };
  return (
    <>
      <textarea
        className="bg-zinc-700 text-3xl"
        rows={1}
        placeholder="Post Title"
      ></textarea>
      <Editor editorRef={editorRef} />
      <Button onClick={() => getData()}>Post</Button>
      <Button onClick={() => getMeta()}>get meta</Button>
    </>
  );
};
