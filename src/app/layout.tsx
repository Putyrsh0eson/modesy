import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ModesyProvider } from "@/context/ModesyContext";
import { SiteShell } from "@/components/layout/SiteShell";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Home - Modesy - Marketplace - Classified Ads Script",
  description: "Modesy Marketplace and Classified Ads Platform",
  icons: {
    icon: "/sites/modesy/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${openSans.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8f9fa] text-[#222222]">
        <ModesyProvider>
          <SiteShell>{children}</SiteShell>
        </ModesyProvider>
      </body>
    </html>
  );
}
