import SettingsForm from "@/components/client-side/SettingsForm";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <div>
      <h1 className="text-5xl font-light">Profile Settings</h1>
      <SettingsForm />
    </div>
  );
};

export default page;
