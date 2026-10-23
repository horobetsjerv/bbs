/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import {
  CATALOG_PATH,
  TYPE_URL,
  catalogHref,
  landingHref,
} from "@/app/_lib/catalog-url";
import { telHref } from "@/app/_lib/contacts";

import { LEAD_ANCHOR, MTelegram, mobileHref } from "../mobile/ui";
import { VicostoneLogo } from "./blocks";
import { NAVIGATION } from "./Footer";
import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";
import { H3_SB, H4_BTN, H4_L, Icon, PrimaryBtn, SwapIcon } from "./ui";

type Menu = "brands" | "catalog" | "vyroby";
type MenuLinkData = { label: string; href: string };

// Ширины пунктов зафиксированы в Figma (null — по содержимому),
// раскладка — justify-between.
// «Шоурум» — на страницу шоурума (/showroom/, как в таблице структуры).
// `menu` — выпадающая панель под шапкой (Figma Header 1072:8155).
const NAV: {
  label: string;
  width: number | null;
  arrow: boolean;
  href: string;
  menu?: Menu;
}[] = [
  { label: "Бренди", width: 73, arrow: true, href: "/laminam/", menu: "brands" },
  { label: "Каталог", width: 73, arrow: true, href: "/kataloh/", menu: "catalog" },
  {
    label: "Вироби на замовлення",
    width: 182,
    arrow: true,
    href: "/proekty/",
    menu: "vyroby",
  },
  { label: "Про компанію", width: null, arrow: true, href: "/pro-nas/" },
  { label: "Шоурум", width: null, arrow: false, href: "/showroom/" },
  { label: "Співпраця", width: null, arrow: false, href: "/spivpratsia/" },
];

const K = { type: ["keramohranit"] };
const Q = { type: ["kvarts"] };

/**
 * «Вироби на замовлення» (Variant3). Своих страниц у изделий нет — ведём в
 * подборки каталога; у проектов фильтра нет. «Ресепшн» в базе не размечен —
 * общая страница изделий (вопрос заказчику).
 */
const VYROBY: MenuLinkData[] = [
  // «Ванна кімната» в фильтрах — пункт «Умивальники»; со стільницями — пересечение.
  { label: "Стільниці у ванну", href: catalogHref({ product: ["stilnytsi"], application: ["umyvalnyky"] }) },
  { label: "Стільниці на кухню", href: catalogHref({ product: ["stilnytsi"] }) },
  { label: "Підвіконня", href: catalogHref({ product: ["pidvikonnia"] }) },
  { label: "Раковини та умивальники", href: catalogHref({ product: ["umyvalnyky"] }) },
  // «Стіни» в базе только у керамограніту — подборка совпадает со всем каталогом.
  { label: "Стінові панелі", href: catalogHref({ application: ["stiny"], ...K }) },
  { label: "Облицьовування каміна", href: catalogHref({ product: ["kaminy"] }) },
  // Сходи есть у обоих типов, поэтому без типа.
  { label: "Сходи", href: catalogHref({ application: ["skhody"] }) },
  { label: "Ресепшн", href: "/proekty/" },
  // «Столи» — применение базы вне списка ТЗ: в панели фильтров скрыто, ссылка работает.
  { label: "Обідні та журнальні столи", href: catalogHref({ application: ["stoly"] }) },
];

/** «Каталог»: разделы по типу каменя, пункты — подборки «призначення + тип». */
const CATALOG: {
  key: "keramohranit" | "kvarts";
  title: string;
  href: string;
  cols: number;
  items: MenuLinkData[];
}[] = [
  {
    key: "keramohranit",
    title: "Керамограніт",
    href: `${CATALOG_PATH}${TYPE_URL.keramohranit}/`,
    cols: 3,
    items: [
      { label: "Для стільниць та островів", href: catalogHref({ product: ["stilnytsi"], ...K }) },
      { label: "Для кухонних фартухів", href: catalogHref({ product: ["fartukhy"], ...K }) },
      { label: "Для підвіконь", href: catalogHref({ product: ["pidvikonnia"], ...K }) },
      { label: "Для фасадів", href: catalogHref({ application: ["fasad"], ...K }) },
      { label: "Для облицювання стін", href: catalogHref({ application: ["stiny"], ...K }) },
      { label: "Для камінів", href: catalogHref({ product: ["kaminy"], ...K }) },
      // Свои страницы-входы из SEO-таблицы (фильтры совпадают с другими подборками).
      { label: "Для ванної кімнати", href: landingHref("keramogranit-dlia-vannoi-kimnaty") },
      { label: "Для умивальників", href: catalogHref({ product: ["umyvalnyky"], ...K }) },
      { label: "Для підлоги", href: catalogHref({ application: ["pidloha"], ...K }) },
      { label: "Для вулиці", href: catalogHref({ application: ["vulytsia"], ...K }) },
      { label: "Для тераси", href: catalogHref({ application: ["terasa"], ...K }) },
      { label: "Для сходів", href: catalogHref({ application: ["skhody"], ...K }) },
      { label: "Для плінтуса", href: landingHref("keramogranit-dlia-plintusa") },
    ],
  },
  {
    key: "kvarts",
    title: "Кварцовий камінь",
    href: `${CATALOG_PATH}${TYPE_URL.kvarts}/`,
    cols: 1,
    items: [
      { label: "Для стільниць, островів та кухонних фартухів", href: catalogHref({ product: ["stilnytsi"], ...Q }) },
      { label: "Для підвіконь", href: catalogHref({ product: ["pidvikonnia"], ...Q }) },
      { label: "Для сходів", href: catalogHref({ ...Q, application: ["skhody"] }) },
    ],
  },
];

/**
 * Шапка сайта: десктоп (1280) и мобильная (Figma MobileHeader 1288:7547).
 * `mobile` — у страницы есть мобильная вёрстка: до 1280px (xl) показывается
 * мобильный вариант, иначе десктопный на любой ширине.
 * Без обращения к базе: телефон передаёт каркас (Page / SiteShell),
 * поэтому шапку можно показать и на странице 500.
 */
export default function Header({
  phones,
  telegram,
  mobile = false,
}: {
  phones: string[];
  telegram: string | null;
  mobile?: boolean;
}) {
  return (
    <>
      <DesktopHeader phone={phones[0]} className={mobile ? "max-xl:hidden" : ""} />
      {mobile && <MobileHeader phone={phones[0]} telegram={telegram} />}
    </>
  );
}

// Открытая панель: курсор на пункте или на самой панели (она внутри группы),
// либо фокус с клавиатуры внутри (focus-visible — клик мышью панель не держит).
const OPEN_TEXT =
  "group-hover/menu:font-semibold group-hover/menu:text-red group-has-[:focus-visible]/menu:font-semibold group-has-[:focus-visible]/menu:text-red";
// Появление — плавно: прозрачность и сдвиг на 4px за 200ms (сдвиг — только
// без prefers-reduced-motion). Закрытие с
// задержкой 150ms (visibility переключается в конце transition): курсор
// успевает наискосок дойти до панели через пустоту шапки, а панель остаётся
// наводимой и снова «ловит» hover. Открытая — над закрывающейся.
const PANEL =
  "invisible absolute inset-x-0 top-full z-[1] flex -translate-y-[4px] justify-center motion-reduce:translate-none bg-white opacity-0 shadow-[inset_0_-1px_0_var(--color-light-gray)] transition-[opacity,translate,visibility] delay-150 duration-200 ease-out group-hover/menu:visible group-hover/menu:z-[2] group-hover/menu:translate-y-0 group-hover/menu:opacity-100 group-hover/menu:delay-0 group-has-[:focus-visible]/menu:visible group-has-[:focus-visible]/menu:z-[2] group-has-[:focus-visible]/menu:translate-y-0 group-has-[:focus-visible]/menu:opacity-100 group-has-[:focus-visible]/menu:delay-0";
// Пока панель открыта, строка шапки сплошная белая и без нижней линии —
// в макете шапка с панелью один белый блок с линией снизу.
const HEADER_OPEN =
  "transition-[background-color,box-shadow] delay-150 duration-200 ease-out has-[[data-menu]:hover]:bg-white has-[[data-menu]:hover]:shadow-none has-[[data-menu]:hover]:delay-0 has-[[data-menu]_:focus-visible]:bg-white has-[[data-menu]_:focus-visible]:shadow-none has-[[data-menu]_:focus-visible]:delay-0";

function DesktopHeader({ phone, className }: { phone: string; className: string }) {
  return (
    <header
      className={`relative z-20 flex w-full min-w-[1280px] justify-center bg-white/40 shadow-[inset_0_-1px_0_var(--color-light-gray)] backdrop-blur-[19.25px] ${HEADER_OPEN} ${className}`}
    >
      <div className="flex w-[1280px] items-center px-[80px] py-[24px]">
        <div className="flex min-w-px flex-1 items-center gap-[24px]">
          <Logo />
          <nav className="flex min-w-px flex-1 items-center justify-between">
            {NAV.map((item) => {
              const width = item.width ? { width: `${item.width}px` } : undefined;
              if (!item.menu) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group flex shrink-0 items-center justify-center px-[8px] py-[14px]"
                    style={width}
                  >
                    {/* Hover по Figma (btn_header Variant2): semibold red, стрелка вниз. */}
                    {item.arrow && (
                      <SwapIcon
                        src="/figma/bbs/arrow-nav.svg"
                        hover="/figma/bbs/arrow-nav-hover.svg"
                      />
                    )}
                    <span
                      className={`text-trim whitespace-nowrap ${H4_L} text-ink group-hover:font-semibold group-hover:text-red`}
                    >
                      {item.label}
                    </span>
                  </a>
                );
              }
              return (
                // Обёртка на всю высоту шапки (−24 / +24): между пунктом и
                // панелью нет зазора, где hover бы терялся.
                <div
                  key={item.label}
                  data-menu
                  className="group/menu -my-[24px] flex shrink-0 py-[24px]"
                >
                  <a
                    href={item.href}
                    className="flex items-center justify-center px-[8px] py-[14px]"
                    style={width}
                  >
                    <SwapIcon
                      src="/figma/bbs/arrow-nav.svg"
                      hover="/figma/bbs/arrow-nav-hover.svg"
                      menu
                    />
                    <span
                      className={`text-trim whitespace-nowrap ${H4_L} text-ink ${OPEN_TEXT}`}
                    >
                      {item.label}
                    </span>
                  </a>
                  {/* Панель поверх страницы на всю ширину шапки, контент — колонка 1120. */}
                  <div className={PANEL}>
                    <div className="flex w-[1120px] pb-[24px]">
                      {item.menu === "brands" && <BrandsMenu />}
                      {item.menu === "catalog" && <CatalogMenu />}
                      {item.menu === "vyroby" && <MenuGrid items={VYROBY} cols={3} />}
                    </div>
                  </div>
                </div>
              );
            })}
            <a
              href={telHref(phone)}
              className="flex w-[164px] shrink-0 items-center justify-center px-[8px] py-[14px]"
            >
              <span
                className={`text-trim whitespace-nowrap ${H4_BTN} text-blue`}
              >
                {phone}
              </span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

/**
 * «Бренди» (Figma Variant2, инстанс полосы логотипов как BrandLogosStrip):
 * px 71 / py 32, две половины, между ними синяя линия 1 + 1px.
 */
function BrandsMenu() {
  return (
    <div className="flex w-full items-start justify-between px-[71px] py-[32px]">
      <div
        className="flex min-w-px flex-1 flex-col items-center"
        style={{ boxShadow: "inset -1px 0 0 var(--color-blue)" }}
      >
        <a href="/laminam/" aria-label="Laminam" className="block">
          <Icon src="/figma/bbs/laminam-logo-dark.svg" width={277} height={40} />
        </a>
      </div>
      <div
        className="flex min-w-px flex-1 flex-col items-center"
        style={{ boxShadow: "inset 1px 0 0 var(--color-blue)" }}
      >
        <a href="/vicostone/" className="block">
          <VicostoneLogo size={40} />
        </a>
      </div>
    </div>
  );
}

// Пункты раздела раскрываются, пока курсор на его названии или на самих
// пунктах (или фокус с клавиатуры внутри): высота 0fr → 1fr и проявление за
// 250ms. Ловят курсор только пункты открытого раздела (pointer-events),
// закрывающийся — уже нет, пока плавно гаснет. Строки статичные — их
// собирает Tailwind.
const SECTION_OPEN = {
  keramohranit:
    "group-has-[[data-sec=keramohranit]:hover]/cat:visible group-has-[[data-sec=keramohranit]:hover]/cat:grid-rows-[1fr] group-has-[[data-sec=keramohranit]:hover]/cat:opacity-100 group-has-[[data-sec=keramohranit]:hover]/cat:pointer-events-auto group-has-[[data-sec=keramohranit]:focus-visible]/cat:visible group-has-[[data-sec=keramohranit]:focus-visible]/cat:grid-rows-[1fr] group-has-[[data-sec=keramohranit]:focus-visible]/cat:opacity-100 group-has-[[data-sec=keramohranit]:focus-visible]/cat:pointer-events-auto group-has-[[data-sec=keramohranit]_:focus-visible]/cat:visible group-has-[[data-sec=keramohranit]_:focus-visible]/cat:grid-rows-[1fr] group-has-[[data-sec=keramohranit]_:focus-visible]/cat:opacity-100 group-has-[[data-sec=keramohranit]_:focus-visible]/cat:pointer-events-auto",
  kvarts:
    "group-has-[[data-sec=kvarts]:hover]/cat:visible group-has-[[data-sec=kvarts]:hover]/cat:grid-rows-[1fr] group-has-[[data-sec=kvarts]:hover]/cat:opacity-100 group-has-[[data-sec=kvarts]:hover]/cat:pointer-events-auto group-has-[[data-sec=kvarts]:focus-visible]/cat:visible group-has-[[data-sec=kvarts]:focus-visible]/cat:grid-rows-[1fr] group-has-[[data-sec=kvarts]:focus-visible]/cat:opacity-100 group-has-[[data-sec=kvarts]:focus-visible]/cat:pointer-events-auto group-has-[[data-sec=kvarts]_:focus-visible]/cat:visible group-has-[[data-sec=kvarts]_:focus-visible]/cat:grid-rows-[1fr] group-has-[[data-sec=kvarts]_:focus-visible]/cat:opacity-100 group-has-[[data-sec=kvarts]_:focus-visible]/cat:pointer-events-auto",
};
const SECTION_ACTIVE = {
  keramohranit:
    "group-has-[[data-sec=keramohranit]:hover]/cat:text-red group-has-[[data-sec=keramohranit]_:focus-visible]/cat:text-red",
  kvarts:
    "group-has-[[data-sec=kvarts]:hover]/cat:text-red group-has-[[data-sec=kvarts]_:focus-visible]/cat:text-red",
};

/**
 * «Каталог» (в макете нет, собран в стиле Variant2/3): сначала только два
 * раздела — «Керамограніт» и «Кварцовий камінь»; при наведении на раздел
 * справа за синей линией раскрываются его пункты (колонками в ряд).
 * Пункты обоих разделов лежат в одной ячейке грида — панель плавно меняет
 * высоту при смене раздела. Название раздела невидимым продолжением (after)
 * тянется вправо на всю колонку пунктов: пока они раскрываются, курсор
 * по этой строке не теряет hover. Продолжение лежит под пунктами (-z-10),
 * колонка пунктов сама курсор не ловит (pointer-events-none).
 */
function CatalogMenu() {
  return (
    <div className="group/cat flex w-full items-start">
      <ul className="flex shrink-0 flex-col">
        {CATALOG.map((s) => (
          <li key={s.key} className="flex">
            <a
              data-sec={s.key}
              href={s.href}
              className="relative flex w-full py-[14px] pr-[40px] pl-[8px] after:absolute after:inset-y-0 after:left-full after:-z-10 after:w-[calc(1120px-100%)] after:content-['']"
            >
              <span
                className={`text-trim whitespace-nowrap ${H3_SB} text-ink transition-colors duration-200 hover:text-red ${SECTION_ACTIVE[s.key]}`}
              >
                {s.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="pointer-events-none grid min-w-px flex-1">
        {CATALOG.map((s) => (
          <div
            key={s.key}
            data-sec={s.key}
            className={`invisible col-start-1 row-start-1 grid grid-rows-[0fr] opacity-0 pointer-events-none transition-[grid-template-rows,opacity,visibility] duration-250 ease-out motion-reduce:transition-[opacity,visibility] ${SECTION_OPEN[s.key]}`}
          >
            <div className="min-h-0 overflow-hidden pl-[32px] shadow-[inset_2px_0_0_var(--color-blue)]">
              <MenuGrid items={s.items} cols={s.cols} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Пункты панели — btn_header из Variant3 (px 8 / py 14, стрелка, H4 light;
 * hover — semibold red, стрелка вниз). По просьбе заказчика не столбиком,
 * а в ряд: равные колонки, порядок слева направо.
 */
function MenuGrid({ items, cols }: { items: MenuLinkData[]; cols: number }) {
  return (
    <ul
      className="grid w-full"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {items.map((l) => (
        <li key={l.label} className="flex">
          <a href={l.href} className="group flex items-center px-[8px] py-[14px]">
            <SwapIcon
              src="/figma/bbs/arrow-nav.svg"
              hover="/figma/bbs/arrow-nav-hover.svg"
            />
            <span
              className={`text-trim whitespace-nowrap ${H4_L} text-ink group-hover:font-semibold group-hover:text-red`}
            >
              {l.label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Мобильная шапка: p 16, лого 72×28 | разделитель | подпись, справа
 * Hamburger 36px (меню — HeaderMenu). Закреплена; фон сплошной белый:
 * в макете white 4% + blur, но над тёмным героем она темнела и «мигала».
 */
/** Бренды в меню — та же пара логотипов, что в шапке таблицы сравнения (Compare). */
const MENU_BRANDS: Record<string, { logo: React.ReactNode; caption: string }> = {
  Laminam: {
    logo: <Icon src="/figma/bbs/laminam-logo-sm.svg" width={138.5} height={19.983} />,
    caption: "Великоформатний керамограніт",
  },
  Vicostone: { logo: <VicostoneLogo size={20} />, caption: "Кварцовий агломерат" },
};

function MobileHeader({ phone, telegram }: { phone: string; telegram: string | null }) {
  // Пункты подвала + «Контакти» после «Про нас»: на десктопе контакты
  // открывает «Шоурум» в шапке, а на мобилке иначе до них не дойти.
  const items = NAVIGATION.flatMap((l) => {
    const link = { label: l.label, href: mobileHref(l.href) };
    return l.label === "Про нас" ? [link, { label: "Контакти", href: "/kontakty/" }] : [link];
  });

  return (
    <header
      className="sticky top-0 z-30 flex w-full items-center justify-between bg-white p-[16px] xl:hidden"
      style={{ boxShadow: "inset 0 -1px 0 var(--color-light-gray)" }}
    >
      <Link href="/" className="flex shrink-0 items-center gap-[4px]">
        <img
          src="/figma/bbs/bbs-logo.webp"
          alt="BBS"
          width={72}
          height={28}
          className="block h-[28px] w-[72px] shrink-0 object-cover"
        />
        <span className="h-[20px] w-px shrink-0 bg-[#1460ad]" />
        <span className="shrink-0 whitespace-nowrap text-[10px] font-semibold text-[#e52b34]">
          <span className="block leading-[11px]">EXCLUSIVE</span>
          <span className="block leading-[11px]">SURFACE</span>
        </span>
      </Link>
      <HeaderMenu
        brands={items.filter((l) => MENU_BRANDS[l.label]).map((l) => ({ ...l, ...MENU_BRANDS[l.label] }))}
        links={items.filter((l) => !MENU_BRANDS[l.label])}
        contacts={
          <>
            <PrimaryBtn href={`/#${LEAD_ANCHOR}`} className="w-full">
              Зв’язатися з нами
            </PrimaryBtn>
            <a href={telHref(phone)} className={`flex items-center gap-[8px] py-[12px] ${H4_BTN} text-blue`}>
              <Icon src="/figma/bbs/phone.svg" size={20} />
              <span className="text-trim whitespace-nowrap">{phone}</span>
            </a>
            <MTelegram href={telegram} arrow={false} />
          </>
        }
      />
    </header>
  );
}
