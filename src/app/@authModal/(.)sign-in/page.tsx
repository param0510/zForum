import CloseModal from "@/components/client-side/CloseModal";
import SignIn from "@/components/server-side/SignIn";
import { useRouter } from "next/navigation";

const SignInModal = () => {
  return (
    <div className="fixed inset-0 z-10 bg-zinc-900/40">
      <div className="container mx-auto flex h-full max-w-lg items-center">
        <div className="relative h-fit w-full rounded-lg bg-white px-2 py-20">
          <div className="absolute right-4 top-4">
            <CloseModal />
          </div>

          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
