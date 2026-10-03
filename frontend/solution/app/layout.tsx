import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import { DashboardProvider } from "@/components/providers/DashboardProvider";
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
// DashboardProvider shares the selected account, currency and data with everything inside it.
// Suspense is required because the provider reads the page URL (useSearchParams).
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Suspense>
          <DashboardProvider>
            <AccountProvider>
              <Header />
              {children}
            </AccountProvider>
          </DashboardProvider>
        </Suspense>
      </body>
    </html>
  );
}
