import type { Metadata } from "next";
import { AdminShell } from "./AdminShell";
import "./admin.css";

// Админка всегда показывает актуальные данные: прекомпиляция здесь только вредит.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BBS — адмін-панель",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
