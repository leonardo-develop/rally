import { useState } from 'react'
import { ArrowUpRight, ChevronDown, Headphones, Users } from 'lucide-react'

const lobbies = [
  { name: 'Late night ranked', game: 'VALORANT', mode: 'Competitive · Gold–Plat', members: 3, max: 5, tag: 'VOICE ON', color: 'lime', initials: ['M', 'J', 'S'] },
  { name: 'First run, no spoilers', game: 'ELDEN RING', mode: 'Co-op · New players welcome', members: 2, max: 4, tag: 'CHILL', color: 'coral', initials: ['A', 'K'] },
  { name: 'One more drop?', game: 'APEX LEGENDS', mode: 'Trios · Any rank', members: 2, max: 3, tag: 'MIC NEEDED', color: 'blue', initials: ['R', 'T'] },
  { name: 'Cozy farm evening', game: 'STARDEW VALLEY', mode: 'Co-op · Year 2', members: 1, max: 4, tag: '18+', color: 'yellow', initials: ['P'] },
]

export default function LobbyList({ onJoin }) {
  const [filter, setFilter] = useState('All games')
  const [joined, setJoined] = useState([])
  const filtered = filter === 'All games' ? lobbies : lobbies.filter((lobby) => lobby.game === filter.toUpperCase())

  function join(lobby) {
    setJoined((current) => [...current, lobby.name])
    onJoin(lobby)
  }

  return <section className="lobby-section"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> OPEN PARTIES</div><h2>Find a lobby<span className="heading-count">04</span></h2></div><label className="filter-select"><span className="sr-only">Filter by game</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All games</option>{[...new Set(lobbies.map((lobby) => lobby.game))].map((game) => <option key={game}>{game}</option>)}</select><ChevronDown size={15} /></label></div>
    <div className="lobby-list">{filtered.map((lobby, index) => <article className="lobby-row" key={lobby.name} style={{ animationDelay: `${index * 70}ms` }}><div className={`game-glyph ${lobby.color}`}><span>{lobby.game.split(' ').map((word) => word[0]).join('').slice(0, 2)}</span><i /></div><div className="lobby-info"><div className="lobby-title-line"><h3>{lobby.name}</h3><span className={`lobby-tag ${lobby.color}`}>{lobby.tag}</span></div><div className="lobby-subline"><b>{lobby.game}</b><span>·</span><span>{lobby.mode}</span></div></div><div className="lobby-members"><div className="member-stack">{lobby.initials.map((initial, memberIndex) => <span className={`member-avatar member-${memberIndex}`} key={initial + memberIndex}>{initial}</span>)}</div><span><Users size={13} /> {lobby.members}/{lobby.max}</span></div><button className={joined.includes(lobby.name) ? 'join-button joined' : 'join-button'} onClick={() => join(lobby)} disabled={joined.includes(lobby.name)}>{joined.includes(lobby.name) ? 'Joined' : 'Join'} {!joined.includes(lobby.name) && <ArrowUpRight size={15} />}</button></article>)}</div>
    <button className="browse-button" onClick={() => setFilter('All games')}>Browse all lobbies <ArrowUpRight size={15} /></button><div className="voice-note"><Headphones size={15} /><span>Most parties are on voice. Bring a mic, bring good vibes.</span></div></section>
}