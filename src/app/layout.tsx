import Navbar from "@/components/server-side/Navbar";
import "@/styles/globals.css";

export const metadata = {
  title: "ForumZ",
  description: "An e-Forum web app similar to stack_overflow/reddit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-600 text-white">
        <header>
          <Navbar />
        </header>
        <main className="p-3">{children}</main>
        <footer></footer>
      </body>
    </html>
  );
}
