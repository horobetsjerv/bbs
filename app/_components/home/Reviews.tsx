import { SectionHeader } from "../bbs/ui";

export default function Reviews() {
  return (
    <section className="flex w-full flex-col items-start gap-[24px]">
      <SectionHeader title="Відгуки клієнтів і партнерів BBS" />
      <div className="flex items-start gap-[24px]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[379px] w-[262px] shrink-0 bg-back-card-gray" />
        ))}
      </div>
    </section>
  );
}
