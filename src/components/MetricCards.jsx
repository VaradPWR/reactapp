import React from 'react';
import {
  Sun,
  Wind,
  Droplets,
  Sunrise,
  Gauge,
  Compass,
  CloudRain
} from 'lucide-react';
import {
  formatWindSpeed,
  getWindDirectionLabel,
  getUVDescription,
  getHumidityDescription,
  formatSunTime,
  getDaylightProgress
} from '../utils/helpers';

export default function MetricCards({ weather, unit }) {
  if (!weather || !weather.current) return null;

  const { current } = weather;
  const uvInfo = getUVDescription(current.uvIndex);
  const humidityInfo = getHumidityDescription(current.humidity);
  const windDirLabel = getWindDirectionLabel(current.windDirection);
  const daylightProgress = getDaylightProgress(current.sunrise, current.sunset, current.time);

  return (
    <div className="metrics-bento-grid" aria-label="Detailed Weather Metrics">
      {/* 1. UV Index */}
      <div className="metric-card uv-card">
        <div className="metric-card-header">
          <Sun size={17} className="metric-icon" />
          <span className="metric-title">UV Index</span>
        </div>
        <div className="metric-body">
          <div className="metric-main-value">
            <span className="value-num">{current.uvIndex}</span>
            <span
              className="metric-badge"
              style={{ backgroundColor: `${uvInfo.color}25`, color: uvInfo.color, borderColor: uvInfo.color }}
            >
              {uvInfo.label}
            </span>
          </div>
          <div className="uv-bar-track">
            <div
              className="uv-bar-fill"
              style={{
                width: `${Math.min((current.uvIndex / 11) * 100, 100)}%`,
                backgroundColor: uvInfo.color
              }}
            />
          </div>
          <p className="metric-footnote">{uvInfo.desc}</p>
        </div>
      </div>

      {/* 2. Wind & Direction */}
      <div className="metric-card wind-card">
        <div className="metric-card-header">
          <Wind size={17} className="metric-icon" />
          <span className="metric-title">Wind & Breeze</span>
        </div>
        <div className="metric-body">
          <div className="metric-main-value">
            <span className="value-num">{formatWindSpeed(current.windSpeed, unit)}</span>
          </div>
          <div className="wind-direction-row">
            <div
              className="wind-compass-circle"
              style={{ transform: `rotate(${current.windDirection || 0}deg)` }}
              title={`Wind direction: ${current.windDirection}°`}
            >
              <Compass size={18} />
            </div>
            <span className="wind-direction-text">
              {windDirLabel} ({current.windDirection || 0}°)
            </span>
          </div>
          <p className="metric-footnote">
            {current.windSpeed < 10
              ? 'Gentle breeze'
              : current.windSpeed < 25
              ? 'Moderate breeze'
              : 'Strong air currents'}
          </p>
        </div>
      </div>

      {/* 3. Humidity */}
      <div className="metric-card humidity-card">
        <div className="metric-card-header">
          <Droplets size={17} className="metric-icon" />
          <span className="metric-title">Humidity</span>
        </div>
        <div className="metric-body">
          <div className="metric-main-value">
            <span className="value-num">{current.humidity}%</span>
            <span className="metric-sub-label">{humidityInfo.label}</span>
          </div>
          <div className="humidity-meter-track">
            <div
              className="humidity-meter-fill"
              style={{ width: `${current.humidity}%` }}
            />
          </div>
          <p className="metric-footnote">{humidityInfo.desc}</p>
        </div>
      </div>

      {/* 4. Sunrise & Sunset */}
      <div className="metric-card sun-schedule-card">
        <div className="metric-card-header">
          <Sunrise size={17} className="metric-icon" />
          <span className="metric-title">Sun Schedule</span>
        </div>
        <div className="metric-body">
          <div className="sun-times-row">
            <div className="sun-time-block">
              <span className="sun-label">Sunrise</span>
              <span className="sun-time-val">{formatSunTime(current.sunrise)}</span>
            </div>
            <div className="sun-time-block text-right">
              <span className="sun-label">Sunset</span>
              <span className="sun-time-val">{formatSunTime(current.sunset)}</span>
            </div>
          </div>
          {/* Daylight progress bar */}
          <div className="daylight-track-container">
            <div className="daylight-track">
              <div
                className="daylight-progress"
                style={{ width: `${daylightProgress}%` }}
              />
              <div
                className="sun-position-dot"
                style={{ left: `${daylightProgress}%` }}
                title={`Daylight cycle: ${daylightProgress}%`}
              />
            </div>
          </div>
          <p className="metric-footnote">
            {daylightProgress === 0
              ? 'Before dawn'
              : daylightProgress === 100
              ? 'Night has fallen'
              : `${daylightProgress}% daylight elapsed`}
          </p>
        </div>
      </div>

      {/* 5. Pressure */}
      <div className="metric-card pressure-card">
        <div className="metric-card-header">
          <Gauge size={17} className="metric-icon" />
          <span className="metric-title">Pressure</span>
        </div>
        <div className="metric-body">
          <div className="metric-main-value">
            <span className="value-num">{current.surfacePressure}</span>
            <span className="value-unit">hPa</span>
          </div>
          <p className="metric-footnote">
            {current.surfacePressure > 1020
              ? 'High atmospheric pressure · Stable conditions'
              : current.surfacePressure < 1005
              ? 'Low atmospheric pressure · Rain likely'
              : 'Normal atmospheric pressure level'}
          </p>
        </div>
      </div>

      {/* 6. Precipitation */}
      <div className="metric-card precip-card">
        <div className="metric-card-header">
          <CloudRain size={17} className="metric-icon" />
          <span className="metric-title">Precipitation</span>
        </div>
        <div className="metric-body">
          <div className="metric-main-value">
            <span className="value-num">{current.precipitation}</span>
            <span className="value-unit">mm</span>
          </div>
          <p className="metric-footnote">
            {current.precipitation > 0
              ? `${current.precipitation} mm measured in the last hour`
              : 'Zero precipitation currently recorded'}
          </p>
        </div>
      </div>
    </div>
  );
}
