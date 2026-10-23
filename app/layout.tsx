import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "./_lib/site";

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
