import { notFound } from "next/navigation";

import { findMaterialId, getMaterial, getSimilar, materialSeo } from "@/app/_lib/catalog";
import ProductPage from "@/app/_components/product/ProductPage";
import { CATALOG_PATH } from "@/app/_lib/catalog-url";
import { breadcrumbLd } from "@/app/_components/seo/JsonLd";
import { OG_BASE, assetUrl, pageUrl } from "@/app/_lib/site";

// Товар: /tovary/{slug}/ — slug уникален на весь сайт (publicSlugs в catalog.ts).
type Params = Promise<{ slug: string }>;

async function load(slug: string) {
  const id = await findMaterialId(slug);
  return id === null ? null : getMaterial(id);
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const m = await load(slug);
  if (!m) return {};
  const seo = materialSeo(m);
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
    // Превью ссылки — фото декора (общая картинка сайта, если фото нет).
    openGraph: m.images[0]
      ? { ...OG_BASE, images: [{ url: assetUrl(m.images[0].full), alt: m.images[0].alt }] }
      : OG_BASE,
  };
}

export default async function MaterialPage({ params }: { params: Params }) {
  const { slug } = await params;
  const m = await load(slug);
  if (!m) notFound();
  const similar = await getSimilar(m.id);

  const crumb = `${(m.collection?.name ?? m.brand.name).toUpperCase()}.${m.name.toUpperCase()}`;
  // Одно название декора бывает в разных коллекциях (Blend / Calce Avorio) —
  // в H1 коллекция идёт перед названием, как в крошке.
  const title = (m.collection ? `${m.collection.name} ${m.name}` : m.name).toUpperCase();
  const techRows = Object.entries(m.techSpecs ?? {}).map(([label, value]) => ({ label, value }));
  const seo = materialSeo(m);
  // У Laminam артикулов в данных клиента нет: импорт кладёт в поле slug
  // (ключ повторного импорта) — такой «артикул» не показываем.
  const article = m.article !== m.slug ? m.article : null;
  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: m.collection ? `${m.collection.name} ${m.name}` : m.name,
    url: pageUrl(seo.canonical),
    description: seo.description,
    image: m.images.slice(0, 5).map((i) => assetUrl(i.full)),
    brand: { "@type": "Brand", name: m.brand.name },
    ...(article ? { sku: article } : {}),
    ...(m.typeLabel ? { category: m.typeLabel } : {}),
    ...(m.country ? { countryOfOrigin: { "@type": "Country", name: m.country } } : {}),
  };

  return (
    <ProductPage
      variant="material"
      breadcrumb={["Головна", "Каталог", crumb]}
      ld={[breadcrumbLd(["Головна", "Каталог", crumb], seo.canonical), product]}
      title={title}
      brand={m.brand.name}
      images={m.images}
      info={[
        ...(m.collection ? [{ label: "Колекція:", value: m.collection.name.toUpperCase() }] : []),
        ...(m.country ? [{ label: "Країна виробник:", value: m.country }] : []),
      ]}
      specs={[
        { label: "Доступні розміри:", values: m.sizes },
        { label: "Доступні товщини:", values: m.thicknesses },
        { label: "Фактура поверхні", values: m.surfaces },
      ]}
      applications={m.applications.map((a) => a.slug)}
      details={[
        ...(article ? [{ label: "Артикул", value: article }] : []),
        ...(m.designs.length ? [{ label: "Дизайн", value: m.designs.join(", ") }] : []),
        {
          label: "Застосування",
          value: m.applications.map((a) => a.name).join(", ") || "—",
        },
        { label: "Наявність", value: m.inStock ? "В наявності" : "Під замовлення" },
        ...techRows,
      ]}
      materialId={m.id}
      description={m.description}
      specPdfUrl={m.specPdfUrl}
      consult={{
        title: "Потрібна консультація?",
        text: "Наші менеджери допоможуть підібрати матеріал під ваш проєкт",
      }}
      similar={{
        title: "Схожі кольори",
        button: "Повернутись до каталога",
        href: CATALOG_PATH,
        cards: similar,
      }}
    />
  );
}
