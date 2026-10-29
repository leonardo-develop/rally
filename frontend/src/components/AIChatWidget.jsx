import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Bot, MoreHorizontal, Sparkles } from 'lucide-react'

export default function AIChatWidget({ apiUrl, token }) {
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hey, player. Need a hand finding a game, tuning a build, or settling a friendly debate?' }])
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    async function scrollChatToBottom() {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    scrollChatToBottom()
  }, [messages, loading])

  async function send(event) {
    event.preventDefault()
    const text = prompt.trim()
    if (!text || loading) return
    setPrompt('')
    setError('')
    setMessages((current) => [...current, { role: 'user', text }])
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt: text }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'The assistant could not respond.')
      setMessages((current) => [...current, { role: 'assistant', text: data.response }])
    } catch (requestError) {
      setError(requestError.message === 'Failed to fetch' ? 'Could not reach the API.' : requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return <section className="chat-widget"><header className="chat-header"><div className="bot-avatar"><Bot size={19} /></div><div className="chat-title"><b>Rally sidekick <span className="verified-mark">✦</span></b><small><i /> READY WHEN YOU ARE</small></div><button className="chat-menu" title="Chat options"><MoreHorizontal size={19} /></button></header>
    <div className="chat-context"><Sparkles size={14} /><span>GAMING ASSISTANT</span><span className="context-dot" />PRIVATE CHAT</div>
    <div className="messages" aria-live="polite">{messages.map((message, index) => <div className={`message ${message.role}`} key={`${message.role}-${index}`}>{message.role === 'assistant' && <span className="message-bot"><Bot size={14} /></span>}<p>{message.text}</p></div>)}{loading && <div className="message assistant"><span className="message-bot"><Bot size={14} /></span><p className="typing"><i /><i /><i /></p></div>}<div ref={bottomRef} /></div>
    {error && <div className="chat-error" role="alert">{error}</div>}
    <div className="suggestions"><span>TRY ASKING</span><button onClick={() => setPrompt('How do I find teammates for ranked?')}>Find ranked teammates</button><button onClick={() => setPrompt('Suggest a co-op game for two friends.')}>Co-op picks</button></div>
    <form className="chat-composer" onSubmit={send}><label className="sr-only" htmlFor="chat-prompt">Message the gaming assistant</label><textarea id="chat-prompt" rows="2" maxLength="2000" placeholder="Ask your sidekick anything…" value={prompt} onChange={(event) => setPrompt(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form.requestSubmit() } }} /><div className="composer-bottom"><span>ENTER TO SEND · SHIFT + ENTER FOR NEW LINE</span><button className="send-button" type="submit" title="Send message" disabled={!prompt.trim() || loading}><ArrowUp size={17} /></button></div></form>
  </section>
}