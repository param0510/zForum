import CreateCommunityClient from "@/components/client-side/CreateCommunityClient";
import { db } from "@/lib/db";

const CreateCommunityPage = async () => {
  const existingCommunities = await db.community.findMany({
    select: {
      name: true,
    },
  });
  return (
    <CreateCommunityClient
      existingCommunityNames={existingCommunities.map(({ name }) => name)}
    />
  );
};

export default CreateCommunityPage;
