import { getServerAuthSession } from "@/lib/auth";
import Link from "next/link";
import SearchBar from "../client-side/SearchBar";
import UserAccountNav from "../client-side/UserAccountNav";
import { buttonVariants } from "../custom/Button";
import { Icons } from "../custom/Icons";

const Navbar = async () => {
  const session = await getServerAuthSession();
  return (
    <nav className="fixed inset-x-0 top-0 z-[10] h-fit border-b border-zinc-300 bg-zinc-100 py-2">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        <Link className="flex items-center gap-2" href="/">
          <Icons.logo className="h-8 w-8 stroke-black sm:h-6 sm:w-6" />
          <p className="hidden text-sm font-medium text-zinc-700 md:block">
            ForumZ
          </p>
        </Link>
        {/* Search Bar */}
        <SearchBar />
        {/* Toggle Between Sign-in/sign-up button and user_profile_avatar */}
        {session ? (
          /* Avatar */
          <UserAccountNav
            user={{
              email: session.user.email ?? null,
              name: session.user.name ?? null,
              image: session.user.image ?? null,
            }}
          />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
