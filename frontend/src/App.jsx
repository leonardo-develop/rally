import { useState } from 'react'
import { ArrowUpRight, Gamepad2, LogOut, Radio, Sparkles, Users } from 'lucide-react'
import Auth from './components/Auth.jsx'
import LobbyList from './components/LobbyList.jsx'
import AIChatWidget from './components/AIChatWidget.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [session, setSession] = useState(null)
  const [activeTab, setActiveTab] = useState('discover')
  const [notice, setNotice] = useState('')

  function handleSignOut() {
    setSession(null)
    setNotice('')
  }

  if (!session) {
    return <Auth apiUrl={API_URL} onAuthenticated={setSession} />
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="Rally home"><span className="brand-mark"><Gamepad2 size={20} /></span>rally<span className="brand-period">.</span></a>
        <div className="side-label">YOUR SPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <button className={activeTab === 'discover' ? 'side-link active' : 'side-link'} onClick={() => setActiveTab('discover')}><Radio size={17} /> Discover</button>
          <button className={activeTab === 'friends' ? 'side-link active' : 'side-link'} onClick={() => setActiveTab('friends')}><Users size={17} /> Friends <span className="nav-count">3</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="status-block"><span className="online-dot" /> Servers operational</div>
          <button className="profile-row" onClick={handleSignOut} title="Sign out"><span className="avatar">{session.user.username.slice(0, 1).toUpperCase()}</span><span className="profile-copy"><b>{session.user.username}</b><small>Online now</small></span><LogOut size={16} /></button>
        </div>
      </aside>

      <section className="main-column">
        <header className="topbar"><div className="breadcrumbs">COMMUNITY <span>/</span> {activeTab.toUpperCase()}</div><div className="topbar-right"><span className="live-indicator"><i /> 1,284 playing</span><button className="icon-button" title="Open profile" onClick={handleSignOut}><span className="avatar avatar-small">{session.user.username.slice(0, 1).toUpperCase()}</span></button></div></header>
        <div className="content-wrap">
          {activeTab === 'discover' ? <>
            <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line" /> YOUR NEXT GREAT GAME STARTS HERE</div><h1>Find your<br /><em>people.</em></h1><p className="welcome-copy">Good games are better together. Drop into a lobby and make tonight count.</p></div><div className="welcome-stats"><span className="stat-icon"><Sparkles size={18} /></span><div><b>18</b><small>active lobbies</small></div><ArrowUpRight size={17} /></div></section>
            {notice && <div className="notice" role="status">{notice}</div>}
            <LobbyList onJoin={(lobby) => setNotice(`You're in ${lobby.name}. Your party invite is ready.`)} />
          </> : <section className="friends-panel"><div className="eyebrow"><span className="eyebrow-line" /> YOUR SQUAD</div><h1>Friends <em>online.</em></h1><p className="welcome-copy">Your friends list is ready for its backend connection.</p><div className="friend-row"><span className="avatar friend-avatar">M</span><span><b>mossbyte</b><small>In a match · VALORANT</small></span><span className="online-dot" /></div><div className="friend-row"><span className="avatar friend-avatar orange">K</span><span><b>k1tty.exe</b><small>Looking for group</small></span><span className="online-dot" /></div><div className="friend-row"><span className="avatar friend-avatar blue">R</span><span><b>rivenfall</b><small>Online</small></span><span className="online-dot" /></div></section>}
          <footer className="page-footer"><span>RALLY COMMUNITY</span><span>PLAY KIND. PLAY TOGETHER.</span></footer>
        </div>
      </section>
      <aside className="chat-column"><AIChatWidget apiUrl={API_URL} token={session.access_token} /></aside>
    </main>
  )
}