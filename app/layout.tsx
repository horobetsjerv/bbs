import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OG_BASE, SITE_URL } from "./_lib/site";
import { Suspense } from "react";
import NavProgress from "./_components/bbs/NavProgress";
import { PreloaderArm } from "./_components/bbs/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Title по умолчанию не задаём: у каждой страницы свой, а 404/500 ставят
  // <title> сами — иначе в <head> было бы два заголовка и браузер взял бы первый.
  description:
    "Оригінальний керамограніт Laminam і кварцовий камінь Vicostone для стільниць, фасадів, підлоги та стін. Каталог, зразки й розрахунок вартості від BBS.",
  // Превью ссылок в Telegram / Facebook / X. og:title и og:description Next
  // берёт из title / description страницы; twitter — из openGraph.
  openGraph: OG_BASE,
  twitter: { card: "summary_large_image" },
};

// Цвет панели браузера на телефоне — как белая шапка сайта.
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full motion-safe:scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <PreloaderArm />
        {/* Полоса прогресса переходов; useSearchParams требует Suspense. */}
        <Suspense>
          <NavProgress />
        </Suspense>
      </body>
    </html>
  );
}
