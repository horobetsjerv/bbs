"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_COOKIE, safeNext, sessionFor } from "@/app/_lib/admin-auth";

export type LoginState = { error: string | null };

/** Проверка пароля: верный — cookie сессии на 30 дней и обратно в админку. */
export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const session = sessionFor(String(form.get("password") ?? ""));
  if (!session) {
    return {
      error: process.env.ADMIN_PASSWORD ? "Невірний пароль" : "Пароль адмінки не налаштовано",
    };
  }
  (await cookies()).set(ADMIN_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(safeNext(String(form.get("next") ?? "")));
}
