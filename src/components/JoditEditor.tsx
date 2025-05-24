// JoditEditor.tsx
"use client";
import React, { useMemo, useRef } from "react";
import dynamic from "next/dynamic";

//import JoditEditor from "jodit-react";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});

const JEditor = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (contentString: string) => void;
}) => {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
      enableDragAndDropFileToEditor: true,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_as_html" as const,
      beautifyHTML: false,
      paste: {
        keepAttributes: ["style", "class"],
        clearFormatting: false,
        useNativeClipboard: true,
        forcePasteAsText: false,
      },
    }),
    [placeholder]
  );
  //console.log({ placeholder, value, onChange, config, editor });
  if (typeof window === "undefined") {
    return <div>Loading...</div>;
  }

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      onChange={onChange}
    />
  );
};

export default JEditor;
