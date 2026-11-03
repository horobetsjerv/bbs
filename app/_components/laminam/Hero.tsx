/* eslint-disable @next/next/no-img-element */
import {
  Breadcrumbs,
  GhostBtn,
  H1_L,
  H2_L,
  PrimaryBtn,
} from "../bbs/ui";

/** Каталог Laminam Surfaces Book (06-2025) от клиента; кнопка в герое скачивает его. */
export const LAMINAM_PDF = {
  href: "/files/laminam-surfaces-book-2025.pdf",
  name: "Laminam Surfaces Book 2025.pdf",
};

export default function Hero() {
  return (
    // min-h = низ фото (4 + 626): следующий блок отступает от фото, а не от
    // текста, иначе короткий H1 поднимал преимущества под фото.
    <section className="relative flex min-h-[630px] w-full min-w-[1280px] flex-col items-center">
      {/* Rectangle 1280×626 на 4px ниже шапки; кроп фото из Figma + затемнение 60%. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-[4px] h-[626px] overflow-hidden"
      >
        <img
          src="/figma/bbs/hero-laminam.jpg"
          alt=""
          className="absolute top-[-132.41%] left-[-1.64%] h-[470.24%] w-[174.69%] max-w-none"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative flex w-[1120px] flex-col items-start pt-[12px]">
        <Breadcrumbs items={["Головна", "Laminam"]} />

        <div className="mt-[16px] flex w-[834px] flex-col items-start gap-[40px]">
          <img
            src="/figma/bbs/laminam-logo-white.svg"
            alt="Laminam"
            width={547}
            height={79}
            className="block h-[79px] w-[547px] shrink-0"
          />
          {/* H1 из SEO-таблицы (лист «Laminam»). */}
          <h1 className={`text-trim w-full ${H1_L} text-white`}>
            Керамограніт <span className="font-semibold">Laminam</span>
          </h1>
          <div className={`text-trim w-full ${H2_L} text-caption-gray`}>
            <p>
              Laminam - італійський виробник великоформатної кераміки для
              архітектури та дизайну.
            </p>
            <p>Інновації, естетика та довговічність у кожній плиті.</p>
          </div>
          <div className="flex items-start gap-[24px]">
            <PrimaryBtn className="w-[228px] justify-start" href="/kataloh/laminam/">
              Перейти до каталогу
            </PrimaryBtn>
            <GhostBtn icon="/figma/bbs/download-white.svg" href={LAMINAM_PDF.href} download={LAMINAM_PDF.name}>
              Завантажити каталог (PDF)
            </GhostBtn>
          </div>
        </div>
      </div>
    </section>
  );
}
