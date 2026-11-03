"use client";

import type { ComponentProps } from "react";
import { Selector as AstryxSelector } from "@astryxdesign/core/Selector";

/**
 * Selector админки. По умолчанию Astryx накладывает список поверх поля так,
 * чтобы выбранный пункт лёг на триггер; поле при этом скрыто списком.
 * Здесь список всегда раскрывается вниз от поля.
 */
export function Selector(props: ComponentProps<typeof AstryxSelector>) {
  return <AstryxSelector placement="below" {...props} />;
}
