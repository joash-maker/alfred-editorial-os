import type { Metadata } from "next";
import "./globals.css";
import BackToTop from "../components/BackToTop";

export const metadata: Metadata = {
  title: "Alfred OS",
  description: "Mediahubink operating system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
