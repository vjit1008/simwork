import { useEffect, useRef, useState } from "react";

const EMOJIS = {
  "😊 Smileys": ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥸","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️","😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗","🤔","🫣","🤭","🫡","🤫","🤥","😶","😐","😑","😬","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤","😪","😵","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕"],
  "👋 Gestures": ["👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🙏","✍️","💅","🤳","💪","🦵","🦶","👂","🦻","👃","🫀","🫁","🧠","🦷","🦴","👀","👁️","👅","👄","🫦"],
  "❤️ Hearts": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☯️","🕊️","🌈"],
  "🎉 Celebration": ["🎉","🎊","🎈","🎁","🎀","🏆","🥇","🥈","🥉","🏅","🎖️","🎗️","🎟️","🎫","🎠","🎡","🎢","🎪","🤹","🎭","🎨","🎬","🎤","🎧","🎼","🎵","🎶","🎻","🥁","🎷","🎺","🎸","🪕","🎮","🕹️","🃏","🀄","🎲","🧩","♟️"],
  "🔥 Popular": ["🔥","⚡","✨","💫","⭐","🌟","💥","❄️","🌊","🍀","🌸","🌺","🌻","🌹","🌷","💐","🍁","🍂","🍃","🌿","☘️","🌱","🌴","🌵","🎋","🎍","🍄","🌾","💧","🌙","☀️","🌤️","⛅","🌈","🌪️","⛈️","🌩️","❄️","☃️","⛄","🌊","🔮","🧿","🪬"],
  "😺 Animals": ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐻‍❄️","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧","🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🕷️","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🦧","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🦬","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐈‍⬛","🪶","🐓","🦃","🦤","🦚","🦜","🦢","🦩","🕊️","🐇","🦝","🦨","🦡","🦫","🦦","🦥","🐁","🐀","🐿️","🦔"],
  "🍕 Food": ["🍕","🍔","🌮","🌯","🥙","🧆","🥚","🍳","🥘","🍲","🥣","🥗","🍿","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍟","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🥠","🥡","🦀","🦞","🦐","🦑","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍼","🥛","☕","🫖","🍵","🧃","🥤","🧋","🍶","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧉","🍾"],
};

export default function EmojiPicker({ onEmojiSelect }) {
  const [open, setOpen]       = useState(false);
  const [tab, setTab]         = useState(Object.keys(EMOJIS)[0]);
  const [search, setSearch]   = useState("");
  const ref                   = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = search.trim()
    ? Object.values(EMOJIS).flat().filter(e => e.includes(search))
    : EMOJIS[tab];

  return (
    <div ref={ref} style={{ position: "relative", display: "flex", alignItems: "center" }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 20, padding: "0 8px", lineHeight: 1,
          color: open ? "#7C6EFA" : "#888", transition: "color .15s",
        }}
        title="Emoji"
      >😊</button>

      {open && (
        <div style={{
          position: "absolute", bottom: 44, left: 0, zIndex: 9999,
          width: 320, background: "#1a1a2e", border: "1px solid #2e2e4a",
          borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,.5)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          {/* Search */}
          <div style={{ padding: "10px 10px 6px" }}>
            <input
              autoFocus
              placeholder="Search emoji…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "7px 10px", borderRadius: 8,
                border: "1px solid #2e2e4a", background: "#12122a",
                color: "#fff", fontSize: 13, outline: "none",
              }}
            />
          </div>

          {/* Category tabs */}
          {!search && (
            <div style={{ display: "flex", overflowX: "auto", padding: "0 6px 4px", gap: 2, scrollbarWidth: "none" }}>
              {Object.keys(EMOJIS).map(cat => (
                <button
                  key={cat}
                  onClick={() => setTab(cat)}
                  title={cat}
                  style={{
                    background: tab === cat ? "#7C6EFA22" : "none",
                    border: "none", borderRadius: 7, cursor: "pointer",
                    fontSize: 16, padding: "4px 7px", flexShrink: 0,
                    opacity: tab === cat ? 1 : 0.5, transition: "all .15s",
                  }}
                >
                  {cat.split(" ")[0]}
                </button>
              ))}
            </div>
          )}

          {/* Emoji grid */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(8, 1fr)",
            gap: 2, padding: "6px 8px 10px", maxHeight: 220, overflowY: "auto",
          }}>
            {filtered.map((emoji, i) => (
              <button
                key={i}
                onClick={() => { onEmojiSelect(emoji); setOpen(false); setSearch(""); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 20, padding: 4, borderRadius: 6,
                  transition: "background .1s", lineHeight: 1,
                }}
                onMouseEnter={e => e.target.style.background = "#7C6EFA33"}
                onMouseLeave={e => e.target.style.background = "none"}
              >
                {emoji}
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "span 8", textAlign: "center", color: "#555", padding: 20, fontSize: 13 }}>
                No results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}