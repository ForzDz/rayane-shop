import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hook personnalisé pour GSAP animations
 * Gère le cleanup automatique
 */
export const useGSAPAnimation = (
  animationFn: (ctx: gsap.Context) => void,
  dependencies: React.DependencyList = []
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      animationFn(ctx);
    }, ref.current);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref;
};

/**
 * Animation fade-in simple
 */
export const useFadeIn = (delay = 0) => {
  return useGSAPAnimation((ctx) => {
    ctx.add(() => {
      gsap.from('.fade-in', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay,
        stagger: 0.2,
        ease: 'power2.out',
      });
    });
  });
};

/**
 * Animation pour les sections au scroll (mobile-friendly)
 */
export const useScrollAnimation = () => {
  return useGSAPAnimation(() => {
    const sections = gsap.utils.toArray('.scroll-animate');
    
    sections.forEach((section: Element) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        ease: 'power2.out',
      });
    });
  });
};

/**
 * Animation de page (entrée)
 */
export const usePageTransition = () => {
  useEffect(() => {
    gsap.from('.page-content', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, []);
};
