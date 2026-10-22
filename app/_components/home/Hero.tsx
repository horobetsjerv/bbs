/* eslint-disable @next/next/no-img-element */
import { BrandsPanel } from "../bbs/blocks";
import { GhostBtn, H1_SB, H2_L, PrimaryBtn } from "../bbs/ui";

// «Два бренди — два рішення» из SEO-таблицы (лист «Головна»).
export const BRANDS_TITLE = "Два бренди — два рішення";
export const BRAND_COPY = {
  laminam:
    "Laminam — тонкий великоформатний керамограніт товщиною від 3 до 20 мм. Застосовують для облицювання стін і підлоги, виготовлення стільниць та фасадів. Матеріал має низьке водопоглинання, стійкий до високих температур, подряпин і впливу побутової хімії, тому підходить для різних типів поверхонь.",
  vicostone:
    "Vicostone — кварцовий агломерат, виготовлений методом вібропресування у вакуумі. Використовують для кухонних і ванних стільниць, підвіконь, сходів та інших поверхонь. Матеріал має непористу структуру, тому не вбирає рідини, стійкий до плям, подряпин і повсякденного механічного навантаження.",
};

/** Герой главной + карточка брендов (Frame 54), наезжающая на фото. */
export default function Hero() {
  return (
    <section className="relative flex w-full min-w-[1280px] flex-col items-center">
      {/* Rectangle: фото 626px, начинается на 4px ниже шапки, затемнение 60%.
          Файл уже в пропорциях кадра из Figma (1280×626); шире — обрезка по центру. */}
      <div className="absolute inset-x-0 top-[4px] h-[626px] overflow-hidden">
        <img
          src="/figma/bbs/hero-main.webp"
          alt=""
          aria-hidden
          className="absolute inset-0 size-full max-w-none object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative flex w-[1120px] flex-col items-start pt-[76px]">
        <div className="flex w-[833px] flex-col items-start gap-[40px]">
          <h1 className={`text-trim w-full ${H1_SB} text-white`}>
            <span className="font-light">Штучний камінь </span>
            Laminam <span className="font-light">та </span>
            Vicostone<span className="font-light"> в Україні</span>
          </h1>
          <p className={`text-trim w-full ${H2_L} text-caption-gray`}>
            Оригінальні керамічні та кварцові поверхні для стільниць, меблів,
            підлоги, стін і фасадів.
          </p>
          <div className="flex items-start gap-[24px]">
            <PrimaryBtn href="/kataloh/" className="w-[228px] justify-start">
              Переглянути каталог
            </PrimaryBtn>
            <GhostBtn href="#lead-form" icon="/figma/bbs/calculator.svg">
              Розрахувати вартість проєкта
            </GhostBtn>
          </div>
        </div>

        <BrandsPanel
          className="mt-[60px]"
          title={BRANDS_TITLE}
          laminam={BRAND_COPY.laminam}
          vicostone={BRAND_COPY.vicostone}
        />
      </div>
    </section>
  );
}
