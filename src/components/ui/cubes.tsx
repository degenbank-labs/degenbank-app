import React, { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";

interface Gap {
  row: number;
  col: number;
}
interface Duration {
  enter: number;
  leave: number;
}

interface ArenaData {
  id: string;
  name: string;
  type: string;
  status: string;
  phase: string;
  timeRemaining: string;
  totalTVL: number;
  activeVaults: number;
  participants: number;
  prizePool: number;
  description: string;
  color: string;
  cubePosition: { row: number; col: number };
}

export interface CubesProps {
  gridSize?: number;
  cubeSize?: number;
  maxAngle?: number;
  radius?: number;
  easing?: gsap.EaseString;
  duration?: Duration;
  cellGap?: number | Gap;
  borderStyle?: string;
  faceColor?: string;
  shadow?: boolean | string;
  autoAnimate?: boolean;
  rippleOnClick?: boolean;
  rippleColor?: string;
  rippleSpeed?: number;
  arenaData?: ArenaData[];
  onCubeClick?: (arena: ArenaData, row: number, col: number) => void;
  onCubeHover?: (arena: ArenaData | null, row: number, col: number) => void;
}

const Cubes: React.FC<CubesProps> = ({
  gridSize = 10,
  cubeSize,
  maxAngle = 45,
  radius = 3,
  easing = "power2.out",
  duration = { enter: 0.2, leave: 0.2 }, // Faster and consistent animation speeds
  cellGap,
  borderStyle = "2px solid #6fb7a5", // Use primary color
  faceColor = "transparent",
  shadow = false,
  autoAnimate = false, // Disable auto animation to prevent interference
  rippleOnClick = true,
  rippleColor = "#6fb7a5", // Use primary color
  rippleSpeed = 2,
  arenaData = [],
  onCubeClick,
  onCubeHover,
}) => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const userActiveRef = useRef(false);
  const simPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const simTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const simRAFRef = useRef<number | null>(null);

  // Improved spacing calculation
  const colGap =
    typeof cellGap === "number"
      ? `${cellGap}px`
      : (cellGap as Gap)?.col !== undefined
        ? `${(cellGap as Gap).col}px`
        : "60px"; // Increased default spacing

  const rowGap =
    typeof cellGap === "number"
      ? `${cellGap}px`
      : (cellGap as Gap)?.row !== undefined
        ? `${(cellGap as Gap).row}px`
        : "60px"; // Increased default spacing

  const enterDur = duration.enter;
  const leaveDur = duration.leave;

  const tiltAt = useCallback(
    (rowCenter: number, colCenter: number) => {
      if (!sceneRef.current) return;
      
      // Find the specific cube being hovered
      const targetRow = Math.floor(rowCenter);
      const targetCol = Math.floor(colCenter);
      
      sceneRef.current
        .querySelectorAll<HTMLDivElement>(".cube")
        .forEach((cube) => {
          const r = +cube.dataset.row!;
          const c = +cube.dataset.col!;
          
          // Only animate the specific cube being hovered
          if (r === targetRow && c === targetCol) {
            gsap.to(cube, {
              duration: enterDur,
              ease: easing,
              overwrite: true,
              rotateX: -maxAngle,
              rotateY: maxAngle,
            });
          } else {
            // Reset all other cubes immediately
            gsap.to(cube, {
              duration: leaveDur,
              ease: easing,
              overwrite: true,
              rotateX: 0,
              rotateY: 0,
            });
          }
        });
    },
    [maxAngle, enterDur, leaveDur, easing]
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      userActiveRef.current = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      const rect = sceneRef.current!.getBoundingClientRect();
      const cellW = rect.width / gridSize;
      const cellH = rect.height / gridSize;
      const colCenter = (e.clientX - rect.left) / cellW;
      const rowCenter = (e.clientY - rect.top) / cellH;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() =>
        tiltAt(rowCenter, colCenter)
      );

      idleTimerRef.current = setTimeout(() => {
        userActiveRef.current = false;
      }, 3000);
    },
    [gridSize, tiltAt]
  );

  const resetAll = useCallback(() => {
    if (!sceneRef.current) return;
    sceneRef.current.querySelectorAll<HTMLDivElement>(".cube").forEach((cube) =>
      gsap.to(cube, {
        duration: leaveDur,
        rotateX: 0,
        rotateY: 0,
        ease: easing,
      })
    );
  }, [leaveDur, easing]);

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      userActiveRef.current = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

      const rect = sceneRef.current!.getBoundingClientRect();
      const cellW = rect.width / gridSize;
      const cellH = rect.height / gridSize;

      const touch = e.touches[0];
      const colCenter = (touch.clientX - rect.left) / cellW;
      const rowCenter = (touch.clientY - rect.top) / cellH;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() =>
        tiltAt(rowCenter, colCenter)
      );

      idleTimerRef.current = setTimeout(() => {
        userActiveRef.current = false;
      }, 3000);
    },
    [gridSize, tiltAt]
  );

  const onTouchStart = useCallback(() => {
    userActiveRef.current = true;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!sceneRef.current) return;
    resetAll();
  }, [resetAll]);

  const onClick = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!rippleOnClick || !sceneRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      const cellW = rect.width / gridSize;
      const cellH = rect.height / gridSize;

      const clientX =
        (e as MouseEvent).clientX ||
        ((e as TouchEvent).touches && (e as TouchEvent).touches[0].clientX);
      const clientY =
        (e as MouseEvent).clientY ||
        ((e as TouchEvent).touches && (e as TouchEvent).touches[0].clientY);

      const colHit = Math.floor((clientX - rect.left) / cellW);
      const rowHit = Math.floor((clientY - rect.top) / cellH);

      const baseRingDelay = 0.15;
      const baseAnimDur = 0.3;
      const baseHold = 0.6;

      const spreadDelay = baseRingDelay / rippleSpeed;
      const animDuration = baseAnimDur / rippleSpeed;
      const holdTime = baseHold / rippleSpeed;

      const rings: Record<number, HTMLDivElement[]> = {};
      sceneRef.current
        .querySelectorAll<HTMLDivElement>(".cube")
        .forEach((cube) => {
          const r = +cube.dataset.row!;
          const c = +cube.dataset.col!;
          const dist = Math.hypot(r - rowHit, c - colHit);
          const ring = Math.round(dist);
          if (!rings[ring]) rings[ring] = [];
          rings[ring].push(cube);
        });

      Object.keys(rings)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((ring) => {
          const delay = ring * spreadDelay;
          const faces = rings[ring].flatMap((cube) =>
            Array.from(cube.querySelectorAll<HTMLElement>(".cube-face"))
          );

          gsap.to(faces, {
            backgroundColor: rippleColor,
            duration: animDuration,
            delay,
            ease: "power3.out",
          });
          gsap.to(faces, {
            backgroundColor: faceColor,
            duration: animDuration,
            delay: delay + animDuration + holdTime,
            ease: "power3.out",
          });
        });
    },
    [rippleOnClick, gridSize, faceColor, rippleColor, rippleSpeed]
  );

  // Remove auto animation effect since we want manual control
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", resetAll);
    el.addEventListener("click", onClick);

    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", resetAll);
      el.removeEventListener("click", onClick);

      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);

      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [onPointerMove, resetAll, onClick, onTouchMove, onTouchStart, onTouchEnd]);

  const cells = Array.from({ length: gridSize });

  // Helper function to get arena data for a specific position
  const getArenaForPosition = (row: number, col: number): ArenaData | null => {
    return arenaData.find(arena => 
      arena.cubePosition.row === row && arena.cubePosition.col === col
    ) || null;
  };

  const sceneStyle: React.CSSProperties = {
    gridTemplateColumns: cubeSize
      ? `repeat(${gridSize}, ${cubeSize}px)`
      : `repeat(${gridSize}, 1fr)`,
    gridTemplateRows: cubeSize
      ? `repeat(${gridSize}, ${cubeSize}px)`
      : `repeat(${gridSize}, 1fr)`,
    columnGap: colGap,
    rowGap: rowGap,
    perspective: "99999999px",
    gridAutoRows: "1fr",
  };
  
  const wrapperStyle = {
    "--cube-face-border": borderStyle,
    "--cube-face-bg": faceColor,
    "--cube-face-shadow":
      shadow === true ? "0 0 6px rgba(0,0,0,.5)" : shadow || "none",
    ...(cubeSize
      ? {
          width: `${gridSize * cubeSize + (gridSize - 1) * 60}px`, // Account for gaps
          height: `${gridSize * cubeSize + (gridSize - 1) * 60}px`, // Account for gaps
        }
      : {}),
  } as React.CSSProperties;

  return (
    <div
      className="relative flex items-center justify-center"
      style={wrapperStyle}
    >
      <div ref={sceneRef} className="grid" style={sceneStyle}>
        {cells.map((_, r) =>
          cells.map((__, c) => {
            const arena = getArenaForPosition(r, c);
            const isClickable = !!arena;
            
            return (
              <div
                key={`${r}-${c}`}
                className={`cube relative aspect-square h-full w-full [transform-style:preserve-3d] ${
                  isClickable ? 'cursor-pointer' : ''
                }`}
                data-row={r}
                data-col={c}
                onClick={() => {
                  if (arena && onCubeClick) {
                    onCubeClick(arena, r, c);
                  }
                }}
                onMouseEnter={() => {
                  if (onCubeHover) {
                    onCubeHover(arena, r, c);
                  }
                }}
                onMouseLeave={() => {
                  if (onCubeHover) {
                    onCubeHover(null, r, c);
                  }
                }}
              >
                <span className="pointer-events-none absolute -inset-9" />

              <div
                className="cube-face absolute inset-0 flex items-center justify-center"
                style={{
                  background: faceColor,
                  border: arena ? `2px solid #6fb7a5` : "var(--cube-face-border)", // Use primary color
                  boxShadow: "var(--cube-face-shadow)",
                  transform: "translateY(-50%) rotateX(90deg)",
                }}
              />
              <div
                className="cube-face absolute inset-0 flex items-center justify-center"
                style={{
                  background: faceColor,
                  border: arena ? `2px solid #6fb7a5` : "var(--cube-face-border)", // Use primary color
                  boxShadow: "var(--cube-face-shadow)",
                  transform: "translateY(50%) rotateX(-90deg)",
                }}
              />
              <div
                className="cube-face absolute inset-0 flex items-center justify-center"
                style={{
                  background: faceColor,
                  border: arena ? `2px solid #6fb7a5` : "var(--cube-face-border)", // Use primary color
                  boxShadow: "var(--cube-face-shadow)",
                  transform: "translateX(-50%) rotateY(-90deg)",
                }}
              />
              <div
                className="cube-face absolute inset-0 flex items-center justify-center"
                style={{
                  background: faceColor,
                  border: arena ? `2px solid #6fb7a5` : "var(--cube-face-border)", // Use primary color
                  boxShadow: "var(--cube-face-shadow)",
                  transform: "translateX(50%) rotateY(90deg)",
                }}
              />
              <div
                className="cube-face absolute inset-0 flex items-center justify-center"
                style={{
                  background: faceColor,
                  border: arena ? `2px solid #6fb7a5` : "var(--cube-face-border)", // Use primary color
                  boxShadow: "var(--cube-face-shadow)",
                  transform: "rotateY(-90deg) translateX(50%) rotateY(90deg)",
                }}
              />
              <div
                className="cube-face absolute inset-0 flex items-center justify-center"
                style={{
                  background: faceColor,
                  border: arena ? `2px solid #6fb7a5` : "var(--cube-face-border)", // Use primary color
                  boxShadow: "var(--cube-face-shadow)",
                  transform: "rotateY(90deg) translateX(-50%) rotateY(-90deg)",
                }}
              />
            </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Cubes;