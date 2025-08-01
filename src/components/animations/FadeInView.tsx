
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
}

const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.6
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay * 1000);
          } else {
            setIsVisible(true);
          }
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Trigger slightly before element enters viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Fallback: If intersection observer doesn't work, show content after delay
    const fallbackTimer = setTimeout(() => {
      if (!hasIntersected) {
        setIsVisible(true);
      }
    }, 1000 + (delay * 1000));

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [delay, hasIntersected]);

  const getInitialTransform = () => {
    switch (direction) {
      case "up": return "translateY(50px)";
      case "down": return "translateY(-50px)";
      case "left": return "translateX(50px)";
      case "right": return "translateX(-50px)";
      default: return "translateY(50px)";
    }
  };

  return (
    <div
      ref={ref}
      className={cn("transition-all ease-out", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate(0)" : getInitialTransform(),
        transitionDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  );
};

export default FadeInView;
