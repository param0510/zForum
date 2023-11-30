import Navbar from "@/components/server-side/Navbar";
import Providers from "@/context/providers";
import "@/styles/globals.css";

export const metadata = {
  title: "ForumZ",
  description: "An e-Forum web app similar to stack_overflow/reddit",
};

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text- bg-slate-600">
        <Providers>
          <header>
            {/* @ts-expect-error Server Component */}
            <Navbar />
          </header>
          {authModal}
          <main className="p-3">{children}</main>
          <footer></footer>
        </Providers>
      </body>
    </html>
  );
}
