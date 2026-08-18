import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/admin/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: { default: "Dealer Console", template: "%s | Dealer Console" },
  robots: { index: false, follow: false },
};

/**
 * Auth gate for the whole console. Every page below this layout is a server
 * component, so an unauthenticated request never renders admin markup at all.
 */
export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
