import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({children}: AuthLayoutProps) {
  return(
    <div className="bg-background-color flex h-screen items-center justify-center">
      {children}
    </div>
  );
}