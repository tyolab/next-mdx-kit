/**
 * Dependency-free, SSR-safe data-viz components for MDX articles.
 * Pure CSS/SVG (no chart lib) so they render in Next static export.
 * Registered in components/mdx/components.js and used directly in .mdx bodies.
 *
 *   <StatGrid><Stat value="28%" label="Everyday brands with likely-AI chat" /></StatGrid>
 *   <BarChart data={[{label:'Banking', value:28}]} unit="%" />
 *   <StackedBar rows={[{label:'Banking', values:{ai:11, chat:12, none:15}}]} segments={SEG} />
 *   <Donut data={[{label:'AI', value:73, color:'#2563eb'}]} />
 *   <DataTable columns={[...]} rows={[...]} />
 *   <Callout type="note" title="Floor, not truth">…</Callout>
 */
import React from 'react';

const PALETTE = {
  ai: 'var(--nmk-chart-ai, #2563eb)', chat: 'var(--nmk-chart-chat, #f59e0b)',
  human: 'var(--nmk-chart-human, #14b8a6)', none: 'var(--nmk-chart-none, #e2e8f0)',
  accent: 'var(--color-accent, #7c3aed)', ink: 'var(--color-text, #0f172a)',
  muted: 'var(--color-muted, #64748b)', grid: 'var(--color-border, #e9eef5)',
};
const SERIES = ['#2563eb', '#7c3aed', '#0ea5e9', '#f59e0b', '#14b8a6', '#ef4444',
  '#10b981', '#6366f1', '#f43f5e', '#eab308'];

const card = {
  border: '1px solid #e9eef5', borderRadius: 14, padding: '20px 22px',
  background: '#fff', margin: '26px 0', boxShadow: '0 1px 3px rgba(15,23,42,.04)',
};

// NOTE: not exported — the canonical Figure lives in src/components/primitives.js
// and is re-exported from src/charts/index.js. This one is kept for internal
// use by BarChart/StackedBar/Donut/DataTable below (they share its `card` styling).
function Figure({ title, caption, source, children }) {
  return (
    <figure style={card}>
      {title && <div style={{ fontWeight: 700, color: PALETTE.ink, fontSize: 16, marginBottom: 2 }}>{title}</div>}
      {caption && <div style={{ color: PALETTE.muted, fontSize: 13.5, marginBottom: 14 }}>{caption}</div>}
      {children}
      {source && <figcaption style={{ color: PALETTE.muted, fontSize: 12, marginTop: 12 }}>{source}</figcaption>}
    </figure>
  );
}

export function BarChart({ data = [], unit = '', max, color = PALETTE.ai, height = 26, title, caption, source }) {
  const top = max || Math.max(1, ...data.map((d) => d.value));
  const body = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: PALETTE.ink, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</div>
          <div style={{ background: PALETTE.grid, borderRadius: 6, height, position: 'relative' }}>
            <div style={{
              width: `${Math.min((d.value / top) * 100, 100)}%`, background: d.color || color, height: '100%',
              borderRadius: 6, minWidth: 2, transition: 'width .3s',
            }} />
            <span style={{
              position: 'absolute', right: 8, top: 0, lineHeight: `${height}px`,
              fontSize: 12.5, fontWeight: 700, color: PALETTE.ink,
            }}>{d.value}{unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
  return (title || caption || source) ? <Figure title={title} caption={caption} source={source}>{body}</Figure> : <div style={card}>{body}</div>;
}

export function StackedBar({ rows = [], segments = [], title, caption, source, asPercent = true }) {
  const body = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {rows.map((r, i) => {
        const total = segments.reduce((s, seg) => s + (r.values[seg.key] || 0), 0) || 1;
        return (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 13, color: PALETTE.ink, textAlign: 'right' }}>{r.label}</div>
            <div style={{ display: 'flex', height: 24, borderRadius: 6, overflow: 'hidden', background: PALETTE.none }}>
              {segments.map((seg) => {
                const v = r.values[seg.key] || 0;
                const pct = (v / total) * 100;
                if (!v) return null;
                return (
                  <div key={seg.key} title={`${seg.label}: ${v}`} style={{
                    width: `${pct}%`, background: seg.color, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700,
                  }}>{pct >= 12 ? (asPercent ? Math.round(pct) + '%' : v) : ''}</div>
                );
              })}
            </div>
          </div>
        );
      })}
      <Legend items={segments} />
    </div>
  );
  return <Figure title={title} caption={caption} source={source}>{body}</Figure>;
}

function Legend({ items }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 6 }}>
      {items.map((it) => (
        <span key={it.key || it.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: PALETTE.muted }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: it.color, display: 'inline-block' }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

export function Donut({ data = [], size = 190, thickness = 30, title, caption, source, centerLabel }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const segs = data.map((d, i) => {
    const frac = d.value / total;
    const seg = { ...d, color: d.color || SERIES[i % SERIES.length], dash: frac * c, offset: offset * c };
    offset += frac;
    return seg;
  });
  const body = (
    <div style={{ display: 'flex', gap: 26, alignItems: 'center', flexWrap: 'wrap' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segs.map((s, i) => (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color}
              strokeWidth={thickness} strokeDasharray={`${s.dash} ${c - s.dash}`} strokeDashoffset={-s.offset} />
          ))}
        </g>
        <text x="50%" y="47%" textAnchor="middle" style={{ fontSize: 26, fontWeight: 800, fill: PALETTE.ink }}>{centerLabel ?? total}</text>
        <text x="50%" y="59%" textAnchor="middle" style={{ fontSize: 12, fill: PALETTE.muted }}>brands</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {segs.map((s, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: PALETTE.ink }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color }} />
            <strong>{s.value}</strong> <span style={{ color: PALETTE.muted }}>· {Math.round((s.value / total) * 100)}% — {s.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
  return <Figure title={title} caption={caption} source={source}>{body}</Figure>;
}

// NOTE: not exported — canonical StatGrid lives in src/components/primitives.js.
function StatGrid({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, margin: '26px 0' }}>
      {children}
    </div>
  );
}

// NOTE: not exported — canonical Stat lives in src/components/primitives.js.
function Stat({ value, label, sub, color = PALETTE.ai }) {
  return (
    <div style={{ ...card, margin: 0, padding: '18px 20px' }}>
      <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1.05 }}>{value}</div>
      <div style={{ fontSize: 13.5, color: PALETTE.ink, marginTop: 6, fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: PALETTE.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// NOTE: not exported — canonical Callout lives in src/components/primitives.js.
function Callout({ type = 'note', title, children }) {
  const tones = {
    note: ['#eff6ff', '#2563eb'], warn: ['#fff7ed', '#f59e0b'],
    method: ['#f5f3ff', '#7c3aed'], good: ['#ecfdf5', '#10b981'],
  };
  const [bg, bar] = tones[type] || tones.note;
  return (
    <div style={{ background: bg, borderLeft: `4px solid ${bar}`, borderRadius: 10, padding: '14px 18px', margin: '22px 0' }}>
      {title && <div style={{ fontWeight: 700, color: PALETTE.ink, marginBottom: 4 }}>{title}</div>}
      <div style={{ fontSize: 14.5, color: '#1e293b' }}>{children}</div>
    </div>
  );
}

export function CardGrid({ children, min = 260 }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
      gap: 18, margin: '26px 0',
    }}>
      {children}
    </div>
  );
}

export function ArticleCard({ href, title, summary, tag, n, color = PALETTE.ai, minHeight = 440, cta = 'Read More →' }) {
  const cardStyle = {
    ...card, margin: 0, padding: '28px 26px', display: 'flex', flexDirection: 'column',
    textDecoration: 'none', borderTop: `4px solid ${color}`, minHeight,
  };
  const inner = (
    <>
      {(tag || n != null) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
          {n != null && (
            <span style={{
              flexShrink: 0, width: 24, height: 24, borderRadius: 7, background: color, color: '#fff',
              fontSize: 13, fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>{n}</span>
          )}
          {tag && (
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: .4, textTransform: 'uppercase',
              color: PALETTE.muted,
            }}>{tag}</span>
          )}
        </div>
      )}
      <div style={{ fontWeight: 700, fontSize: 18, color: PALETTE.ink, lineHeight: 1.32 }}>{title}</div>
      <div style={{ fontSize: 14, color: PALETTE.muted, marginTop: 12, lineHeight: 1.6, flexGrow: 1 }}>{summary}</div>
      {/* Only show the call-to-action when the card actually links somewhere. */}
      {href && cta && (
        <span style={{ color, fontWeight: 700, fontSize: 14, marginTop: 18 }}>{cta}</span>
      )}
    </>
  );

  return href
    ? <a href={href} style={cardStyle}>{inner}</a>
    : <div style={cardStyle}>{inner}</div>;
}

export function DataTable({ columns = [], rows = [], title, caption, source }) {
  const body = (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13.5 }}>
        <thead>
          <tr>{columns.map((c, i) => (
            <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '8px 12px', borderBottom: `2px solid ${PALETTE.grid}`, color: PALETTE.muted, fontWeight: 700, whiteSpace: 'nowrap' }}>{c}</th>
          ))}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 ? '#fafbfc' : '#fff' }}>
              {r.map((cell, j) => (
                <td key={j} style={{ textAlign: j === 0 ? 'left' : 'right', padding: '8px 12px', borderBottom: `1px solid ${PALETTE.grid}`, color: PALETTE.ink, whiteSpace: 'nowrap' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return <Figure title={title} caption={caption} source={source}>{body}</Figure>;
}

export const CHART_PALETTE = PALETTE;
