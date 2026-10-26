"use client";

import { useRef } from "react";

/**
 * <details> вопроса FAQ с плавным раскрытием: высота анимируется от строки
 * вопроса до полной и обратно. Пока идёт закрытие, details ещё open —
 * на это время ставится data-closing (шеврон по нему поворачивается сразу).
 * Без JS и при reduced motion — обычный <details>.
 */
export default function FaqDetails({
  className,
  style,
  summaryClassName,
  summary,
  children,
}: {
  className: string;
  style?: React.CSSProperties;
  summaryClassName: string;
  summary: React.ReactNode;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const anim = useRef<Animation | null>(null);

  const toggle = (e: React.MouseEvent) => {
    const d = ref.current;
    if (!d || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    const start = d.getBoundingClientRect().height;
    anim.current?.cancel();
    const opening = !d.open || d.dataset.closing !== undefined;
    let end: number;
    if (opening) {
      delete d.dataset.closing;
      d.open = true;
      end = d.getBoundingClientRect().height;
    } else {
      d.dataset.closing = "";
      end = d.querySelector("summary")!.getBoundingClientRect().height;
    }
    d.style.overflow = "hidden";
    const a = d.animate({ height: [`${start}px`, `${end}px`] }, { duration: 250, easing: "ease-out" });
    anim.current = a;
    a.onfinish = () => {
      if (!opening) {
        d.open = false;
        delete d.dataset.closing;
      }
      d.style.overflow = "";
      anim.current = null;
    };
  };

  return (
    <details ref={ref} className={className} style={style}>
      <summary className={summaryClassName} onClick={toggle}>
        {summary}
      </summary>
      {children}
    </details>
  );
}
