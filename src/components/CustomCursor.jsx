import { memo, useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";

const TRAIL_LENGTH = 12;
const SPAWN_INTERVAL = 40; // ms between trail particles
const FADE_DURATION = 500; // ms for trail to fade out

const CustomCursor = memo(function CustomCursor() {
  const { theme } = useTheme();
  const cursorRef = useRef(null);
  const trailRef = useRef([]);
  const lastSpawnTime = useRef(0);
  const [trail, setTrail] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Update cursor position
  const updateCursor = useCallback((e) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    }

    // Spawn trail particles
    const now = Date.now();
    if (now - lastSpawnTime.current > SPAWN_INTERVAL) {
      lastSpawnTime.current = now;

      const newParticle = {
        id: now,
        x: e.clientX,
        y: e.clientY,
        createdAt: now,
      };

      setTrail((prev) => {
        const updated = [...prev, newParticle];
        // Keep only recent particles
        return updated.filter((p) => now - p.createdAt < FADE_DURATION);
      });
    }
  }, []);

  // Handle mouse enter/leave for hover states
  const handleMouseOver = useCallback((e) => {
    const target = e.target;
    const isInteractive =
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.closest("button") ||
      target.closest("a") ||
      target.style.cursor === "pointer" ||
      getComputedStyle(target).cursor === "pointer";

    setIsHovering(isInteractive);
  }, []);

  // Show/hide cursor on mouse enter/leave
  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  // Cleanup old trail particles
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setTrail((prev) => prev.filter((p) => now - p.createdAt < FADE_DURATION));
    }, 100);

    return () => clearInterval(cleanup);
  }, []);

  // Add event listeners
  useEffect(() => {
    // Check for touch device
    if ("ontouchstart" in window) {
      return; // Don't show custom cursor on touch devices
    }

    document.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Initially check if mouse is in viewport
    setIsVisible(true);

    return () => {
      document.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [updateCursor, handleMouseOver, handleMouseEnter, handleMouseLeave]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  const glowColor = theme.glow.color;
  const now = Date.now();

  return (
    <>
      {/* Trail particles */}
      {trail.map((particle) => {
        const age = now - particle.createdAt;
        const opacity = Math.max(0, 1 - age / FADE_DURATION);

        return (
          <div
            key={particle.id}
            className="cursor-trail-particle"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: opacity * 0.6,
              transform: `translate(-50%, -50%)`,
              backgroundColor: glowColor,
              boxShadow: `0 0 8px ${glowColor}`,
            }}
          />
        );
      })}

      {/* Main cursor */}
      <div
        ref={cursorRef}
        className={`custom-cursor ${isVisible ? "visible" : ""} ${
          isHovering ? "hovering" : ""
        }`}
        style={{
          "--cursor-color": glowColor,
        }}
      >
        <div className="cursor-dot" />
        <div className="cursor-ring" />
      </div>
    </>
  );
});

export default CustomCursor;
