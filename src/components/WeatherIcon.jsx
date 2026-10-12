import React from 'react';
import {
  Sun,
  SunMedium,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Wind
} from 'lucide-react';

const ICON_MAP = {
  Sun,
  SunMedium,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Wind
};

export default function WeatherIcon({ name, size = 28, className = '', animate = false }) {
  const IconComponent = ICON_MAP[name] || CloudSun;

  return (
    <span className={`weather-icon-wrapper ${animate ? 'icon-animated' : ''} ${className}`}>
      <IconComponent size={size} />
    </span>
  );
}
