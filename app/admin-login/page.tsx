import type { Metadata } from "next";

import { safeNext } from "@/app/_lib/admin-auth";

import "../admin/admin.css";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Вхід — BBS адмін-панель",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin-login">) {
  const { next } = await searchParams;
  return <LoginForm next={safeNext(typeof next === "string" ? next : null)} />;
}
