import { notFound } from "next/navigation";

import { findMaterialId, getMaterial, getSimilar, materialSeo } from "@/app/_lib/catalog";
import ProductPage from "@/app/_components/product/ProductPage";
import { CATALOG_PATH } from "@/app/_lib/catalog-url";

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
  };
}

export default async function MaterialPage({ params }: { params: Params }) {
  const { slug } = await params;
  const m = await load(slug);
  if (!m) notFound();
  const similar = await getSimilar(m.id);

  const crumb = `${(m.collection?.name ?? m.brand.name).toUpperCase()}.${m.name.toUpperCase()}`;
  const techRows = Object.entries(m.techSpecs ?? {}).map(([label, value]) => ({ label, value }));

  return (
    <ProductPage
      variant="material"
      breadcrumb={["Головна", "Каталог", crumb]}
      title={m.name.toUpperCase()}
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
        { label: "Артикул", value: m.article },
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
