import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchChannels, createChannel } from '../api/projects';
import { useAuth } from '../context/AuthContext';
import EmojiPicker from './EmojiPicker';
import API from '../api/axios';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉'];
const AVATAR_COLORS   = ['#7C6EFA','#34D399','#F59E0B','#F87171','#60A5FA','#A78BFA','#EC4899'];

const avatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
const initials    = (name) => {
  if (!name) return '?';
  const p = name.trim().split(' ');
  return (p.length >= 2 ? p[0][0] + p[p.length - 1][0] : name[0]).toUpperCase();
};

export default function Teamwork() {
  const { user } = useAuth();

  /* ── core state ── */
  const [channels,      setChannels]      = useState([]);
  const [active,        setActive]        = useState(null);
  const [messages,      setMessages]      = useState([]);
  const [text,          setText]          = useState('');
  const [newCh,         setNewCh]         = useState('');
  const [chError,       setChError]       = useState('');
  const [sending,       setSending]       = useState(false);

  /* ── feature state ── */
  const [search,        setSearch]        = useState('');
  const [showSearch,    setShowSearch]    = useState(false);
  const [replyTo,       setReplyTo]       = useState(null);
  const [hovered,       setHovered]       = useState(null);
  const [editingId,     setEditingId]     = useState(null);
  const [editText,      setEditText]      = useState('');
  const [typingUsers,   setTypingUsers]   = useState([]);
  const [unread,        setUnread]        = useState({});
  const [reactionMsgId, setReactionMsgId] = useState(null);
  const [mentionList,   setMentionList]   = useState([]);
  const [showMentions,  setShowMentions]  = useState(false);

  /* ── refs ── */
  const bottomRef      = useRef();
  const pollRef        = useRef();
  const activeRef      = useRef(active);
  const typingTimer    = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => { activeRef.current = active; }, [active]);

  /* ════ helpers ════ */
  const lastRead    = (id) => parseInt(localStorage.getItem(`lr_${id}`) || '0');
  const markRead    = (id) => localStorage.setItem(`lr_${id}`, Date.now().toString());

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDate = (ts) => {
    const d = new Date(ts), now = new Date();
    const yest = new Date(); yest.setDate(now.getDate() - 1);
    if (d.toDateString() === now.toDateString())  return 'Today';
    if (d.toDateString() === yest.toDateString()) return 'Yesterday';
    return d.toLocaleDateString([], { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  };

  /* ════ data loading ════ */
  const loadChannels = useCallback(async () => {
    try { const r = await fetchChannels(); setChannels(r.data.channels); }
    catch (e) { console.error(e); }
  }, []);

  useEffect(() => { loadChannels(); }, [loadChannels]);
  useEffect(() => {
    if (channels.length > 0 && !active) setActive(channels[0]);
  }, [channels]);

  const loadMessages = useCallback(async (channelId) => {
    try {
      const r   = await API.get(`/api/channels/${channelId}`);
      const msgs = r.data.channel.messages || [];
      setMessages(msgs);

      /* typing users — filter stale (> 4 s) */
      const typing = (r.data.channel.typingUsers || []).filter(
        t => Date.now() - new Date(t.updatedAt).getTime() < 4000 && t.name !== user?.name
      );
      setTypingUsers(typing);

      /* unread counts for OTHER channels */
      channels.forEach(ch => {
        if (ch._id !== activeRef.current?._id) {
          API.get(`/api/channels/${ch._id}`).then(res => {
            const m  = res.data.channel.messages || [];
            const lr = lastRead(ch._id);
            const cnt = m.filter(msg =>
              new Date(msg.createdAt).getTime() > lr && msg.senderName !== user?.name
            ).length;
            setUnread(prev => ({ ...prev, [ch._id]: cnt }));
          }).catch(() => {});
        }
      });
    } catch (e) { console.error(e); }
  }, [user, channels]);

  useEffect(() => {
    if (!active) return;
    markRead(active._id);
    setUnread(prev => ({ ...prev, [active._id]: 0 }));
    loadMessages(active._id);

    pollRef.current = setInterval(() => {
      if (activeRef.current) loadMessages(activeRef.current._id);
    }, 3000);

    return () => clearInterval(pollRef.current);
  }, [active, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ════ derived data ════ */
  const knownMembers   = [...new Set(messages.map(m => m.senderName).filter(Boolean))];
  const filteredMsgs   = search.trim()
    ? messages.filter(m => m.text?.toLowerCase().includes(search.toLowerCase())
        || m.senderName?.toLowerCase().includes(search.toLowerCase()))
    : messages;

  /* ════ actions ════ */
  const switchChannel = (ch) => {
    setActive(ch); setSearch(''); setShowSearch(false);
    setReplyTo(null); markRead(ch._id);
    setUnread(prev => ({ ...prev, [ch._id]: 0 }));
  };

  const handleTextChange = (val) => {
    setText(val);
    /* @mention detection */
    const words = val.split(/\s/);
    const last  = words[words.length - 1];
    if (last.startsWith('@') && last.length > 1) {
      const q = last.slice(1).toLowerCase();
      const hits = knownMembers.filter(n => n.toLowerCase().includes(q) && n !== user?.name);
      setMentionList(hits); setShowMentions(hits.length > 0);
    } else { setShowMentions(false); }

    /* typing indicator */
    if (active) {
      API.post(`/api/channels/${active._id}/typing`, { isTyping: true }).catch(() => {});
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        API.post(`/api/channels/${active._id}/typing`, { isTyping: false }).catch(() => {});
      }, 2000);
    }
  };

  const insertMention = (name) => {
    const words = text.split(/\s/);
    words[words.length - 1] = `@${name} `;
    setText(words.join(' ')); setShowMentions(false); inputRef.current?.focus();
  };

  const handleSend = async () => {
    if (!text.trim() || !active || sending) return;
    setSending(true);
    try {
      await API.post(`/api/channels/${active._id}/message`, {
        text: text.trim(),
        replyTo: replyTo ? { text: replyTo.text, senderName: replyTo.senderName } : null,
      });
      setText(''); setReplyTo(null); markRead(active._id);
      await loadMessages(active._id);
      API.post(`/api/channels/${active._id}/typing`, { isTyping: false }).catch(() => {});
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  const handleReaction = async (msgId, emoji) => {
    try {
      await API.post(`/api/channels/${active._id}/message/${msgId}/react`, { emoji });
      await loadMessages(active._id);
    } catch (e) { console.error(e); }
    setReactionMsgId(null);
  };

  const handleDelete = async (msgId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await API.delete(`/api/channels/${active._id}/message/${msgId}`);
      await loadMessages(active._id);
    } catch (e) { console.error(e); }
  };

  const handleEditSubmit = async (msgId) => {
    if (!editText.trim()) return;
    try {
      await API.put(`/api/channels/${active._id}/message/${msgId}`, { text: editText.trim() });
      setEditingId(null); await loadMessages(active._id);
    } catch (e) { console.error(e); }
  };

  const handleCreateChannel = async () => {
    if (!newCh.trim()) return; setChError('');
    try {
      const r = await createChannel({ name: newCh.trim() });
      setNewCh(''); await loadChannels(); setActive(r.data.channel);
    } catch (e) { setChError(e.response?.data?.message || 'Failed to create channel'); }
  };

  /* ════ render ════ */
  return (
    <>
      <style>{`
        @keyframes typing-bounce {
          0%,80%,100% { transform:scale(0.6); opacity:.4 }
          40%          { transform:scale(1);   opacity:1   }
        }
        .mention-item:hover { background: rgba(124,110,250,.12); }
        .action-btn:hover   { background: rgba(255,255,255,.08); }
        .ch-item:hover      { background: rgba(124,110,250,.08) !important; }
        .reaction-chip:hover{ background: rgba(124,110,250,.25) !important; }
      `}</style>

      <div style={s.container}>

        {/* ── SIDEBAR ── */}
        <div style={s.sidebar}>
          <div style={s.sideHead}>TEAMWORK</div>
          <div style={s.channelList}>
            {channels.map(ch => {
              const isActive = active?._id === ch._id;
              const cnt      = unread[ch._id] || 0;
              return (
                <div key={ch._id} className="ch-item" style={{
                  ...s.chItem,
                  background: isActive ? 'rgba(124,110,250,.15)' : 'transparent',
                  color:      isActive ? '#7C6EFA' : 'var(--muted2)',
                  fontWeight: isActive ? 700 : 400,
                }} onClick={() => switchChannel(ch)}>
                  <span># {ch.name}</span>
                  {cnt > 0 && !isActive && (
                    <span style={s.badge}>{cnt > 9 ? '9+' : cnt}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div style={s.newChArea}>
            {chError && <div style={s.err}>{chError}</div>}
            <div style={s.newChRow}>
              <input style={s.newChInput} placeholder="New channel name" value={newCh}
                onChange={e => { setNewCh(e.target.value); setChError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleCreateChannel()} />
              <button style={s.newChBtn} onClick={handleCreateChannel}>+</button>
            </div>
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div style={s.chat}>
          {!active ? (
            <div style={s.empty}>Select a channel to start chatting 💬</div>
          ) : (<>

            {/* Header */}
            <div style={s.chatHead}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={s.chatTitle}># {active.name}</span>
                <span style={s.chatSub}>All team members · updates every 3s</span>
              </div>
              <button style={s.iconBtn} onClick={() => { setShowSearch(p => !p); setSearch(''); }}>🔍</button>
            </div>

            {/* Search bar */}
            {showSearch && (
              <div style={{ padding:'8px 16px', borderBottom:'1px solid var(--border)' }}>
                <input autoFocus style={{ ...s.input, margin:0 }}
                  placeholder="Search messages…" value={search}
                  onChange={e => setSearch(e.target.value)} />
              </div>
            )}

            {/* Messages */}
            <div style={s.messages}>
              {filteredMsgs.length === 0 && (
                <div style={s.noMsg}>
                  {search ? '🔍 No messages match your search.' : 'No messages yet. Say hello! 👋'}
                </div>
              )}

              {filteredMsgs.map((m, i) => {
                const isMe      = m.senderName === user?.name;
                const showName  = i === 0 || filteredMsgs[i-1]?.senderName !== m.senderName;
                const showDate  = i === 0 || new Date(m.createdAt).toDateString() !== new Date(filteredMsgs[i-1].createdAt).toDateString();
                const isEditing = editingId === m._id;
                const isHov     = hovered === i;
                const showRxns  = reactionMsgId === m._id;

                return (
                  <div key={m._id || i}>

                    {/* Date separator */}
                    {showDate && (
                      <div style={s.dateSep}>
                        <div style={s.dateLine} />
                        <span style={s.dateLabel}>{formatDate(m.createdAt)}</span>
                        <div style={s.dateLine} />
                      </div>
                    )}

                    <div
                      style={{ ...s.msg, alignItems: isMe ? 'flex-end' : 'flex-start', position:'relative' }}
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => { setHovered(null); if (reactionMsgId === m._id) setReactionMsgId(null); }}
                    >
                      {/* Name + avatar row */}
                      {showName && (
                        <div style={{ ...s.msgMeta, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                          <div style={{
                            width:28, height:28, borderRadius:'50%',
                            background: avatarColor(m.senderName),
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:11, fontWeight:700, color:'#fff', flexShrink:0,
                          }}>
                            {initials(m.senderName)}
                          </div>
                          <span style={{ ...s.msgName, color: isMe ? '#7C6EFA' : '#34D399' }}>
                            {m.senderName || 'User'}
                          </span>
                          <span style={s.msgTime}>{formatTime(m.createdAt)}</span>
                          {m.edited && <span style={{ fontSize:10, color:'var(--muted2)' }}>(edited)</span>}
                        </div>
                      )}

                      {/* Reply quote */}
                      {m.replyTo?.text && (
                        <div style={{
                          ...s.replyQuote,
                          alignSelf: isMe ? 'flex-end' : 'flex-start',
                          borderLeft:  isMe ? 'none' : '3px solid #7C6EFA',
                          borderRight: isMe ? '3px solid #7C6EFA' : 'none',
                        }}>
                          <b style={{ fontSize:11 }}>{m.replyTo.senderName}</b>
                          <span style={{ fontSize:12, color:'var(--muted2)', marginLeft:6 }}>
                            {m.replyTo.text?.slice(0,80)}{m.replyTo.text?.length > 80 ? '…' : ''}
                          </span>
                        </div>
                      )}

                      {/* Bubble / edit input */}
                      {isEditing ? (
                        <div style={{ display:'flex', gap:6, maxWidth:'70%' }}>
                          <input autoFocus value={editText}
                            onChange={e => setEditText(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter')  handleEditSubmit(m._id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            style={{ ...s.input, margin:0, flex:1, fontSize:13 }} />
                          <button onClick={() => handleEditSubmit(m._id)} style={s.sendBtn}>✓</button>
                          <button onClick={() => setEditingId(null)} style={{ ...s.sendBtn, background:'var(--s2)', color:'var(--muted2)' }}>✕</button>
                        </div>
                      ) : (
                        <div style={{
                          ...s.bubble,
                          background: m.deleted ? 'transparent' : isMe ? '#7C6EFA' : 'var(--s2)',
                          color:      m.deleted ? 'var(--muted2)' : isMe ? '#fff' : 'var(--text)',
                          fontStyle:  m.deleted ? 'italic' : 'normal',
                          border:     m.deleted ? '1px dashed var(--border)' : 'none',
                          borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        }}>
                          {m.text}
                        </div>
                      )}

                      {/* Reaction chips */}
                      {m.reactions?.length > 0 && (
                        <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:4 }}>
                          {m.reactions.map((r, ri) => (
                            <button key={ri} className="reaction-chip"
                              onClick={() => handleReaction(m._id, r.emoji)}
                              style={s.reactionChip}>
                              {r.emoji} <span style={{ fontSize:11 }}>{r.users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Hover action bar */}
                      {isHov && !isEditing && !m.deleted && (
                        <div style={{ ...s.actionBar, [isMe ? 'left' : 'right']: 0 }}>
                          {showRxns ? (
                            <>
                              {QUICK_REACTIONS.map(emoji => (
                                <button key={emoji} className="action-btn" style={s.actionBtn}
                                  onClick={() => handleReaction(m._id, emoji)}>{emoji}</button>
                              ))}
                              <button className="action-btn" style={s.actionBtn}
                                onClick={() => setReactionMsgId(null)}>✕</button>
                            </>
                          ) : (
                            <button className="action-btn" style={s.actionBtn} title="React"
                              onClick={() => setReactionMsgId(m._id)}>😊</button>
                          )}
                          <button className="action-btn" style={s.actionBtn} title="Reply"
                            onClick={() => setReplyTo(m)}>↩</button>
                          {isMe && (<>
                            <button className="action-btn" style={s.actionBtn} title="Edit"
                              onClick={() => { setEditingId(m._id); setEditText(m.text); }}>✏️</button>
                            <button className="action-btn" style={s.actionBtn} title="Delete"
                              onClick={() => handleDelete(m._id)}>🗑️</button>
                          </>)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 0', marginTop:4 }}>
                  <div style={{ display:'flex', gap:3 }}>
                    {[0,1,2].map(i => (
                      <span key={i} style={{
                        width:6, height:6, borderRadius:'50%',
                        background:'var(--muted2)', display:'inline-block',
                        animation:`typing-bounce 1.2s ${i*0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize:12, color:'var(--muted2)' }}>
                    {typingUsers.map(t => t.name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing…
                  </span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Reply preview */}
            {replyTo && (
              <div style={s.replyPreview}>
                <span style={{ fontSize:12, color:'var(--muted2)' }}>
                  ↩ Replying to <b>{replyTo.senderName}</b>: {replyTo.text?.slice(0,60)}{replyTo.text?.length > 60 ? '…' : ''}
                </span>
                <button onClick={() => setReplyTo(null)}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted2)', fontSize:16 }}>✕</button>
              </div>
            )}

            {/* Input */}
            <div style={{ position:'relative' }}>
              {/* @mention dropdown */}
              {showMentions && (
                <div style={s.mentionDropdown}>
                  {mentionList.map(name => (
                    <div key={name} className="mention-item" style={s.mentionItem}
                      onClick={() => insertMention(name)}>
                      <div style={{
                        width:22, height:22, borderRadius:'50%',
                        background: avatarColor(name),
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:10, fontWeight:700, color:'#fff',
                      }}>{initials(name)}</div>
                      {name}
                    </div>
                  ))}
                </div>
              )}

              <div style={s.inputRow}>
                <EmojiPicker onEmojiSelect={emoji => setText(p => p + emoji)} />
                <input ref={inputRef} style={s.input}
                  placeholder={`Message #${active.name}`}
                  value={text}
                  onChange={e => handleTextChange(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) handleSend();
                    if (e.key === 'Escape') { setReplyTo(null); setShowMentions(false); }
                  }} />
                <button style={{ ...s.sendBtn, opacity: sending ? 0.6 : 1 }}
                  onClick={handleSend} disabled={sending}>
                  {sending ? '…' : 'Send'}
                </button>
              </div>
            </div>
          </>)}
        </div>
      </div>
    </>
  );
}

/* ── styles ── */
const s = {
  container:       { display:'flex', height:'calc(100vh - 56px)', overflow:'hidden', background:'var(--bg)' },
  sidebar:         { width:220, borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', flexShrink:0 },
  sideHead:        { fontSize:11, fontWeight:700, color:'var(--muted2)', padding:'18px 16px 10px', letterSpacing:'.08em' },
  channelList:     { flex:1, overflowY:'auto', padding:'0 6px' },
  chItem:          { padding:'8px 12px', borderRadius:7, fontSize:14, cursor:'pointer', transition:'all .15s', marginBottom:2, display:'flex', alignItems:'center', justifyContent:'space-between' },
  badge:           { background:'#F87171', color:'#fff', borderRadius:10, fontSize:10, fontWeight:700, padding:'1px 6px', minWidth:16, textAlign:'center' },
  newChArea:       { padding:'10px 10px 14px', borderTop:'1px solid var(--border)' },
  err:             { fontSize:11, color:'#F87171', marginBottom:6, padding:'0 2px' },
  newChRow:        { display:'flex', gap:6 },
  newChInput:      { flex:1, padding:'7px 10px', borderRadius:7, border:'1px solid var(--border2)', background:'var(--s2)', color:'var(--text)', fontSize:12, outline:'none' },
  newChBtn:        { padding:'7px 12px', background:'#7C6EFA', border:'none', borderRadius:7, cursor:'pointer', color:'#fff', fontSize:16, fontWeight:700 },
  chat:            { flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
  chatHead:        { padding:'14px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' },
  chatTitle:       { fontWeight:700, fontSize:15, color:'var(--text)' },
  chatSub:         { fontSize:11, color:'var(--muted2)' },
  iconBtn:         { background:'none', border:'none', cursor:'pointer', fontSize:16, padding:'4px 8px', borderRadius:6, color:'var(--muted2)' },
  messages:        { flex:1, overflowY:'auto', padding:'16px 20px', display:'flex', flexDirection:'column', gap:2 },
  noMsg:           { textAlign:'center', color:'var(--muted2)', fontSize:14, padding:40 },
  msg:             { display:'flex', flexDirection:'column', marginBottom:4 },
  msgMeta:         { display:'flex', alignItems:'center', gap:6, marginBottom:3 },
  msgName:         { fontSize:12, fontWeight:700 },
  msgTime:         { fontSize:11, color:'var(--muted2)' },
  bubble:          { maxWidth:'70%', padding:'8px 14px', fontSize:14, lineHeight:1.5, wordBreak:'break-word' },
  replyQuote:      { maxWidth:'70%', padding:'4px 10px', background:'rgba(124,110,250,.08)', borderRadius:6, marginBottom:3, display:'flex', alignItems:'center', gap:4 },
  replyPreview:    { padding:'8px 16px', borderTop:'1px solid var(--border)', background:'rgba(124,110,250,.06)', display:'flex', alignItems:'center', justifyContent:'space-between' },
  inputRow:        { padding:'12px 16px', borderTop:'1px solid var(--border)', display:'flex', gap:10, alignItems:'center' },
  input:           { flex:1, padding:'10px 14px', borderRadius:10, border:'1px solid var(--border2)', background:'var(--s2)', color:'var(--text)', fontSize:14, outline:'none' },
  sendBtn:         { padding:'10px 22px', background:'#7C6EFA', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontWeight:700, fontSize:14 },
  empty:           { flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted2)', fontSize:15 },
  dateSep:         { display:'flex', alignItems:'center', gap:10, margin:'16px 0 10px', color:'var(--muted2)', fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em' },
  dateLine:        { flex:1, height:1, background:'var(--border)' },
  dateLabel:       {},
  actionBar:       { position:'absolute', top:-36, display:'flex', gap:2, background:'var(--s1)', border:'1px solid var(--border)', borderRadius:8, padding:'3px 5px', zIndex:10, boxShadow:'0 2px 10px rgba(0,0,0,.3)' },
  actionBtn:       { background:'none', border:'none', cursor:'pointer', fontSize:15, padding:'2px 5px', borderRadius:4, lineHeight:1 },
  reactionChip:    { background:'rgba(124,110,250,.1)', border:'1px solid rgba(124,110,250,.2)', borderRadius:12, padding:'2px 8px', cursor:'pointer', fontSize:13, display:'flex', alignItems:'center', gap:4 },
  mentionDropdown: { position:'absolute', bottom:'100%', left:52, background:'var(--s1)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden', zIndex:100, minWidth:180, boxShadow:'0 4px 16px rgba(0,0,0,.3)' },
  mentionItem:     { display:'flex', alignItems:'center', gap:8, padding:'8px 12px', cursor:'pointer', fontSize:13, color:'var(--text)', transition:'background .1s' },
};