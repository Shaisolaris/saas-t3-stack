import type { Metadata } from "next";
export const metadata: Metadata = { title: "T3 SaaS", description: "T3 Stack SaaS — tRPC, Prisma, NextAuth" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>{children}</body></html>;
}
