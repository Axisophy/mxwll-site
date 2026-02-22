import type { Metadata } from "next";
import { neueHaasGrotesk, sabon, inputMono, fontClassNames } from "@/lib/fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "MXWLL - A digital laboratory for science, maths, and explanation design",
  description: "We make complex things visible - through interactive visualisation, illustration, and systematic design.",
  keywords: ["visualisation", "science", "mathematics", "explanation design", "interactive", "illustration"],
  authors: [{ name: "Simon Tyler" }],
  openGraph: {
    title: "MXWLL",
    description: "A digital laboratory for science, maths, and explanation design",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={fontClassNames}>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
