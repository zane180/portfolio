import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zane Luis — AI Engineer",
  description:
    "Portfolio of Zane Luis, CS student at University of Michigan building AI-powered systems. Targeting AI Engineering internships for Summer 2027.",
  keywords: ["AI Engineering", "Machine Learning", "Next.js", "FastAPI", "University of Michigan"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#06060a] text-slate-100">
        {children}
      </body>
    </html>
  );
}
