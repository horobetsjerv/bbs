"use client";

import { useEffect, useState } from "react";

/**
 * Прелоадер страниц сайта (включает Page): лого BBS, полоса и проценты.
 *
 * Разметка приходит в HTML и только накрывает страницу — контент под ней
 * отрисован сразу (его видят и поисковики). Проценты считает inline-скрипт,
 * он стартует до гидратации React: разбор HTML, шрифты и картинки, видимые
 * на первом экране (hero, первая порция карточек). Не дольше 4 с; за
 * сессию — один раз; поисковым роботам не показывается. Если JS не дошёл,
 * CSS сам гасит прелоадер через 6 с (globals.css, .bbs-pl).
 *
 * Разметку держит dangerouslySetInnerHTML: скрипт меняет её до гидратации,
 * React её не сверяет. При переходах внутри сайта компонент ничего не
 * рисует — вставленный React-ом <script> не выполнился бы, и прелоадер
 * завис бы. Отличает их флаг `booted`: его ставит PreloaderArm из корневого
 * layout после первой гидратации — на любой странице, даже без прелоадера.
 */
let booted = false;

/** В корневом layout: после первой гидратации сайта прелоадер больше не рисуется. */
export function PreloaderArm() {
  useEffect(() => {
    booted = true;
  }, []);
  return null;
}

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
  var start = Date.now(), MIN = 500, MAX = 4000;
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

/**
 * Знак BBS (bbs-logo.png, 2× от 104×40, 24 цвета) прямо в разметке: на медленной
 * сети отдельный файл логотипа грузился дольше самого прелоадера.
 */
const LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANEAAABQCAMAAACwCGCgAAAASFBMVEUAAAALYK4FXqzrKzMKX6wAAP4KYK0BfHz2FRcAPr4Ad/QEI3/oKTIHbMLqKjIA//+xExN/AgL8VFRhYWH7A2VVVap/f/+qAFXEhKR7AAAAGHRSTlMA+RH5owFiAgoEAgOg/l0BAwIDAgIDAgMUb1xWAAAICUlEQVR42t2bjZLbKgyFFdYyGNLYSdO77/+mF2EbRPh10nampjOdZmsTfz6AjgQL8A80CeMAWkgp4SRNwHgZQQg8DRIRXQYQaJHwPEQWyaBlwvMQXQaJEk6BNG9El8HYRcLqdB6iyyDOgRSIdqSzzCPXhP0EVSScbBNvNLrNjmtDb0y/14XtQ9vbte3B2A+VCwNRB9JnDX/DGOjoQVxekCpMYvigGZgBNYzwfhcjBU7Teox1EkVIXfQH2w/b92yHHAw/3u9jhIleeM9jjMIjTX+GiLpGN2/fJ7ocIBogIJk/SzT8JSIJPSp9SAR/VyOGJOpExxfehGg43MWYEDVuAHutGNibqBAdD3qciEadneJHW0rUvocjidqj2fRQUI7Yato1KWQgwm0ejbKng70P+kdKpKX2lyS32VWeLmyqtHUFh0w6QjrqxnqUSJrJaFRZwRQ1CsaypdLa1QTaRjnZa2s5EXIi2e8gGBHu/SHFt4TjrlhDMDNUVdpfjpBAxgrXxmyG+0yDkjwYFol+OCKav3aEzPPs+/G92D4m99IwITL+MRzR/e4gFpUI9XRCySrS3pXuKEqgxrV4IUtE7aap/iHdHA9Eob+ZeNwACxr5tv3MLUblgeeJ/FX5WGAdGGlgUGosEdGPvQvLdeH6mAgJI4040cajbtfr9eu1Xa83ta2vPkZhlshZ+p5wqG32IF+Jhm0e8Tym+GpsuKf6B+Y0mmBexVApTGgEpX1am6xpeyDQAD1hm9ZQ/ISILqSaTo0Ibl/1pmCZikiBSF46nQjiR0TOwWBhHkk76OD61WpKPUPxge7PEfWMuvXB0a9N7xFdbKSgPrJEHQrRfLKXBZWoRJTT6Kcf6WPS2GyfENpEY64P/lb4WocxkQrPfbvd2FJnP3n1bvAAXiISKREGorIJ2761TZRdyPXAhm5p9X54ia4q04f/T1rEJ/Z9IiESfh6lJtpMU1jbRzcL1tt+FYkyfYiw9ggejwwngjCL7Iqnlse3l+j7+VAL7CIREYgcUroyDNlA7MsxfUQgc755YJliftQxIghBlbkixrta8QSpiwjZ2/iACPNEkUYAYfJbS/cKBDFRlAOa4qjLERnkRPI4EblRplFpZbBP7WfKkhBBWAgdEeZUamq0GksNvLa0P8F/RzRC4SPe+ih5ooePOc/dzSlG9GLyyPG+FB+CRsavDNaEa9bQfg6FAPJebSJXINXuz1o9NWIO1Wv6apEnWvy4ur461cfjySeW8jXkGCmnUa3A4kyDbmuUWbzHqCqa1whZgL0qVUj9lkVt8wgxQQpEXqMkunI3LWbrMptEQ9ID62MgE4l5jQyPsOS113Zb2z7a2LjDF5VEhqjhyaS1DJglmvpckI13VC0vEjVckMsnVLyy8+JDxgXVXZ3Ubi/0AyIBIvberxq1neotilW0vcGLD94FdWlkLZRGs4+6n+8QbRGtTLS0vapd2sEjrXNpjEvJ2KkRfasM+dF7RJQ4chcUOVV4uIzvdm2p9NiJEJnDG1gOG/Kj0m5HWOzmvcxXXBnqfdAEzmmkKYw91gG1eu3QkqTvrrIK9XpvwfcNfTVKljQS9T4GGxcL2QTA86Eyjm5d4Xg6oVKFKHnzGjGi1DhT3it4Vp0nMhXv7WpNLCIVVgaEJy9lLTaqPr9t84ghnXhuVbOg0MgirIk0ynhvZCMqvIifoe79qlHGqUpu7LQo+bo99kBqvNVD+XRiccYuVshARFTNJiiAhADJ51GBSOfK8JLZ3Zavu0J25N25+SaFplghX8lvaURbyN5n+rUuJhKmSuRLC+u3l7IJVSGilT0Q3VlYY8XIzlFHLSXSh0Yd8iRrEhki3SKCb57yIWCiELAp2dBIipALFIhMnShKhLNE9JYXXkmIceh/4YuPOpEoxIn8PNqziKhMENygXRlm5oLyRC6ReOlkihLhPBE+w7Bac6OFGtnt5flYlJfwC+5ZhbJEpYMP4f1ik6ix6Sv8YZ9XjRRbn3O5xBeTMAvku9KVWlBcbWMR9leJaBS5ToZojzhPtLCHvsVbE4rV6+yg+84DZTTq8JlznqjX110EVfwKGi0dRWKS6G7yQBmNGubbzsZPicZyBRLVEqV85Vp+blGI9486K/nOEc3pXvnBbAIKGiGFHHVtA0FxU8zvWnYRjWsa/AnRXqRmRGz3Zt1tgXoycbtzoKm0D4vVPT5KEMb1YJsN1MVR1zg6sm0UAhQ00vZdqbDHl5s/LinHqbJt6eeRgcQub1FEhD1asZpDzGsEAOxmV+AyZpqMs+++JCSjnKa6D3tX2Y3Y5Vd7H1a4g4jVw6LSPuW+hY5+T+6FqH7cUurJyL2PwqjzJI8l41TturEo1F175YjrZmK8aV88ixAT+ddF9/Z1gTUiXptzkt15Pau6U86d6htnTn6xLYexeoyveJzW3TZzn1g8dLKq21CIHVnqebHbJIpPvRwmWr9nKhDZxzAmlRlX+e3oh8ZRp234SGcqdc85JfqLnXTyRL0nndz9UqJMicRMh1v2ont0i1jrlsZA6zjaR6fRZKTR+6fRovhWU9dI2TqM9htODG5Ex08MDodPDMrmkPstpzqnRmhun+rEvlOdNoDL5gnI33Ty9kMi6CXqAfq3iIa/c977sxPswwGiLqDPfstgN9HDJ79loDseI36NE/z7bTgCJD5ovvzrjxm/1pCaTYbHkFQ+yl5khpMpxNaecwBFRztOAQRs2TZwKqLTAO1EZxlyLmUeTqXQplGvQv8Dkp92j9IZsEEAAAAASUVORK5CYII=";

const HTML = `<div id="bbs-pl" class="bbs-pl fixed inset-0 z-[1000] flex flex-col items-center justify-center gap-[40px] bg-white">
  <span data-status class="sr-only" aria-live="polite">Завантаження сторінки…</span>
  <div class="flex h-[40px] items-center gap-[4px]" aria-hidden="true">
    <img src="${LOGO}" alt="" width="104" height="40" style="width:104.375px;height:40.102px" />
    <div class="h-[40px] w-[2px] bg-[#1460ad]"></div>
    <div class="whitespace-nowrap text-[16px] font-medium leading-[20px] text-[#e52b34]">EXCLUSIVE<br />SURFACE</div>
  </div>
  <div class="flex w-[220px] flex-col items-center gap-[16px]">
    <div class="h-[3px] w-full overflow-hidden rounded-full bg-back-card-gray" role="progressbar" aria-label="Завантаження сторінки" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
      <div data-bar class="h-full w-full origin-left rounded-full bg-blue" style="transform:scaleX(0)"></div>
    </div>
    <div class="flex items-baseline gap-[8px] text-[16px] leading-[20px] tracking-[-0.8px]" aria-hidden="true">
      <span class="font-light text-card-gray">Завантаження</span>
      <span data-num class="w-[44px] font-semibold text-blue tabular-nums">0%</span>
    </div>
  </div>
</div>
<noscript><style>.bbs-pl{display:none}</style></noscript>
<script>${SCRIPT}</script>`;

export default function Preloader() {
  const [show] = useState(() => !booted);
  if (!show) return null;
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: HTML }} />;
}
