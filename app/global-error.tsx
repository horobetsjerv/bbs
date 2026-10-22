"use client";

import "./globals.css";

import ServerError from "./error";

/**
 * Ошибка в корневом layout: Next.js заменяет им весь документ,
 * поэтому свои <html>/<body> и глобальные стили. Вид — как у страницы 500.
 */
export default function GlobalError() {
  return (
    <html lang="uk" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <ServerError />
      </body>
    </html>
  );
}
