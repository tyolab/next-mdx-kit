import { useState } from 'react';

export function Pre({ children, raw, style, ...props }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const text = raw || '';
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div style={{ position: 'relative' }}>
      {raw && (
        <button onClick={copy} aria-label="Copy code"
          style={{ position: 'absolute', top: 8, right: 8, fontSize: '.72rem', padding: '.15rem .5rem',
            background: 'var(--color-primary, #2563eb)', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}
      <pre {...props} style={{ overflowX: 'auto', ...style }}>{children}</pre>
    </div>
  );
}
