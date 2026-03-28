import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './result.css';

// ── Live Burnout Indicator ──
const LiveBurnoutIndicator = ({ score, status }) => {
  const risk = status?.toUpperCase() || 'LOW';

  const color =
    risk === 'HIGH'   ? '#ef4444' :
    risk === 'MEDIUM' ? '#f59e0b' :
    '#22c55e';

  const label =
    risk === 'HIGH'   ? 'Critical' :
    risk === 'MEDIUM' ? 'Moderate' :
    'Stable';

  return (
    <div className="live-indicator">
      <div className="live-dot-wrap">
        <span className="live-ring" style={{ '--ring-color': color }} />
        <span className="live-core" style={{ background: color }} />
      </div>
      <span className="live-tag">LIVE</span>
      <div className="live-sep" />
      <span className="live-score" style={{ color }}>
        {typeof score === 'number' ? score.toFixed(1) : '--'}
      </span>
      <div className="live-sep" />
      <span className="live-status" style={{ color }}>{label}</span>
    </div>
  );
};

// ── Burnout Score Gauge ──
const BurnoutGauge = ({ score = 0 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const isHigh   = score > 60;
    const isMedium = score > 30;

    const glowColor = isHigh ? '#ef4444' : isMedium ? '#f59e0b' : '#22c55e';
    const gradStart = isHigh ? '#7f1d1d' : isMedium ? '#78350f' : '#14532d';
    const gradEnd   = isHigh ? '#ef4444' : isMedium ? '#f59e0b' : '#86efac';

    const draw = (val) => {
      const W  = canvas.width;
      const H  = canvas.height;
      const cx = W / 2;
      const cy = H - 14;
      const R  = 94;

      ctx.clearRect(0, 0, W, H);

      // Tick marks
      for (let i = 0; i <= 10; i++) {
        const angle = Math.PI + (Math.PI * i) / 10;
        const inner = i % 5 === 0 ? R - 18 : R - 10;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * (R + 2), cy + Math.sin(angle) * (R + 2));
        ctx.lineTo(cx + Math.cos(angle) * inner,   cy + Math.sin(angle) * inner);
        ctx.strokeStyle = i % 5 === 0 ? '#333' : '#1e1e1e';
        ctx.lineWidth   = i % 5 === 0 ? 1.5 : 1;
        ctx.stroke();
      }

      // Background track
      ctx.beginPath();
      ctx.arc(cx, cy, R, Math.PI, 2 * Math.PI);
      ctx.lineWidth   = 10;
      ctx.strokeStyle = '#111';
      ctx.stroke();

      // Gradient arc fill
      const pct      = Math.min(val / 100, 1);
      const gradient = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
      gradient.addColorStop(0, gradStart);
      gradient.addColorStop(1, gradEnd);

      ctx.beginPath();
      ctx.arc(cx, cy, R, Math.PI, Math.PI + Math.PI * pct);
      ctx.shadowBlur  = 14;
      ctx.shadowColor = glowColor;
      ctx.lineWidth   = 10;
      ctx.strokeStyle = gradient;
      ctx.lineCap     = 'round';
      ctx.stroke();
      ctx.shadowBlur  = 0;

      // Center needle dot
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
      ctx.fillStyle   = glowColor;
      ctx.shadowBlur  = 10;
      ctx.shadowColor = glowColor;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // Score number
      ctx.fillStyle = glowColor;
      ctx.font      = "700 30px 'Inter', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText(val.toFixed(1), cx, cy - 28);

      // /100 label
      ctx.fillStyle = '#444';
      ctx.font      = "400 11px 'JetBrains Mono', monospace";
      ctx.fillText('/ 100', cx, cy - 10);

      // Zone labels
      ctx.fillStyle = '#333';
      ctx.font      = "400 9px 'JetBrains Mono', monospace";
      ctx.textAlign = 'left';
      ctx.fillText('LOW', cx - R - 4, cy + 16);
      ctx.textAlign = 'right';
      ctx.fillText('HIGH', cx + R + 4, cy + 16);
    };

    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const p     = Math.min((ts - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      draw(eased * score);
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <canvas
      ref={canvasRef}
      width={260}
      height={150}
      style={{ width: '100%', maxWidth: '260px', display: 'block', margin: '0 auto' }}
    />
  );
};

// ── Bug Rate Speedometer ──
const Speedometer = ({ value = 0 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const draw = (val) => {
      const W  = canvas.width;
      const H  = canvas.height;
      const cx = W / 2;
      const cy = H - 10;
      const R  = 110;

      ctx.clearRect(0, 0, W, H);

      ctx.beginPath();
      ctx.arc(cx, cy, R, Math.PI, 2 * Math.PI);
      ctx.lineWidth   = 12;
      ctx.strokeStyle = '#111';
      ctx.stroke();

      const isCritical = val > 0.3;
      const glowColor  = isCritical ? '#ef4444' : '#4ade80';
      const gradient   = ctx.createLinearGradient(cx - R, cy, cx + R, cy);

      if (isCritical) {
        gradient.addColorStop(0, '#7f1d1d');
        gradient.addColorStop(1, '#ef4444');
      } else {
        gradient.addColorStop(0, '#16a34a');
        gradient.addColorStop(1, '#bef264');
      }

      const pct = Math.min(val, 1);
      ctx.beginPath();
      ctx.arc(cx, cy, R, Math.PI, Math.PI + Math.PI * pct);
      ctx.shadowBlur  = 15;
      ctx.shadowColor = glowColor;
      ctx.lineWidth   = 12;
      ctx.strokeStyle = gradient;
      ctx.lineCap     = 'round';
      ctx.stroke();
      ctx.shadowBlur  = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font      = "600 32px 'Inter', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillText((val * 100).toFixed(1) + '%', cx, cy - 40);
    };

    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1000, 1);
      draw(p * value);
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <canvas ref={canvasRef} width={300} height={160} style={{ width: '100%' }} />;
};

// ── Activity Chart ──
const MiniChart = () => {
  const canvasRef  = useRef(null);
  const dailyData  = [20, 45, 28, 80, 40, 95, 60, 88, 70, 92];
  const weeklyData = [30, 35, 40, 55, 50, 65, 60, 75, 72, 80];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let frame, offset = 0;

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const drawLine = (data, color, width, glowSize, isDashed = false) => {
        ctx.beginPath();
        ctx.setLineDash(isDashed ? [5, 5] : []);
        ctx.shadowBlur  = glowSize;
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.lineWidth   = width;
        ctx.lineJoin    = 'round';
        ctx.lineCap     = 'round';
        const xStep = W / (data.length - 1);
        data.forEach((v, i) => {
          const x = i * xStep;
          const y = (H - (v / 100) * H) + Math.sin(offset + i) * 3;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.stroke();
      };

      drawLine(weeklyData, '#166534', 2, 0, true);
      drawLine(dailyData,  '#4ade80', 3, 15, false);

      offset += 0.05;
      frame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <canvas ref={canvasRef} width={800} height={200} style={{ width: '100%', height: 'auto' }} />
      <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#666' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '3px', background: '#4ade80', boxShadow: '0 0 5px #4ade80' }} />
          DAILY PROPAGATION
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '2px', border: '1px dashed #166534' }} />
          WEEKLY TREND
        </div>
      </div>
    </div>
  );
};

// ── Ratio Bar ──
const RatioBar = ({ label, value }) => (
  <div className="ratio-bar-wrap">
    <div className="ratio-bar-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span className="ratio-label">{label}</span>
      <span className="ratio-value">{(value * 100).toFixed(1)}%</span>
    </div>
    <div className="ratio-track">
      <div className="ratio-fill" style={{ width: `${value * 100}%` }} />
    </div>
  </div>
);

// ── Result Page ──
const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const d = location.state?.result;

  if (!d) return (
    <div className="dashboard-container" style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: '13px', color: '#444', letterSpacing: '0.1em' }}>
        ANALYZING DNA...
      </span>
    </div>
  );

  const burnoutStatus = d.burnoutStatus?.toUpperCase?.() || null;
  const burnoutScore  = d.burnoutScore ?? null;

  const risk =
    burnoutStatus     ? burnoutStatus :
    d.bugRate > 0.4   ? 'HIGH' :
    d.bugRate > 0.2   ? 'MEDIUM' : 'LOW';

  const riskColor =
    risk === 'HIGH'   ? '#ef4444' :
    risk === 'MEDIUM' ? '#f59e0b' :
    '#22c55e';

  const riskDesc =
    risk === 'HIGH'   ? 'High burnout detected — take a break.' :
    risk === 'MEDIUM' ? 'Moderate workload imbalance detected.' :
    'Healthy coding pattern. Keep it up.';

  return (
    <div className="dashboard-container">

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="logo">COMMIT <span>DNA</span></div>
        <div className="nav-links">
          <button onClick={() => navigate('/')}>HOME</button>
          <button className="active">DASHBOARD</button>
        </div>
      </nav>
     

      {/* ── Hero Identity Card ── */}
      <div className="main-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>

          {/* LEFT — Developer Identity */}
          <div className="profile-info">
            <span className="sub-label">DEVELOPER IDENTITY</span>
            <h1>{d.developerName}</h1>
            <p style={{ marginTop: '8px', color: '#aaa', fontFamily: 'JetBrains Mono', fontSize: '12px', letterSpacing: '0.05em' }}>
              Total Commits: <strong style={{ color: '#fff' }}>{d.totalCommits}</strong>
            </p>
          </div>

          {/* RIGHT — Burnout status block */}
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <span className="sub-label">BURNOUT STATUS</span>

            {/* Live pill */}
            <LiveBurnoutIndicator score={burnoutScore} status={risk} />

            {/* Big score number */}
            {burnoutScore !== null && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginTop: '2px' }}>
                <span style={{
                  fontSize: '56px',
                  fontWeight: '800',
                  color: riskColor,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  textShadow: `0 0 40px ${riskColor}44`,
                }}>
                  {burnoutScore.toFixed(1)}
                </span>
                <span style={{ fontSize: '13px', color: '#444', fontFamily: 'JetBrains Mono' }}> / 100</span>
              </div>
            )}

            <p style={{ fontSize: '11px', color: '#555', fontFamily: 'JetBrains Mono', letterSpacing: '0.04em', marginTop: '2px' }}>
              {riskDesc}
            </p>
          </div>

        </div>
      </div>

      {/* ── Row 1: Bug Rate + Code Dynamics ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>

        <div className="sub-card">
          <h3>BUG RATE</h3>
          <Speedometer value={d.bugRate} />
          <p className="meter-note" style={{ color: d.bugRate > 0.3 ? '#ef4444' : '#4ade80' }}>
            {d.bugRate > 0.3 ? 'CRITICAL VULNERABILITY' : 'SYSTEM STABLE'}
          </p>
        </div>

        <div className="sub-card">
          <h3>CODE DYNAMICS</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '10px' }}>
            <div>
              <RatioBar label="Night Velocity"   value={d.nightRatio} />
              <RatioBar label="Weekend Momentum" value={d.weekendRatio} />
            </div>
            <div>
              <RatioBar label="Refactor Rate" value={d.refactorRate} />
              <RatioBar label="Stability"     value={1 - d.bugRate} />
            </div>
          </div>
        </div>

      </div>

      {/* ── Row 2: Burnout Gauge + Commit Chart ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginTop: '20px' }}>

        {burnoutScore !== null && (
          <div className="sub-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ alignSelf: 'flex-start' }}>BURNOUT GAUGE</h3>
            <BurnoutGauge score={burnoutScore} />
            <div style={{ marginTop: '14px' }}>
              <LiveBurnoutIndicator score={burnoutScore} status={risk} />
            </div>
          </div>
        )}

        <div className="sub-card">
          <h3>COMMIT PROPAGATION</h3>
          <MiniChart />
        </div>

      </div>

      {/* ── Row 3: Stack + Summary ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>

        <div className="sub-card">
          <h3>PRIMARY STACK</h3>
          <span className="highlight-text">{d.primaryLanguage || 'UNKNOWN'}</span>
          <div style={{ marginTop: '20px' }}>
            <span className="velocity-badge">{d.codeVelocity || 'N/A'} VELOCITY</span>
          </div>
        </div>

        <div className="sub-card">
          <h3>ANALYSIS SUMMARY</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            {[
              { label: 'Bug Rate',      val: `${(d.bugRate * 100).toFixed(1)}%`,      color: d.bugRate > 0.3 ? '#ef4444' : '#4ade80' },
              { label: 'Night Ratio',   val: `${(d.nightRatio * 100).toFixed(1)}%`,   color: '#aaa' },
              { label: 'Weekend Ratio', val: `${(d.weekendRatio * 100).toFixed(1)}%`, color: '#aaa' },
              { label: 'Refactor Rate', val: `${(d.refactorRate * 100).toFixed(1)}%`, color: '#aaa' },
              ...(burnoutScore !== null
                ? [{ label: 'Burnout Score', val: `${burnoutScore.toFixed(1)} / 100`, color: riskColor }]
                : []),
            ].map(({ label, val, color }) => (
              <div key={label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                paddingBottom: '8px',
              }}>
                <span style={{ color: '#555' }}>{label}</span>
                <span style={{ color, fontWeight: '600' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ResultPage;