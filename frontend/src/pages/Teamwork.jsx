import { useEffect, useState, useRef } from 'react';
import { fetchChannels, fetchChannel, postMessage, createChannel } from '../api/projects';
import { useAuth } from '../context/AuthContext';

export default function Teamwork() {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [newCh, setNewCh] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    fetchChannels().then(r => setChannels(r.data.channels)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!active) return;
    fetchChannel(active._id)
      .then(r => setMessages(r.data.channel.messages))
      .catch(console.error);
  }, [active]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !active) return;
    await postMessage(active._id, text);
    setText('');
    const r = await fetchChannel(active._id);
    setMessages(r.data.channel.messages);
  };

  const handleCreateChannel = async () => {
    if (!newCh.trim()) return;
    await createChannel({ name: newCh, members: [user?.id] });
    setNewCh('');
    const r = await fetchChannels();
    setChannels(r.data.channels);
  };

  return (
    <div style={s.container}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sideHead}>Teamwork</div>
        {channels.map(ch => (
          <div
            key={ch._id}
            style={{ ...s.chItem, background: active?._id === ch._id ? 'var(--color-background-tertiary)' : 'transparent' }}
            onClick={() => setActive(ch)}
          >
            # {ch.name}
            {ch.department !== 'general' && (
              <span style={s.tag}>{ch.department}</span>
            )}
          </div>
        ))}
        <div style={s.newCh}>
          <input
            style={s.newChInput}
            placeholder="New channel name"
            value={newCh}
            onChange={e => setNewCh(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateChannel()}
          />
          <button style={s.newChBtn} onClick={handleCreateChannel}>+</button>
        </div>
      </div>

      {/* Chat area */}
      <div style={s.chat}>
        {!active ? (
          <div style={s.empty}>Select a channel to start chatting</div>
        ) : (
          <>
            <div style={s.chatHead}># {active.name}</div>
            <div style={s.messages}>
              {messages.map((m, i) => (
                <div key={i} style={s.msg}>
                  <span style={s.msgName}>{m.senderName || 'User'}</span>
                  <span style={s.msgTime}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <p style={s.msgText}>{m.text}</p>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div style={s.inputRow}>
              <input
                style={s.input}
                placeholder={`Message #${active.name}`}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button style={s.sendBtn} onClick={handleSend}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  container: { display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' },
  sidebar: { width: 220, borderRight: '1px solid var(--color-border-tertiary)', padding: '16px 0', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  sideHead: { fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', padding: '0 16px 12px', textTransform: 'uppercase', letterSpacing: '.05em' },
  chItem: { padding: '8px 16px', fontSize: 14, color: 'var(--color-text-primary)', cursor: 'pointer', borderRadius: 6, margin: '0 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tag: { fontSize: 10, background: 'var(--color-background-tertiary)', padding: '2px 6px', borderRadius: 8, color: 'var(--color-text-secondary)' },
  newCh: { display: 'flex', gap: 6, padding: '12px 10px 0', marginTop: 'auto' },
  newChInput: { flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--color-border-secondary)', background: 'var(--color-background-tertiary)', color: 'var(--color-text-primary)', fontSize: 12 },
  newChBtn: { padding: '6px 10px', background: 'var(--color-background-tertiary)', border: '1px solid var(--color-border-secondary)', borderRadius: 6, cursor: 'pointer', color: 'var(--color-text-primary)', fontSize: 16 },
  chat: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  chatHead: { padding: '14px 20px', borderBottom: '1px solid var(--color-border-tertiary)', fontWeight: 500, fontSize: 15, color: 'var(--color-text-primary)' },
  messages: { flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 },
  msg: { borderRadius: 8 },
  msgName: { fontWeight: 500, fontSize: 13, color: 'var(--color-text-primary)', marginRight: 8 },
  msgTime: { fontSize: 11, color: 'var(--color-text-secondary)' },
  msgText: { margin: '4px 0 0', fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.5 },
  inputRow: { padding: '12px 20px', borderTop: '1px solid var(--color-border-tertiary)', display: 'flex', gap: 10 },
  input: { flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--color-border-secondary)', background: 'var(--color-background-secondary)', color: 'var(--color-text-primary)', fontSize: 14 },
  sendBtn: { padding: '10px 20px', background: '#7C6EFA', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 },
  empty: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: 14 },
};