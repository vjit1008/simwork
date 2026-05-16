// frontend/src/components/EmojiPicker.jsx
import { useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

export default function EmojiPicker({ onEmojiSelect }) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div style={{ position: "relative" }} ref={pickerRef}>
      {/* Emoji button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        title="Emoji"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "20px",
          padding: "0 8px",
          color: open ? "#7c6af7" : "#888",
          transition: "color 0.15s",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        😊
      </button>

      {/* Picker popup — floats above the input bar */}
      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "42px",
            left: "0",
            zIndex: 1000,
          }}
        >
          <Picker
            data={data}
            theme="dark"
            onEmojiSelect={(emoji) => {
              onEmojiSelect(emoji.native);
              setOpen(false);
            }}
            previewPosition="none"
            skinTonePosition="none"
          />
        </div>
      )}
    </div>
  );
}