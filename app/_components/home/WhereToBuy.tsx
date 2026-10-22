/* eslint-disable @next/next/no-img-element */
import { BrandLogosStrip } from "../bbs/blocks";
import { H3_L, OutlineBtn, SectionHeader } from "../bbs/ui";

export default function WhereToBuy() {
  return (
    <section className="flex w-full flex-col items-start">
      <div className="flex w-full flex-col items-start gap-[24px]">
        <SectionHeader
          title="Де купити Laminam та Vicostone в Україні"
          action={
            <OutlineBtn href="/kontakty/" className="w-[252px] justify-between">
              Детальніше про шоурум
            </OutlineBtn>
          }
        />
        {/* Здесь линия снаружи текста: фрейм 36px при тексте 35px. */}
        <div className="flex w-full items-center border-b border-light-gray">
          <p className={`text-trim min-w-px flex-1 ${H3_L} text-card-gray`}>
            Відвідайте шоурум BBS, щоб переглянути декор наживо, отримати
            консультацію та замовити матеріал!
          </p>
        </div>
        <div className="relative h-[500px] w-full">
          <img
            src="/figma/bbs/showroom.webp"
            alt="Шоурум BBS"
            className="absolute inset-0 size-full max-w-none object-fill"
          />
        </div>
      </div>
      <BrandLogosStrip />
    </section>
  );
}
