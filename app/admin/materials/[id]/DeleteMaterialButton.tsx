"use client";

import { useState, useTransition } from "react";
import { AlertDialog } from "@astryxdesign/core/AlertDialog";
import { Button } from "@astryxdesign/core/Button";
import { deleteMaterial } from "../actions";

export function DeleteMaterialButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
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
        title="Видалити матеріал?"
        description={`«${name}» буде видалено разом із фото та зв'язками. Дію не можна скасувати.`}
        actionLabel="Видалити"
        cancelLabel="Скасувати"
        isActionLoading={isPending}
        onAction={() => startTransition(() => void deleteMaterial(id))}
      />
    </>
  );
}
