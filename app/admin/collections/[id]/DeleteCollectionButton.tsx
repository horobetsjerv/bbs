"use client";

import { useState, useTransition } from "react";
import { AlertDialog } from "@astryxdesign/core/AlertDialog";
import { Button } from "@astryxdesign/core/Button";
import { deleteCollection } from "../actions";

export function DeleteCollectionButton({
  id,
  name,
  materialCount,
}: {
  id: number;
  name: string;
  materialCount: number;
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
        title="Видалити колекцію?"
        // Материалы переживают удаление коллекции: в схеме collection_id обнуляется.
        description={
          materialCount
            ? `«${name}» буде видалено. ${materialCount} матеріалів залишаться в каталозі, але без колекції.`
            : `«${name}» буде видалено. Дію не можна скасувати.`
        }
        actionLabel="Видалити"
        cancelLabel="Скасувати"
        isActionLoading={isPending}
        onAction={() => startTransition(() => void deleteCollection(id))}
      />
    </>
  );
}
