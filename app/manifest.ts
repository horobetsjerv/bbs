import type { MetadataRoute } from "next";

// Web App Manifest: название и иконки сайта для «На головний екран» и вкладок.
// Иконки — знак «S в стрелке» из логотипа (public/icons, app/apple-icon.png).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BBS — Laminam і Vicostone",
    short_name: "BBS",
    description:
      "Оригінальний керамограніт Laminam і кварцовий камінь Vicostone: каталог, зразки, вироби на замовлення.",
    lang: "uk",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
