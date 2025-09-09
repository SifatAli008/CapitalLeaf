import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CapitalLeaf - Zero Trust Security Framework",
  description: "Professional fintech security platform with Zero Trust Access Control",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 20'%3E%3Ctext x='5' y='15' font-family='Arial' font-size='14' fill='%234a5568'%3ECapital%3C/text%3E%3Ctext x='45' y='15' font-family='Brush Script MT' font-size='14' fill='%233182ce'%3ELeaf%3C/text%3E%3C/svg%3E"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
