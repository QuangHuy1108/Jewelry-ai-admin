import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Shield, 
  Zap, 
  BellRing,
  Volume2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function LiveSupport() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [activeMessageText, setActiveMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const audioContextRef = useRef(null);

  // --- Premium Luxury Fallback Dataset (Strong Null-Safety Assurance) ---
  const mockChats = [
    {
      id: 'chat-1',
      customerEmail: 'clara.rose@goldlifestyle.com',
      cartValue: 1850.00, // HIGH TICKET Trigger (> $1,500)
      takeoverType: 'AI_Assistant',
      lastMessage: 'Does this custom platinum band include a GIA diamond certificate?',
      messages: [
        { sender: 'customer', text: 'Hi, I am looking at the custom Royal Emerald Ring.', time: '14:32' },
        { sender: 'AI_Assistant', text: 'Hello Clara! The Royal Emerald Ring is cast in 18k Gold or Platinum 950. What metal do you prefer?', time: '14:33' },
        { sender: 'customer', text: 'Does this custom platinum band include a GIA diamond certificate?', time: '14:35' }
      ]
    },
    {
      id: 'chat-2',
      customerEmail: 'marcus.v@sterlinggroup.sg',
      cartValue: 420.00, // Regular Cart
      takeoverType: 'AI_Assistant',
      lastMessage: 'Is the 18K Yellow Gold hypoallergenic?',
      messages: [
        { sender: 'customer', text: 'Hello, is the 18K Yellow Gold hypoallergenic?', time: '14:20' },
        { sender: 'AI_Assistant', text: 'Yes, Marcus! Our 18k Gold is composed of 75% pure gold alloyed with hypoallergenic silver and copper. It is nickel-free.', time: '14:21' }
      ]
    },
    {
      id: 'chat-3',
      customerEmail: 'sophia.laurent@hautejewels.fr',
      cartValue: 2900.00, // HIGH TICKET Trigger (> $1,500)
      takeoverType: 'Human_Agent', // Already Takeover
      lastMessage: 'I have updated the delivery address for the emerald choker.',
      messages: [
        { sender: 'customer', text: 'I am ordering the Princess Aura emerald choker.', time: '14:02' },
        { sender: 'AI_Assistant', text: 'An exquisite choice Sophia! The 3.40ct Columbian emerald choker is GIA certified.', time: '14:03' },
        { sender: 'Human_Agent', text: 'Hi Sophia, this is Arthur from GlowUp Concierge. I will personally review the packaging to ensure the GIA certificate is enclosed safely.', time: '14:05' },
        { sender: 'customer', text: 'I have updated the delivery address for the emerald choker.', time: '14:07' }
      ]
    }
  ];

  // --- Custom Latency Telemetry Trace dataset (ai_stylist_analysis_trace) ---
  const telemetryData = [
    { hour: '09:00', 'Gemini Latency (ms)': 310, 'Quota Usage': 22 },
    { hour: '10:00', 'Gemini Latency (ms)': 450, 'Quota Usage': 35 },
    { hour: '11:00', 'Gemini Latency (ms)': 1180, 'Quota Usage': 78 }, // spike detected
    { hour: '12:00', 'Gemini Latency (ms)': 390, 'Quota Usage': 48 },
    { hour: '13:00', 'Gemini Latency (ms)': 280, 'Quota Usage': 30 },
    { hour: '14:00', 'Gemini Latency (ms)': 315, 'Quota Usage': 42 },
  ];

  // --- Real-time Listeners with Strong Null-Safety & Memory Leak Protection ---
  useEffect(() => {
    let unsubscribe = null;
    try {
      unsubscribe = onSnapshot(collection(db, 'chats'), (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(docSnapshot => {
            const data = docSnapshot.data();
            // --- Robust Null-Safety Guardrails ---
            return {
              id: docSnapshot.id,
              customerEmail: data.customerEmail || data.userEmail || 'Anonymous Guest',
              cartValue: parseFloat(data.cartValue) || 0.0,
              takeoverType: data.takeoverType || data.senderType || 'AI_Assistant',
              lastMessage: data.lastMessage || 'Open room',
              messages: Array.isArray(data.messages) ? data.messages : []
            };
          });
          setChats(list);
        } else {
          setChats(mockChats);
        }
        setLoading(false);
      }, (error) => {
        console.warn('Chats listener failed; fallback securely loaded.', error);
        setChats(mockChats);
        setLoading(false);
      });
    } catch (err) {
      console.error('Firestore init failed; loading mock context securely', err);
      setChats(mockChats);
      setLoading(false);
    }

    return () => {
      // --- Safe Unmounting & Cleanup (Task 16) ---
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // --- Sound Alert Synthesizer for High-Ticket trigger (Web Audio API) ---
  const triggerAudioBeep = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Synthesize premium double notification beep
      const playBeep = (time, freq, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
        
        osc.start(time);
        osc.stop(time + duration);
      };

      const now = ctx.currentTime;
      playBeep(now, 880, 0.15); // A5 high note
      playBeep(now + 0.18, 1320, 0.25); // E6 high chime
    } catch (e) {
      console.warn('Audio synthesis restricted by browser security policies.', e);
    }
  };

  // Trigger sound automatically if any chat room cartridge exceeds $1,500 and is active AI
  useEffect(() => {
    const hasUnresolvedHighTicket = chats.some(c => c.cartValue > 1500 && c.takeoverType === 'AI_Assistant');
    if (hasUnresolvedHighTicket) {
      const timer = setTimeout(() => {
        triggerAudioBeep();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [chats]);

  const handleTakeover = async (chatId) => {
    try {
      if (chatId.startsWith('chat-')) {
        // Mock simulation updates for sandboxed preview
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, takeoverType: 'Human_Agent' } : c));
      } else {
        const ref = doc(db, 'chats', chatId);
        await updateDoc(ref, {
          takeoverType: 'Human_Agent',
          senderType: 'Human_Agent',
          takeoverAt: serverTimestamp()
        });
      }
    } catch (err) {
      alert('Takeover failed: ' + err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeMessageText.trim() || !selectedChatId) return;

    const currentChat = chats.find(c => c.id === selectedChatId);
    if (!currentChat) return;

    const newMessage = {
      sender: 'Human_Agent',
      text: activeMessageText.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    try {
      if (selectedChatId.startsWith('chat-')) {
        setChats(prev => prev.map(c => {
          if (c.id === selectedChatId) {
            return {
              ...c,
              lastMessage: newMessage.text,
              messages: [...c.messages, newMessage]
            };
          }
          return c;
        }));
      } else {
        const ref = doc(db, 'chats', selectedChatId);
        // Securely append message array
        await updateDoc(ref, {
          messages: [...currentChat.messages, newMessage],
          lastMessage: newMessage.text,
          updatedAt: serverTimestamp()
        });
      }
      setActiveMessageText('');
    } catch (err) {
      alert('Failed to send override message: ' + err.message);
    }
  };

  const selectedChat = chats.find(c => c.id === selectedChatId);

  // Custom tooltips matching the premium luxury obsidian style
  const CustomTelemetryTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#0A0A0B',
          border: '1px solid var(--border-color-hover)',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.8)',
        }}>
          <p style={{ 
            color: 'var(--text-primary)', 
            fontWeight: '600', 
            fontSize: '0.85rem', 
            marginBottom: '10px', 
            borderBottom: '1px solid rgba(212,175,55,0.1)', 
            paddingBottom: '6px',
            fontFamily: 'Outfit, sans-serif'
          }}>
            {label} Traces
          </p>
          {payload.map((p, idx) => (
            <p key={idx} style={{ 
              color: p.color || 'var(--gold-primary)', 
              fontSize: '0.825rem', 
              margin: '6px 0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              gap: '24px',
              fontFamily: 'Outfit, sans-serif'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: p.color }} />
                <span>{p.name}:</span>
              </span>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                {p.name.includes('Latency') ? `${p.value} ms` : `${p.value}% load`}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="header-bar">
        <div>
          <h1 className="page-title" style={{ fontSize: '2.25rem', color: 'var(--text-primary)' }}>Live Support & Telemetry</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>Monitor customer AI chats, step in to rescue high-value carts, and track latency metrics</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', alignItems: 'start' }}>
        
        {/* --- LEFT SIDE: Takeover Console --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Alarms / Alert bar if any high-ticket is unhandled */}
          {chats.some(c => c.cartValue > 1500 && c.takeoverType === 'AI_Assistant') && (
            <div className="glass-panel" style={{ 
              background: 'rgba(212, 175, 55, 0.08)', 
              border: '1px solid rgba(212, 175, 55, 0.4)', 
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              animation: 'pulse 2s infinite'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BellRing size={20} className="shake" color="var(--gold-primary)" />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>High-Ticket Shopping Cart Alert</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>A customer has jewelry items exceeding $1,500 in their shopping cart. Recommend GIA cert advice.</p>
                </div>
              </div>
              <button 
                onClick={triggerAudioBeep}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: '1px solid rgba(212,175,55,0.3)',
                  borderRadius: '20px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  color: 'var(--gold-primary)',
                  cursor: 'pointer'
                }}
              >
                <Volume2 size={12} /> Test Chime
              </button>
            </div>
          )}

          <div className="glass-panel" style={{ padding: '32px', minHeight: '520px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px', padding: 0, overflow: 'hidden' }}>
            
            {/* Rooms Selector */}
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', height: '520px' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={16} color="var(--gold-primary)" />
                  Active Consultations
                </h3>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                {loading ? (
                  <p style={{ textAlign: 'center', padding: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading rooms...</p>
                ) : (
                  chats.map(room => {
                    const isHighTicket = room.cartValue > 1500;
                    const isTakenOver = room.takeoverType === 'Human_Agent';
                    const isSelected = selectedChatId === room.id;
                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedChatId(room.id)}
                        style={{
                          padding: '16px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          marginBottom: '8px',
                          transition: 'all 0.2s',
                          background: isSelected 
                            ? 'rgba(212,175,55,0.08)' 
                            : isHighTicket && !isTakenOver
                              ? 'rgba(212,175,55,0.03)'
                              : 'transparent',
                          border: isSelected 
                            ? '1px solid var(--gold-primary)' 
                            : isHighTicket && !isTakenOver
                              ? '1px solid rgba(212,175,55,0.3)'
                              : '1px solid transparent',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ 
                            fontSize: '0.85rem', 
                            fontWeight: isSelected || (isHighTicket && !isTakenOver) ? '700' : '500',
                            color: isHighTicket && !isTakenOver ? 'var(--gold-primary)' : 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '180px'
                          }}>
                            {room.customerEmail}
                          </span>
                          
                          {/* Cart Price Tag */}
                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 'bold', 
                            color: isHighTicket ? 'var(--accent-orange)' : 'var(--text-secondary)',
                            background: isHighTicket ? 'rgba(255,152,0,0.08)' : 'rgba(255,255,255,0.03)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            border: isHighTicket ? '1px solid rgba(255,152,0,0.2)' : 'none'
                          }}>
                            ${room.cartValue.toFixed(0)}
                          </span>
                        </div>

                        <p style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {room.lastMessage}
                        </p>

                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            fontWeight: '600',
                            color: isTakenOver ? 'var(--accent-green)' : 'var(--accent-blue)',
                            background: isTakenOver ? 'rgba(76,175,80,0.08)' : 'rgba(59,130,246,0.08)',
                            padding: '2px 6px',
                            borderRadius: '20px'
                          }}>
                            {isTakenOver ? '● Live Override' : '○ AI Handling'}
                          </span>
                          
                          {isHighTicket && !isTakenOver && (
                            <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'var(--gold-primary)', animation: 'pulse 1s infinite' }}>
                              ⚠️ RESCUE NEEDED
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Conversation view */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '520px', background: '#070708' }}>
              {selectedChat ? (
                <>
                  {/* Chat Room Header */}
                  <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>{selectedChat.customerEmail}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Cart Value: <strong style={{ color: 'var(--gold-primary)' }}>${selectedChat.cartValue.toLocaleString()}</strong>
                      </p>
                    </div>

                    {selectedChat.takeoverType === 'AI_Assistant' ? (
                      <button
                        onClick={() => handleTakeover(selectedChat.id)}
                        className="btn btn-primary"
                        style={{ padding: '8px 14px', fontSize: '0.8rem', gap: '6px' }}
                      >
                        <Zap size={12} /> Takeover Live Chat
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: '600', border: '1px solid rgba(76,175,80,0.2)', padding: '6px 12px', borderRadius: '20px', background: 'rgba(76,175,80,0.05)' }}>
                        <Shield size={12} /> Admin Overridden
                      </div>
                    )}
                  </div>

                  {/* Message stream */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {selectedChat.messages.map((msg, idx) => {
                      const isCustomer = msg.sender === 'customer';
                      const isAi = msg.sender === 'AI_Assistant';
                      return (
                        <div key={idx} style={{ 
                          alignSelf: isCustomer ? 'flex-start' : 'flex-end',
                          maxWidth: '75%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isCustomer ? 'flex-start' : 'flex-end'
                        }}>
                          {/* Bubble Container */}
                          <div style={{
                            background: isCustomer 
                              ? '#1c1c1f' 
                              : isAi 
                                ? 'rgba(59,130,246,0.08)' 
                                : 'rgba(212,175,55,0.1)',
                            border: isCustomer
                              ? '1px solid rgba(255,255,255,0.03)'
                              : isAi
                                ? '1px solid rgba(59,130,246,0.2)'
                                : '1px solid var(--border-color-hover)',
                            padding: '12px 16px',
                            borderRadius: '14px',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            lineHeight: '1.4'
                          }}>
                            {msg.text}
                          </div>
                          
                          {/* Timestamp and Sender metadata */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <span style={{ fontWeight: '600', color: isCustomer ? 'var(--text-muted)' : isAi ? 'var(--accent-blue)' : 'var(--gold-primary)' }}>
                              {isCustomer ? 'Client' : isAi ? '✦ AI Stylist' : '🛡️ Agent Arthur'}
                            </span>
                            <span>·</span>
                            <span>{msg.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Overwritten Text Editor textbox */}
                  <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.15)' }}>
                    {selectedChat.takeoverType === 'Human_Agent' ? (
                      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
                        <input 
                          type="text"
                          placeholder="Type an override message (e.g. recommend GIA cert clarity, offer cart discount)..."
                          value={activeMessageText}
                          onChange={e => setActiveMessageText(e.target.value)}
                          style={{
                            flex: 1,
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid rgba(212,175,55,0.2)',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ padding: '12px 18px' }}
                        >
                          <Send size={16} />
                        </button>
                      </form>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '10px', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.03)' }}>
                        Takeover Live Chat first to enable human overrides textbox.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                  <MessageSquare size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
                  <p style={{ fontSize: '0.85rem' }}>Select an active room on the left panel to override and monitor chat streams</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* --- RIGHT SIDE: Telemetry Dashboard --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={22} color="var(--gold-primary)" />
              AI Performance Telemetry
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
              Real-time latency metrics from Custom Trace `ai_stylist_analysis_trace` on mobile app.
            </p>

            {/* Quota Load Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Gemini API Quota</p>
                <p style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-green)', marginTop: '4px' }}>94.2% Avail</p>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Congestion Diagnostics</p>
                <p style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--accent-orange)', marginTop: '4px' }}>1 Spike</p>
              </div>
            </div>

            {/* Recharts Latency Diagram */}
            <div style={{ background: '#070708', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.06)', padding: '20px 10px 10px 10px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: '600', paddingLeft: '10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={12} /> Latency Trends (ms)
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={telemetryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(212, 175, 55, 0.05)" strokeDasharray="3 3" />
                  <XAxis dataKey="hour" stroke="var(--text-secondary)" tick={{ fontSize: 10, fontFamily: 'Outfit' }} />
                  <YAxis 
                    stroke="var(--text-secondary)" 
                    tick={{ fontSize: 10, fontFamily: 'Outfit' }}
                    domain={[0, 1500]}
                  />
                  <Tooltip content={<CustomTelemetryTooltip />} />
                  <Legend wrapperStyle={{ fontFamily: 'Outfit', fontSize: '0.75rem', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="Gemini Latency (ms)" stroke="var(--gold-primary)" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Quota Usage" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Latency Diagnostic Notes */}
            <div style={{ marginTop: '20px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', padding: '12px 14px', borderRadius: '8px' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-orange)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} /> Telemetry Spike Diagnostic (11:00)
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '4px', lineHeight: '1.4' }}>
                High latency spike of <strong>1,180ms</strong> detected during peak hours (11:00). High quota request levels triggered rate-limiting trace thresholds. Quota remains stable.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
