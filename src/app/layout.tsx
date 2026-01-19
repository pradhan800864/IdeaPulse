import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Assuming Inter using google fonts
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

import { cn } from "@/lib/utils";

// If using google fonts, we'd normally configure it.
// Assuming next/font is ok to use without configuring Google API Key (it is).
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "IdeaPulse",
    description: "Startup ideas aggregator dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
                <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                    <div className="hidden border-r bg-muted/40 md:block">
                        <Sidebar />
                    </div>
                    <div className="flex flex-col">
                        <Header />
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}
