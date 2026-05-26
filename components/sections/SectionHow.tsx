"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SectionShell } from "@/components/ui/SectionShell";
import { Mono } from "@/components/ui/Mono";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { EASE_OUT_QUINT } from "@/lib/motion";

type Step = { num: string; title: string; body: string };
type ChatTurn = { from: "client" | "nashr"; text: string };
type Handover = {
  labels: { you: string; us: string };
  youProvide: string[];
  nashrHandles: string[];
};

/**
 * §02 — How we work, rendered as an AI chat conversation.
 *
 * 12 turns: 6 client questions + 6 NASHR responses. Each NASHR turn carries
 * one of the 6 process steps as its payload (numeral + title + body).
 *
 * Playback: on scroll-in, types each turn in order with a brief "typing"
 * indicator (3 pulsing dots) before each. Once it plays, it doesn't replay.
 */
export function SectionHow() {
  const t = useTranslations("how");
  const steps = (t.raw("steps") as Step[]) ?? [];
  const handover = t.raw("handover") as Handover;
  const clientPrompts = (t.raw("chatPrompts") as string[]) ?? [];

  // Interleave: client[i] → nashr[i] for i = 0..5
  const turns: ChatTurn[] = [];
  for (let i = 0; i < 6; i++) {
    turns.push({ from: "client", text: clientPrompts[i] ?? "" });
    turns.push({ from: "nashr", text: `${steps[i]?.num} ${steps[i]?.title} ${steps[i]?.body}` });
  }

  return (
    <SectionShell
      id="how"
      number="2.0"
      label={t("ref")}
      watermark="02"
      elevated
    >
      <SplitText
        as="h2"
        className="t-h1 max-w-[24ch] text-[var(--fg)]"
        text={t("headline")}
        ariaLabel={t("headline")}
        stagger={0.06}
      />

      {/* Chat container */}
      <ChatThread steps={steps} clientPrompts={clientPrompts} />

      {/* You provide / NASHR handles split */}
      <Reveal delay={0.1}>
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 border-t border-[var(--border)]">
          <SplitColumn label={handover.labels.you} items={handover.youProvide} />
          <SplitColumn
            label={handover.labels.us}
            items={handover.nashrHandles}
            border
          />
        </div>
      </Reveal>
    </SectionShell>
  );
}

/* ---------- Chat thread component ---------- */

function ChatThread({
  steps,
  clientPrompts,
}: {
  steps: Step[];
  clientPrompts: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();

  // Build the 12-turn sequence as {from, payload}
  const turns: Array<{
    from: "client" | "nashr";
    text: string;
    step?: Step;
  }> = [];
  for (let i = 0; i < 6; i++) {
    turns.push({ from: "client", text: clientPrompts[i] ?? "" });
    turns.push({
      from: "nashr",
      text: steps[i]?.body ?? "",
      step: steps[i],
    });
  }

  // Reveal-once playback index. 0 = none visible; turns.length = all shown.
  const [visibleCount, setVisibleCount] = useState(reduce ? turns.length : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    if (visibleCount >= turns.length) return;
    const t = window.setTimeout(() => {
      setVisibleCount((c) => Math.min(c + 1, turns.length));
    }, 700);
    return () => window.clearTimeout(t);
  }, [inView, visibleCount, turns.length, reduce]);

  return (
    <div
      ref={ref}
      className="mt-12 rounded-[10px] border border-[var(--border)] bg-[var(--bg)]/60 p-5 md:p-7 space-y-4"
    >
      {turns.map((turn, i) => {
        const visible = i < visibleCount;
        return (
          <ChatBubble
            key={i}
            turn={turn}
            visible={visible}
            isLastVisible={i === visibleCount - 1 && visibleCount < turns.length}
          />
        );
      })}

      {/* Typing indicator at the end while the next turn is pending */}
      {!reduce && visibleCount > 0 && visibleCount < turns.length && (
        <TypingIndicator from={turns[visibleCount]?.from ?? "nashr"} />
      )}
    </div>
  );
}

function ChatBubble({
  turn,
  visible,
}: {
  turn: { from: "client" | "nashr"; text: string; step?: Step };
  visible: boolean;
  isLastVisible: boolean;
}) {
  const reduce = useReducedMotion();
  const isClient = turn.from === "client";

  if (!visible && !reduce) return null;

  const wrapClass = isClient ? "justify-start" : "justify-end";
  const bubbleClass = isClient
    ? "rounded-[10px] border border-[var(--border)] bg-[var(--bg-card)] text-[var(--fg-secondary)]"
    : "rounded-[10px] border border-[var(--gold)]/30 bg-[rgba(164,143,96,0.06)] text-[var(--fg)]";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: EASE_OUT_QUINT }}
      className={`flex ${wrapClass}`}
    >
      <div className={`${bubbleClass} px-4 py-3 max-w-[78%] md:max-w-[68%]`}>
        {turn.step && (
          <div className="mb-1 flex items-center gap-2">
            <Mono size={11} tone="gold">
              {turn.step.num}
            </Mono>
            <span className="t-mono-sm font-mono uppercase text-[var(--gold-bright)] tracking-[0.08em]">
              {turn.step.title}
            </span>
          </div>
        )}
        <p className="t-body" style={{ fontSize: "15px", lineHeight: 1.55 }}>
          {turn.text}
        </p>
      </div>
    </motion.div>
  );
}

function TypingIndicator({ from }: { from: "client" | "nashr" }) {
  const justify = from === "client" ? "justify-start" : "justify-end";
  return (
    <div className={`flex ${justify}`}>
      <div className="rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-[var(--fg-muted)]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SplitColumn({
  label,
  items,
  border,
}: {
  label: string;
  items: string[];
  border?: boolean;
}) {
  return (
    <div
      className="py-10 md:py-12"
      style={{
        borderInlineStart: border ? "1px solid var(--border)" : undefined,
        paddingInlineStart: border ? "clamp(20px, 3vw, 48px)" : undefined,
        paddingInlineEnd: !border ? "clamp(20px, 3vw, 48px)" : undefined,
      }}
    >
      <span className="handover-label text-[var(--fg-muted)]">
        {label}
      </span>
      <ul className="mt-6 space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 text-[var(--fg-secondary)] t-body"
          >
            <span aria-hidden className="text-[var(--fg-faint)] select-none">—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
