'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface ScrollState {
  activeSection: string | null;
  activeStep: string | null;
  progress: number;  // 0-1 progress through current step
  rung: number;      // Current rung (1-4)
}

interface UseScrollytellingOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollytelling(
  sectionIds: string[],
  options: UseScrollytellingOptions = {}
): ScrollState {
  const { threshold = 0.5, rootMargin = '-20% 0px -20% 0px' } = options;

  const [state, setState] = useState<ScrollState>({
    activeSection: null,
    activeStep: null,
    progress: 0,
    rung: 1,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Find the most visible entry
      let mostVisible: IntersectionObserverEntry | null = null;
      let maxRatio = 0;

      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisible = entry;
        }
      }

      if (mostVisible) {
        const id = mostVisible.target.id;
        const [sectionId, stepId] = id.split('__');

        // Determine rung from section
        let rung = 1;
        if (sectionId.includes('parallax')) rung = 1;
        else if (sectionId.includes('cepheid')) rung = 2;
        else if (sectionId.includes('supernova')) rung = 3;
        else if (sectionId.includes('hubble')) rung = 4;

        setState(prev => ({
          ...prev,
          activeSection: sectionId,
          activeStep: stepId || sectionId,
          progress: maxRatio,
          rung,
        }));
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin,
    });

    // Observe all sections
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sectionIds, threshold, rootMargin]);

  return state;
}

// Hook for tracking scroll progress within a single element
export function useScrollProgress(elementRef: React.RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the element has scrolled past
      const start = rect.top;
      const end = rect.bottom;
      const height = end - start;

      // Progress is 0 when element enters viewport, 1 when it leaves
      if (start >= windowHeight) {
        setProgress(0);
      } else if (end <= 0) {
        setProgress(1);
      } else {
        const scrolled = windowHeight - start;
        const total = windowHeight + height;
        setProgress(Math.max(0, Math.min(1, scrolled / total)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementRef]);

  return progress;
}

// Sticky panel positioning helper
export function useStickyPanel() {
  const [isSticky, setIsSticky] = useState(false);
  const [stickyTop, setStickyTop] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const headerHeight = 80; // Account for fixed header

      if (rect.top <= headerHeight && rect.bottom > window.innerHeight) {
        setIsSticky(true);
        setStickyTop(headerHeight);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { containerRef, isSticky, stickyTop };
}
