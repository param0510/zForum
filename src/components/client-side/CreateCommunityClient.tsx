"use client";
import { FC, useState } from "react";
import { Button } from "../custom/Button";

interface CreateCommunityClientProps {}

const CreateCommunityClient: FC<CreateCommunityClientProps> = () => {
  const [input, setInput] = useState<string>("");
  return (
    <>
      <input
        type="text"
        className="p-2 text-black"
        placeholder="c/"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex gap-2">
        <Button variant={"subtle"}>Cancel</Button>
        <Button disabled={!!!input.trim()}>Create</Button>
      </div>
    </>
  );
};

export default CreateCommunityClient;
