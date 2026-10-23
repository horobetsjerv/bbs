"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Тонкая полоса прогресса вверху экрана при переходах внутри сайта (M10,
 * уровень 2): клик по ссылке на другую страницу или смена фильтров каталога
 * (событие `bbs:navstart`). Появляется, только если переход дольше 200 мс;
 * ползёт к 90%, пока ждём, на новом адресе — дотягивается до 100% и гаснет.
 * Аварийно гаснет через 15 с.
 */
export default function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  // idle → wait (200 мс тишины) → run (ползёт) → done (100% и гаснет)
  const [phase, setPhase] = useState<"idle" | "wait" | "run" | "done">("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

  useEffect(() => {
    const start = () => {
      clear();
      setPhase("wait");
      later(200, () => setPhase((p) => (p === "wait" ? "run" : p)));
      later(15000, () => setPhase("idle"));
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      // Тот же адрес или якорь на этой странице — перехода не будет.
      if (url.pathname === location.pathname && url.search === location.search) return;
      start();
    };
    document.addEventListener("click", onClick);
    window.addEventListener("bbs:navstart", start);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("bbs:navstart", start);
      clear();
    };
  }, []);

  // Новый адрес отрисован — переход закончен (сравнение во время рендера,
  // как советует React для «состояния от пропсов»).
  const route = `${pathname}?${search}`;
  const [seen, setSeen] = useState(route);
  if (seen !== route) {
    setSeen(route);
    setPhase((p) => (p === "run" ? "done" : "idle"));
  }
  // Дотянулась до 100% — гаснет.
  useEffect(() => {
    if (phase !== "done") return;
    const timer = setTimeout(() => setPhase("idle"), 400);
    return () => clearTimeout(timer);
  }, [phase]);

  const width = phase === "run" ? "90%" : phase === "done" ? "100%" : "0%";
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-0 z-[1001] h-[3px] transition-opacity duration-300 ${
        phase === "run" || phase === "done" ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-blue shadow-[0_0_8px_rgb(18_69_116/0.5)]"
        style={{
          width,
          // К 90% — медленно (ждём ответ), к 100% — быстро.
          transition:
            phase === "run" ? "width 8s cubic-bezier(0.1, 0.7, 0.2, 1)" : phase === "done" ? "width 0.2s ease-out" : "none",
        }}
      />
    </div>
  );
}
