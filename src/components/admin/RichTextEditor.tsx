"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface RichTextEditorProps {
  name: string;
  label: string;
  initialValue?: string;
}

export default function RichTextEditor({ name, label, initialValue = "" }: RichTextEditorProps) {
  const [html, setHtml] = useState(initialValue);
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialValue || "<p></p>",
    editorProps: {
      attributes: {
        class: "admin-input min-h-[260px] resize-y overflow-auto focus:outline-none",
      },
    },
    onUpdate: ({ editor: current }) => {
      setHtml(current.getHTML());
    },
    immediatelyRender: false,
  });

  const toolbarButtonClass = "admin-btn admin-btn-secondary px-2 py-1 text-xs";

  if (!editor) {
    return (
      <div className="mb-4">
        <label className="admin-input-label">{label}</label>
        <div className="admin-input min-h-[260px]">Loading editor...</div>
        <input type="hidden" name={name} defaultValue={initialValue} />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="admin-input-label">{label}</label>
      <p className="admin-subheading mb-2">TIPTAP EDITOR</p>
      <div className="flex flex-wrap gap-1 mb-2">
        <button type="button" className={toolbarButtonClass} onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </button>
        <button type="button" className={toolbarButtonClass} onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </button>
        <button type="button" className={toolbarButtonClass} onClick={() => editor.chain().focus().toggleStrike().run()}>
          S
        </button>
        <button type="button" className={toolbarButtonClass} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          UL
        </button>
        <button type="button" className={toolbarButtonClass} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          OL
        </button>
        <button type="button" className={toolbarButtonClass} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button type="button" className={toolbarButtonClass} onClick={() => editor.chain().focus().setParagraph().run()}>
          P
        </button>
      </div>

      <EditorContent editor={editor} />

      <input type="hidden" name={name} value={html} />
    </div>
  );
}
