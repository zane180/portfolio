"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const frame = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      const dot = dotRef.current;
      const ringEl = ringRef.current;
      if (dot && ringEl) {
        dot.style.left = `${mouse.current.x - 4}px`;
        dot.style.top = `${mouse.current.y - 4}px`;

        ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
        ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
        ringEl.style.left = `${ring.current.x - 16}px`;
        ringEl.style.top = `${ring.current.y - 16}px`;
      }
      frame.current = requestAnimationFrame(animate);
    };
    animate();

    const onEnter = () => {
      dotRef.current?.classList.add("scale-150");
      ringRef.current?.classList.add("scale-150");
    };
    const onLeave = () => {
      dotRef.current?.classList.remove("scale-150");
      ringRef.current?.classList.remove("scale-150");
    };
    document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
