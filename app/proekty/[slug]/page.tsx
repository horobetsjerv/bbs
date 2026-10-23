import { notFound } from "next/navigation";

import ProductPage from "@/app/_components/product/ProductPage";
import { firstFitting } from "@/app/_lib/catalog";
import { getProject, getProjects } from "@/app/_lib/content";
import { breadcrumbLd } from "@/app/_components/seo/JsonLd";
import { OG_BASE, assetUrl } from "@/app/_lib/site";

type Params = Promise<{ slug: string }>;

/** «… з керамограніту» / «… з кварцу» в названии проекта (перед автором). */
const MATERIAL_PHRASE = / з (керамограніту|кварцу|кварцового каменю)(?=,|$)/;

/**
 * Title до 65 символов (ориентир таблицы) без «…»: сначала короче хвост,
 * потом из названия уходит материал («з керамограніту»), автор остаётся —
 * он отличает одинаковые изделия (Pietra Grey … EK Studio / … Oselya Buro).
 */
function titleFor(name: string, full: string) {
  const bare = name.replace(MATERIAL_PHRASE, "");
  return firstFitting([full, `${name} — виріб на замовлення | BBS`, `${name} | BBS`, `${bare} | BBS`], 65);
}

/** Если укороченный Title совпал с чужим — полное название: дубль хуже длины. */
async function projectTitle(name: string, full: string) {
  const own = titleFor(name, full);
  const clash = (await getProjects()).some((x) => x.title !== name && titleFor(x.title, "") === own);
  return clash ? `${name} | BBS` : own;
}

/**
 * Description до 160 символов целыми предложениями. Короткое описание
 * («Стільниця, фартух та острів з кварцу») обычно повторяет название —
 * тогда его не дублируем.
 */
function projectDescription(name: string, short: string | null, brand: string | undefined) {
  const norm = (t: string) => t.toLowerCase().replace(/\s*\d+\s*мм/g, "").trim();
  const lead = `${name} — виріб на замовлення${brand ? ` з ${brand}` : ""}.`;
  // Уточнение изделия — если влезает; иначе без него, но с хвостом.
  const leads = short && !norm(name).includes(norm(short)) ? [`${lead} ${upperFirst(short)}.`, lead] : [lead];
  return firstFitting(
    leads.flatMap((l) => [
      `${l} Фото проєкту, матеріал і характеристики. Розрахуємо вартість вашого виробу в BBS.`,
      `${l} Фото проєкту, матеріал і характеристики.`,
      `${l} Розрахуємо вартість вашого виробу в BBS.`,
      l,
    ]),
    160,
  );
}

const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** SEO-поля из админки, иначе — по шаблону в духе таблицы (Title 45–65, Description до 160). */
export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return {};
  const brand = p.material?.brand.name;
  const full = `${p.name} — виріб на замовлення${brand ? ` з ${brand}` : ""} | BBS`;
  return {
    title: p.seoTitle || (await projectTitle(p.name, full)),
    description: p.seoDescription || projectDescription(p.name, p.shortDescription, brand),
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
