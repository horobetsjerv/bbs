"use client";

import { useState, useTransition } from "react";
import type { ComponentProps } from "react";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { FormLayout } from "@astryxdesign/core/FormLayout";
import { Grid } from "@astryxdesign/core/Grid";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack, StackItem, VStack } from "@astryxdesign/core/Layout";
import { Heading, Text } from "@astryxdesign/core/Text";
import { TextArea } from "@astryxdesign/core/TextArea";
import { TextInput } from "@astryxdesign/core/TextInput";
import {
  AtSign,
  MapPin,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { saveSettings, type SettingsInput } from "./actions";
import type { Settings } from "./queries";

type IconType = ComponentProps<typeof TextInput>["startIcon"];

/** Список однотипных значений (телефони, email): додати рядок / прибрати рядок. */
function StringList({
  label,
  description,
  addLabel,
  placeholder,
  icon,
  values,
  onChange,
}: {
  label: string;
  description: string;
  addLabel: string;
  placeholder: string;
  icon: IconType;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  // Пустой список показывает одну пустую строку — иначе вводить некуда.
  const rows = values.length ? values : [""];

  return (
    <VStack gap={2}>
      {rows.map((value, index) => (
        <HStack key={index} gap={1} vAlign="end">
          <StackItem size="fill">
            <TextInput
              label={index === 0 ? label : `${label} ${index + 1}`}
              isLabelHidden={index > 0}
              value={value}
              onChange={(next) =>
                onChange(rows.map((item, i) => (i === index ? next : item)))
              }
              isOptional={index === 0}
              startIcon={icon}
              placeholder={placeholder}
              description={index === 0 ? description : undefined}
              width="100%"
            />
          </StackItem>
          <IconButton
            label={`Прибрати ${label.toLowerCase()} ${index + 1}`}
            icon={<Icon icon={Trash2} size="sm" />}
            variant="ghost"
            tooltip="Прибрати"
            isDisabled={rows.length === 1 && !value}
            onClick={() => onChange(rows.filter((_, i) => i !== index))}
          />
        </HStack>
      ))}
      <HStack hAlign="start">
        <Button
          label={addLabel}
          variant="ghost"
          size="sm"
          icon={<Icon icon={Plus} size="sm" />}
          onClick={() => onChange([...rows, ""])}
        />
      </HStack>
    </VStack>
  );
}

export function SettingsForm({ settings }: { settings: Settings | null }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const [phones, setPhones] = useState<string[]>(settings?.phones ?? []);
  const [emails, setEmails] = useState<string[]>(settings?.emails ?? []);
  const [address, setAddress] = useState(settings?.address ?? "");
  const [mapLat, setMapLat] = useState(settings?.mapLat ?? "");
  const [mapLng, setMapLng] = useState(settings?.mapLng ?? "");
  const [workingHours, setWorkingHours] = useState(settings?.workingHours ?? "");
  const [instagram, setInstagram] = useState(settings?.socials?.instagram ?? "");
  const [facebook, setFacebook] = useState(settings?.socials?.facebook ?? "");
  const [telegram, setTelegram] = useState(settings?.socials?.telegram ?? "");
  // Интеграций ещё нет, полей в форме тоже: сохранённые значения просто едут обратно в базу.
  const telegramChatId = settings?.telegramChatId ?? "";
  const googleSheetId = settings?.googleSheetId ?? "";

  const handleSubmit = () => {
    setError(null);
    setIsSaved(false);
    const input: SettingsInput = {
      phones,
      emails,
      address,
      mapLat,
      mapLng,
      workingHours,
      socials: { instagram, facebook, telegram },
      telegramChatId,
      googleSheetId,
    };
    startTransition(async () => {
      const result = await saveSettings(input);
      if (result.ok) setIsSaved(true);
      else setError(result.error);
    });
  };

  return (
    <VStack gap={4} maxWidth={1100}>
      {error ? <Banner status="error" title={error} /> : null}
      {isSaved ? <Banner status="success" title="Налаштування збережено" /> : null}

      <Card padding={4}>
        <VStack gap={3}>
          <VStack gap={0.5}>
            <Heading level={2}>Контакти</Heading>
            <Text type="supporting">
              Показуються в шапці, підвалі та на сторінці «Контакти»
            </Text>
          </VStack>
          <FormLayout>
            <StringList
              label="Телефони"
              description="Перший номер — основний, він потрапляє в шапку сайту"
              addLabel="Додати номер"
              placeholder="+380 44 000 00 00"
              icon={Phone}
              values={phones}
              onChange={setPhones}
            />
            <StringList
              label="Email"
              description="Адреси для листів із форм зворотного зв'язку"
              addLabel="Додати email"
              placeholder="office@example.com"
              icon={AtSign}
              values={emails}
              onChange={setEmails}
            />
            <TextArea
              label="Адреса"
              value={address}
              onChange={setAddress}
              rows={2}
              isOptional
              description="Адреса шоуруму для сторінки «Контакти»"
              width="100%"
            />
            <TextArea
              label="Графік роботи"
              value={workingHours}
              onChange={setWorkingHours}
              rows={2}
              isOptional
              description="Наприклад: Пн–Пт 09:00–18:00, Сб 10:00–15:00"
              width="100%"
            />
            <Grid columns={{ minWidth: 240, max: 2 }} gap={3}>
              <TextInput
                label="Широта"
                value={mapLat}
                onChange={setMapLat}
                isOptional
                startIcon={MapPin}
                placeholder="50.4501"
                description="Координата мітки на карті"
                width="100%"
              />
              <TextInput
                label="Довгота"
                value={mapLng}
                onChange={setMapLng}
                isOptional
                startIcon={MapPin}
                placeholder="30.5234"
                description="Координата мітки на карті"
                width="100%"
              />
            </Grid>
          </FormLayout>
        </VStack>
      </Card>

      <Card padding={4}>
        <VStack gap={3}>
          <VStack gap={0.5}>
            <Heading level={2}>Соцмережі</Heading>
            <Text type="supporting">
              Порожнє поле — іконка не показується на сайті
            </Text>
          </VStack>
          <FormLayout>
            <TextInput
              label="Instagram"
              value={instagram}
              onChange={setInstagram}
              isOptional
              placeholder="https://instagram.com/..."
              width="100%"
            />
            <TextInput
              label="Facebook"
              value={facebook}
              onChange={setFacebook}
              isOptional
              placeholder="https://facebook.com/..."
              width="100%"
            />
            <TextInput
              label="Telegram"
              value={telegram}
              onChange={setTelegram}
              isOptional
              placeholder="https://t.me/..."
              width="100%"
            />
          </FormLayout>
        </VStack>
      </Card>

      <HStack gap={2} hAlign="start">
        <Button
          label="Зберегти"
          variant="primary"
          onClick={handleSubmit}
          isLoading={isPending}
        />
      </HStack>
    </VStack>
  );
}
