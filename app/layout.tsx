import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Akshaya Centre | Management System",
  description: "A secure, shared management system for Akshaya Centre operations."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
