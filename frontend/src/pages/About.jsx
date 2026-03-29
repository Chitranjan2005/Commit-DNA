import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import './About.css';

// ── Animated counter hook ──
const useCounter = (target, duration = 1600, start = false) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return val;
};

// ── Intersection observer hook ──
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
};

// ── Stat counter card ──
const StatCard = ({ value, suffix, label, delay }) => {
  const [ref, inView] = useInView();
  const count = useCounter(value, 1600, inView);
  return (
    <div ref={ref} className="about-stat-card" style={{ animationDelay: `${delay}ms` }}>
      <span className="about-stat-num">
        {count}{suffix}
      </span>
      <span className="about-stat-label">{label}</span>
    </div>
  );
};

// ── Metric row ──
const MetricRow = ({ emoji, name, formula, desc, thresholds, delay }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`metric-row ${inView ? 'metric-row-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="metric-row-left">
        <span className="metric-emoji">{emoji}</span>
        <div>
          <p className="metric-name">{name}</p>
          <code className="metric-formula">{formula}</code>
        </div>
      </div>
      <p className="metric-desc">{desc}</p>
      <div className="metric-thresholds">
        {thresholds.map(({ label, color }) => (
          <span key={label} className="metric-threshold" style={{ '--tc': color }}>{label}</span>
        ))}
      </div>
    </div>
  );
};

// ── Timeline step ──
const TimelineStep = ({ num, title, desc, delay }) => {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`tl-step ${inView ? 'tl-step-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className="tl-num">{String(num).padStart(2, '0')}</div>
      <div className="tl-line" />
      <div className="tl-content">
        <p className="tl-title">{title}</p>
        <p className="tl-desc">{desc}</p>
      </div>
    </div>
  );
};

const About = () => {
  const [visible, setVisible] = useState(false);
  const [heroRef, heroIn] = useInView(0.05);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`about-root ${visible ? 'about-visible' : ''}`}>
      <Navbar />

      {/* ── HERO ──
      <section ref={heroRef} className="about-hero">
        <div className="about-hero-bg-grid" />
        <div className={`about-hero-inner ${heroIn ? 'about-hero-in' : ''}`}>
          <span className="about-eyebrow">COMMIT DNA / ABOUT</span>
          <h1 className="about-hero-title">
            <span className="about-hero-line1">DECODE YOUR</span>
            <span className="about-hero-line2">DEVELOPER</span>
            <span className="about-hero-line3">DNA<span className="about-hero-dot">.</span></span>
          </h1>
          <p className="about-hero-sub">
            Every commit is a timestamped fingerprint. We read the entire history
            and translate it into a living portrait of how you actually code.
          </p>
        </div>

        <div className="about-hero-dna" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="dna-pair" style={{ animationDelay: `${i * 120}ms` }}>
              <div className="dna-node left"  style={{ animationDelay: `${i * 120}ms` }} />
              <div className="dna-bridge"     style={{ animationDelay: `${i * 120 + 60}ms` }} />
              <div className="dna-node right" style={{ animationDelay: `${i * 120}ms` }} />
            </div>
          ))}
        </div>
      </section> */}

      {/* ── STATS ── */}
      <section className="about-stats-section">
        <div className="about-section-inner">
          <div className="about-stats-grid">
            <StatCard value={5}    suffix="+"  label="Behavioral Metrics"    delay={0}   />
            <StatCard value={100}  suffix="+"  label="Commits Parsed Live"   delay={100} />
            <StatCard value={6}    suffix=""   label="Developer Archetypes"  delay={200} />
            <StatCard value={3}    suffix=""   label="Burnout Risk Levels"   delay={300} />
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="about-mission-section">
        <div className="about-section-inner about-mission-grid">
          <div className="about-mission-label">
            <span className="about-vertical-label">PHILOSOPHY [2026]</span>
          </div>
          <div className="about-mission-body">
            <h2 className="about-section-title">What is<br />Commit DNA?</h2>
            <p className="about-body-text">
              Commit DNA is a developer analytics platform built on a single principle:
              <strong> self-awareness over judgment.</strong> We don't rate your output —
              we decode the behavioral patterns hidden inside your Git history and surface them
              as a visual identity.
            </p>
            <p className="about-body-text">
              Night commits, weekend velocity, bug spikes, refactor investments — each one is
              a strand in your unique coding DNA. We fuse Git precision with bold visual design
              to help developers and teams understand how they actually work, not just what they ship.
            </p>
            <div className="about-mission-tags">
              {['Git History', 'Behavioral Analysis', 'Burnout Detection', 'No Hardcoded Data'].map(t => (
                <span key={t} className="about-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="about-how-section">
        <div className="about-section-inner">
          <div className="about-section-header">
            <span className="about-eyebrow">PROCESS</span>
            <h2 className="about-section-title">How It Works</h2>
          </div>
          <div className="tl-grid">
            {[
              { title: 'Validate',       desc: 'Frontend verifies the GitHub URL — checks format, github.com domain, and user/repo path.' },
              { title: 'Clone',          desc: 'Backend clones the repo into a UUID-named temp folder, supporting multiple concurrent users.' },
              { title: 'Extract',        desc: 'Runs git log --numstat to pull every commit: author, timestamp, message, lines changed.' },
              { title: 'Parse',          desc: 'Each commit becomes a structured object. Night flag, weekend flag, bug/refactor keyword match.' },
              { title: 'Score',          desc: 'Ratios computed, burnout formula applied — weighted across night, weekend, spikes, and bug rate.' },
              { title: 'Visualize',      desc: 'Dashboard renders live: archetype card, heatmap, gauge, and peak hours chart. Temp repo deleted.' },
            ].map((s, i) => (
              <TimelineStep key={s.title} num={i + 1} {...s} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section className="about-metrics-section">
        <div className="about-section-inner">
          <div className="about-section-header">
            <span className="about-eyebrow">METRICS</span>
            <h2 className="about-section-title">What We Measure</h2>
          </div>
          <div className="metrics-list">
            {[
              {
                emoji: '🌙', name: 'Night Ratio',
                formula: 'Commits(10PM–5AM) ÷ Total',
                desc: 'Measures how often you code past midnight — the #1 early indicator of unsustainable work habits.',
                thresholds: [{ label: '0–10% Healthy', color: '#4ade80' }, { label: '10–25% Watch', color: '#f59e0b' }, { label: '25%+ Critical', color: '#ef4444' }],
              },
              {
                emoji: '📅', name: 'Weekend Ratio',
                formula: 'Commits(Sat+Sun) ÷ Total',
                desc: 'Eroding recovery time is the second strongest burnout signal. Weekends should be sacred.',
                thresholds: [{ label: '0–10% Healthy', color: '#4ade80' }, { label: '10–25% Moderate', color: '#f59e0b' }, { label: '25%+ Heavy', color: '#ef4444' }],
              },
              {
                emoji: '🐛', name: 'Bug Rate',
                formula: 'Fix/Bug/Hotfix Commits ÷ Total',
                desc: 'Tracks commit messages matching fix, bug, patch, hotfix, resolve. High rates may signal fatigue-induced errors.',
                thresholds: [{ label: '0–5% Low', color: '#4ade80' }, { label: '5–15% Normal', color: '#f59e0b' }, { label: '15%+ High', color: '#ef4444' }],
              },
              {
                emoji: '🔧', name: 'Refactor Rate',
                formula: 'Cleanup/Optimize Commits ÷ Total',
                desc: 'Healthy refactoring signals code quality investment. Too little or too much both flag instability.',
                thresholds: [{ label: '0–2% Low', color: '#f59e0b' }, { label: '2–10% Healthy', color: '#4ade80' }, { label: '10%+ Unstable', color: '#ef4444' }],
              },
              {
                emoji: '📊', name: 'Commit Spike',
                formula: '(Max Day ÷ Avg Day) − 1',
                desc: 'Detects deadline crunch behavior. Value of 4 = busiest day had 5× more commits than average.',
                thresholds: [{ label: '0 Steady', color: '#4ade80' }, { label: '1–3 Pressure', color: '#f59e0b' }, { label: '4+ Crunch', color: '#ef4444' }],
              },
            ].map((m, i) => <MetricRow key={m.name} {...m} delay={i * 60} />)}
          </div>
        </div>
      </section>

      {/* ── BURNOUT FORMULA ── */}
      <section className="about-formula-section">
        <div className="about-section-inner">
          <div className="about-section-header">
            <span className="about-eyebrow">FORMULA</span>
            <h2 className="about-section-title">The Burnout Score</h2>
          </div>
          <div className="formula-layout">
            <div className="formula-block">
              <div className="formula-code">
                <div className="formula-line">
                  <span className="formula-kw">Score</span>
                  <span className="formula-op"> = </span>
                </div>
                <div className="formula-line formula-indent">
                  <span className="formula-weight">0.4</span>
                  <span className="formula-op"> × </span>
                  <span className="formula-var">Night Ratio</span>
                </div>
                <div className="formula-line formula-indent">
                  <span className="formula-op">+ </span>
                  <span className="formula-weight">0.3</span>
                  <span className="formula-op"> × </span>
                  <span className="formula-var">Weekend Ratio</span>
                </div>
                <div className="formula-line formula-indent">
                  <span className="formula-op">+ </span>
                  <span className="formula-weight">0.2</span>
                  <span className="formula-op"> × </span>
                  <span className="formula-var">Commit Spike</span>
                </div>
                <div className="formula-line formula-indent">
                  <span className="formula-op">+ </span>
                  <span className="formula-weight">0.1</span>
                  <span className="formula-op"> × </span>
                  <span className="formula-var">Bug Rate</span>
                </div>
              </div>
            </div>

            <div className="formula-thresholds">
              {[
                { range: '0.00 – 0.24', status: 'Healthy',    color: '#4ade80', desc: 'Sustainable patterns, normal hours' },
                { range: '0.25 – 0.49', status: 'Medium',     color: '#f59e0b', desc: 'Some signals worth monitoring' },
                { range: '0.50 – 1.00', status: 'Overloaded', color: '#ef4444', desc: 'Multiple burnout indicators elevated' },
              ].map(({ range, status, color, desc }) => (
                <div key={status} className="formula-threshold-card" style={{ '--fc': color }}>
                  <div className="ftc-indicator" />
                  <div>
                    <p className="ftc-range">{range}</p>
                    <p className="ftc-status" style={{ color }}>{status}</p>
                    <p className="ftc-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STACK ── */}
      <section className="about-stack-section">
        <div className="about-section-inner">
          <div className="about-section-header">
            <span className="about-eyebrow">TECH STACK</span>
            <h2 className="about-section-title">Built With</h2>
          </div>
          <div className="stack-grid">
            {[
              { layer: 'Frontend', items: ['React', 'React Router', 'GSAP / CSS Animations', 'Canvas API', 'JetBrains Mono'] },
              { layer: 'Backend',  items: ['Node.js', 'Express.js', 'simple-git', 'day.js', 'UUID temp dirs'] },
              { layer: 'Analysis', items: ['git log --numstat', 'Keyword regex', 'Weighted scoring', 'Hourly bucketing', 'Archetype engine'] },
            ].map(({ layer, items }) => (
              <div key={layer} className="stack-card">
                <p className="stack-layer">{layer}</p>
                <ul className="stack-items">
                  {items.map(i => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;