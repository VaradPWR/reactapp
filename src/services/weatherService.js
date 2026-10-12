// Weather interpretation and API service using Open-Meteo

export const WMO_CODES = {
  0: { label: 'Clear Sky', icon: 'Sun', nightIcon: 'Moon', theme: 'clear', desc: 'Clear and bright skies' },
  1: { label: 'Mainly Clear', icon: 'SunMedium', nightIcon: 'Moon', theme: 'clear', desc: 'Mostly clear with light breeze' },
  2: { label: 'Partly Cloudy', icon: 'CloudSun', nightIcon: 'CloudMoon', theme: 'cloudy', desc: 'Scattered clouds throughout the day' },
  3: { label: 'Overcast', icon: 'Cloud', nightIcon: 'Cloud', theme: 'overcast', desc: 'Thick cloud cover blanket' },
  45: { label: 'Foggy', icon: 'CloudFog', nightIcon: 'CloudFog', theme: 'fog', desc: 'Reduced visibility due to fog' },
  48: { label: 'Depositing Rime Fog', icon: 'CloudFog', nightIcon: 'CloudFog', theme: 'fog', desc: 'Freezing rime fog conditions' },
  51: { label: 'Light Drizzle', icon: 'CloudDrizzle', nightIcon: 'CloudDrizzle', theme: 'rain', desc: 'Light intermittent drizzle' },
  53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', nightIcon: 'CloudDrizzle', theme: 'rain', desc: 'Steady fine mist and drizzle' },
  55: { label: 'Dense Drizzle', icon: 'CloudDrizzle', nightIcon: 'CloudDrizzle', theme: 'rain', desc: 'Heavy persistent drizzle' },
  56: { label: 'Light Freezing Drizzle', icon: 'CloudSnow', nightIcon: 'CloudSnow', theme: 'snow', desc: 'Freezing drizzle hazard' },
  57: { label: 'Dense Freezing Drizzle', icon: 'CloudSnow', nightIcon: 'CloudSnow', theme: 'snow', desc: 'Heavy icy drizzle accumulation' },
  61: { label: 'Slight Rain', icon: 'CloudRain', nightIcon: 'CloudRain', theme: 'rain', desc: 'Gentle raindrops falling' },
  63: { label: 'Moderate Rain', icon: 'CloudRain', nightIcon: 'CloudRain', theme: 'rain', desc: 'Steady moderate rainfall' },
  65: { label: 'Heavy Rain', icon: 'CloudRain', nightIcon: 'CloudRain', theme: 'rain', desc: 'Heavy downpour expected' },
  66: { label: 'Freezing Rain', icon: 'CloudSnow', nightIcon: 'CloudSnow', theme: 'snow', desc: 'Sub-zero rain icing surfaces' },
  67: { label: 'Heavy Freezing Rain', icon: 'CloudSnow', nightIcon: 'CloudSnow', theme: 'snow', desc: 'Hazardous freezing rain' },
  71: { label: 'Slight Snow Fall', icon: 'Snowflake', nightIcon: 'Snowflake', theme: 'snow', desc: 'Light fluttering snow' },
  73: { label: 'Moderate Snow', icon: 'Snowflake', nightIcon: 'Snowflake', theme: 'snow', desc: 'Steady snowfall accumulative' },
  75: { label: 'Heavy Snow', icon: 'Snowflake', nightIcon: 'Snowflake', theme: 'snow', desc: 'Intense snow accumulation' },
  77: { label: 'Snow Grains', icon: 'Snowflake', nightIcon: 'Snowflake', theme: 'snow', desc: 'Fine frozen snow pellets' },
  80: { label: 'Slight Rain Showers', icon: 'CloudRain', nightIcon: 'CloudRain', theme: 'rain', desc: 'Brief passing rain showers' },
  81: { label: 'Moderate Rain Showers', icon: 'CloudRain', nightIcon: 'CloudRain', theme: 'rain', desc: 'Passing moderate rain downpours' },
  82: { label: 'Violent Rain Showers', icon: 'CloudRain', nightIcon: 'CloudRain', theme: 'thunderstorm', desc: 'Sudden intense torrential showers' },
  85: { label: 'Light Snow Showers', icon: 'CloudSnow', nightIcon: 'CloudSnow', theme: 'snow', desc: 'Intermittent snow flurries' },
  86: { label: 'Heavy Snow Showers', icon: 'CloudSnow', nightIcon: 'CloudSnow', theme: 'snow', desc: 'Passing heavy blizzard flurries' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning', nightIcon: 'CloudLightning', theme: 'thunderstorm', desc: 'Thunderstorms with active lightning' },
  96: { label: 'Thunderstorm with Slight Hail', icon: 'CloudLightning', nightIcon: 'CloudLightning', theme: 'thunderstorm', desc: 'Severe storm with small hail' },
  99: { label: 'Severe Thunderstorm & Hail', icon: 'CloudLightning', nightIcon: 'CloudLightning', theme: 'thunderstorm', desc: 'Extreme storm with heavy hail' }
};

export function getWeatherMeta(code, isDay = 1) {
  const info = WMO_CODES[code] || {
    label: 'Partly Cloudy',
    icon: 'CloudSun',
    nightIcon: 'CloudMoon',
    theme: 'cloudy',
    desc: 'Moderate weather conditions'
  };

  const iconName = isDay ? info.icon : info.nightIcon;
  let themeName = info.theme;
  if (!isDay && (themeName === 'clear' || themeName === 'cloudy')) {
    themeName = 'night';
  }

  return {
    ...info,
    iconName,
    theme: themeName
  };
}

/**
 * Search for cities using Open-Meteo Geocoding API
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];
  const cleanQuery = encodeURIComponent(query.trim());
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cleanQuery}&count=7&language=en&format=json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding request failed');
    const data = await res.json();
    if (!data.results || !data.results.length) return [];

    return data.results.map((item) => ({
      id: item.id,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
      population: item.population
    }));
  } catch (err) {
    console.error('Error fetching cities:', err);
    return [];
  }
}

/**
 * Reverse geocoding lookup using Open-Meteo or BigDataCloud
 */
export async function getCityByCoordinates(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'User-Agent': 'AetheriaWeatherApp/1.0' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.suburb || addr.county || 'My Location';
      const country = addr.country || '';
      return {
        name: cityName,
        country: country,
        latitude: lat,
        longitude: lon,
        admin1: addr.state || ''
      };
    }
  } catch (err) {
    console.warn('Reverse geocode fallback:', err);
  }

  return {
    name: 'Current Location',
    country: '',
    latitude: lat,
    longitude: lon,
    admin1: ''
  };
}

/**
 * Fetch comprehensive weather forecast from Open-Meteo
 */
export async function fetchWeatherForecast(lat, lon, timezone = 'auto') {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'weather_code',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m'
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'wind_speed_10m',
    'uv_index',
    'is_day'
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_probability_max',
    'precipitation_sum',
    'wind_speed_10m_max'
  ].join(',');

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=${encodeURIComponent(timezone)}&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather data fetch failed (${res.status})`);
  }

  const data = await res.json();
  return processWeatherData(data);
}

function processWeatherData(data) {
  const current = data.current || {};
  const daily = data.daily || {};
  const hourly = data.hourly || {};

  // Current weather processed
  const currentMeta = getWeatherMeta(current.weather_code, current.is_day);

  // Hourly forecast (next 24 hours starting from current hour)
  const currentTimeStr = current.time || '';
  const hourlyList = [];
  if (hourly.time && hourly.time.length) {
    let startIndex = hourly.time.findIndex((t) => t >= currentTimeStr);
    if (startIndex === -1) startIndex = 0;
    
    // Take 24 hourly intervals
    for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time.length); i++) {
      const code = hourly.weather_code ? hourly.weather_code[i] : 0;
      const isDay = hourly.is_day ? hourly.is_day[i] : 1;
      const meta = getWeatherMeta(code, isDay);
      
      hourlyList.push({
        time: hourly.time[i],
        temp: Math.round(hourly.temperature_2m[i]),
        feelsLike: Math.round(hourly.apparent_temperature ? hourly.apparent_temperature[i] : hourly.temperature_2m[i]),
        precipProb: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
        precipAmount: hourly.precipitation ? hourly.precipitation[i] : 0,
        humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[i] : 0,
        windSpeed: hourly.wind_speed_10m ? Math.round(hourly.wind_speed_10m[i]) : 0,
        weatherCode: code,
        isDay,
        iconName: meta.iconName,
        label: meta.label
      });
    }
  }

  // Daily forecast (7 days)
  const dailyList = [];
  if (daily.time && daily.time.length) {
    for (let i = 0; i < daily.time.length; i++) {
      const code = daily.weather_code[i];
      const meta = getWeatherMeta(code, 1);
      dailyList.push({
        date: daily.time[i],
        maxTemp: Math.round(daily.temperature_2m_max[i]),
        minTemp: Math.round(daily.temperature_2m_min[i]),
        sunrise: daily.sunrise ? daily.sunrise[i] : null,
        sunset: daily.sunset ? daily.sunset[i] : null,
        uvIndexMax: daily.uv_index_max ? Math.round(daily.uv_index_max[i] * 10) / 10 : 0,
        rainProb: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
        precipSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
        windMax: daily.wind_speed_10m_max ? Math.round(daily.wind_speed_10m_max[i]) : 0,
        weatherCode: code,
        iconName: meta.iconName,
        label: meta.label
      });
    }
  }

  const todayDaily = dailyList[0] || {};

  return {
    current: {
      time: current.time,
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      precipitation: current.precipitation,
      surfacePressure: Math.round(current.surface_pressure),
      windSpeed: Math.round(current.wind_speed_10m),
      windDirection: current.wind_direction_10m,
      isDay: current.is_day,
      weatherCode: current.weather_code,
      meta: currentMeta,
      todayMin: todayDaily.minTemp ?? Math.round(current.temperature_2m - 4),
      todayMax: todayDaily.maxTemp ?? Math.round(current.temperature_2m + 4),
      sunrise: todayDaily.sunrise,
      sunset: todayDaily.sunset,
      uvIndex: todayDaily.uvIndexMax ?? 3.5
    },
    hourly: hourlyList,
    daily: dailyList,
    rawTimezone: data.timezone,
    elevation: data.elevation
  };
}

export const POPULAR_CITIES = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6895, lon: 139.6917, timezone: 'Asia/Tokyo' },
  { name: 'London', country: 'United Kingdom', lat: 51.5085, lon: -0.1257, timezone: 'Europe/London' },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060, timezone: 'America/New_York' },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194, timezone: 'America/Los_Angeles' }
];
