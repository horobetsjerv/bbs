"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Editor } from "@tiptap/core";
import { EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Dialog, DialogHeader } from "@astryxdesign/core/Dialog";
import { Divider } from "@astryxdesign/core/Divider";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import {
  HStack,
  Layout,
  LayoutContent,
  LayoutFooter,
  VStack,
} from "@astryxdesign/core/Layout";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { ToggleButton } from "@astryxdesign/core/ToggleButton";
import {
  Bold,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Redo2,
  TextQuote,
  Underline,
  Undo2,
} from "lucide-react";
import { uploadImage } from "../uploads/actions";

/**
 * Расширения объявлены один раз на модуль: Tiptap сравнивает массив по ссылке,
 * и новый массив на каждом рендере заставляет его пересоздавать опции по кругу.
 */
const EXTENSIONS = [
  StarterKit.configure({
    // На сайте только H2 и H3: H1 занят заголовком статьи.
    heading: { levels: [2, 3] },
    codeBlock: false,
    code: false,
    strike: false,
    link: { openOnClick: false },
  }),
  Image.configure({ inline: false }),
];

type Props = {
  label: string;
  /** HTML статьи. */
  value: string;
  onChange: (html: string) => void;
  description?: string;
};

/**
 * Редактор текста статьи на Tiptap. Панель собрана из Astryx-кнопок,
 * само поле стилизуется в admin.css через класс bbs-editor.
 */
export function RichTextEditor({ label, value, onChange, description }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startUpload] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [linkDraft, setLinkDraft] = useState<string | null>(null);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const [initialContent] = useState(value);

  /**
   * Редактор создаётся вручную, а не через useEditor: тот уничтожает инстанс по таймеру
   * в 1 мс после cleanup-эффекта, и на загруженной машине в dev-режиме React (StrictMode
   * запускает эффекты дважды) редактор бесконечно пересоздаётся, вкладка виснет.
   */
  const [editor, setEditor] = useState<Editor | null>(null);
  useEffect(() => {
    const instance = new Editor({
      extensions: EXTENSIONS,
      content: initialContent,
      editorProps: {
        attributes: {
          // Grammarly и LanguageTool переписывают DOM внутри contenteditable и конфликтуют с ProseMirror.
          "data-gramm": "false",
          "data-lt-active": "false",
          spellcheck: "false",
        },
      },
      onUpdate: ({ editor }) =>
        onChangeRef.current(editor.isEmpty ? "" : editor.getHTML()),
    });
    setEditor(instance);
    return () => {
      instance.destroy();
      setEditor(null);
    };
  }, [initialContent]);

  // Активные форматы читаются через селектор: сам editor не триггерит ререндер.
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      h2: editor?.isActive("heading", { level: 2 }) ?? false,
      h3: editor?.isActive("heading", { level: 3 }) ?? false,
      bold: editor?.isActive("bold") ?? false,
      italic: editor?.isActive("italic") ?? false,
      underline: editor?.isActive("underline") ?? false,
      bulletList: editor?.isActive("bulletList") ?? false,
      orderedList: editor?.isActive("orderedList") ?? false,
      blockquote: editor?.isActive("blockquote") ?? false,
      link: editor?.isActive("link") ?? false,
      canUndo: editor?.can().undo() ?? false,
      canRedo: editor?.can().redo() ?? false,
    }),
  });

  if (!editor || !state) return null;

  const openLinkDialog = () => {
    setLinkDraft(editor.getAttributes("link").href ?? "");
  };

  const applyLink = () => {
    const href = (linkDraft ?? "").trim();
    if (href) {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setLinkDraft(null);
  };

  const handleImageFile = (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    const formData = new FormData();
    formData.append("file", file);
    startUpload(async () => {
      const result = await uploadImage(formData);
      if (result.ok) editor.chain().focus().setImage({ src: result.url }).run();
      else setUploadError(result.error);
    });
  };

  const toggle = (
    key: keyof typeof state,
    icon: typeof Bold,
    title: string,
    run: () => void,
  ) => (
    <ToggleButton
      label={title}
      icon={<Icon icon={icon} size="sm" />}
      isIconOnly
      size="sm"
      isPressed={Boolean(state[key])}
      onPressedChange={run}
    />
  );

  return (
    <VStack gap={1}>
      <Text type="label">{label}</Text>
      {description ? <Text type="supporting">{description}</Text> : null}

      <div className="bbs-editor">
        <HStack gap={0.5} vAlign="center" wrap="wrap">
          {toggle("h2", Heading2, "Заголовок H2", () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
          )}
          {toggle("h3", Heading3, "Заголовок H3", () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
          )}
          <Divider orientation="vertical" />
          {toggle("bold", Bold, "Жирний", () =>
            editor.chain().focus().toggleBold().run(),
          )}
          {toggle("italic", Italic, "Курсив", () =>
            editor.chain().focus().toggleItalic().run(),
          )}
          {toggle("underline", Underline, "Підкреслений", () =>
            editor.chain().focus().toggleUnderline().run(),
          )}
          <Divider orientation="vertical" />
          {toggle("bulletList", List, "Маркований список", () =>
            editor.chain().focus().toggleBulletList().run(),
          )}
          {toggle("orderedList", ListOrdered, "Нумерований список", () =>
            editor.chain().focus().toggleOrderedList().run(),
          )}
          {toggle("blockquote", TextQuote, "Цитата", () =>
            editor.chain().focus().toggleBlockquote().run(),
          )}
          <IconButton
            label="Роздільник"
            icon={<Icon icon={Minus} size="sm" />}
            variant="ghost"
            size="sm"
            tooltip="Роздільник"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
          <Divider orientation="vertical" />
          {toggle("link", Link2, "Посилання", openLinkDialog)}
          <IconButton
            label="Зображення"
            icon={<Icon icon={ImageIcon} size="sm" />}
            variant="ghost"
            size="sm"
            tooltip="Вставити зображення"
            isLoading={isUploading}
            onClick={() => fileInputRef.current?.click()}
          />
          <Divider orientation="vertical" />
          <IconButton
            label="Скасувати"
            icon={<Icon icon={Undo2} size="sm" />}
            variant="ghost"
            size="sm"
            tooltip="Скасувати"
            isDisabled={!state.canUndo}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <IconButton
            label="Повторити"
            icon={<Icon icon={Redo2} size="sm" />}
            variant="ghost"
            size="sm"
            tooltip="Повторити"
            isDisabled={!state.canRedo}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </HStack>

        <EditorContent editor={editor} />

        {/* Скрытый input: картинка вставляется через тот же загрузчик, что и обложка. */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            handleImageFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {uploadError ? <Banner status="error" title={uploadError} /> : null}

      {linkDraft !== null ? (
        <Dialog isOpen onOpenChange={() => setLinkDraft(null)} purpose="form" width={440}>
          <Layout
            header={
              <DialogHeader
                title="Посилання"
                subtitle="Порожнє поле прибирає посилання з виділеного тексту"
                onOpenChange={() => setLinkDraft(null)}
              />
            }
            content={
              <LayoutContent>
                <TextInput
                  label="Адреса"
                  value={linkDraft}
                  onChange={setLinkDraft}
                  placeholder="https://"
                  hasAutoFocus
                  width="100%"
                />
              </LayoutContent>
            }
            footer={
              <LayoutFooter>
                <HStack gap={2} hAlign="end">
                  <Button
                    label="Скасувати"
                    variant="ghost"
                    onClick={() => setLinkDraft(null)}
                  />
                  <Button label="Застосувати" variant="primary" onClick={applyLink} />
                </HStack>
              </LayoutFooter>
            }
          />
        </Dialog>
      ) : null}
    </VStack>
  );
}
