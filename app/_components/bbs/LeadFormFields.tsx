"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";

import { NAME_MAX, nameError, phoneDigits, phoneError } from "@/app/_lib/lead-validation";
import { submitLead, type LeadState } from "@/app/_lib/leads";

import { H3_L, H3_SB, H4_L, HOVER_EASE, LINE_BASE_BLUE, LINE_FILL, MOB_L, MOB_SB, PrimaryBtn, SwapIcon, inset } from "./ui";

export type LeadPreset = {
  formType: "feedback" | "sample_order" | "price_request";
  materialId?: number | null;
  message?: string;
};

type FieldState = "neutral" | "error" | "valid";

/** Рамка поля по состоянию: серая / красная / зелёная. */
const BORDER: Record<FieldState, string> = {
  neutral: "var(--color-card-gray)",
  error: "var(--color-red)",
  valid: "#2e7d32",
};

/**
 * Обёртка поля: рамка по состоянию, галочка у корректного и сообщение об
 * ошибке под полем (aria-describedby у поля). Строка под сообщение есть
 * всегда — форма не прыгает, когда ошибка появляется или исчезает.
 */
function FieldBox({
  state,
  error,
  errorId,
  compact,
  className = "",
  children,
}: {
  state: FieldState;
  error: string | null;
  errorId: string;
  compact: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-[4px] ${className}`}>
      <label
        className={`flex items-center gap-[8px] bg-white transition-shadow duration-150 ${compact ? "px-[16px] py-[12px]" : "px-[32px] py-[16px]"}`}
        style={inset(BORDER[state])}
      >
        {children}
        {state === "valid" && (
          <svg viewBox="0 0 16 16" aria-hidden className="size-[16px] shrink-0 text-[#2e7d32]">
            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </label>
      <p id={errorId} className={`h-[18px] truncate ${MOB_L} text-[14px] leading-[18px] text-red`}>
        {state === "error" ? error : null}
      </p>
    </div>
  );
}

/** Маска «+380 (67) 123 45 67»; `open` — оставить «+380 (» в пустом поле при фокусе. */
function formatPhone(digits: string, open: boolean) {
  const local = digits.slice(3);
  if (!local && !open) return "";
  let out = `+380 (${local.slice(0, 2)}`;
  if (local.length >= 2) out += `) ${local.slice(2, 5)}`;
  if (local.length > 5) out += ` ${local.slice(5, 7)}`;
  if (local.length > 7) out += ` ${local.slice(7, 9)}`;
  return out;
}

/** Ошибка сети или сервера — сообщение под формой (введённое остаётся), а не страница ошибки. */
const NETWORK_ERROR = "Не вдалося надіслати заявку. Перевірте з’єднання та спробуйте ще раз.";

/** Повтор той же заявки в течение 10 минут — не отправляем, а уточняем. */
const REPEAT_WINDOW = 10 * 60 * 1000;
const REPEAT_KEY = "bbs-last-lead";
const leadKey = (name: string, phone: string, message: string) =>
  [name.trim().toLowerCase(), phoneDigits(phone), message.trim()].join("|");
function lastLead(): { key: string; at: number } | null {
  try {
    return JSON.parse(sessionStorage.getItem(REPEAT_KEY) ?? "null");
  } catch {
    return null;
  }
}
function rememberLead(key: string) {
  try {
    sessionStorage.setItem(REPEAT_KEY, JSON.stringify({ key, at: Date.now() }));
  } catch {}
}

/** Состояние поля: пока не трогали — нейтральное, дальше — по проверке. */
const stateOf = (shown: boolean, error: string | null): FieldState =>
  !shown ? "neutral" : error ? "error" : "valid";

/**
 * Сама форма. Проверка своя, без подсказок браузера (noValidate): поле
 * показывает состояние сразу, как только в него начали вводить; по «Залишити
 * заявку» — ошибки у всех полей и фокус на первом неверном. Правила — в
 * lead-validation.ts, сервер проверяет то же. Успех — onSent (благодарность
 * показывает LeadFormFields).
 */
function LeadForm({
  preset,
  compact,
  onSent,
}: {
  preset: LeadPreset;
  compact: boolean;
  onSent: () => void;
}) {
  const [state, action, pending] = useActionState<LeadState, FormData>(async (prev, form) => {
    try {
      const next = await submitLead(prev, form);
      if (next.status === "ok") {
        rememberLead(leadKey(String(form.get("name")), String(form.get("phone")), String(form.get("message") ?? "")));
        onSent();
      }
      return next;
    } catch {
      return { status: "error", message: NETWORK_ERROR };
    }
  }, { status: "idle" });
  const [repeat, setRepeat] = useState(false);
  const id = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(preset.message ?? "");
  // Поле «тронули» — показываем его состояние; после попытки отправки — все.
  const [dirty, setDirty] = useState({ name: false, phone: false });
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const errors = { name: nameError(name), phone: phoneError(phone) };
  const nameState = stateOf(dirty.name || submitted, errors.name);
  const phoneState = stateOf(dirty.phone || submitted, errors.phone);
  const input = `block h-[16px] min-w-px flex-1 bg-transparent p-0 ${compact ? MOB_L : MOB_SB} text-card-gray outline-none placeholder:text-card-gray`;

  return (
    <form
      action={action}
      noValidate
      aria-busy={pending || undefined}
      onSubmit={(e) => {
        // Повторное нажатие или Enter во время отправки — не отправляем ещё раз.
        if (pending) return e.preventDefault();
        setSubmitted(true);
        if (errors.name || errors.phone) {
          e.preventDefault();
          (errors.name ? nameRef : phoneRef).current?.focus();
          return;
        }
        const last = lastLead();
        const same = last?.key === leadKey(name, phone, message) && Date.now() - last.at < REPEAT_WINDOW;
        setRepeat(same);
        if (same) e.preventDefault();
      }}
      className={`flex shrink-0 flex-col items-start gap-[24px] ${compact ? "w-full" : "w-[477px]"}`}
    >
      <input type="hidden" name="formType" value={preset.formType} />
      {preset.materialId ? (
        <input type="hidden" name="materialId" value={preset.materialId} />
      ) : null}
      <div className={`flex w-full flex-col items-start ${compact ? "gap-[12px]" : "gap-[16px]"}`}>
        <div className={`flex w-full ${compact ? "flex-col gap-[12px]" : "items-start gap-[16px]"}`}>
          <FieldBox
            state={nameState}
            error={errors.name}
            errorId={`${id}-name-error`}
            compact={compact}
            className="min-w-px flex-1 self-stretch"
          >
            <span className="sr-only">Ваше ім’я</span>
            <input
              ref={nameRef}
              name="name"
              autoComplete="name"
              maxLength={NAME_MAX}
              value={name}
              placeholder="Ваше ім’я"
              aria-required
              aria-invalid={nameState === "error" || undefined}
              aria-describedby={nameState === "error" ? `${id}-name-error` : undefined}
              onChange={(e) => {
                setRepeat(false);
                setName(e.target.value);
                setDirty((d) => ({ ...d, name: true }));
              }}
              className={input}
            />
          </FieldBox>
          <FieldBox
            state={phoneState}
            error={errors.phone}
            errorId={`${id}-phone-error`}
            compact={compact}
            className="min-w-px flex-1 self-stretch"
          >
            <span className="sr-only">Телефон</span>
            <input
              ref={phoneRef}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              placeholder="+380 (  )"
              aria-required
              aria-invalid={phoneState === "error" || undefined}
              aria-describedby={phoneState === "error" ? `${id}-phone-error` : undefined}
              // Маска: префикс +380 подставляется при фокусе, лишние цифры не вводятся.
              onFocus={() => setPhone((v) => formatPhone(phoneDigits(v), true))}
              onBlur={() => setPhone((v) => formatPhone(phoneDigits(v), false))}
              onPaste={(e) => {
                // Вставка целого номера заменяет поле, а не дописывается к «+380 (».
                const pasted = phoneDigits(e.clipboardData.getData("text"));
                if (pasted.length - 3 >= 9) {
                  e.preventDefault();
                  setPhone(formatPhone(pasted, true));
                  setDirty((d) => ({ ...d, phone: true }));
                }
              }}
              onChange={(e) => {
                let d = phoneDigits(e.target.value);
                // Backspace по скобке или пробелу: цифр столько же — стираем последнюю.
                if (e.target.value.length < phone.length && d === phoneDigits(phone)) d = d.slice(0, -1);
                if (d.length <= 3) d = "";
                setPhone(formatPhone(d, true));
                setDirty((x) => ({ ...x, phone: true }));
                setRepeat(false);
              }}
              className={input}
            />
          </FieldBox>
        </div>
        <label
          className={`flex w-full items-start bg-white ${compact ? "h-[80px] px-[16px] py-[12px]" : "h-[96px] px-[32px] py-[16px]"}`}
          style={inset("var(--color-card-gray)")}
        >
          <span className="sr-only">Повідомлення</span>
          <textarea
            name="message"
            maxLength={2000}
            value={message}
            onChange={(e) => {
              setRepeat(false);
              setMessage(e.target.value);
            }}
            placeholder="Повідомлення"
            className={`size-full resize-none bg-transparent ${compact ? MOB_L : MOB_SB} text-card-gray outline-none placeholder:text-card-gray`}
          />
        </label>
      </div>
      {repeat ? (
        <p role="alert" className={`${MOB_SB} text-card-gray`}>
          Таку заявку ви вже надіслали — менеджер зв’яжеться з вами. Щоб щось додати, змініть повідомлення.
        </p>
      ) : (
        state.status === "error" &&
        !pending && (
          <p role="alert" className={`${MOB_SB} text-red`}>
            {state.message}
          </p>
        )
      )}
      <PrimaryBtn type="submit" className="w-full" disabled={pending} loading={pending}>
        {pending ? "Надсилаємо…" : "Залишити заявку"}
      </PrimaryBtn>
    </form>
  );
}

/** Сколько висит благодарность, прежде чем форма вернётся. */
const THANKS_MS = 5000;

/**
 * Форма заявки (Frame 41) с благодарностью после отправки. `compact` —
 * мобильная форма (Consultation): поля столбиком, текст 16mob_l.
 *
 * Форма и благодарность — два слоя в одной ячейке сетки (высота блока не
 * прыгает), смена — плавным проявлением. После успеха под благодарностью
 * сразу встаёт новая пустая форма (key), через 5 с или по «Надіслати ще одну
 * заявку» она проявляется обратно.
 */
export default function LeadFormFields({
  preset,
  compact = false,
}: {
  preset: LeadPreset;
  compact?: boolean;
}) {
  const [round, setRound] = useState(0);
  const [thanks, setThanks] = useState(false);
  const thanksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!thanks) return;
    // Фокус — через кадр: в момент смены слой ещё visibility: hidden
    // (начало перехода), и focus() бы не сработал.
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => thanksRef.current?.focus({ preventScroll: true })),
    );
    const timer = setTimeout(() => setThanks(false), THANKS_MS);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [thanks]);

  const layer = "col-start-1 row-start-1 transition-[opacity,visibility] duration-300 ease-out motion-reduce:transition-none";
  return (
    <div className={`grid shrink-0 ${compact ? "w-full" : "w-[477px]"}`}>
      <div className={`${layer} ${thanks ? "invisible opacity-0" : "opacity-100"}`} inert={thanks}>
        <LeadForm
          key={round}
          preset={preset}
          compact={compact}
          onSent={() => {
            setThanks(true);
            setRound((r) => r + 1);
          }}
        />
      </div>
      <div
        ref={thanksRef}
        tabIndex={-1}
        role={thanks ? "status" : undefined}
        className={`${layer} flex flex-col items-start justify-center gap-[16px] outline-none ${thanks ? "opacity-100" : "invisible opacity-0"}`}
        inert={!thanks}
      >
        <p className={`text-trim ${H3_SB} text-ink`}>Дякуємо! Заявку отримано.</p>
        <p className={`text-trim ${H3_L} text-card-gray`}>Менеджер зв’яжеться з вами найближчим часом.</p>
        <button
          type="button"
          onClick={() => setThanks(false)}
          className={`group mt-[8px] flex cursor-pointer items-center gap-[8px] py-[8px] ${H4_L} text-blue transition-colors ${HOVER_EASE} hover:text-red`}
        >
          <span className={`text-trim whitespace-nowrap ${LINE_FILL} ${LINE_BASE_BLUE}`}>Надіслати ще одну заявку</span>
          <SwapIcon src="/figma/bbs/arrow-link-blue.svg" hover="/figma/bbs/arrow-link-hover.svg" />
        </button>
      </div>
    </div>
  );
}
