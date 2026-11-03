"use client";

import { useMemo, useState } from "react";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Layout";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@astryxdesign/core/SegmentedControl";
import { Text } from "@astryxdesign/core/Text";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

export type GalleryImage = {
  url: string;
  alt: string | null;
  surfaceId: number | null;
};

export type GallerySurface = { id: number; name: string };

/**
 * Набросок галереи карточки: крупный кадр + лента мініатюр.
 * Фото лежат внешними ссылками на сайте производителя, поэтому обычный img,
 * а не next/image: тот потребует remotePatterns в next.config.
 */
export function MaterialGallery({
  images,
  surfaces = [],
}: {
  images: GalleryImage[];
  surfaces?: GallerySurface[];
}) {
  const [active, setActive] = useState(0);
  const [surfaceFilter, setSurfaceFilter] = useState("");

  // Переключатель нужен только там, где у декора правда несколько обработок.
  const tabs = surfaces.filter((surface) =>
    images.some((image) => image.surfaceId === surface.id),
  );
  const visible = useMemo(
    () =>
      surfaceFilter
        ? images.filter((image) => String(image.surfaceId) === surfaceFilter)
        : images,
    [images, surfaceFilter],
  );

  const selectSurface = (value: string) => {
    setSurfaceFilter(value);
    setActive(0);
  };

  if (!images.length) {
    return (
      <VStack gap={2} hAlign="center" vAlign="center" padding={6}>
        <Icon icon={ImageOff} size="lg" color="tertiary" />
        <Text type="supporting">Фото не завантажені</Text>
      </VStack>
    );
  }

  const current = visible[active] ?? visible[0];
  const move = (step: number) =>
    setActive((index) => (index + step + visible.length) % visible.length);

  return (
    <VStack gap={2}>
      {tabs.length > 1 ? (
        <SegmentedControl
          label="Поверхня"
          value={surfaceFilter}
          onChange={selectSurface}
          layout="fill"
        >
          <SegmentedControlItem value="" label="Всі" />
          {tabs.map((surface) => (
            <SegmentedControlItem
              key={surface.id}
              value={String(surface.id)}
              label={surface.name}
            />
          ))}
        </SegmentedControl>
      ) : null}

      <div
        style={{
          aspectRatio: "4 / 3",
          overflow: "hidden",
          borderRadius: "var(--radius-container)",
          backgroundColor: "var(--color-surface-secondary)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.url}
          alt={current.alt ?? ""}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Управление под кадром, а не поверх: на светлых фото белые стрелки не читаются. */}
      <HStack gap={2} vAlign="center">
        <IconButton
          label="Попереднє фото"
          icon={<Icon icon={ChevronLeft} size="sm" />}
          size="sm"
          onClick={() => move(-1)}
        />
        <StackItem size="fill">
          <Text type="supporting">
            {active + 1} / {visible.length}
          </Text>
        </StackItem>
        <IconButton
          label="Наступне фото"
          icon={<Icon icon={ChevronRight} size="sm" />}
          size="sm"
          onClick={() => move(1)}
        />
      </HStack>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.25rem",
          width: "100%",
        }}
      >
          {visible.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Фото ${index + 1}`}
              aria-current={index === active}
              style={{
                flex: "0 0 auto",
                width: "5rem",
                aspectRatio: "1",
                padding: 0,
                cursor: "pointer",
                overflow: "hidden",
                borderRadius: "var(--radius-container)",
                background: "none",
                border:
                  index === active
                    ? "2px solid var(--color-border-emphasized)"
                    : "var(--border-width) solid var(--color-border)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </button>
          ))}
      </div>
    </VStack>
  );
}
