// Тексты подборки каталога из SEO-таблицы (app/_lib/catalog-texts.ts) под
// сеткой товаров. Макета в Figma нет (Catalog BBS / Catalog LAM заканчиваются
// подвалом), поэтому блок собран из готовых частей сайта: шапка секции и
// абзацы — как у текстовых блоков страницы Laminam, этапы — как «Співпраця»
// главной, FAQ — те же FaqSection / MFaq, что на главной и Laminam.

import type { LandingBlock, LandingSection, LandingText } from "@/app/_lib/catalog-texts";

import { FaqSection } from "../bbs/blocks";
import { H3_L, H3_SB, H4_L, MOB_L, MOB_SB, PrimaryBtn, SectionHeader } from "../bbs/ui";
import { StepList } from "../home/Cooperation";
import { MFaq, MStepList } from "../mobile/Home";
import { MSection, MTitle, mobileHref } from "../mobile/ui";

/** Кнопка «Отримати консультацію» открывает форму заявки (LeadModal). */
const CONSULT_HREF = "/#lead-form";

/** Линия сверху пункта — как у этапов «Співпраця» и таблиц сайта. */
const TOP_LINE = { boxShadow: "inset 0 1px 0 var(--color-light-gray)" };

/** Блок секции на десктопе (колонка 1120px). */
function Block({ block }: { block: LandingBlock }) {
  switch (block.kind) {
    case "text":
      return block.paragraphs.map((p) => (
        <p key={p} className={`text-trim w-full ${H3_L} text-card-gray`}>
          {p}
        </p>
      ));
    case "steps":
      return <StepList steps={block.items} />;
    case "list":
      return (
        <ul className="flex w-full flex-col items-start">
          {block.items.map((item) => (
            <li key={item} className="flex w-full py-[16px]" style={TOP_LINE}>
              <span className={`text-trim ${H3_L} text-ink`}>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "criteria": {
      // Четыре пункта — два ряда по два, иначе по три в ряд (без одинокого хвоста).
      const n = block.rows.length;
      const cols = n % 3 === 1 && n % 2 === 0 ? "grid-cols-2" : "grid-cols-3";
      return (
        <ul className={`grid w-full ${cols} gap-x-[24px] gap-y-[40px]`}>
          {block.rows.map((row) => (
            <li key={row.title} className="flex flex-col items-start gap-[16px] pt-[24px]" style={TOP_LINE}>
              <h3 className={`text-trim ${H3_SB} text-ink`}>{row.title}</h3>
              <p className={`text-trim ${H4_L} text-card-gray`}>{row.text}</p>
            </li>
          ))}
        </ul>
      );
    }
    case "specs":
      // Колонки — по сетке критериев: подпись в первой трети, значение — в двух.
      return (
        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-3 gap-x-[24px] py-[16px]" style={TOP_LINE}>
              <th className={`text-trim text-left ${H3_SB} text-ink`}>{block.head[0]}</th>
              <th className={`text-trim col-span-2 text-left ${H3_SB} text-ink`}>{block.head[1]}</th>
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.label} className="grid grid-cols-3 gap-x-[24px] py-[16px]" style={TOP_LINE}>
                <td className={`text-trim ${H3_L} text-card-gray`}>{row.label}</td>
                <td className="col-span-2 flex flex-col items-start gap-[12px]">
                  {row.value.map((v) => (
                    <span key={v} className={`text-trim ${H3_L} text-ink`}>
                      {v}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "cta":
      return <PrimaryBtn href={CONSULT_HREF}>{block.label}</PrimaryBtn>;
  }
}

/** Секция на десктопе; без заголовка — вступление листа. */
function Section({ section }: { section: LandingSection }) {
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      {section.title && <SectionHeader title={section.title} />}
      {section.blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </section>
  );
}

/** Десктоп: секции H2 по порядку листа, затем FAQ; между секциями 80px. */
export function CatalogLandingText({ text }: { text: LandingText }) {
  return (
    <div className="mt-[120px] flex w-[1120px] flex-col items-start gap-[80px]">
      {text.sections.map((s, i) => (
        <Section key={s.title ?? i} section={s} />
      ))}
      {text.faq && (
        <FaqSection
          title={text.faq.title}
          questions={text.faq.items.map((f) => f.question)}
          answers={text.faq.items.map((f) => f.answer)}
          heading
        />
      )}
      {text.closing && <Section section={text.closing} />}
    </div>
  );
}

/** Блок секции на мобилке (колонка 343px). */
function MBlock({ block }: { block: LandingBlock }) {
  switch (block.kind) {
    case "text":
      return block.paragraphs.map((p) => (
        <p key={p} className={`text-trim w-full ${MOB_L} text-card-gray`}>
          {p}
        </p>
      ));
    case "steps":
      return <MStepList steps={block.items} />;
    case "list":
      return (
        <ul className="flex w-full flex-col items-start">
          {block.items.map((item) => (
            <li key={item} className="flex w-full py-[16px]" style={TOP_LINE}>
              <span className={`text-trim ${MOB_L} text-ink`}>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "criteria":
      return (
        <ul className="flex w-full flex-col items-start">
          {block.rows.map((row) => (
            <li key={row.title} className="flex w-full flex-col items-start gap-[12px] py-[16px]" style={TOP_LINE}>
              <h3 className={`text-trim ${MOB_SB} text-ink`}>{row.title}</h3>
              <p className={`text-trim w-full ${MOB_L} text-card-gray`}>{row.text}</p>
            </li>
          ))}
        </ul>
      );
    case "specs":
      // Обычная таблица: ширину колонок считает браузер. Значения (форматы
      // плит) не переносятся — переносится подпись.
      return (
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-[16px] pr-[16px] text-left align-top" style={TOP_LINE}>
                <span className={`text-trim block ${MOB_SB} text-ink`}>{block.head[0]}</span>
              </th>
              <th className="py-[16px] text-left align-top" style={TOP_LINE}>
                <span className={`text-trim block ${MOB_SB} text-ink`}>{block.head[1]}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row) => (
              <tr key={row.label}>
                <td className="py-[16px] pr-[16px] align-top" style={TOP_LINE}>
                  <span className={`text-trim block ${MOB_L} text-card-gray`}>{row.label}</span>
                </td>
                <td className="py-[16px] align-top" style={TOP_LINE}>
                  <span className="flex flex-col items-start gap-[12px]">
                    {row.value.map((v) => (
                      <span key={v} className={`text-trim whitespace-nowrap ${MOB_L} text-ink`}>
                        {v}
                      </span>
                    ))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "cta":
      return (
        <PrimaryBtn href={mobileHref(CONSULT_HREF)} className="w-full">
          {block.label}
        </PrimaryBtn>
      );
  }
}

/** Секция на мобилке; без заголовка — вступление листа. */
function MSectionBlock({ section }: { section: LandingSection }) {
  return (
    <MSection>
      {section.title && <MTitle>{section.title}</MTitle>}
      {section.blocks.map((b, i) => (
        <MBlock key={i} block={b} />
      ))}
    </MSection>
  );
}

/** Мобилка: секции MSection с заголовком H2_mob_sb, FAQ — MFaq (серый, как на главной). */
export function MobileCatalogLandingText({ text }: { text: LandingText }) {
  return (
    <>
      {text.sections.map((s, i) => (
        <MSectionBlock key={s.title ?? i} section={s} />
      ))}
      {text.faq && (
        <MFaq
          title={text.faq.title}
          questions={text.faq.items.map((f) => f.question)}
          answers={text.faq.items.map((f) => f.answer)}
          heading
        />
      )}
      {text.closing && <MSectionBlock section={text.closing} />}
    </>
  );
}
