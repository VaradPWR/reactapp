import React, { useMemo } from 'react';

export default function WeatherBackground({ theme = 'clear', isDay = 1, themeMode = 'dark' }) {
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.17 + (i % 7) * 2.3) % 100}%`,
      delay: `${((i * 3) % 17 * 0.2).toFixed(1)}s`,
      duration: `${3 + (i % 5) * 1.5}s`,
      size: `${2 + (i % 4)}px`,
      opacity: 0.15 + (i % 4) * 0.1
    }));
  }, []);

  return (
    <div className={`weather-bg-container theme-${theme} ${isDay ? 'daytime' : 'nighttime'} mode-${themeMode}`}>
      <div className="bg-gradient-base" />
      <div className="bg-glow-orb orb-1" />
      <div className="bg-glow-orb orb-2" />
      <div className="bg-glow-orb orb-3" />
      
      {/* Ambient weather particles (rain / stars / snow) */}
      <div className="bg-particle-field" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`particle particle-${theme}`}
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: theme === 'rain' ? '18px' : p.size,
              opacity: p.opacity
            }}
          />
        ))}
      </div>
      
      {/* Subtle overlay grid/noise for depth */}
      <div className="bg-noise-overlay" />
    </div>
  );
}
