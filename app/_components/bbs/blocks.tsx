/* eslint-disable @next/next/no-img-element */
import {
  H2_SB,
  H3_L,
  H4_L,
  Icon,
  OutlineBtn,
  PrimaryBtn,
  SectionHeader,
  TextLink,
  inset,
} from "./ui";
import LeadFormFields, { type LeadPreset } from "./LeadFormFields";
import JsonLd, { faqLd } from "../seo/JsonLd";

/**
 * FAQ: строки 66px, соседние делят общую линию (−1px).
 * С ответами — ещё и разметка FAQPage (мобильный MFaq её не дублирует).
 */
export function FaqSection({
  title,
  questions,
  answers,
  allHref = null,
  heading = false,
}: {
  title: string;
  questions: string[];
  /** Ответы по порядку вопросов; без них строки только раскрывают шеврон. */
  answers?: string[];
  /**
   * Куда ведёт «Всі запитання». По умолчанию кнопки нет: страницы со всеми
   * вопросами нет ни в ТЗ, ни в структуре (у каждой страницы свой FAQ).
   */
  allHref?: string | null;
  /** Вопросы — заголовки h3 (в SEO-таблице помечены h3), вид тот же. */
  heading?: boolean;
}) {
  const Question = heading ? "h3" : "span";
  const ld = answers && faqLd(questions, answers);
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      {ld && <JsonLd data={ld} />}
      <SectionHeader
        title={title}
        action={
          allHref && <OutlineBtn href={allHref}>Всі запитання</OutlineBtn>
        }
      />
      <div className="flex w-full flex-col items-start">
        {questions.map((q, i) => (
          <details
            key={q}
            className="group w-full bg-white"
            style={{
              marginBottom: i < questions.length - 1 ? -1 : 0,
              boxShadow:
                "inset 0 1px 0 var(--color-light-gray), inset 0 -1px 0 var(--color-light-gray)",
            }}
          >
            <summary className="flex cursor-pointer list-none items-center gap-[10px] py-[21px] pr-[10px] pl-[20px] [&::-webkit-details-marker]:hidden">
              <Question className={`text-trim min-w-px flex-1 ${H3_L} text-ink`}>
                {q}
              </Question>
              <Icon
                src="/figma/bbs/chevron-down.svg"
                size={24}
                className="transition-transform group-open:rotate-180"
              />
            </summary>
            {answers?.[i] && (
              // pre-line: пункты списка в ответе — с новой строки.
              <p className={`pr-[54px] pb-[21px] pl-[20px] whitespace-pre-line ${H4_L} text-card-gray`}>
                {answers[i]}
              </p>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}

/** Frame 4593: серый баннер с заголовком слева и Main_cta справа. */
export function CtaBanner({
  title,
  text,
  button = "Залишити заявку",
  // Форма заявки одна — на главной (LeadForm), баннер ведёт к ней.
  href = "/#lead-form",
}: {
  title: React.ReactNode;
  /** Без текста — только заголовок (в SEO-таблице Vicostone текста нет). */
  text?: React.ReactNode;
  button?: string;
  href?: string;
}) {
  return (
    <section
      className="flex w-full items-center gap-[24px] bg-light-gray px-[71px] py-[32px]"
      style={inset("var(--color-back-card-gray)")}
    >
      <div className="flex w-[477px] shrink-0 flex-col items-start gap-[24px]">
        <h2 className={`text-trim w-full ${H2_SB} text-ink`}>{title}</h2>
        {text && <p className={`text-trim w-full ${H3_L} text-card-gray`}>{text}</p>}
      </div>
      <PrimaryBtn className="min-w-px flex-1" href={href}>
        {button}
      </PrimaryBtn>
    </section>
  );
}

/**
 * Frame 41: форма заявки — текст слева, поля и Main_cta справа.
 * `preset` — из адреса (/?lead=sample_order&material=…): кнопки карточки товара.
 * `title`/`text` — подписи экземпляра (по умолчанию — как на главной).
 */
export function LeadForm({
  preset = { formType: "feedback" },
  title = "Готові обрати ідеальну поверхню для вашого проєкту?",
  text = (
    <>
      <span className="font-semibold">Залиште заявку </span>- наші менеджери
      зв’яжуться з вами та{" "}
      <span className="font-semibold">допоможуть з вибором.</span>
    </>
  ),
}: {
  preset?: LeadPreset;
  title?: React.ReactNode;
  text?: React.ReactNode;
}) {
  return (
    // id — якорь для «Розрахувати вартість проєкта» в герое главной.
    <section
      id="lead-form"
      className="flex w-full scroll-mt-[40px] items-center gap-[24px] bg-light-gray px-[71px] py-[32px]"
    >
      <div className="flex w-[477px] shrink-0 flex-col items-start gap-[24px]">
        <h2 className={`text-trim w-full ${H2_SB} text-ink`}>{title}</h2>
        <p className={`text-trim w-full ${H3_L} text-card-gray`}>{text}</p>
        <div className="flex w-full items-center gap-[8px]">
          <Icon src="/figma/bbs/telegram.svg" size={48} />
          <TextLink weight="semibold">Зв’язатися через Telegram</TextLink>
        </div>
      </div>

      <LeadFormFields preset={preset} />
    </section>
  );
}

/** Цветной логотип Vicostone: знак и надпись вырезаны из одного спрайта (кроп из Figma). */
export function VicostoneBrandLogo() {
  return (
    <div className="flex items-center gap-[4px]">
      <div className="relative size-[40px] shrink-0 overflow-hidden">
        <img
          src="/figma/bbs/vicostone-sprite.png"
          alt=""
          aria-hidden
          className="absolute top-[-7.93%] left-[-125.63%] h-[258.22%] w-[351.98%] max-w-none"
        />
      </div>
      <div className="relative h-[32px] w-[194.667px] shrink-0 overflow-hidden">
        <img
          src="/figma/bbs/vicostone-sprite.png"
          alt="Vicostone"
          className="absolute top-[-248.29%] left-[-8.22%] h-[519.65%] w-[116.44%] max-w-none"
        />
      </div>
    </div>
  );
}

function BrandColumn({
  logo,
  text,
  link,
  href,
  spread,
}: {
  logo: React.ReactNode;
  text: React.ReactNode;
  link: string;
  href?: string;
  spread: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 flex-col items-start gap-[24px] ${spread ? "justify-between" : ""}`}
    >
      {logo}
      <p className={`text-trim w-[382px] ${H3_L} text-card-gray`}>{text}</p>
      {/* mt-auto: колонки разной длины — ссылки на одной линии. */}
      <div className={spread ? "" : "mt-auto"}>
        <TextLink href={href}>{link}</TextLink>
      </div>
    </div>
  );
}

/**
 * Frame 54: карточка брендов Laminam | Vicostone со ссылками в каталоги.
 * `title` — заголовок внутри карточки (герой главной).
 * `spread` — в короткой колонке свободное место делится между логотипом,
 * текстом и ссылкой (justify-between, «Про компанію»); без него ссылка
 * просто прижата к низу.
 */
export function BrandsPanel({
  title,
  laminam,
  vicostone,
  spread = false,
  className = "",
}: {
  title?: React.ReactNode;
  laminam: React.ReactNode;
  vicostone: React.ReactNode;
  spread?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full flex-col items-start gap-[32px] bg-light-gray px-[71px] py-[32px] ${className}`}
      style={inset("var(--color-back-card-gray)")}
    >
      {title && <h2 className={`text-trim ${H2_SB} text-ink`}>{title}</h2>}
      <div className="flex w-full items-stretch justify-between">
        <BrandColumn
          logo={<Icon src="/figma/bbs/laminam-logo.svg" width={277} height={40} />}
          text={laminam}
          link="Перейти в каталог Laminam"
          href="/kataloh/laminam/"
          spread={spread}
        />
        <div className="w-[2px] shrink-0 self-stretch bg-blue" />
        <BrandColumn
          logo={<VicostoneBrandLogo />}
          text={vicostone}
          link="Перейти в каталог Vicostone"
          href="/kataloh/kvartsovyi-kamin/"
          spread={spread}
        />
      </div>
    </div>
  );
}

/** Логотип Vicostone из двух растровых частей (знак + надпись). */
export function VicostoneLogo({ size }: { size: 20 | 40 }) {
  const big = size === 40;
  return (
    <div className={`flex items-center ${big ? "gap-[4px]" : "gap-[2px]"}`}>
      <img
        src="/figma/bbs/vicostone-mark.png"
        alt=""
        aria-hidden
        className="block shrink-0"
        style={{ width: size, height: size }}
      />
      <img
        src="/figma/bbs/vicostone-word.png"
        alt="Vicostone"
        className="block shrink-0"
        style={
          big ? { width: 194.667, height: 32 } : { width: 97.333, height: 16 }
        }
      />
    </div>
  );
}

/** Frame 43: полоса логотипов Laminam | Vicostone под фото. */
export function BrandLogosStrip() {
  return (
    <div
      className="flex w-full items-start justify-between bg-light-gray px-[71px] py-[32px]"
      style={{
        boxShadow:
          "inset 1px 0 0 var(--color-back-card-gray), inset -1px 0 0 var(--color-back-card-gray), inset 0 -1px 0 var(--color-back-card-gray)",
      }}
    >
      <div
        className="flex min-w-px flex-1 flex-col items-center"
        style={{ boxShadow: "inset -1px 0 0 var(--color-blue)" }}
      >
        <Icon src="/figma/bbs/laminam-logo-dark.svg" width={277} height={40} />
      </div>
      <div
        className="flex min-w-px flex-1 flex-col items-center"
        style={{ boxShadow: "inset 1px 0 0 var(--color-blue)" }}
      >
        <VicostoneLogo size={40} />
      </div>
    </div>
  );
}
