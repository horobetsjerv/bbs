import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Вход в админку по паролю ADMIN_PASSWORD (страница /admin-login/).
 * В cookie лежит не пароль, а подпись от него: смена пароля в env
 * разлогинивает всех. Без ADMIN_PASSWORD админка открыта только при
 * разработке, в сборке (next start, Vercel) — закрыта.
 */
export const ADMIN_COOKIE = "bbs_admin";
export const ADMIN_LOGIN_PATH = "/admin-login/";

const token = (password: string) =>
  createHmac("sha256", password).update("bbs-admin-session").digest("hex");

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

/** Админка без пароля: только при разработке и без ADMIN_PASSWORD. */
export const adminOpen = () =>
  !process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== "production";

/** Пароль верный — значение cookie сессии, иначе null. */
export function sessionFor(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return expected && same(password, expected) ? token(expected) : null;
}

/** Cookie сессии действительна. */
export function validSession(value: string | undefined) {
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(password && value && same(value, token(password)));
}

/** Куда вернуть после входа: только внутрь админки. */
export const safeNext = (next: string | null | undefined) =>
  next && /^\/admin(?:\/|$)/.test(next) && !next.startsWith("//") ? next : "/admin/";
