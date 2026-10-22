// Мобильные «Вироби на замовлення» (Figma 1274:13156).

import type { Decor } from "@/app/_lib/catalog";
import { getProjects } from "@/app/_lib/content";

import { H2_L } from "../bbs/ui";
import { HeroButtons } from "./Contacts";
import MobileDecors from "./Decors";
import { MCarousel, MCta, MHero, MProjectSmallCard, MSection, MTitle } from "./ui";

/** Проекты с материалами бренда — лентой карточек 240px. */
async function BrandProjects({ brand, title }: { brand: string; title: string }) {
  const projects = await getProjects(undefined, brand);
  if (projects.length === 0) return null;
  return (
    <div className="flex w-full flex-col items-start gap-[24px]">
      <MTitle>{title}</MTitle>
      <MCarousel>
        {projects.map((p) => (
          <MProjectSmallCard key={p.href} {...p} />
        ))}
      </MCarousel>
    </div>
  );
}

export default function MobileVyroby({ decors }: { decors: Decor[][] }) {
  return (
    <>
      <MHero breadcrumb={["Головна", "Вироби на замовлення"]} bg="overlay">
        <h1 className={`text-trim w-full ${H2_L} text-white`}>
          <span className="font-semibold">Вироби з матеріалу</span> Laminam і Vicostone
        </h1>
        <HeroButtons />
      </MHero>
      <div className="contents" data-reveal>
        <MSection>
          <BrandProjects brand="laminam" title="Вироби з Laminam" />
          <BrandProjects brand="vicostone" title="Вироби з Vicostone" />
        </MSection>
        <MCta
          center
          bigText
          title="Бажаєте замовити виріб на замовлення?"
          text="Наша команда допоможе підібрати ідеальний матеріал для вашого проекту."
        />
        <MobileDecors decors={decors} buttonStart />
      </div>
    </>
  );
}
