"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { Folder, workspace } from "@/lib/supabase/supabase-types";
import React, { useCallback, useRef, useState, useEffect } from "react";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  dirDetails: File | Folder | workspace;
  fileId: string;
  dirType: "workspace" | "folder" | "file";
}

var TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const QuillEditor: React.FC<QuillEditorProps> = ({
  dirDetails,
  dirType,
  fileId,
}) => {
  const [quill, setQuill] = useState<any>(null);
  const { state, workspaceId, folderId, dispatch } = useAppState();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  //   const wrapperRef = useCallback(async (wrapper: HTMLDivElement |null) => {
  //     if (typeof window !== "undefined" && wrapper) {
  //       if (wrapper === null) return;
  //       wrapper.innerHTML = "";
  //       const editor = document.createElement("div");
  //       wrapper.append(editor);
  //       const Quill = (await import("quill")).default;
  //       // WIP cursor
  //       const q = new Quill(editor, {
  //         theme: "snow",
  //         modules: {
  //           toolbar: TOOLBAR_OPTIONS,
  //           // WIP cursor
  //         },
  //       });
  //       setQuill(q);
  //     }
  //   }, []);

  useEffect(() => {
    const initializeQuill = async () => {
      if (!wrapperRef.current || typeof window === "undefined") return;

      // Clear existing content
      wrapperRef.current.innerHTML = "";

      // Create the editor div
      const editor = document.createElement("div");
      wrapperRef.current.append(editor);

      // Dynamically import Quill
      const Quill = (await import("quill")).default;

      const q = new Quill(editor, {
        theme: "snow",
        modules: {
          toolbar: TOOLBAR_OPTIONS,
          // Add other modules if needed
        },
      });

      setQuill(q); // Set the Quill instance
    };

    initializeQuill();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center flex-col mt-2 relative">
        <div className="max-w-[800px]" id="container" ref={wrapperRef}></div>
      </div>
    </>
  );
};

export default QuillEditor;