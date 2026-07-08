import Navbar from "../components/Navbar";
import { type ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({children}: MainLayoutProps) {

  return (
    <>
      <div className="bg-background-color h-screen">
        <header>
          <Navbar/>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-3">
          {children}
        </main>
      </div>
    </>
  )
}