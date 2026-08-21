// CompareTable + CompareRow — feature comparison table.
// reach/them: "yes" | "no" | "partial" | "soon" | any plain string
function cmpCell(val) {
  if (val === 'yes')     return <span className="cmp-yes">✓ Yes</span>;
  if (val === 'no')      return <span className="cmp-no">✗ No</span>;
  if (val === 'soon')    return <span className="cmp-soon">Coming soon</span>;
  if (val === 'partial') return <span className="cmp-partial">Partial</span>;
  return <span className="cmp-text">{val}</span>;
}

export function CompareTable({ competitor, competitorUrl, children }) {
  return (
    <section className="lp-compare-section">
      <div className="lp-container">
        <div className="lp-compare-wrap">
          <table className="lp-compare-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="th-reach">TYO Reach</th>
                <th>{competitorUrl
                  ? <a href={competitorUrl} target="_blank" rel="noopener noreferrer" style={{color:'inherit'}}>{competitor}</a>
                  : competitor}
                </th>
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function CompareRow({ feature, reach, them, note }) {
  return (
    <tr>
      <td className="td-feature">{feature}{note && <span className="td-note">{note}</span>}</td>
      <td>{cmpCell(reach)}</td>
      <td>{cmpCell(them)}</td>
    </tr>
  );
}

// FAQ accordion — uses native <details> for zero-JS expand/collapse.
export function FAQ({ title, children }) {
  return (
    <section className="lp-faq">
      <div className="lp-container">
        {title && <h2 className="lp-section-title">{title}</h2>}
        <div className="lp-faq-list">{children}</div>
      </div>
    </section>
  );
}

export function FAQItem({ q, children }) {
  return (
    <details className="lp-faq-item">
      <summary>{q}</summary>
      <div className="lp-faq-body">{children}</div>
    </details>
  );
}

// Changelog entry
export function ChangelogEntry({ version, date, title, children }) {
  return (
    <div className="lp-cl-entry">
      <div className="lp-cl-meta">
        <span className="lp-cl-version">{version}</span>
        <span className="lp-cl-date">{date}</span>
      </div>
      <div className="lp-cl-body">
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  );
}

export function Changelog({ children }) {
  return (
    <section className="lp-changelog">
      <div className="lp-container">
        <div className="lp-changelog-list">{children}</div>
      </div>
    </section>
  );
}

// ContactSection — renders contact channels (parameterized; source hardcoded
// four tyo.com.au addresses, here they're a prop with the same defaults).
const DEFAULT_CHANNELS = [
  { title: 'General enquiries', desc: 'Questions about the product, pricing, or your account.', email: 'hello@tyo.com.au' },
  { title: 'Technical support', desc: 'Trouble connecting, billing issues, or bug reports.', email: 'support@tyo.com.au' },
  { title: 'Teams & business', desc: 'Setting up for your organisation, pricing for large teams.', email: 'teams@tyo.com.au' },
  { title: 'Security disclosures', desc: 'Found a vulnerability? Please disclose responsibly.', email: 'security@tyo.com.au' },
];

export function ContactSection({ channels = DEFAULT_CHANNELS }) {
  return (
    <section className="lp-features">
      <div className="lp-container">
        <div className="lp-contact-grid">
          {channels.map((c) => (
            <div className="lp-contact-card" key={c.email}>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
