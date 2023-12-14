import Navbar from "@/components/server-side/Navbar";
import { Toaster } from "@/components/shadcn-ui/Toaster";
import Providers from "@/context/providers";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

export const metadata = {
  title: "ForumZ",
  description: "An e-Forum web app similar to stack_overflow/reddit",
};

const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "light bg-white text-slate-900 antialiased",
        inter.className,
      )}
    >
      <body className="min-h-screen bg-slate-50 pt-12 antialiased">
        <Providers>
          <header>
            {/* @ts-expect-error Server Component */}
            <Navbar />
          </header>
          {authModal}
          <main className="container mx-auto h-full max-w-7xl pt-12">
            {children}
          </main>
          <footer></footer>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
