import CreateCommunityClient from "@/components/client-side/CreateCommunityClient";
import { Button } from "@/components/custom/Button";
import React from "react";

const CreateCommunityPage = () => {
  return (
    <div className="container mx-auto">
      <h3>Create Community</h3>
      <section className="flex flex-col gap-2">
        <h4>Name</h4>
        <p>Community names including capitalization cannot be changed.</p>
        <CreateCommunityClient />
      </section>
    </div>
  );
};

export default CreateCommunityPage;
