import { useEffect, useState } from 'react';

export default function IntroReveal({ enabled = true }) {
  const [phase, setPhase] = useState(enabled ? 'visible' : 'hidden');

  useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('hidden');
      return undefined;
    }
    const exit = window.setTimeout(() => setPhase('exit'), 1800);
    const remove = window.setTimeout(() => setPhase('hidden'), 2350);
    return () => { window.clearTimeout(exit); window.clearTimeout(remove); };
  }, [enabled]);

  if (phase === 'hidden') return null;
  return <div className={`intro-reveal ${phase === 'exit' ? 'is-exiting' : ''}`} aria-hidden="true"><div><span>N</span>EXTEC</div><p>DIGITAL SYSTEMS</p></div>;
}
