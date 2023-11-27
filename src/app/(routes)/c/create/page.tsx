import CreateCommunityClient from "@/components/client-side/CreateCommunityClient";
import { Button } from "@/components/custom/Button";
import React from "react";

const CreateCommunityPage = () => {
  return (
    <div className="container mx-auto">
      <h3 className="text-3xl">Create Community</h3>
      <section className="mt-2 flex flex-col gap-2">
        <h4 className="text-2xl">Name</h4>
        <p>Community names including capitalization cannot be changed.</p>
        <CreateCommunityClient />
      </section>
    </div>
  );
};

export default CreateCommunityPage;
