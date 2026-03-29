import React, { useRef, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Dashboard.css';

// ─────────────────────────────────────────
// Archetype Engine
// ─────────────────────────────────────────
const getArchetype = (d) => {
  const { nightRatio = 0, bugRate = 0, refactorRate = 0, weekendRatio = 0, burnoutScore = 0 } = d;

  if (burnoutScore > 65 && nightRatio > 0.5)
    return {
      id: 'burnout-machine',
      title: 'The Burnout Machine',
      emoji: '💀',
      color: '#ef4444',
      glow: 'rgba(239,68,68,0.15)',
      border: 'rgba(239,68,68,0.25)',
      desc: 'You ship at all hours, bugs and all. The codebase fears you — and so does your sleep schedule.',
      traits: ['Night Owl', 'High Output', 'Bug Prone', 'Overclocked'],
    };

  if (nightRatio > 0.55 && bugRate > 0.35)
    return {
      id: 'midnight-firefighter',
      title: 'The Midnight Firefighter',
      emoji: '🔥',
      color: '#f97316',
      glow: 'rgba(249,115,22,0.15)',
      border: 'rgba(249,115,22,0.25)',
      desc: 'You live in the dark, patching fires. Every commit at 2am is a battle scar.',
      traits: ['Night Coder', 'Crisis Driven', 'Reactive', 'Battle-Hardened'],
    };

  if (bugRate < 0.15 && refactorRate > 0.35)
    return {
      id: 'silent-architect',
      title: 'The Silent Architect',
      emoji: '🧠',
      color: '#818cf8',
      glow: 'rgba(129,140,248,0.15)',
      border: 'rgba(129,140,248,0.25)',
      desc: 'Calm, deliberate, surgical. You refactor before others even notice the smell.',
      traits: ['Low Bug Rate', 'Refactor Heavy', 'Methodical', 'Precision Coder'],
    };

  if (weekendRatio > 0.4 && burnoutScore < 50)
    return {
      id: 'weekend-warrior',
      title: 'The Weekend Warrior',
      emoji: '⚡',
      color: '#facc15',
      glow: 'rgba(250,204,21,0.15)',
      border: 'rgba(250,204,21,0.25)',
      desc: 'Mon–Fri is just warmup. You hit different on weekends — hyperfocused, unstoppable.',
      traits: ['Weekend Peak', 'Burst Coder', 'Self-Driven', 'Side Project Energy'],
    };

  if (nightRatio < 0.2 && bugRate < 0.2 && burnoutScore < 35)
    return {
      id: 'zen-coder',
      title: 'The Zen Coder',
      emoji: '🌿',
      color: '#4ade80',
      glow: 'rgba(74,222,128,0.15)',
      border: 'rgba(74,222,128,0.25)',
      desc: 'Balanced, healthy, consistent. You code in daylight, ship clean, and actually log off.',
      traits: ['Day Coder', 'Low Burnout', 'Stable Output', 'Clean Commits'],
    };

  return {
    id: 'ghost-committer',
    title: 'The Ghost Committer',
    emoji: '👻',
    color: '#94a3b8',
    glow: 'rgba(148,163,184,0.15)',
    border: 'rgba(148,163,184,0.2)',
    desc: 'Consistent, quiet, unclassifiable. You show up, get it done, leave no trace.',
    traits: ['Steady Pace', 'Mixed Hours', 'Reliable', 'Unfazed'],
  };
};

// ─────────────────────────────────────────
// Commit Heatmap (7 days × 24 hours)
// ─────────────────────────────────────────
const CommitHeatmap = ({ hourlyData = [] }) => {
  const days   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours  = Array.from({ length: 24 }, (_, i) => i);
  const maxVal = Math.max(...hourlyData.flat(), 1);

  const getColor = (val) => {
    if (!val || val === 0) return 'rgba(255,255,255,0.03)';
    const pct   = val / maxVal;
    const isDanger = /* late night */ true;
    if (pct > 0.7)  return '#adf822';
    if (pct > 0.45) return '#5d9e12';
    if (pct > 0.2)  return '#2d5a07';
    return '#162e04';
  };

  const getBorderColor = (val, hour) => {
    if (!val) return 'transparent';
    const pct = val / maxVal;
    if (pct > 0.7) return 'rgba(173,248,34,0.5)';
    return 'transparent';
  };

  const isDangerHour = (h) => h >= 0 && h <= 5;

  return (
    <div className="heatmap-wrap">
      {/* Hour axis top */}
      <div className="heatmap-hour-axis">
        <div className="heatmap-day-spacer" />
        {hours.map(h => (
          <div key={h} className="heatmap-hour-label">
            {h % 6 === 0 ? `${h}h` : ''}
          </div>
        ))}
      </div>

      {/* Grid rows */}
      {days.map((day, di) => (
        <div key={day} className="heatmap-row">
          <div className="heatmap-day-label">{day}</div>
          {hours.map(hi => {
            const val = hourlyData[di]?.[hi] ?? 0;
            return (
              <div
                key={hi}
                className="heatmap-cell"
                style={{
                  background: getColor(val),
                  border: `1px solid ${getBorderColor(val, hi)}`,
                  boxShadow: val / maxVal > 0.7
                    ? '0 0 6px rgba(173,248,34,0.3)'
                    : 'none',
                  outline: isDangerHour(hi) ? '1px solid rgba(239,68,68,0.08)' : 'none',
                }}
                title={`${day} ${hi}:00 — ${val} commits`}
              />
            );
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="heatmap-legend">
        <span className="heatmap-legend-label">Less</span>
        {['rgba(255,255,255,0.03)', '#162e04', '#2d5a07', '#5d9e12', '#adf822'].map((c, i) => (
          <div key={i} className="heatmap-legend-cell" style={{ background: c }} />
        ))}
        <span className="heatmap-legend-label">More</span>
        <div className="heatmap-legend-danger">
          <div className="heatmap-legend-danger-swatch" />
          <span>Danger zone (0–5h)</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Peak Hours Bar Chart (canvas)
// ─────────────────────────────────────────
const PeakHoursChart = ({ hourlyTotals = [] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W   = canvas.width;
    const H   = canvas.height;
    const max = Math.max(...hourlyTotals, 1);

    ctx.clearRect(0, 0, W, H);

    const barW   = W / 24;
    const padX   = barW * 0.25;

    hourlyTotals.forEach((val, i) => {
      const pct      = val / max;
      const barH     = pct * (H - 28);
      const x        = i * barW + padX;
      const y        = H - barH - 18;
      const isDanger = i >= 0 && i <= 5;
      const isPeak   = pct > 0.7;

      // Bar fill
      const grad = ctx.createLinearGradient(0, y + barH, 0, y);
      if (isDanger) {
        grad.addColorStop(0, 'rgba(239,68,68,0.1)');
        grad.addColorStop(1, 'rgba(239,68,68,0.6)');
      } else if (isPeak) {
        grad.addColorStop(0, '#2d5a07');
        grad.addColorStop(1, '#adf822');
      } else {
        grad.addColorStop(0, '#0a1a04');
        grad.addColorStop(1, '#3a7a0a');
      }

      ctx.beginPath();
      ctx.roundRect(x, y, barW - padX * 2, barH, [3, 3, 0, 0]);
      ctx.fillStyle = grad;
      ctx.fill();

      if (isPeak) {
        ctx.shadowBlur  = 10;
        ctx.shadowColor = '#adf822';
        ctx.fill();
        ctx.shadowBlur  = 0;
      }

      // Hour label
      if (i % 6 === 0) {
        ctx.fillStyle = '#444';
        ctx.font      = "400 9px 'JetBrains Mono', monospace";
        ctx.textAlign = 'center';
        ctx.fillText(`${i}h`, x + (barW - padX * 2) / 2, H - 4);
      }
    });

    // Danger zone bracket
    ctx.strokeStyle = 'rgba(239,68,68,0.2)';
    ctx.lineWidth   = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, H - 18);
    ctx.lineTo(6 * barW, H - 18);
    ctx.lineTo(6 * barW, 0);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [hourlyTotals]);

  return (
    <div className="peak-chart-wrap">
      <canvas ref={canvasRef} width={800} height={180} style={{ width: '100%', height: 'auto' }} />
      <div className="peak-chart-labels">
        <div className="peak-danger-tag">⚠ danger zone</div>
        <div className="peak-info">Peak commit hours highlighted in neon</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Developer Archetype Card
// ─────────────────────────────────────────
const ArchetypeCard = ({ archetype, developerName }) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`archetype-card ${revealed ? 'archetype-revealed' : ''}`}
      style={{
        '--arc-color':  archetype.color,
        '--arc-glow':   archetype.glow,
        '--arc-border': archetype.border,
      }}
    >
      {/* Glow backdrop */}
      <div className="archetype-glow-bg" />

      {/* Top row */}
      <div className="archetype-top">
        <div className="archetype-emoji-wrap">
          <span className="archetype-emoji">{archetype.emoji}</span>
        </div>
        <div className="archetype-meta">
          <span className="archetype-eyebrow">DEVELOPER ARCHETYPE</span>
          <h2 className="archetype-title" style={{ color: archetype.color }}>
            {archetype.title}
          </h2>
          <p className="archetype-name">{developerName}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="archetype-divider" style={{ background: archetype.border }} />

      {/* Description */}
      <p className="archetype-desc">{archetype.desc}</p>

      {/* Trait tags */}
      <div className="archetype-traits">
        {archetype.traits.map((t, i) => (
          <span
            key={t}
            className="archetype-trait"
            style={{
              color: archetype.color,
              borderColor: archetype.border,
              background: archetype.glow,
              animationDelay: `${i * 80}ms`,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* DNA sequence decoration */}
      <div className="archetype-dna-strip">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="dna-bit"
            style={{
              background: i % 3 === 0
                ? archetype.color
                : 'rgba(255,255,255,0.06)',
              animationDelay: `${i * 40}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Dashboard Page
// ─────────────────────────────────────────
const Dashboard = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [repoUrl, setRepoUrl] = useState('');

  // Try to reuse result from navigation state, else prompt
  useEffect(() => {
    const state = location.state?.result;
    if (state) {
      setData(state);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const handleFetch = async () => {
    if (!repoUrl) return;
    setLoading(true);
    try {
      const [analyzeRes, burnoutRes] = await Promise.all([
        fetch('https://commit-dna-3.onrender.com/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repoUrl }),
        }),
        fetch('https://commit-dna-3.onrender.com/api/burnout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ repoUrl }),
        }),
      ]);
      const a = await analyzeRes.json();
      const b = burnoutRes.ok ? await burnoutRes.json() : {};
      setData({ ...a, ...b });
    } catch (e) {
      alert('Failed: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Derive hourly totals (sum across days) for peak chart
  const hourlyTotals = data?.hourlyData
    ? Array.from({ length: 24 }, (_, h) =>
        (data.hourlyData).reduce((sum, day) => sum + (day[h] ?? 0), 0)
      )
    : [];

  const archetype = data ? getArchetype(data) : null;

  return (
    <div className="db-container">
      <Navbar />

      <div className="db-inner">

        {/* ── Header ── */}
        <div className="db-header">
          <div>
            <span className="db-eyebrow">DEVELOPER DASHBOARD</span>
            <h1 className="db-title">
              {data?.developerName
                ? <>{data.developerName}<span className="db-title-dot">.</span></>
                : 'Analyze a Repo'}
            </h1>
          </div>

          {data && (
            <button className="db-reset-btn" onClick={() => setData(null)}>
              ↩ New Analysis
            </button>
          )}
        </div>

        {/* ── No data state — input ── */}
        {!data && !loading && (
          <div className="db-empty">
            <p className="db-empty-label">No repo loaded. Enter a GitHub URL to begin.</p>
            <div className="db-input-row">
              <input
                type="text"
                className="db-input"
                placeholder="https://github.com/user/repo"
                value={repoUrl}
                onChange={e => setRepoUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFetch()}
              />
              <button className="db-analyze-btn" onClick={handleFetch}>
                ANALYZE
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="db-loading">
            <div className="db-loading-bar" />
            <span>DECODING DNA...</span>
          </div>
        )}

        {/* ── Main content ── */}
        {data && !loading && (
          <>

            {/* ── Row 1: Archetype Card + Stats ── */}
            <div className="db-grid-top">

              <ArchetypeCard archetype={archetype} developerName={data.developerName} />

              {/* Quick stat pills */}
              <div className="db-stat-col">
                {[
                  { label: 'TOTAL COMMITS',  val: data.totalCommits,                        unit: '',      color: '#fff' },
                  { label: 'BURNOUT SCORE',  val: data.burnoutScore?.toFixed(1) ?? '—',     unit: '/ 100', color: data.burnoutScore > 60 ? '#ef4444' : data.burnoutScore > 30 ? '#f59e0b' : '#4ade80' },
                  { label: 'BUG RATE',       val: (data.bugRate * 100).toFixed(1),           unit: '%',     color: data.bugRate > 0.3 ? '#ef4444' : '#4ade80' },
                  { label: 'NIGHT RATIO',    val: (data.nightRatio * 100).toFixed(1),        unit: '%',     color: data.nightRatio > 0.5 ? '#f97316' : '#aaa' },
                  { label: 'WEEKEND RATIO',  val: (data.weekendRatio * 100).toFixed(1),      unit: '%',     color: '#aaa' },
                  { label: 'REFACTOR RATE',  val: (data.refactorRate * 100).toFixed(1),      unit: '%',     color: '#aaa' },
                ].map(({ label, val, unit, color }) => (
                  <div key={label} className="db-stat-pill">
                    <span className="db-stat-label">{label}</span>
                    <span className="db-stat-val" style={{ color }}>
                      {val}<span className="db-stat-unit">{unit}</span>
                    </span>
                  </div>
                ))}
              </div>

            </div>

            {/* ── Row 2: Heatmap ── */}
            <div className="db-card">
              <div className="db-card-header">
                <h3 className="db-card-title">COMMIT HEATMAP</h3>
                <span className="db-card-sub">Activity by day × hour</span>
              </div>
              <CommitHeatmap hourlyData={data.hourlyData ?? []} />
            </div>

            {/* ── Row 3: Peak Hours ── */}
            <div className="db-card">
              <div className="db-card-header">
                <h3 className="db-card-title">PEAK CODING HOURS</h3>
                <span className="db-card-sub">Total commits per hour of day (all days)</span>
              </div>
              <PeakHoursChart hourlyTotals={hourlyTotals} />
            </div>

          </>
        )}

      </div>
    </div>
  );
};

export default Dashboard;