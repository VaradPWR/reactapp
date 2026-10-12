import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatDayName, formatTemp } from '../utils/helpers';

export default function DailyForecast({ daily, unit }) {
  if (!daily || !daily.length) return null;

  // Calculate absolute min and max across all 7 days for normalized temperature bar
  const allMins = daily.map((d) => d.minTemp);
  const allMaxs = daily.map((d) => d.maxTemp);
  const minBound = Math.min(...allMins);
  const maxBound = Math.max(...allMaxs);
  const rangeSpan = Math.max(maxBound - minBound, 1);

  return (
    <section className="forecast-card daily-forecast-card" aria-label="7-Day Forecast">
      <div className="forecast-card-header">
        <div className="header-title-group">
          <Calendar size={18} className="header-icon" />
          <h2 className="card-heading">7-Day Outlook</h2>
        </div>
        <span className="card-subheading">Weekly trends</span>
      </div>

      <div className="daily-list">
        {daily.map((day, index) => {
          // Calculate percentage width and offset for the temperature range bar
          const leftPercent = Math.max(0, ((day.minTemp - minBound) / rangeSpan) * 100);
          const barWidthPercent = Math.max(12, (((day.maxTemp - day.minTemp) / rangeSpan) * 100));

          return (
            <div key={day.date} className="daily-row-item">
              <div className="daily-day-label">
                <span className="day-name">{formatDayName(day.date, index)}</span>
                <span className="day-cond-label">{day.label}</span>
              </div>

              <div className="daily-weather-col">
                <WeatherIcon name={day.iconName} size={22} />
                {day.rainProb > 10 ? (
                  <span className="daily-rain-badge">
                    <Droplets size={10} />
                    {day.rainProb}%
                  </span>
                ) : (
                  <span className="daily-rain-placeholder" />
                )}
              </div>

              {/* Temperature Range Bar */}
              <div className="daily-temp-bar-container">
                <span className="daily-min-temp">{formatTemp(day.minTemp, unit)}</span>
                <div className="temp-track">
                  <div
                    className="temp-fill-bar"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidthPercent}%`
                    }}
                  />
                </div>
                <span className="daily-max-temp">{formatTemp(day.maxTemp, unit)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
