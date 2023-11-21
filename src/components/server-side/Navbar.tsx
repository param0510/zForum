import { FC } from "react";
import UserAvatar from "../custom/UserAvatar";
import { Button } from "../custom/Button";
import Link from "next/link";
import { Icons } from "../custom/Icons";
interface NavbarProps {}

const Navbar: FC<NavbarProps> = ({}) => {
  return (
    <nav className="flex h-14 border-b border-b-gray-600/40 bg-slate-400/40 px-4 items-center justify-between w-full">
      <Link className="flex gap-2" href="/">
        <Icons.logo strokeWidth="2" className="text-white stroke-white" />
        <span>ForumZ</span>
      </Link>
      {/* Search Bar */}
      {/* Avatar */}
      {/* Toggle Between Sign-in/sign-up button and user_profile_avatar */}
      {true ? (
        <Button aria-label="sign-in button">
          <Link href="/sign-in">Login</Link>
        </Button>
      ) : (
        <UserAvatar imgUrl={""} />
      )}
    </nav>
  );
};

export default Navbar;
