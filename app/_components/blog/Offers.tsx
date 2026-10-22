/* eslint-disable @next/next/no-img-element */
import {
  H2_SB,
  H4_BTN,
  H4_L,
  OutlineBtn,
  SectionHeader,
  SwapIcon,
  inset,
} from "../bbs/ui";

const OFFERS = [
  {
    title: "Обрати матеріал",
    text: "Понад 400 декорів каменю, керамічних плит та HPL-плит стабільно підтримуються на складах у великому обсязі. Решту доставимо швидко під замовлення.",
    button: "Перейти до каталогу",
    href: "/kataloh/",
    backgrounds: ["/figma/bbs/offer-bg-1.png"],
    dark: true,
  },
  {
    title: "Замовити виріб",
    text: "Наші партнери зроблять стільницю, раковину, підвіконня, сходи, інші вироби з каменю і керамічних плит за проєктом будь-якої складності у будь-якій точці України",
    button: "Перейти до виробів на замовлення",
    href: "/proekty/",
    backgrounds: ["/figma/bbs/offer-bg-1.png", "/figma/bbs/offer-bg-2.png"],
    dark: false,
  },
];

/** Frame 46 «Наші пропозиції»: две плитки 357px с фоном. */
export default function Offers() {
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader
        title={<span className="text-black">Наші пропозиції</span>}
        action={
          <OutlineBtn
            href="/#lead-form"
            icon="/figma/bbs/support-blue.svg"
            hoverIcon="/figma/bbs/support-white.svg"
          >
            Отримати допомогу з вибором
          </OutlineBtn>
        }
      />
      <div className="flex w-full items-center justify-center gap-[24px]">
        {OFFERS.map((o) => (
          <div
            key={o.title}
            className="relative flex w-[357px] shrink-0 flex-col items-center py-[60px]"
          >
            {o.backgrounds.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 size-full max-w-none object-fill"
              />
            ))}
            <div
              className="pointer-events-none absolute inset-0"
              style={inset("var(--color-light-gray)")}
            />

            <div className="relative flex w-full flex-col items-center justify-center gap-[40px] px-[32px]">
              <div className="flex h-[146px] w-full flex-col items-start gap-[24px]">
                <p
                  className={`text-trim w-full text-center ${H2_SB} ${o.dark ? "text-white" : "text-blue"}`}
                >
                  {o.title}
                </p>
                <p
                  className={`text-trim w-full ${H4_L} ${o.dark ? "text-back-card-gray" : "text-card-gray"}`}
                >
                  {o.text}
                </p>
              </div>
              {/* Hover как у btn: red, светлая обводка, тень. */}
              <a
                href={o.href}
                className={`group flex w-full items-center justify-center gap-[8px] px-[24px] py-[14px] ${H4_BTN} transition-[background-color,color,box-shadow] duration-200 hover:bg-red hover:text-back-card-gray hover:shadow-[inset_0_0_0_1px_var(--color-light-gray),var(--lift)] ${
                  o.dark
                    ? "bg-blue text-white shadow-[inset_0_0_0_1px_#ffffff]"
                    : "bg-white text-blue shadow-[inset_0_0_0_1px_var(--color-blue)]"
                }`}
              >
                <span className="text-trim whitespace-nowrap">{o.button}</span>
                <SwapIcon
                  src={
                    o.dark
                      ? "/figma/bbs/arrow-btn-white.svg"
                      : "/figma/bbs/arrow-btn-blue.svg"
                  }
                  hover="/figma/bbs/arrow-btn-hover.svg"
                />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
