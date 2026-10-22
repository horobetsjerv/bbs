import { findProductPath } from "@/app/_lib/catalog";

/**
 * Старый адрес товара нового сайта /catalog/{brand}/{slug} → 301 на
 * /tovary/{slug}/. Паттерном в next.config.ts не выразить: публичный slug
 * при совпадении между брендами получает префикс бренда (см. publicSlugs).
 * Route handler, а не permanentRedirect(): тот отдаёт 308, а нужен 301,
 * как у остальных редиректов в next.config.ts.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ brand: string; slug: string }> },
) {
  const { brand, slug } = await params;
  const path = await findProductPath(brand, slug);
  if (!path) return new Response("Not Found", { status: 404 });
  const url = new URL(path, request.url);
  url.search = new URL(request.url).search;
  return Response.redirect(url, 301);
}
