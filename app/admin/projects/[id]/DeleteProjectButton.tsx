"use client";

import { useState, useTransition } from "react";
import { AlertDialog } from "@astryxdesign/core/AlertDialog";
import { Button } from "@astryxdesign/core/Button";
import { deleteProject } from "../actions";

export function DeleteProjectButton({
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
        title="Видалити проект?"
        description={`«${name}» буде видалено разом із галереєю та зв'язками з матеріалами. Дію не можна скасувати.`}
        actionLabel="Видалити"
        cancelLabel="Скасувати"
        isActionLoading={isPending}
        onAction={() => startTransition(() => void deleteProject(id))}
      />
    </>
  );
}
