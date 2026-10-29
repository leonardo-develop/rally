import { useState } from 'react'
import { Gamepad2, MoveRight, ShieldCheck } from 'lucide-react'

export default function Auth({ apiUrl, onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'register' ? form : { email: form.email, password: form.password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Could not sign in')
      onAuthenticated(data)
    } catch (requestError) {
      setError(requestError.message === 'Failed to fetch' ? 'Cannot reach the API. Check that the backend is running.' : requestError.message)
    } finally {
      setLoading(false)
    }
  }

  async function discordStub() {
    try {
      const response = await fetch(`${apiUrl}/api/auth/discord`, { method: 'POST' })
      const data = await response.json()
      setError(data.detail || 'Discord OAuth is not configured.')
    } catch {
      setError('Cannot reach the API. Check that the backend is running.')
    }
  }

  return (
    <main className="auth-screen">
      <div className="auth-art"><div className="art-grid" /><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-stamp"><Gamepad2 size={30} /><span>PLAY<br />TOGETHER</span></div><div className="art-caption"><span>RALLY / 001</span><span>COMMUNITY BUILT FOR PLAYERS</span></div></div>
      <section className="auth-panel"><a className="brand auth-brand" href="#home"><span className="brand-mark"><Gamepad2 size={20} /></span>rally<span className="brand-period">.</span></a><div className="auth-content"><div className="eyebrow"><span className="eyebrow-line" /> YOUR PEOPLE ARE HERE</div><h1>Make room<br />for <em>one more.</em></h1><p className="auth-lead">A better place to find your next party, game, and favorite teammate.</p>
        <div className="auth-tabs" role="tablist"><button className={mode === 'login' ? 'auth-tab selected' : 'auth-tab'} onClick={() => { setMode('login'); setError('') }}>Log in</button><button className={mode === 'register' ? 'auth-tab selected' : 'auth-tab'} onClick={() => { setMode('register'); setError('') }}>Create account</button></div>
        <form className="auth-form" onSubmit={submit}>
          {mode === 'register' && <label>GAMER TAG<input autoComplete="username" required minLength="3" maxLength="32" pattern="[a-zA-Z0-9_]+" placeholder="e.g. mossbyte" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} /></label>}
          <label>EMAIL<input type="email" autoComplete="email" required maxLength="254" placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label>PASSWORD<input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} required minLength={mode === 'register' ? 8 : 1} maxLength="128" placeholder={mode === 'register' ? 'At least 8 characters' : 'Your password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="submit-button" type="submit" disabled={loading}>{loading ? 'One moment…' : mode === 'login' ? 'Enter the lobby' : 'Create your account'} <MoveRight size={17} /></button>
        </form>
        <div className="auth-divider"><span /> OR <span /></div><button className="discord-button" onClick={discordStub}><span className="discord-mark">◉</span> Continue with Discord</button><p className="auth-security"><ShieldCheck size={14} /> Your account details are encrypted and secure.</p>
      </div><div className="auth-bottom"><span>RALLY COMMUNITY PLATFORM</span><span>EST. FOR THE SQUAD</span></div></section>
    </main>
  )
}