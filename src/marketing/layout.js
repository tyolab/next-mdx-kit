import { useContext } from 'react';
import Link from 'next/link';
import { SectionDepthContext } from '../components/context.js';

export function Button({ href, variant = 'primary', children }) {
  return (
    <Link href={href} className={`lp-btn lp-btn-${variant}`}>
      {children}
    </Link>
  );
}

// Groups sibling <Button>s into a spaced, centered, wrapping row. Without a
// wrapper, buttons in MDX render as bare inline-blocks with no gap.
export function ButtonRow({ children }) {
  return <div className="lp-button-row">{children}</div>;
}

export function Hero({ title, subtitle, children }) {
  return (
    <section className="lp-hero">
      <div className="lp-container">
        <h1 className="lp-hero-title">{title}</h1>
        {subtitle && <p className="lp-hero-sub">{subtitle}</p>}
        {children && <div className="lp-hero-cta">{children}</div>}
      </div>
    </section>
  );
}

// Teams hero — slightly tighter than the consumer hero.
export function TeamsHero({ title, subtitle, children }) {
  return (
    <section className="lp-hero-teams">
      <div className="lp-container">
        <h1 className="lp-hero-title">{title}</h1>
        {subtitle && <p className="lp-hero-sub">{subtitle}</p>}
        {children && <div className="lp-hero-cta">{children}</div>}
      </div>
    </section>
  );
}

// UseCaseHero — hero for persona/use-case pages with an audience label.
export function UseCaseHero({ title, subtitle, audience, children }) {
  return (
    <section className="lp-usecase-hero">
      <div className="lp-container">
        {audience && <div className="lp-uc-audience">{audience}</div>}
        <h1 className="lp-hero-title">{title}</h1>
        {subtitle && <p className="lp-hero-sub">{subtitle}</p>}
        {children && <div className="lp-hero-cta">{children}</div>}
      </div>
    </section>
  );
}

export function FeatureGrid({ children }) {
  const depth = useContext(SectionDepthContext);
  if (depth > 0) return <div className="lp-features-grid">{children}</div>;
  return (
    <section className="lp-features">
      <div className="lp-container lp-features-grid">{children}</div>
    </section>
  );
}

export function Feature({ title, children }) {
  return (
    <div className="lp-feature">
      <h3 className="lp-feature-title">{title}</h3>
      <div className="lp-feature-body">{children}</div>
    </div>
  );
}

export function Steps({ children }) {
  return (
    <section className="lp-steps">
      <div className="lp-container lp-steps-grid">{children}</div>
    </section>
  );
}

export function Step({ n, title, children }) {
  return (
    <div className="lp-step">
      <div className="lp-step-n">{n}</div>
      <div className="lp-step-body">
        <h3 className="lp-step-title">{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
}

// HighlightGrid + HighlightFeature — prominent feature cards for the teams page.
export function HighlightGrid({ children }) {
  return (
    <section className="lp-features" style={{ paddingTop: 0 }}>
      <div className="lp-container">
        <div className="lp-highlight-grid">{children}</div>
      </div>
    </section>
  );
}

export function HighlightFeature({ icon, title, isKey, coming, children }) {
  return (
    <div className={`lp-highlight${isKey ? ' is-key' : ''}`}>
      {icon && <span className="lp-highlight-icon">{icon}</span>}
      <h3>{title}{coming && <span style={{ fontSize: '.7rem', marginLeft: '.5rem', opacity: .5, fontWeight: 400 }}>coming</span>}</h3>
      <div>{children}</div>
    </div>
  );
}

// Trust bar — a horizontal strip of short proof points.
export function TrustBar({ children }) {
  return (
    <div className="lp-trustbar">
      <div className="lp-container">
        <div className="lp-trustbar-inner">{children}</div>
      </div>
    </div>
  );
}

export function TrustItem({ children }) {
  return (
    <span className="lp-trust-item">
      <span className="lp-trust-dot" />
      {children}
    </span>
  );
}

export function CTASection({ title, children }) {
  return (
    <section className="lp-cta-band">
      <div className="lp-container">
        {title && <h2 className="lp-cta-title">{title}</h2>}
        <div className="lp-cta-actions">{children}</div>
      </div>
    </section>
  );
}

// Comparison note — subtle "vs competitor" context.
export function VsNote({ children }) {
  return (
    <div className="lp-container">
      <div className="lp-vs-note">{children}</div>
    </div>
  );
}
