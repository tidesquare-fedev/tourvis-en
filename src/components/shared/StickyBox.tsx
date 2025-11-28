'use client';

import {
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

type StickyBoxProps = {
  children: ReactNode;
  topOffset?: number; // px from viewport top
  enableBelow?: number; // enable sticky only when viewport width >= this (px)
  boundarySelector?: string; // CSS selector for the scroll boundary container
  triggerSelector?: string; // element after which sticky should start
  debug?: boolean; // prints console logs for debugging
};

// Robust sticky/floating wrapper that doesn't depend on CSS sticky (works inside transformed/overflow parents)
export function StickyBox({
  children,
  topOffset = 112,
  enableBelow = 1024,
  boundarySelector = '.booking-container',
  triggerSelector,
  debug = false,
}: StickyBoxProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [passedTrigger, setPassedTrigger] = useState<boolean>(false);
  const modeRef = useRef<'static' | 'fixed' | 'pinned'>('static');
  const lastLogRef = useRef<number>(0);

  const compute = useCallback(() => {
    const container = containerRef.current;
    const box = boxRef.current;
    if (!container || !box) return;

    const vw = window.innerWidth;
    if (vw < enableBelow) {
      // Reset on mobile
      box.style.position = 'static';
      box.style.top = '';
      box.style.left = '';
      box.style.width = '';
      box.style.transform = '';
      setIsEnabled(false);
      return;
    }
    setIsEnabled(true);

    const boundary =
      (boundarySelector
        ? (container.closest(boundarySelector) as HTMLElement | null)
        : null) ||
      (boundarySelector
        ? (document.querySelector(boundarySelector) as HTMLElement | null)
        : null) ||
      container;
    const boundaryRect = boundary
      ? boundary.getBoundingClientRect()
      : container.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect(); // wrapper for width/offset within boundary
    const targetEl = (box.firstElementChild as HTMLElement) || box;
    const boxRect = targetEl.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const boundaryTop = boundaryRect.top + scrollY;
    const boundaryBottom = boundaryTop + boundaryRect.height;
    const containerTop = containerRect.top + scrollY;
    const offsetWithinBoundary = containerTop - boundaryTop;
    const boxHeight = boxRect.height;
    const left = containerRect.left + window.pageXOffset;
    const width = containerRect.width;

    // sticky 시작 여부: 트리거 엘리먼트의 실제 위치를 우선 사용 (IO 없이도 동작)
    let active = passedTrigger;
    let triggerBottom = 0;
    if (triggerSelector) {
      const trig = document.querySelector(
        triggerSelector,
      ) as HTMLElement | null;
      if (trig) {
        const tr = trig.getBoundingClientRect();
        triggerBottom = tr.bottom;
        active = tr.bottom <= topOffset;
      } else {
        active = true;
      }
    }

    const stickyStart = containerTop;
    const stickyEnd = boundaryBottom - boxHeight - offsetWithinBoundary;
    const currentTop = scrollY + topOffset;

    // reserve space to prevent layout shift when fixed
    // container must span the whole boundary height so that absolute pinning works within it
    container.style.minHeight = `${Math.max(Math.ceil(boxRect.height), 1)}px`;

    let nextMode: 'static' | 'fixed' | 'pinned' = 'static';
    if (!active) {
      // Static
      targetEl.style.position = 'static';
      targetEl.style.top = '';
      targetEl.style.left = '';
      targetEl.style.width = '';
      targetEl.style.transform = '';
      targetEl.style.zIndex = '';
      nextMode = 'static';
    } else if (currentTop >= stickyEnd) {
      // Pin to bottom inside container (absolute)
      targetEl.style.position = 'absolute';
      // Place box at boundary bottom (relative to container)
      const pinnedTop = boundaryBottom - containerTop - boxHeight;
      targetEl.style.top = `${Math.max(0, pinnedTop)}px`;
      targetEl.style.left = '0px';
      targetEl.style.width = `${width}px`;
      targetEl.style.zIndex = '30';
      nextMode = 'pinned';
    } else {
      // Fixed to viewport with computed left/width
      targetEl.style.position = 'fixed';
      targetEl.style.top = `${topOffset}px`;
      targetEl.style.left = `${containerRect.left}px`;
      targetEl.style.width = `${width}px`;
      targetEl.style.zIndex = '30';
      nextMode = 'fixed';
    }

    if (debug && modeRef.current !== nextMode) {
      // 모드 변경 디버그 정보
    } else if (debug) {
      // Throttled metrics for inspection
      const now = performance.now();
      if (now - lastLogRef.current > 250) {
        lastLogRef.current = now;
        // 디버그 메트릭스
      }
    }
    modeRef.current = nextMode;
  }, [topOffset, enableBelow, boundarySelector]);

  // Observe trigger visibility to decide when to stick
  useEffect(() => {
    if (!triggerSelector) {
      setPassedTrigger(true);
      return;
    }
    const el = document.querySelector(triggerSelector) as HTMLElement | null;
    if (!el) {
      setPassedTrigger(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        // 트리거 하단이 topOffset 위로 사라지면 고정 시작
        const v = !entry.isIntersecting;
        setPassedTrigger(v);
      },
      { root: null, threshold: 0, rootMargin: `-${topOffset}px 0px 0px 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [triggerSelector, topOffset, debug]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    compute();
    // RAF loop as a safety net (in case scroll events are swallowed by nested scrollers)
    let rafLoop = 0;
    const loop = () => {
      compute();
      rafLoop = requestAnimationFrame(loop);
    };
    rafLoop = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rafLoop);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [
    compute,
    debug,
    topOffset,
    enableBelow,
    boundarySelector,
    triggerSelector,
  ]);

  useLayoutEffect(() => {
    compute();
  }, [compute]);

  // Recompute when trigger activation toggles
  useEffect(() => {
    compute();
  }, [passedTrigger, compute]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative' }}
      data-stickybox={debug ? 'debug' : undefined}
    >
      <div ref={boxRef} aria-live={isEnabled ? 'off' : 'polite'}>
        {children}
      </div>
    </div>
  );
}
