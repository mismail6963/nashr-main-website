"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, animate } from "motion/react";
import { EASE_OUT_QUINT } from "@/lib/motion";
import { useReveal } from "@/components/motion/useReveal";

type Props = {
  to: number;
  duration?: number;
  className?: string;
};

export function CountUp({ to, duration = 1.2, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useReveal(ref);
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: EASE_OUT_QUINT,
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {Math.round(value)}
    </span>
  );
}
