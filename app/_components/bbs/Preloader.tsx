"use client";

import { useEffect, useState } from "react";

/**
 * Прелоадер главной и каталога: лого BBS, полоса и проценты.
 *
 * Разметка приходит в HTML и только накрывает страницу — контент под ней
 * отрисован сразу (его видят и поисковики). Проценты считает inline-скрипт,
 * он стартует до гидратации React: разбор HTML, шрифты и картинки, видимые
 * на первом экране (hero, первая порция карточек). Не дольше 4,5 с; за
 * сессию — один раз; поисковым роботам не показывается. Если JS не дошёл,
 * CSS сам гасит прелоадер через 6 с (globals.css, .bbs-pl).
 *
 * Разметку держит dangerouslySetInnerHTML: скрипт меняет её до гидратации,
 * React её не сверяет. При переходах внутри сайта компонент ничего не
 * рисует — вставленный React-ом <script> не выполнился бы, и прелоадер
 * завис бы.
 */
let booted = false;

const SCRIPT = `(function () {
  var root = document.getElementById("bbs-pl");
  if (!root) return;
  var KEY = "bbs-preloader";
  var bot = /bot|crawl|spider|slurp|facebookexternalhit|TelegramBot|WhatsApp/i.test(navigator.userAgent);
  var seen = false;
  try { seen = !!sessionStorage.getItem(KEY); sessionStorage.setItem(KEY, "1"); } catch (e) {}
  if (bot || seen) { root.parentNode.removeChild(root); return; }

  var html = document.documentElement;
  var prevOverflow = html.style.overflow;
  html.style.overflow = "hidden";
  var bar = root.querySelector("[data-bar]");
  var num = root.querySelector("[data-num]");
  var meter = root.querySelector("[role=progressbar]");
  var status = root.querySelector("[data-status]");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var start = Date.now(), MIN = 500, MAX = 4500;
  var parsed = false, total = 0, done = 0, shown = 0, timedOut = false, leaving = false;

  // 20% — разобранный HTML, 80% — шрифты и картинки первого экрана.
  function target() {
    if (timedOut) return 100;
    if (!parsed) return 5;
    return 20 + (total ? (80 * done) / total : 80);
  }
  function render(p) {
    var v = Math.round(p);
    bar.style.transform = "scaleX(" + p / 100 + ")";
    num.textContent = v + "%";
    meter.setAttribute("aria-valuenow", String(v));
  }
  function leave() {
    leaving = true;
    html.style.overflow = prevOverflow;
    status.textContent = "Сторінку завантажено";
    root.classList.add("is-done");
    setTimeout(function () { if (root.parentNode) root.parentNode.removeChild(root); }, reduce ? 0 : 400);
  }
  function tick() {
    if (leaving) return;
    var t = target();
    // Число догоняет реальный прогресс плавно, но не обгоняет его.
    shown = reduce ? t : Math.min(t, shown + Math.max(0.6, (t - shown) * (timedOut ? 0.35 : 0.12)));
    render(shown);
    if (shown >= 99.5 && Date.now() - start >= MIN) return leave();
    requestAnimationFrame(tick);
  }
  function task(p) {
    total++;
    var finished = false;
    function end() { if (!finished) { finished = true; done++; } }
    p.then(end, end);
  }
  function collect() {
    parsed = true;
    if (document.fonts && document.fonts.ready) task(document.fonts.ready);
    var imgs = document.images;
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (root.contains(img)) continue;
      var r = img.getBoundingClientRect();
      // Только видимые на первом экране: скрытая мобильная/десктопная ветка — 0×0.
      if (!r.width || !r.height || r.top > innerHeight || r.bottom < 0) continue;
      if (img.complete) continue;
      task(new Promise(function (res) {
        img.addEventListener("load", res, { once: true });
        img.addEventListener("error", res, { once: true });
      }));
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", collect, { once: true });
  else collect();
  setTimeout(function () { timedOut = true; }, MAX);
  requestAnimationFrame(tick);
})();`;

const HTML = `<div id="bbs-pl" class="bbs-pl fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-[40px] bg-white">
  <span data-status class="sr-only" aria-live="polite">Завантаження сторінки…</span>
  <div class="flex h-[40px] items-center gap-[4px]" aria-hidden="true">
    <img src="/figma/bbs/bbs-logo.webp" alt="" width="104" height="40" style="width:104.375px;height:40.102px" />
    <div class="h-[40px] w-[2px] bg-[#1460ad]"></div>
    <div class="whitespace-nowrap text-[16px] font-medium leading-[20px] text-[#e52b34]">EXCLUSIVE<br />SURFACE</div>
  </div>
  <div class="flex w-[220px] flex-col items-center gap-[16px]">
    <div class="h-[2px] w-full overflow-hidden bg-back-card-gray" role="progressbar" aria-label="Завантаження сторінки" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
      <div data-bar class="h-full w-full origin-left bg-blue" style="transform:scaleX(0)"></div>
    </div>
    <span data-num class="text-[16px] font-semibold leading-[20px] tracking-[-0.8px] text-blue tabular-nums" aria-hidden="true">0%</span>
  </div>
</div>
<noscript><style>.bbs-pl{display:none}</style></noscript>
<script>${SCRIPT}</script>`;

export default function Preloader() {
  const [show] = useState(() => !booted);
  useEffect(() => {
    booted = true;
  }, []);
  if (!show) return null;
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: HTML }} />;
}
