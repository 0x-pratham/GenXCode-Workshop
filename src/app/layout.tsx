import type { Metadata } from "next";
import { Changa_One, Playfair_Display } from "next/font/google";
import "./globals.css";

// Configure Heading Font
const changa = Changa_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-changa",
});

// Configure Body Font
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "GenXCode Workshop",
  description: "Session management and check-in portal",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${playfair.className} ${changa.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}