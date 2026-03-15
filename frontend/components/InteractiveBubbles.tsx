'use client';

import { useRef, useEffect, useCallback, MouseEvent as ReactMouseEvent } from 'react';

interface Bubble {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  baseSize: number;
  speedX: number;
  speedY: number;
  opacity: number;
  baseOpacity: number;
  glowIntensity: number;
}

export default function InteractiveBubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const bubblesRef = useRef<Bubble[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const BUBBLE_COUNT = 35;
  const MOUSE_RADIUS = 120;

  const createBubble = useCallback((width: number, height: number): Bubble => {
    const baseSize = 4 + Math.random() * 28;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      baseX: 0,
      baseY: 0,
      size: baseSize,
      baseSize: baseSize,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -0.2 - Math.random() * 0.5,
      opacity: 0.04 + Math.random() * 0.12,
      baseOpacity: 0,
      glowIntensity: 0,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.parentElement?.offsetWidth || window.innerWidth;
    let height = canvas.parentElement?.offsetHeight || window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Init bubbles
    bubblesRef.current = Array.from({ length: BUBBLE_COUNT }, () => {
      const b = createBubble(width, height);
      b.baseX = b.x;
      b.baseY = b.y;
      b.baseOpacity = b.opacity;
      return b;
    });

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      bubblesRef.current.forEach((b) => {
        // Drift
        b.x += b.speedX;
        b.y += b.speedY;

        // Wrap around
        if (b.y + b.size < 0) {
          b.y = height + b.size;
          b.x = Math.random() * width;
        }
        if (b.x < -b.size) b.x = width + b.size;
        if (b.x > width + b.size) b.x = -b.size;

        // Mouse interaction
        const dx = b.x - mx;
        const dy = b.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          // Push away
          b.x += dx * force * 0.06;
          b.y += dy * force * 0.06;
          // Grow + glow
          b.size += (b.baseSize * 1.6 - b.size) * 0.08;
          b.glowIntensity += (1 - b.glowIntensity) * 0.1;
          b.opacity += (b.baseOpacity * 3 - b.opacity) * 0.08;
        } else {
          b.size += (b.baseSize - b.size) * 0.04;
          b.glowIntensity += (0 - b.glowIntensity) * 0.04;
          b.opacity += (b.baseOpacity - b.opacity) * 0.04;
        }

        // Draw
        ctx.beginPath();
        ctx.arc(b.x, b.y, Math.max(b.size, 0), 0, Math.PI * 2);

        if (b.glowIntensity > 0.01) {
          // Glowing bubble near cursor
          const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.size * 1.5);
          gradient.addColorStop(0, `rgba(212, 160, 192, ${b.opacity * 1.5})`);
          gradient.addColorStop(0.5, `rgba(212, 160, 192, ${b.opacity * 0.6})`);
          gradient.addColorStop(1, `rgba(212, 160, 192, 0)`);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Border glow
          ctx.strokeStyle = `rgba(255, 255, 255, ${b.glowIntensity * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity})`;
          ctx.fill();
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.parentElement?.offsetHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [createBubble]);

  const handleMouseMove = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1]"
      style={{ cursor: 'default' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}
