import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchChannels, fetchChannel, postMessage, createChannel } from '../api/projects';
import { useAuth } from '../context/AuthContext';

export default function Teamwork() {
  const { user } = useAuth();
  const [channels, setChannels]   = useState([]);
  const [active, setActive]       = useState(null);
  const [messages, setMessages]   = useState([]);
  const [text, setText]           = useState('');
  const [newCh, setNewCh]         = useState('');
  const [error, setError]         = useState('');
  const [sending, setSending]     = useState(false);
  const bottomRef  = useRef();
  const pollRef    = useRef();
  const activeRef  = useRef(active);

  // Keep activeRef in sync so polling uses latest active channel
  useEffect(() => { activeRef.current = active; }, [active]);

  // Load all channels on mount
  const loadChannels = useCallback(async () => {
    try {
      const r = await fetchChannels();
      setChannels(r.data.channels);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadChannels();
  }, [loadChannels]);

  // Auto-select first channel
  useEffect(() => {
    if (channels.length > 0 && !active) {
      setActive(channels[0]);
    }
  }, [channels]);

  // Poll messages every 3 seconds
  const loadMessages = useCallback(async (channelId) => {
    try {
      const r = await fetchChannel(channelId);
      setMessages(r.data.channel.messages || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    loadMessages(active._id);

    // Start polling
    pollRef.current = setInterval(() => {
      if (activeRef.current) loadMessages(activeRef.current._id);
    }, 3000);

    return () => clearInterval(pollRef.current);
  }, [active, loadMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !active || sending) return;
    setSending(true);
    try {
      await postMessage(active._id, text.trim());
      setText('');
      await loadMessages(active._id);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleCreateChannel = async () => {
    if (!newCh.trim()) return;
    setError('');
    try {
      const r = await createChannel({ name: newCh.trim() });
      setNewCh('');
      await loadChannels();
      setActive(r.data.channel);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create channel');
    }
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={s.container}>
      {/* ── SIDEBAR ── */}
      <div style={s.sidebar}>
        <div style={s.sideHead}>TEAMWORK</div>

        <div style={s.channelList}>
          {channels.map(ch => (
            <div
              key={ch._id}
              style={{
                ...s.chItem,
                background: active?._id === ch._id ? 'rgba(124,110,250,.15)' : 'transparent',
                color: active?._id === ch._id ? '#7C6EFA' : 'var(--muted2)',
                fontWeight: active?._id === ch._id ? 700 : 400,
              }}
              onClick={() => setActive(ch)}
            >
              # {ch.name}
            </div>
          ))}
        </div>

        {/* New channel input */}
        <div style={s.newChArea}>
          {error && <div style={s.err}>{error}</div>}
          <div style={s.newChRow}>
            <input
              style={s.newChInput}
              placeholder="New channel name"
              value={newCh}
              onChange={e => { setNewCh(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleCreateChannel()}
            />
            <button style={s.newChBtn} onClick={handleCreateChannel}>+</button>
          </div>
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      <div style={s.chat}>
        {!active ? (
          <div style={s.empty}>Select a channel to start chatting 💬</div>
        ) : (
          <>
            {/* Header */}
            <div style={s.chatHead}>
              <span style={s.chatTitle}># {active.name}</span>
              <span style={s.chatSub}>All team members · updates every 3s</span>
            </div>

            {/* Messages */}
            <div style={s.messages}>
              {messages.length === 0 && (
                <div style={s.noMsg}>No messages yet. Say hello! 👋</div>
              )}
              {messages.map((m, i) => {
                const isMe = m.senderName === user?.name;
                const showName = i === 0 || messages[i - 1]?.senderName !== m.senderName;
                return (
                  <div key={i} style={{ ...s.msg, alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                    {showName && (
                      <div style={s.msgMeta}>
                        <span style={{ ...s.msgName, color: isMe ? '#7C6EFA' : '#34D399' }}>
                          {m.senderName || 'User'}
                        </span>
                        <span style={s.msgTime}>{formatTime(m.createdAt)}</span>
                      </div>
                    )}
                    <div style={{
                      ...s.bubble,
                      background: isMe ? '#7C6EFA' : 'var(--s2)',
                      color: isMe ? '#fff' : 'var(--text)',
                      borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    }}>
                      {m.text}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={s.inputRow}>
              <input
                style={s.input}
                placeholder={`Message #${active.name}`}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button style={{ ...s.sendBtn, opacity: sending ? 0.6 : 1 }} onClick={handleSend} disabled={sending}>
                {sending ? '...' : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  container:   { display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden', background: 'var(--bg)' },
  sidebar:     { width: 220, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  sideHead:    { fontSize: 11, fontWeight: 700, color: 'var(--muted2)', padding: '18px 16px 10px', letterSpacing: '.08em' },
  channelList: { flex: 1, overflowY: 'auto', padding: '0 6px' },
  chItem:      { padding: '8px 12px', borderRadius: 7, fontSize: 14, cursor: 'pointer', transition: 'all .15s', marginBottom: 2 },
  newChArea:   { padding: '10px 10px 14px', borderTop: '1px solid var(--border)' },
  err:         { fontSize: 11, color: '#F87171', marginBottom: 6, padding: '0 2px' },
  newChRow:    { display: 'flex', gap: 6 },
  newChInput:  { flex: 1, padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border2)', background: 'var(--s2)', color: 'var(--text)', fontSize: 12, outline: 'none' },
  newChBtn:    { padding: '7px 12px', background: '#7C6EFA', border: 'none', borderRadius: 7, cursor: 'pointer', color: '#fff', fontSize: 16, fontWeight: 700 },
  chat:        { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  chatHead:    { padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 },
  chatTitle:   { fontWeight: 700, fontSize: 15, color: 'var(--text)' },
  chatSub:     { fontSize: 11, color: 'var(--muted2)' },
  messages:    { flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 },
  noMsg:       { textAlign: 'center', color: 'var(--muted2)', fontSize: 14, padding: 40 },
  msg:         { display: 'flex', flexDirection: 'column', marginBottom: 4 },
  msgMeta:     { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 },
  msgName:     { fontSize: 12, fontWeight: 700 },
  msgTime:     { fontSize: 11, color: 'var(--muted2)' },
  bubble:      { maxWidth: '70%', padding: '8px 14px', fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word' },
  inputRow:    { padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 },
  input:       { flex: 1, padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--s2)', color: 'var(--text)', fontSize: 14, outline: 'none' },
  sendBtn:     { padding: '10px 22px', background: '#7C6EFA', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 },
  empty:       { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted2)', fontSize: 15 },
};