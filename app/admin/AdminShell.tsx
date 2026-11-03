"use client";

import type { ReactNode } from "react";
import NextLink from "next/link";
import { AppShell } from "@astryxdesign/core/AppShell";
import { LinkProvider } from "@astryxdesign/core/Link";
import { Theme } from "@astryxdesign/core/theme";
import { neutralTheme } from "@astryxdesign/theme-neutral/built";
import { AdminNav } from "./AdminNav";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    // mode="light" фиксирует светлую тему: по умолчанию Astryx следует за темой ОС.
    <Theme theme={neutralTheme} mode="light">
      <LinkProvider component={NextLink}>
        <AppShell sideNav={<AdminNav />} contentPadding={0} height="fill">
          {children}
        </AppShell>
      </LinkProvider>
    </Theme>
  );
}
