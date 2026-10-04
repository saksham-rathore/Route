import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Route — Understand your website",
  description:
    "Privacy-first website analytics for understanding traffic, behavior, conversion and revenue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}