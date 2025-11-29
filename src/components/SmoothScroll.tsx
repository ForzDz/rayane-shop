import { useEffect, useRef, ReactNode } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Composant SmoothScroll
 * Utilise Locomotive Scroll pour un défilement fluide
 * Alternative gratuite à ScrollSmoother (GSAP Club)
 */
export const SmoothScroll = ({ children }: SmoothScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    // Initialiser Locomotive Scroll
    locomotiveScrollRef.current = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 0.8, // Vitesse du scroll (plus bas = plus lent, mieux pour mobile)
      smartphone: {
        smooth: true,
        multiplier: 0.6,
      },
      tablet: {
        smooth: true,
        multiplier: 0.7,
      },
    });

    // Cleanup
    return () => {
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
      }
    };
  }, []);

  return (
    <div ref={scrollRef} data-scroll-container>
      {children}
    </div>
  );
};
