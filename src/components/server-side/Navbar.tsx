import { getServerAuthSession } from "@/lib/auth";
import Link from "next/link";
import UserAccountNav from "../client-side/UserAccountNav";
import { buttonVariants } from "../custom/Button";
import { Icons } from "../custom/Icons";
import SearchBar from "../client-side/SearchBar";

const Navbar = async () => {
  const session = await getServerAuthSession();
  return (
    <nav className="flex h-14 w-full items-center justify-between border-b border-b-gray-600/40 bg-slate-400/40 px-4">
      <Link className="flex gap-2" href="/">
        <Icons.logo strokeWidth="2" className="stroke-white text-white" />
        <span>ForumZ</span>
      </Link>
      {/* Search Bar */}
      <SearchBar />
      {/* Toggle Between Sign-in/sign-up button and user_profile_avatar */}
      {session ? (
        /* Avatar */
        <UserAccountNav session={session} />
      ) : (
        <Link href="/sign-in" className={buttonVariants()}>
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
