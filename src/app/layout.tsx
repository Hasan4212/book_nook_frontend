
import type { Metadata } from "next";
import { Josefin_Sans, Lora } from "next/font/google";
import "./globals.css"; 
import Navbar from "@/components/Navbar";


const josefinSans = Josefin_Sans({
  
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-josefin-sans",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "BookNook",
  description: "Borrow, read, return. Repeat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${josefinSans.variable} ${lora.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans"> 
 <Navbar />
        {children} 
        
      </body>
    </html>
  );
}


