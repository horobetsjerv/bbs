"use client";

import { useState, useTransition } from "react";
import { AlertDialog } from "@astryxdesign/core/AlertDialog";
import { Button } from "@astryxdesign/core/Button";
import { deletePost } from "../actions";

export function DeletePostButton({ id, title }: { id: number; title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        label="Видалити"
        variant="destructive"
        onClick={() => setIsOpen(true)}
      />
      <AlertDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="Видалити статтю?"
        description={`«${title}» буде видалено разом із текстом. Дію не можна скасувати.`}
        actionLabel="Видалити"
        cancelLabel="Скасувати"
        isActionLoading={isPending}
        onAction={() => startTransition(() => void deletePost(id))}
      />
    </>
  );
}
