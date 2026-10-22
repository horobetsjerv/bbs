"use client";

import { useRouter } from "next/navigation";
import { Tab, TabList } from "@astryxdesign/core/TabList";
import { DICTIONARY_META, DICTIONARY_TYPES, type DictionaryType } from "./config";

/** Вкладки справочников. Тип живёт в URL, чтобы ссылка на вкладку открывалась напрямую. */
export function DictionaryTabs({ current }: { current: DictionaryType }) {
  const router = useRouter();

  return (
    <TabList
      value={current}
      onChange={(value) => router.push(`/admin/dictionaries?type=${value}`)}
      size="sm"
    >
      {DICTIONARY_TYPES.map((type) => (
        <Tab
          key={type}
          value={type}
          label={DICTIONARY_META[type].label}
          href={`/admin/dictionaries?type=${type}`}
        />
      ))}
    </TabList>
  );
}
