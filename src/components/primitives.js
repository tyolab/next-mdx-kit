import { useContext } from 'react';
import { SectionDepthContext } from './context.js';

const T = {
  primary: 'var(--color-primary, #2563eb)',
  muted: 'var(--color-muted, #64748b)',
  border: 'var(--color-border, #e2e8f0)',
  surface: 'var(--color-surface, #f8fafc)',
  text: 'var(--color-text, #0f172a)',
};

export function SectionDepthProvider({ depth, index, children }) {
  const d = parseInt(depth, 10) || 0;
  const idx = parseInt(index, 10) || 0;
  if (d <= 0) return <SectionDepthContext.Provider value={0}>{children}</SectionDepthContext.Provider>;
  return (
    <SectionDepthContext.Provider value={d}>
      <section style={{ padding: '3.5rem 0', background: idx % 2 === 1 ? T.surface : 'transparent' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 1.5rem' }}>{children}</div>
      </section>
    </SectionDepthContext.Provider>
  );
}

export function Prose({ children, className, style }) {
  const depth = useContext(SectionDepthContext);
  const inner = <div className={className} style={{ maxWidth: 760, margin: '0 auto', color: T.text, ...style }}>{children}</div>;
  if (depth > 0) return inner;
  return <section style={{ padding: '2rem 0' }}>{inner}</section>;
}

export function SectionHeading({ eyebrow, title, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
      {eyebrow && <div style={{ color: T.primary, fontWeight: 600, fontSize: '.8rem', letterSpacing: '.08em', textTransform: 'uppercase' }}>{eyebrow}</div>}
      {title && <h2 style={{ margin: '0 0 .4rem' }}>{title}</h2>}
      {sub && <p style={{ color: T.muted, fontSize: '.95rem' }}>{sub}</p>}
    </div>
  );
}

export function StatGrid({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem', maxWidth: 1140, margin: '2rem auto', padding: '0 1.5rem' }}>
      {children}
    </div>
  );
}

export function Stat({ value, label, sub }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: T.primary }}>{value}</div>
      <div style={{ fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontSize: '.8rem', color: T.muted }}>{sub}</div>}
    </div>
  );
}

const CALLOUT_ACCENT = {
  note: 'var(--color-primary, #2563eb)',
  tip: 'var(--color-accent, #7c3aed)',
  warning: '#f59e0b',
};

export function Callout({ type = 'note', title, children }) {
  const accent = CALLOUT_ACCENT[type] || CALLOUT_ACCENT.note;
  return (
    <aside style={{ borderLeft: `3px solid ${accent}`, background: T.surface, borderRadius: 8, padding: '0.9rem 1.1rem', margin: '1.25rem 0' }}>
      {title && <strong style={{ display: 'block', marginBottom: '.35rem' }}>{title}</strong>}
      <div>{children}</div>
    </aside>
  );
}

export function Figure({ title, caption, source, children }) {
  return (
    <figure style={{ border: `1px solid ${T.border}`, borderRadius: 14, padding: '20px 22px', background: 'var(--color-bg, #fff)', margin: '26px 0' }}>
      {title && <div style={{ fontWeight: 700, color: T.text, fontSize: 16, marginBottom: 2 }}>{title}</div>}
      {caption && <div style={{ color: T.muted, fontSize: 13.5, marginBottom: 14 }}>{caption}</div>}
      {children}
      {source && <figcaption style={{ color: T.muted, fontSize: 12, marginTop: 12 }}>{source}</figcaption>}
    </figure>
  );
}
