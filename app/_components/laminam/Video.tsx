/* eslint-disable @next/next/no-img-element */
import { H3_L, Icon, OutlineBtn, SectionHeader } from "../bbs/ui";

/** Шоурум на Google Maps: на телефоне открывается приложение карт. */
const SHOWROOM_MAP = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "вул. Василя Тютюнника, 51/1А, Київ",
)}`;

export default function Video() {
  return (
    <section className="relative flex w-full flex-col items-start gap-[24px]">
      <SectionHeader
        title="Відео з виробництва"
        action={
          <OutlineBtn href={SHOWROOM_MAP} newTab>
            Шоурум у м. <span className="font-medium">Київ</span>, вул. Василя
            Тютюнника 51/1А
          </OutlineBtn>
        }
      />
      <div className="relative h-[500px] w-full">
        <img
          src="/figma/bbs/video.webp"
          alt=""
          className="absolute inset-0 size-full max-w-none object-fill"
        />
        <div className="absolute inset-0 bg-[rgba(249,249,249,0.2)]" />
      </div>
      <p className={`text-trim w-full ${H3_L} text-ink`}>
        Кераміка Laminam - це інновації, технології та дизайн у кожній деталі.
      </p>
      <button
        type="button"
        aria-label="Відтворити відео"
        className="absolute top-[322px] left-1/2 -translate-x-1/2 cursor-pointer"
      >
        <Icon src="/figma/bbs/play-outline.svg" size={48} />
      </button>
    </section>
  );
}
