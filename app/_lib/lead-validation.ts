// Проверка полей заявки — общая для формы (при вводе и при отправке)
// и server action (leads.ts), чтобы правила не разъезжались.
// Сообщения короткие: под полем для них зарезервирована одна строка.

export const NAME_MAX = 60;

/** Буквы (кириллица, латиница), пробел, апостроф, дефис; начинается с буквы. */
const NAME_CHARS = /^\p{L}[\p{L}\s'’ʼ-]*$/u;

/** Ошибка имени или null. */
export function nameError(value: string): string | null {
  const name = value.trim();
  if (!name) return "Вкажіть ваше ім’я";
  if (!NAME_CHARS.test(name)) return "Лише літери, апостроф і дефіс";
  if (name.replace(/[\s'’ʼ-]/g, "").length < 2) return "Мінімум 2 літери";
  if (name.length > NAME_MAX) return `Максимум ${NAME_MAX} символів`;
  return null;
}

/**
 * Цифры номера, приведённые к 380XXXXXXXXX: вставка «067…», «80…», «+380…»;
 * «0» после +380 по привычке (+380 067…) отбрасывается.
 */
export function phoneDigits(value: string) {
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

/**
 * Код после +380: городские 3x–6x (Київ — 44), мобильные 39, 50, 63, 66–68,
 * 73, 89, 91–99. С 1, 2, 7 (кроме 73) и 8 (кроме 89) номеров нет.
 */
const CODE = /^(?:[3-6]\d|73|89|9[1-9])/;

/** Ошибка телефона или null: пустой, неверный код, неполный. */
export function phoneError(value: string): string | null {
  const local = phoneDigits(value).slice(3);
  if (!local) return "Вкажіть номер телефону";
  // Неверная первая цифра видна сразу, вторая — когда введены обе.
  if (/^[0-2]/.test(local) || (local.length >= 2 && !CODE.test(local)))
    return "Невірний код оператора";
  if (local.length < 9) return "Введіть 9 цифр після +380";
  return null;
}
