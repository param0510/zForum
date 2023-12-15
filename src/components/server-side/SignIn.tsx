import OAuthStack from "../client-side/OAuthStack";
import { Icons } from "../custom/Icons";

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mx-auto max-w-xs text-sm">
          By continuing, you are setting up a ForumZ account and agree to our
          User Agreement and Privacy Policy.
        </p>
      </div>
      <OAuthStack />

      {/* <p className="px-8 text-center text-sm text-muted-foreground">
            New to Breaddit?{" "}
            <Link
              href="/sign-up"
              className="hover:text-brand text-sm underline underline-offset-4"
            >
              Sign Up
            </Link>
          </p> */}
    </div>
  );
};

export default SignIn;
