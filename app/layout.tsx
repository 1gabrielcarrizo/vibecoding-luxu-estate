import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuxeEstate — Premium Real Estate",
  description:
    "Find your sanctuary with LuxeEstate. Curated luxury properties and homes for the discerning eye.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.cdnfonts.com/css/sf-pro-display"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background-light text-nordic-dark font-display antialiased selection:bg-mosque selection:text-white">
        {children}
      </body>
    </html>
  );
}
