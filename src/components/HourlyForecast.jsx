import React, { useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatHourlyTime, formatTemp } from '../utils/helpers';

export default function HourlyForecast({ hourly, timezone, unit }) {
  const scrollRef = useRef(null);

  if (!hourly || !hourly.length) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="forecast-card hourly-forecast-card" aria-label="Hourly Forecast">
      <div className="forecast-card-header">
        <div className="header-title-group">
          <Clock size={18} className="header-icon" />
          <h2 className="card-heading">24-Hour Forecast</h2>
        </div>
        <div className="scroll-controls">
          <button
            type="button"
            className="scroll-btn"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="scroll-btn"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="hourly-scroll-container" ref={scrollRef}>
        {hourly.map((item, index) => {
          const isNow = index === 0;
          const timeLabel = isNow ? 'Now' : formatHourlyTime(item.time, timezone);

          return (
            <div
              key={item.time}
              className={`hourly-item-card ${isNow ? 'is-now-card' : ''}`}
            >
              <span className="hourly-time">{timeLabel}</span>
              <div className="hourly-icon-wrap">
                <WeatherIcon name={item.iconName} size={28} />
              </div>
              <span className="hourly-temp">{formatTemp(item.temp, unit)}</span>
              
              {/* Precipitation chance indicator */}
              <div className="hourly-precip-wrap">
                {item.precipProb > 5 ? (
                  <span className="hourly-precip-value">
                    <Droplets size={11} />
                    {item.precipProb}%
                  </span>
                ) : (
                  <span className="hourly-precip-empty">•</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
