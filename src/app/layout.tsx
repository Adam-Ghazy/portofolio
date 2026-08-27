import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adam Ghazy Al Falah - Mobile, Frontend & Backend Developer",
  description: "Personal portfolio of Adam Ghazy Al Falah, a Junior Mobile, Frontend & Backend Developer specializing in Flutter, Laravel, React.js, and REST APIs with 1+ year of production experience.",
  keywords: [
    "Adam Ghazy Al Falah",
    "Flutter Developer",
    "Mobile Developer",
    "Frontend Developer",
    "Backend Developer",
    "Laravel Developer",
    "React.js Developer",
    "Indonesia Developer",
    "Madiun Developer",
    "Surabaya Developer",
    "REST API Developer",
    "Junior Software Engineer",
    "PENS Graduate",
  ],
  authors: [{ name: "Adam Ghazy Al Falah", url: "https://www.linkedin.com/in/adamghazy" }],
  creator: "Adam Ghazy Al Falah",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.linkedin.com/in/adamghazy",
    title: "Adam Ghazy Al Falah - Mobile, Frontend & Backend Developer",
    description: "Junior Mobile, Frontend & Backend Developer building practical digital solutions with Flutter, Laravel, React.js, and REST APIs.",
    siteName: "Adam Ghazy Al Falah Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Ghazy Al Falah - Mobile, Frontend & Backend Developer",
    description: "Junior Mobile, Frontend & Backend Developer building practical digital solutions with Flutter, Laravel, React.js, and REST APIs.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
