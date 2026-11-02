// Product UI mockups for the case studies — pure HTML/SVG so they stay crisp at any scale.

const spark = (pts: number[], w = 300, h = 90) =>
  pts.map((v, i) => `${i ? 'L' : 'M'}${((i / (pts.length - 1)) * w).toFixed(1)} ${(h - v * h).toFixed(1)}`).join(' ')

export function BankMock() {
  const line = [0.2, 0.28, 0.24, 0.4, 0.36, 0.5, 0.46, 0.62, 0.58, 0.74, 0.7, 0.86]
  return (
    <div className="mock mock-bank">
      <aside>
        <b className="mk-logo">kairo</b>
        {['Overview', 'Invoices', 'Payouts', 'Taxes', 'Cards'].map((n, i) => (
          <span key={n} className={i === 0 ? 'on' : ''}>
            {n}
          </span>
        ))}
      </aside>
      <div className="mk-main">
        <div className="mk-top">
          <div>
            <small>Available balance</small>
            <strong>€48,210.64</strong>
          </div>
          <span className="mk-badge">+12.4% this month</span>
        </div>
        <svg viewBox="0 0 300 90" preserveAspectRatio="none" className="mk-chart">
          <path d={`${spark(line)} L300 90 L0 90Z`} className="area" />
          <path d={spark(line)} className="stroke" />
        </svg>
        <div className="mk-rows">
          {[
            ['Studio Nord', 'Paid', '€6,400'],
            ['Lumen Audio', 'Due in 3d', '€2,150'],
            ['Field Notes', 'Draft', '€980'],
          ].map(([a, b, c]) => (
            <div key={a} className="mk-row">
              <i />
              <span>{a}</span>
              <em>{b}</em>
              <b>{c}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ClimateMock() {
  // dot-matrix "map" with a heat blob — deterministic so it doesn't jump between renders
  const dots = []
  for (let y = 0; y < 14; y++)
    for (let x = 0; x < 26; x++) {
      const land = Math.sin(x * 0.45) + Math.cos(y * 0.6 + x * 0.12) > -0.2 && !(x > 9 && x < 13 && y > 6)
      if (!land) continue
      const heat = Math.max(0, 1 - Math.hypot(x - 17, y - 5) / 6)
      dots.push(<circle key={`${x}-${y}`} cx={x * 12 + 8} cy={y * 12 + 8} r={2 + heat * 2.6} style={{ opacity: 0.25 + heat * 0.75 }} className={heat > 0.35 ? 'hot' : ''} />)
    }
  return (
    <div className="mock mock-climate">
      <div className="mk-head">
        <b>nimbus</b>
        <span>CH₄ · Last 30 days</span>
        <span className="mk-live">● Live</span>
      </div>
      <svg viewBox="0 0 320 176" className="mk-map">
        {dots}
      </svg>
      <div className="mk-stats">
        {[
          ['Plumes detected', '1,284'],
          ['Avg. intensity', '3.7 t/h'],
          ['Sites flagged', '96'],
        ].map(([a, b]) => (
          <div key={a}>
            <small>{a}</small>
            <strong>{b}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AudioMock() {
  const bars = Array.from({ length: 64 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)) * 0.75)
  return (
    <div className="mock mock-audio">
      <div className="mk-cover">
        <span>LIVE</span>
        <b>Night Shift</b>
        <small>w/ Ama K. — Lisbon</small>
      </div>
      <div className="mk-player">
        <div className="mk-wave">
          {bars.map((h, i) => (
            <i key={i} style={{ height: `${h * 100}%` }} className={i < 26 ? 'played' : ''} />
          ))}
        </div>
        <div className="mk-controls">
          <span>41:07</span>
          <button aria-label="Pause">❚❚</button>
          <span>1:58:00</span>
        </div>
        <div className="mk-crates">
          {['Dub techno', 'Amapiano', 'Ambient', 'Jazz edits'].map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
