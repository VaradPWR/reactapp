import React from 'react';
import { MapPin, Calendar, ArrowUp, ArrowDown, Droplets, Sun, Moon } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp, formatHeroDate } from '../utils/helpers';

export default function HeroWeather({ weather, city, unit }) {
  if (!weather || !weather.current) return null;

  const { current } = weather;
  const isDay = current.isDay === 1;

  return (
    <div className="hero-weather-card">
      <div className="hero-card-glow" />
      
      {/* Top Meta: Location, Country, Date */}
      <div className="hero-header">
        <div className="hero-location-block">
          <div className="hero-location-title">
            <MapPin size={22} className="hero-pin-icon" />
            <h1 className="hero-city-name">{city.name}</h1>
            {city.country && <span className="hero-country-tag">{city.country}</span>}
          </div>
          <div className="hero-date-row">
            <Calendar size={14} />
            <span>{formatHeroDate(current.time)}</span>
            <span className="hero-dot-separator">•</span>
            <span className="hero-daynight-tag">
              {isDay ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-indigo-300" />}
              {isDay ? 'Daytime' : 'Nighttime'}
            </span>
          </div>
        </div>

        {/* Condition Badge */}
        <div className="hero-condition-pill">
          <WeatherIcon name={current.meta.iconName} size={24} animate={true} />
          <span className="condition-pill-text">{current.meta.label}</span>
        </div>
      </div>

      {/* Main Temp & Big Visual Display */}
      <div className="hero-body">
        <div className="hero-temp-section">
          <div className="hero-temp-wrapper">
            <span className="hero-temp-number">
              {unit === 'F'
                ? Math.round((current.temp * 9) / 5 + 32)
                : current.temp}
            </span>
            <span className="hero-temp-degree">°{unit}</span>
          </div>

          <p className="hero-condition-desc">{current.meta.desc}</p>
          
          <div className="hero-temp-sub-row">
            <span className="hero-feels-like">
              Feels like <strong>{formatTemp(current.feelsLike, unit)}</strong>
            </span>
            <span className="hero-dot-separator">•</span>
            <div className="hero-range-pills">
              <span className="range-item high">
                <ArrowUp size={14} /> {formatTemp(current.todayMax, unit)}
              </span>
              <span className="range-item low">
                <ArrowDown size={14} /> {formatTemp(current.todayMin, unit)}
              </span>
            </div>
          </div>
        </div>

        {/* Giant Atmospheric Icon with ambient glow */}
        <div className="hero-art-section">
          <div className="hero-art-glow" />
          <div className="hero-art-icon-container">
            <WeatherIcon
              name={current.meta.iconName}
              size={96}
              className="hero-art-icon"
              animate={true}
            />
          </div>
          {current.precipitation > 0 && (
            <div className="hero-precip-badge">
              <Droplets size={14} />
              <span>{current.precipitation} mm precip</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
