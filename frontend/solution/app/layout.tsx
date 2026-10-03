import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import { AccountProvider } from "@/context/AccountContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio Dashboard",
  description: "Wealth management portfolio dashboard",
};

// The header lives here so it stays on every page.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AccountProvider>
          <Header />
          {children}
        </AccountProvider>
      </body>
    </html>
  );
}
