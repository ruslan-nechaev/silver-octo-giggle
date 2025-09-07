import { cn } from "@/lib/utils";
import { motion, Transition } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: (t: number) => number;
  onAnimationComplete?: () => void;
  stepDuration?: number;
  triggerOnMount?: boolean;
};

const buildKeyframes = (
  from: Record<string, string | number>,
  steps: Array<Record<string, string | number>>
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((s) => Object.keys(s)),
  ]);

  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((k) => {
    keyframes[k] = [from[k], ...steps.map((s) => s[k])];
  });
  return keyframes;
};

const BlurText: React.FC<BlurTextProps> = ({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = (t) => t,
  onAnimationComplete,
  stepDuration = 0.35,
}) => {
  // Normalize leading whitespace to avoid odd left indents at line start
  const normalizedText = (text ?? "").replace(/^\s+/, "");
  // Split into tokens. For words mode, preserve whitespace/newlines as tokens
  const elements = animateBy === "words" ? (normalizedText.match(/(\s+|[^\s]+)/g) ?? []) : normalizedText.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current as Element);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  // Fallback: trigger animation on mount to avoid stuck invisible text
  useEffect(() => {
    const t = setTimeout(() => setInView(true), 0);
    return () => clearTimeout(t);
  }, []);

  const defaultFrom = useMemo(
    () =>
      direction === "top"
        ? { filter: "blur(10px)", opacity: 0, y: -50 }
        : { filter: "blur(10px)", opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: "blur(5px)",
        opacity: 0.5,
        y: direction === "top" ? 5 : -5,
      },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) =>
    stepCount === 1 ? 0 : i / (stepCount - 1)
  );

  return (
    <p ref={ref} className={cn("blur-text m-0 flex flex-wrap", className)}>
      {(() => {
        let animatedIndex = 0; // count only animated tokens for delay
        return elements.map((segment, index) => {
          const isWhitespace = /^\s+$/.test(segment);
          if (isWhitespace) {
            // Preserve whitespace/newlines; do not animate; convert spaces to nbsp to avoid collapse
            const content = segment.replace(/ /g, "\u00A0");
            return (
              <span key={`ws-${index}`} style={{ whiteSpace: 'pre-wrap' }}>{content}</span>
            );
          }

          const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);
          const currentDelay = (animatedIndex++ * delay) / 1000;
          const spanTransition: Transition = {
            duration: totalDuration,
            times,
            delay: currentDelay,
          };
          (spanTransition as any).ease = easing;

          return (
            <motion.span
              key={index}
              initial={fromSnapshot}
              animate={inView ? animateKeyframes : fromSnapshot}
              transition={spanTransition}
              onAnimationComplete={
                index === elements.length - 1 ? onAnimationComplete : undefined
              }
              style={{
                display: "inline-block",
                willChange: "transform, filter, opacity",
              }}
            >
              {segment}
            </motion.span>
          );
        });
      })()}
    </p>
  );
};

export { BlurText }


