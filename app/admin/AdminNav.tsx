"use client";

import { SideNav } from "@astryxdesign/core/SideNav";
import {
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from "@astryxdesign/core/SideNav";
import { usePathname } from "next/navigation";

const CATALOG = [
  { href: "/admin/materials", label: "Матеріали" },
  { href: "/admin/collections", label: "Колекції" },
  { href: "/admin/dictionaries", label: "Довідники" },
];

const CONTENT = [
  { href: "/admin/projects", label: "Проекти" },
  { href: "/admin/posts", label: "Блог" },
  { href: "/admin/pages", label: "Сторінки" },
];

const SALES = [{ href: "/admin/leads", label: "Заявки" }];

const SYSTEM = [{ href: "/admin/settings", label: "Налаштування" }];

export function AdminNav() {
  const pathname = usePathname();
  const isSelected = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <SideNav
      header={
        <SideNavHeading
          heading="BBS"
          subheading="Адмін-панель"
          headingHref="/admin/materials"
        />
      }
    >
      <SideNavSection title="Каталог">
        {CATALOG.map((item) => (
          <SideNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            isSelected={isSelected(item.href)}
          />
        ))}
      </SideNavSection>
      <SideNavSection title="Контент">
        {CONTENT.map((item) => (
          <SideNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            isSelected={isSelected(item.href)}
          />
        ))}
      </SideNavSection>
      <SideNavSection title="Продажі">
        {SALES.map((item) => (
          <SideNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            isSelected={isSelected(item.href)}
          />
        ))}
      </SideNavSection>
      <SideNavSection title="Система">
        {SYSTEM.map((item) => (
          <SideNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            isSelected={isSelected(item.href)}
          />
        ))}
      </SideNavSection>
    </SideNav>
  );
}
