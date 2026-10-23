"use client";

import { useActionState, useId, useRef, useState } from "react";

import { NAME_MAX, nameError, phoneDigits, phoneError } from "@/app/_lib/lead-validation";
import { submitLead, type LeadState } from "@/app/_lib/leads";

import { H3_L, H3_SB, MOB_L, MOB_SB, PrimaryBtn, inset } from "./ui";

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
 * ошибке под полем (aria-describedby у поля).
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
    <div className={`flex flex-col gap-[6px] ${className}`}>
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
      {state === "error" && error && (
        <p id={errorId} className={`${MOB_L} text-[14px] leading-[18px] text-red`}>
          {error}
        </p>
      )}
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

/**
 * Отправка через server action. Обрыв сети или сбой сервера — сообщение под
 * формой (введённое остаётся), а не страница ошибки.
 */
async function send(prev: LeadState, form: FormData): Promise<LeadState> {
  try {
    return await submitLead(prev, form);
  } catch {
    return { status: "error", message: "Не вдалося надіслати заявку. Перевірте з’єднання та спробуйте ще раз." };
  }
}

/** Состояние поля: пока не трогали — нейтральное, дальше — по проверке. */
const stateOf = (shown: boolean, error: string | null): FieldState =>
  !shown ? "neutral" : error ? "error" : "valid";

/**
 * Поля формы заявки (Frame 41): пишет заявку в базу через server action.
 * `compact` — мобильная форма (Consultation): поля столбиком, текст 16mob_l.
 *
 * Проверка своя, без подсказок браузера (noValidate): поле показывает
 * состояние сразу, как только в него начали вводить; по «Залишити заявку» —
 * ошибки у всех полей и фокус на первом неверном. Правила — в
 * lead-validation.ts, сервер проверяет то же.
 */
export default function LeadFormFields({
  preset,
  compact = false,
}: {
  preset: LeadPreset;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState<LeadState, FormData>(send, { status: "idle" });
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

  if (state.status === "ok") {
    return (
      <div
        className={`flex shrink-0 flex-col items-start gap-[16px] self-stretch justify-center ${compact ? "w-full" : "w-[477px]"}`}
        role="status"
      >
        <p className={`text-trim ${H3_SB} text-ink`}>Дякуємо! Заявку отримано.</p>
        <p className={`text-trim ${H3_L} text-card-gray`}>
          Менеджер зв’яжеться з вами найближчим часом.
        </p>
      </div>
    );
  }

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
        }
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
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Повідомлення"
            className={`size-full resize-none bg-transparent ${compact ? MOB_L : MOB_SB} text-card-gray outline-none placeholder:text-card-gray`}
          />
        </label>
      </div>
      {state.status === "error" && !pending && (
        <p role="alert" className={`${MOB_SB} text-red`}>
          {state.message}
        </p>
      )}
      <PrimaryBtn type="submit" className="w-full" disabled={pending} loading={pending}>
        {pending ? "Надсилаємо…" : "Залишити заявку"}
      </PrimaryBtn>
    </form>
  );
}
