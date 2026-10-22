"use client";

import { useActionState, useState } from "react";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { VStack } from "@astryxdesign/core/Layout";
import { Heading } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { Theme } from "@astryxdesign/core/theme";
import { neutralTheme } from "@astryxdesign/theme-neutral/built";

import { login, type LoginState } from "./actions";

const INITIAL: LoginState = { error: null };

/** Форма входа в админку — на компонентах Astryx, как сама админка. */
export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, INITIAL);
  const [password, setPassword] = useState("");

  return (
    <Theme theme={neutralTheme} mode="light">
      {/* Фон темы Astryx: тёмная тема сайта (prefers-color-scheme) сюда не должна попадать. */}
      <main
        style={{
          display: "grid",
          placeItems: "center",
          minHeight: "100dvh",
          padding: "1rem",
          background: "var(--color-background-body)",
        }}
      >
        <Card style={{ width: "100%", maxWidth: "24rem" }}>
          <form action={action}>
            <input type="hidden" name="next" value={next} />
            <VStack gap={4}>
              <Heading level={1}>BBS — адмін-панель</Heading>
              {state.error ? <Banner status="error" title={state.error} /> : null}
              <TextInput
                type="password"
                label="Пароль"
                htmlName="password"
                value={password}
                onChange={setPassword}
                hasAutoFocus
                width="100%"
              />
              <Button type="submit" label="Увійти" variant="primary" isLoading={pending} width="100%" />
            </VStack>
          </form>
        </Card>
      </main>
    </Theme>
  );
}
