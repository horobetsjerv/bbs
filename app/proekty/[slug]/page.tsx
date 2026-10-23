import { notFound } from "next/navigation";

import ProductPage from "@/app/_components/product/ProductPage";
import { clampText } from "@/app/_lib/catalog";
import { getProject, getProjects } from "@/app/_lib/content";
import { breadcrumbLd } from "@/app/_components/seo/JsonLd";
import { OG_BASE, assetUrl } from "@/app/_lib/site";

type Params = Promise<{ slug: string }>;

/**
 * Title до 65 символов (ориентир таблицы): укорачиваем хвост, потом название.
 * Обрезка не должна склеивать разные проекты (Pietra Grey … EK Studio /
 * … Oselya Buro) — тогда оставляем полное название, дубль Title хуже длины.
 */
async function projectTitle(name: string, full: string) {
  const fit = [full, `${name} — виріб на замовлення | BBS`, `${name} | BBS`].find((t) => t.length <= 65);
  if (fit) return fit;
  const short = (n: string) => `${clampText(n, 59)} | BBS`;
  const clash = (await getProjects()).some((x) => x.title !== name && short(x.title) === short(name));
  return clash ? `${name} | BBS` : short(name);
}

/** SEO-поля из админки, иначе — по шаблону в духе таблицы (Title 45–65, Description до 160). */
export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return {};
  const brand = p.material?.brand.name;
  const full = `${p.name} — виріб на замовлення${brand ? ` з ${brand}` : ""} | BBS`;
  const materials = p.materials.map((m) => m.name).join(", ");
  return {
    title: p.seoTitle || (await projectTitle(p.name, full)),
    description:
      p.seoDescription ||
      clampText(
        `${p.name}${p.shortDescription ? `, ${p.shortDescription}` : ""} — виріб на замовлення${materials ? ` з ${materials}` : ""}. Фото проєкту, матеріал і характеристики. Розрахуємо вартість вашого виробу в BBS.`,
        160,
      ),
    alternates: { canonical: `/proekty/${slug}/` },
    // Превью ссылки — первое фото проекта.
    openGraph: p.images[0]?.full
      ? { ...OG_BASE, images: [{ url: assetUrl(p.images[0].full), alt: p.name }] }
      : OG_BASE,
  };
}

/** Изделие (проект из админки): фото проекта, характеристики его материала. */
export default async function VyribPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();
  const m = p.material;

  return (
    <ProductPage
      variant="item"
      breadcrumb={["Головна", "Вироби на замовлення", p.name]}
      ld={[breadcrumbLd(["Головна", "Вироби на замовлення", p.name], `/proekty/${slug}/`)]}
      title={p.name}
      brand={m?.brand.name ?? ""}
      images={p.images}
      // Макет 1039:7133: под галереей строки материала проекта, ниже — авторы.
      info={[
        { label: "Назва:", value: m?.name ?? "" },
        // Короткое описание — «что сделано» («Стільниця + фартух з кварцу»); без него — теги.
        { label: "Тип виробу:", value: p.shortDescription || p.tags.join(", ") },
        { label: "Бренд:", value: m?.brand.name ?? "" },
        { label: "Найменування:", value: m?.article ?? "" },
      ]
        .filter((r) => r.value)
        // Авторы из .txt клиента («Вказати меблевиків!»): ссылки на Instagram.
        .concat(p.credits)}
      specs={[]}
      applications={[]}
      details={[]}
      materialId={m?.id}
      consult={{
        title: "Бажаєте замовити ?",
        text: "Наші менеджери допоможуть та зорієнтують під ваш проєкт",
      }}
      similar={{
        title: "Схожі вироби",
        button: "Повернутись до виробів на замовлення",
        href: "/proekty/",
        projects: p.similar,
      }}
    />
  );
}
