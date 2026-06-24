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

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://code-nebula-three.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Code Nebula — GitHub Galaxy Generator",
    template: "%s | Code Nebula",
  },
  description:
    "Turn any public GitHub profile into an interactive 3D code galaxy with repo planets, Nebbi scans, and a README widget.",
  applicationName: "Code Nebula",
  keywords: [
    "Code Nebula",
    "GitHub profile",
    "GitHub README widget",
    "developer portfolio",
    "React Three Fiber",
    "Next.js",
    "3D portfolio",
    "repository visualization",
  ],
  authors: [{ name: "Said Pereyra" }],
  creator: "Said Pereyra",
  publisher: "Said Pereyra",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Code Nebula — GitHub Galaxy Generator",
    description:
      "Explore public GitHub repositories as orbiting planets in a cinematic 3D galaxy.",
    url: "/",
    siteName: "Code Nebula",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Code Nebula — GitHub Galaxy Generator",
    description:
      "Turn public GitHub repositories into an interactive 3D code galaxy.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "rMvhdrg_d7iFxBbaLuZKC57lJAlgIqCGOFkPjdVrMeE",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
