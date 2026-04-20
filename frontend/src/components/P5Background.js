import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

/**
 * P5.js animated financial graph background canvas.
 * Renders:
 *  - Multiple animated stock chart lines with glowing trails
 *  - Floating connected particle network (nodes + edges)
 *  - Candlestick micro-charts
 *  - Pulsing grid lines
 */
export default function P5Background({ darkMode, style, className }) {
  const containerRef = useRef(null);
  const p5InstanceRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy previous instance on re-render
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
    }

    const sketch = (p) => {
      let w, h;
      // Graph lines data
      const lines = [];
      const numLines = 5;
      // Particles
      const particles = [];
      const numParticles = 40;
      // Candlesticks
      const candles = [];
      const numCandles = 18;
      // Grid pulse
      let gridPhase = 0;

      p.setup = () => {
        w = containerRef.current.offsetWidth;
        h = containerRef.current.offsetHeight;
        const canvas = p.createCanvas(w, h);
        canvas.style('display', 'block');
        p.pixelDensity(1);

        // Initialize graph lines
        for (let i = 0; i < numLines; i++) {
          const baseY = h * (0.25 + i * 0.12);
          const points = [];
          const numPoints = 80;
          for (let j = 0; j < numPoints; j++) {
            points.push({
              x: (j / (numPoints - 1)) * w,
              y: baseY + p.random(-30, 30),
              targetY: baseY,
              velocity: 0,
            });
          }
          lines.push({
            points,
            color: [
              [37, 99, 235],   // blue
              [59, 130, 246],  // lighter blue
              [124, 58, 237],  // violet
              [16, 185, 129],  // green
              [99, 102, 241],  // indigo
            ][i],
            alpha: 0.15 + i * 0.05,
            speed: 0.003 + i * 0.001,
            amplitude: 20 + i * 8,
            phase: p.random(p.TWO_PI),
          });
        }

        // Initialize particles
        for (let i = 0; i < numParticles; i++) {
          particles.push({
            x: p.random(w),
            y: p.random(h),
            vx: p.random(-0.3, 0.3),
            vy: p.random(-0.3, 0.3),
            size: p.random(1.5, 3.5),
            alpha: p.random(30, 80),
          });
        }

        // Initialize candlesticks
        const candleStartX = w * 0.65;
        const candleWidth = w * 0.28;
        for (let i = 0; i < numCandles; i++) {
          const x = candleStartX + (i / numCandles) * candleWidth;
          const basePrice = h * 0.6;
          const open = basePrice + p.random(-40, 40);
          const close = open + p.random(-30, 30);
          const high = Math.min(open, close) - p.random(5, 20);
          const low = Math.max(open, close) + p.random(5, 20);
          candles.push({ x, open, close, high, low, width: (candleWidth / numCandles) * 0.6 });
        }
      };

      p.draw = () => {
        p.clear();
        gridPhase += 0.005;

        // Draw subtle grid
        drawGrid(p, w, h, gridPhase);

        // Draw graph lines
        for (const line of lines) {
          drawGraphLine(p, line, w, h);
        }

        // Draw candlesticks
        drawCandlesticks(p, candles);

        // Draw and update particles
        drawParticles(p, particles, w, h);
      };

      p.windowResized = () => {
        if (!containerRef.current) return;
        w = containerRef.current.offsetWidth;
        h = containerRef.current.offsetHeight;
        p.resizeCanvas(w, h);
      };

      // ─── Drawing functions ───

      function drawGrid(p, w, h, phase) {
        p.strokeWeight(0.5);
        // Horizontal lines
        const gridSpacing = 60;
        for (let y = 0; y < h; y += gridSpacing) {
          const pulseAlpha = 8 + Math.sin(phase + y * 0.01) * 4;
          p.stroke(37, 99, 235, pulseAlpha);
          p.line(0, y, w, y);
        }
        // Vertical lines
        for (let x = 0; x < w; x += gridSpacing) {
          const pulseAlpha = 6 + Math.sin(phase + x * 0.008) * 3;
          p.stroke(37, 99, 235, pulseAlpha);
          p.line(x, 0, x, h);
        }
      }

      function drawGraphLine(p, line, w, h) {
        const { points, color, alpha, speed, amplitude, phase } = line;
        const time = p.frameCount * speed + phase;

        // Update points
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          pt.y = pt.targetY +
            Math.sin(time + i * 0.15) * amplitude +
            Math.sin(time * 1.5 + i * 0.08) * (amplitude * 0.4) +
            Math.cos(time * 0.7 + i * 0.2) * (amplitude * 0.25);
        }

        // Draw glow layer
        p.noFill();
        p.strokeWeight(3);
        p.stroke(color[0], color[1], color[2], alpha * 60);
        p.beginShape();
        for (const pt of points) {
          p.vertex(pt.x, pt.y);
        }
        p.endShape();

        // Draw main line
        p.strokeWeight(1.5);
        p.stroke(color[0], color[1], color[2], alpha * 180);
        p.beginShape();
        for (const pt of points) {
          p.vertex(pt.x, pt.y);
        }
        p.endShape();

        // Draw gradient fill below line
        for (let i = 0; i < points.length - 1; i++) {
          const pt1 = points[i];
          const pt2 = points[i + 1];
          const steps = 3;
          for (let s = 0; s < steps; s++) {
            const yOff = s * 15;
            const a = alpha * 30 * (1 - s / steps);
            p.stroke(color[0], color[1], color[2], a);
            p.strokeWeight(0.5);
            p.line(pt1.x, pt1.y + yOff, pt2.x, pt2.y + yOff);
          }
        }
      }

      function drawCandlesticks(p, candles) {
        const time = p.frameCount * 0.008;
        for (let i = 0; i < candles.length; i++) {
          const c = candles[i];
          const drift = Math.sin(time + i * 0.3) * 8;
          const open = c.open + drift;
          const close = c.close + drift;
          const high = c.high + drift;
          const low = c.low + drift;
          const bullish = close < open;

          // Wick
          p.strokeWeight(0.8);
          p.stroke(bullish ? 16 : 239, bullish ? 185 : 68, bullish ? 129 : 68, 40);
          p.line(c.x + c.width / 2, high, c.x + c.width / 2, low);

          // Body
          p.noStroke();
          p.fill(bullish ? 16 : 239, bullish ? 185 : 68, bullish ? 129 : 68, 25);
          const bodyTop = Math.min(open, close);
          const bodyHeight = Math.abs(close - open);
          p.rect(c.x, bodyTop, c.width, Math.max(bodyHeight, 2), 1);
        }
      }

      function drawParticles(p, particles, w, h) {
        const connectionDist = 120;

        for (const particle of particles) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Wrap around
          if (particle.x < 0) particle.x = w;
          if (particle.x > w) particle.x = 0;
          if (particle.y < 0) particle.y = h;
          if (particle.y > h) particle.y = 0;
        }

        // Draw connections
        p.strokeWeight(0.5);
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDist) {
              const alpha = (1 - dist / connectionDist) * 25;
              p.stroke(59, 130, 246, alpha);
              p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            }
          }
        }

        // Draw particles
        p.noStroke();
        for (const particle of particles) {
          // Glow
          p.fill(37, 99, 235, particle.alpha * 0.3);
          p.ellipse(particle.x, particle.y, particle.size * 4);
          // Core
          p.fill(147, 197, 253, particle.alpha);
          p.ellipse(particle.x, particle.y, particle.size);
        }
      }
    };

    p5InstanceRef.current = new p5(sketch, containerRef.current);

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [darkMode]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        ...style,
      }}
    />
  );
}
