/* eslint-disable @next/next/no-img-element */
import { H2_SB, H3_L } from "../bbs/ui";

export default function WhyBbs() {
  return (
    <section className="flex w-full items-start gap-[24px]">
      <div className="flex min-w-px flex-1 flex-col items-start gap-[24px]">
        <h2 className={`text-trim w-full ${H2_SB} text-ink`}>Чому обирають BBS</h2>
        <p className={`text-trim w-full ${H3_L} text-card-gray`}>
          <span className="font-semibold">
            BBS — офіційний дистриб’ютор Laminam та Vicostone
          </span>
          , тому ви отримуєте оригінальні матеріали від виробників і консультацію
          від професіоналів під час вибору. Ми допоможемо визначитися з матеріалом,
          декором і форматом відповідно до особливостей вашого проєкту, а також
          розрахувати необхідну кількість матеріалу. Широкий вибір керамограніту та
          кварцового каменю дає змогу підібрати оптимальне рішення для різних
          проєктів. На матеріали діє{" "}
          <span className="font-semibold">гарантія 25 років</span>, що забезпечує
          впевненість в їх тривалому використанні. Завдяки комплексному супроводу
          ви зможете зосередитися на реалізації своїх ідей, не витрачаючи зайвий
          час на пошуки і розрахунки.{" "}
          <span className="font-semibold">
            Ми врахуємо особливості проєкту на кожному етапі, щоб ви отримали
            якісний результат без зайвого клопоту.
          </span>
        </p>
      </div>
      <div className="relative min-w-px flex-1 self-stretch">
        <img
          loading="lazy"
          src="/figma/bbs/why-bbs.webp"
          alt="Шоурум BBS"
          className="absolute inset-0 size-full max-w-none object-cover"
        />
      </div>
    </section>
  );
}
