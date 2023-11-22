import Navbar from "@/components/server-side/Navbar";
import Providers from "@/context/providers";
import "@/styles/globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

export const metadata = {
  title: "ForumZ",
  description: "An e-Forum web app similar to stack_overflow/reddit",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="bg-slate-600 text-white">
        <Providers>
          <header>
            {/* @ts-expect-error Server Component */}
            <Navbar />
          </header>
          <main className="p-3">{children}</main>
          <footer></footer>
        </Providers>
      </body>
    </html>
  );
}
