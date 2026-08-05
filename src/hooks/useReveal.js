import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current.querySelectorAll('[data-reveal]'),
        { y: 32, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          ...options
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [options]);

  return ref;
}
