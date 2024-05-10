"use client";

// NOTE: this import preventing deployment
import { SessionProvider } from "next-auth/react";

export default function NextAuthWrapper({ children }: any) {
  return <SessionProvider>{children}</SessionProvider>;
}
