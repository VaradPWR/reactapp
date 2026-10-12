/**
 * Convert Celsius to Fahrenheit
 */
export function cToF(celsius) {
  if (celsius === null || celsius === undefined) return '--';
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Format temperature with unit
 */
export function formatTemp(tempC, unit = 'C') {
  if (tempC === null || tempC === undefined) return '--°';
  const val = unit === 'F' ? cToF(tempC) : Math.round(tempC);
  return `${val}°`;
}

/**
 * Format wind speed
 */
export function formatWindSpeed(kmh, unit = 'C') {
  if (kmh === null || kmh === undefined) return '--';
  if (unit === 'F') {
    // mph
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

/**
 * Convert degrees to cardinal compass direction
 */
export function getWindDirectionLabel(deg) {
  if (deg === null || deg === undefined) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Format time from ISO string: "14:00" -> "2 PM" or "14:00"
 */
export function formatHourlyTime(isoStr, timezone) {
  try {
    const date = new Date(isoStr);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: true,
      timeZone: timezone || undefined
    }).format(date);
  } catch {
    const parts = isoStr.split('T');
    return parts[1] ? parts[1].substring(0, 5) : isoStr;
  }
}

/**
 * Format full date for Hero: "Monday, October 12"
 */
export function formatHeroDate(isoStr) {
  try {
    const date = isoStr ? new Date(isoStr) : new Date();
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch {
    return 'Today';
  }
}

/**
 * Format daily forecast day: "Mon", "Tue", etc.
 */
export function formatDayName(isoDateStr, index) {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  try {
    // Treat as local date without timezone shift
    const parts = isoDateStr.split('-');
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  } catch {
    return `Day ${index + 1}`;
  }
}

/**
 * Format time from ISO string: "06:45"
 */
export function formatSunTime(isoStr) {
  if (!isoStr) return '--:--';
  try {
    const date = new Date(isoStr);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  } catch {
    const parts = isoStr.split('T');
    return parts[1] ? parts[1].substring(0, 5) : isoStr;
  }
}

/**
 * UV index evaluation
 */
export function getUVDescription(uv) {
  if (uv === null || uv === undefined) return { label: 'Low', desc: 'No protection required', color: '#10b981' };
  if (uv <= 2) return { label: 'Low', desc: 'Minimal sun risk', color: '#10b981' };
  if (uv <= 5) return { label: 'Moderate', desc: 'Wear sunscreen outdoors', color: '#f59e0b' };
  if (uv <= 7) return { label: 'High', desc: 'Protection essential', color: '#f97316' };
  if (uv <= 10) return { label: 'Very High', desc: 'Extra precautions needed', color: '#ef4444' };
  return { label: 'Extreme', desc: 'Avoid direct midday sun', color: '#a855f7' };
}

/**
 * Humidity comfort interpretation
 */
export function getHumidityDescription(humidity) {
  if (humidity < 30) return { label: 'Dry', desc: 'Air is quite dry' };
  if (humidity <= 60) return { label: 'Comfortable', desc: 'Ideal ambient level' };
  if (humidity <= 75) return { label: 'Humid', desc: 'Noticeably muggy' };
  return { label: 'Very Humid', desc: 'High moisture density' };
}

/**
 * Calculate daylight progress percentage (0 - 100%)
 */
export function getDaylightProgress(sunriseStr, sunsetStr, currentTimeStr) {
  if (!sunriseStr || !sunsetStr) return 50;
  try {
    const sunrise = new Date(sunriseStr).getTime();
    const sunset = new Date(sunsetStr).getTime();
    const now = currentTimeStr ? new Date(currentTimeStr).getTime() : Date.now();

    if (now <= sunrise) return 0;
    if (now >= sunset) return 100;
    const progress = ((now - sunrise) / (sunset - sunrise)) * 100;
    return Math.min(Math.max(Math.round(progress), 0), 100);
  } catch {
    return 50;
  }
}
