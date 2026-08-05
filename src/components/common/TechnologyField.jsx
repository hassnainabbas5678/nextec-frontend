import { useEffect, useRef } from 'react';

export default function TechnologyField() {
  const ref = useRef(null);

  useEffect(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || reduced) return undefined;

    let frame = 0;
    let x = .72;
    let y = .2;
    const update = () => {
      frame = 0;
      ref.current?.style.setProperty('--light-x', `${x * 100}%`);
      ref.current?.style.setProperty('--light-y', `${y * 100}%`);
    };
    const move = (event) => {
      x = event.clientX / window.innerWidth;
      y = event.clientY / window.innerHeight;
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className="technology-field" aria-hidden="true"><i /><b /><span /></div>;
}
