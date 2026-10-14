import type {Metadata} from "next";import "./globals.css";
export const metadata:Metadata={title:"Akshaya Centre Management",description:"Shared centre management system"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
