import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CapitalLeaf - Dynamic Defense with Microservice Isolation",
  description: "Professional fintech security platform with advanced threat detection and user authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
