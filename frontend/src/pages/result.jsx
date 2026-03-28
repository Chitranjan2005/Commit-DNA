import React, { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './result.css';

// ── Speedometer (Fixed for Bug Rate Logic) ──
const Speedometer = ({ value = 0 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = (val) => {
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H - 10;
      const R = 110;

      ctx.clearRect(0, 0, W, H);

      // 1. Background Track
      ctx.beginPath();
      ctx.arc(cx, cy, R, Math.PI, 2 * Math.PI);
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#111';
      ctx.stroke();

      // 2. Logic: Red if bugRate > 30%, else Neon Green
      const isCritical = val > 0.3;
      const glowColor = isCritical ? '#ff4d4d' : '#4ade80';

      const gradient = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
      if (isCritical) {
        gradient.addColorStop(0, '#7f1d1d'); // Dark Red
        gradient.addColorStop(1, '#ff4d4d'); // Bright Neon Red
      } else {
        gradient.addColorStop(0, '#16a34a'); // Deep Emerald
        gradient.addColorStop(1, '#bef264'); // Yellow-Green
      }

      // 3. Glowing Progress Bar
      const pct = Math.min(val, 1);
      ctx.beginPath();
      ctx.arc(cx, cy, R, Math.PI, Math.PI + Math.PI * pct);

      ctx.shadowBlur = 15;
      ctx.shadowColor = glowColor;
      ctx.lineWidth = 12;
      ctx.strokeStyle = gradient;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = "600 32px 'Inter'";
      ctx.textAlign = 'center';
      ctx.fillText((val * 100).toFixed(1) + '%', cx, cy - 40);
    };

    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / 1000, 1);
      draw(progress * value);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <canvas ref={canvasRef} width={300} height={160} style={{ width: '100%' }} />;
};

// ── Activity Chart (Dual-Line Neon Propagation) ──
const MiniChart = () => {
  const canvasRef = useRef(null);

  const dailyData = [20, 45, 28, 80, 40, 95, 60, 88, 70, 92];
  const weeklyData = [30, 35, 40, 55, 50, 65, 60, 75, 72, 80];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame;
    let offset = 0;

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const drawLine = (data, color, width, glowSize, isDashed = false) => {
        ctx.beginPath();
        ctx.setLineDash(isDashed ? [5, 5] : []);
        ctx.shadowBlur = glowSize;
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        const xStep = W / (data.length - 1);
        data.forEach((v, i) => {
          const x = i * xStep;
          // Sine wave "breathing" animation
          const y = (H - (v / 100) * H) + Math.sin(offset + i) * 3;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      };

      // 1. Weekly (Subtle Background)
      drawLine(weeklyData, '#166534', 2, 0, true);
      // 2. Daily (Bright Neon)
      drawLine(dailyData, '#4ade80', 3, 15, false);

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
          <div style={{ width: '12px', height: '3px', background: '#4ade80', boxShadow: '0 0 5px #4ade80' }}></div>
          DAILY PROPAGATION
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '2px', border: '1px dashed #166534' }}></div>
          WEEKLY TREND
        </div>
      </div>
    </div>
  );
};

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

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const d = location.state?.result;

  if (!d) return <div className="dashboard-container" style={{ color: '#fff' }}>Analyzing DNA...</div>;

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="logo">COMMIT <span>DNA</span></div>
        <div className="nav-links">
          <button onClick={() => navigate('/')}>RESCAN</button>
          <button className="active">DASHBOARD</button>
        </div>
      </nav>

      <div className="main-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="profile-info">
            <span className="sub-label">DEVELOPER IDENTITY</span>
            <h1>{d.developerName}</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="sub-label">TOTAL COMMITS</span>
            <div className="total-commits">{d.totalCommits}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>

        <div className="sub-card">
          <h3>BUG RATE</h3>
          <Speedometer value={d.bugRate} />
          <p className="meter-note" style={{ color: d.bugRate > 0.3 ? '#ff4d4d' : '#4ade80' }}>
            {d.bugRate > 0.3 ? 'CRITICAL VULNERABILITY' : 'SYSTEM STABLE'}
          </p>
        </div>

        <div className="sub-card">
          <h3>CODE DYNAMICS</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '10px' }}>
            <div>
              <RatioBar label="Night Velocity" value={d.nightRatio} />
              <RatioBar label="Weekend Momentum" value={d.weekendRatio} />
            </div>
            <div>
              <RatioBar label="Refactor Rate" value={d.refactorRate} />
              <RatioBar label="Stability" value={1 - d.bugRate} />
            </div>
          </div>
        </div>

        <div className="sub-card">
          <h3>Primary Stack</h3>
          <span className="highlight-text">{d.primaryLanguage || 'UNKNOWN'}</span>
          <div style={{ marginTop: '20px' }}>
            <span className="velocity-badge">{d.codeVelocity || 'N/A'} VELOCITY</span>
          </div>
        </div>

        <div className="sub-card">
          <h3>Commit Propagation</h3>
          <MiniChart />
        </div>

      </div>
    </div>
  );
};

export default ResultPage;