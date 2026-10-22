"use client";

import { useActionState, useState } from "react";

import { submitLead, type LeadState } from "@/app/_lib/leads";

import { H3_L, H3_SB, MOB_L, MOB_SB, PrimaryBtn, inset } from "./ui";

export type LeadPreset = {
  formType: "feedback" | "sample_order" | "price_request";
  materialId?: number | null;
  message?: string;
};

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  defaultValue,
  className = "",
  compact = false,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  defaultValue?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <label
      className={`flex items-start bg-white ${compact ? "px-[16px] py-[12px]" : "px-[32px] py-[16px]"} ${className}`}
      style={inset("var(--color-card-gray)")}
    >
      <span className="sr-only">{label}</span>
      <input
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={label}
        className={`block h-[16px] w-full bg-transparent p-0 ${compact ? MOB_L : MOB_SB} text-card-gray outline-none placeholder:text-card-gray`}
      />
    </label>
  );
}

/**
 * Цифры номера, приведённые к 380XXXXXXXXX: вставка «067…», «80…», «+380…»;
 * «0» после +380 по привычке (+380 067…) отбрасывается.
 */
function phoneDigits(value: string) {
  const d = value.replace(/\D/g, "");
  if (!d) return "";
  const full = d.startsWith("380")
    ? d
    : d.startsWith("80")
      ? `3${d}`
      : d.startsWith("0")
        ? `38${d}`
        : `380${d}`;
  return (full[3] === "0" ? full.slice(0, 3) + full.slice(4) : full).slice(0, 12);
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

const PHONE_ERROR = "Вкажіть номер телефону повністю";

/**
 * Телефон с маской: префикс +380 подставляется при фокусе, лишние цифры
 * не вводятся. Неполный номер — красная рамка после ухода с поля, и форма
 * не отправится (customValidity). Сервер проверяет то же (leads.ts).
 */
function PhoneField({
  defaultValue = "",
  className = "",
  compact = false,
}: {
  defaultValue?: string;
  className?: string;
  compact?: boolean;
}) {
  const [value, setValue] = useState(() => formatPhone(phoneDigits(defaultValue), false));
  const [touched, setTouched] = useState(false);
  const local = phoneDigits(value).slice(3);
  const invalid = touched && local.length > 0 && local.length < 9;

  return (
    <label
      className={`flex items-start bg-white ${compact ? "px-[16px] py-[12px]" : "px-[32px] py-[16px]"} ${className}`}
      style={inset(invalid ? "var(--color-red)" : "var(--color-card-gray)")}
    >
      <span className="sr-only">Телефон</span>
      <input
        name="phone"
        type="tel"
        inputMode="tel"
        required
        autoComplete="tel"
        value={value}
        placeholder="+380 (  )"
        aria-invalid={invalid || undefined}
        title={invalid ? PHONE_ERROR : undefined}
        ref={(el) => el?.setCustomValidity(local.length > 0 && local.length < 9 ? PHONE_ERROR : "")}
        onFocus={() => setValue((v) => formatPhone(phoneDigits(v), true))}
        onBlur={() => {
          setTouched(true);
          setValue((v) => formatPhone(phoneDigits(v), false));
        }}
        onPaste={(e) => {
          // Вставка целого номера заменяет поле, а не дописывается к «+380 (».
          const pasted = phoneDigits(e.clipboardData.getData("text"));
          if (pasted.length - 3 >= 9) {
            e.preventDefault();
            setValue(formatPhone(pasted, true));
          }
        }}
        onChange={(e) => {
          let d = phoneDigits(e.target.value);
          // Backspace по скобке или пробелу: цифр столько же — стираем последнюю.
          if (e.target.value.length < value.length && d === phoneDigits(value)) d = d.slice(0, -1);
          if (d.length <= 3) d = "";
          setValue(formatPhone(d, true));
        }}
        className={`block h-[16px] w-full bg-transparent p-0 ${compact ? MOB_L : MOB_SB} text-card-gray outline-none placeholder:text-card-gray`}
      />
    </label>
  );
}

/**
 * Поля формы заявки (Frame 41): пишет заявку в базу через server action.
 * `compact` — мобильная форма (Consultation): поля столбиком, текст 16mob_l.
 */
export default function LeadFormFields({
  preset,
  compact = false,
}: {
  preset: LeadPreset;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, {
    status: "idle",
  });

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
      className={`flex shrink-0 flex-col items-start gap-[24px] ${compact ? "w-full" : "w-[477px]"}`}
    >
      <input type="hidden" name="formType" value={preset.formType} />
      {preset.materialId ? (
        <input type="hidden" name="materialId" value={preset.materialId} />
      ) : null}
      <div className={`flex w-full flex-col items-start ${compact ? "gap-[12px]" : "gap-[16px]"}`}>
        <div className={`flex w-full ${compact ? "flex-col gap-[12px]" : "items-center gap-[16px]"}`}>
          <Field
            label="Ваше ім’я"
            name="name"
            autoComplete="name"
            defaultValue={state.values?.name}
            className="min-w-px flex-1"
            compact={compact}
          />
          <PhoneField
            defaultValue={state.values?.phone}
            className="min-w-px flex-1"
            compact={compact}
          />
        </div>
        <label
          className={`flex w-full items-start bg-white ${compact ? "h-[80px] px-[16px] py-[12px]" : "h-[96px] px-[32px] py-[16px]"}`}
          style={inset("var(--color-card-gray)")}
        >
          <span className="sr-only">Повідомлення</span>
          <textarea
            name="message"
            defaultValue={state.values?.message ?? preset.message}
            placeholder="Повідомлення"
            className={`size-full resize-none bg-transparent ${compact ? MOB_L : MOB_SB} text-card-gray outline-none placeholder:text-card-gray`}
          />
        </label>
      </div>
      {state.status === "error" && (
        <p role="alert" className={`text-trim ${MOB_SB} text-red`}>
          {state.message}
        </p>
      )}
      <PrimaryBtn type="submit" className="w-full" disabled={pending}>
        {pending ? "Надсилаємо…" : "Залишити заявку"}
      </PrimaryBtn>
    </form>
  );
}
