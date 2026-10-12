import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import CityChips from './components/CityChips';
import HeroWeather from './components/HeroWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import MetricCards from './components/MetricCards';
import WeatherBackground from './components/WeatherBackground';
import { fetchWeatherForecast, getCityByCoordinates, POPULAR_CITIES } from './services/weatherService';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './App.css';

const DEFAULT_CITY = POPULAR_CITIES[1]; // London

export default function App() {
  const [city, setCity] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_saved_city');
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  const [unit, setUnit] = useState(() => {
    try {
      return localStorage.getItem('aetheria_unit') || 'C';
    } catch {
      return 'C';
    }
  });

  const [themeMode, setThemeMode] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_theme_mode');
      if (saved) return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
      return 'dark';
    } catch {
      return 'dark';
    }
  });

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync theme mode with document element for global styles
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const handleToggleThemeMode = () => {
    const nextMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);
    localStorage.setItem('aetheria_theme_mode', nextMode);
  };

  // Load weather for selected city
  const loadWeatherData = useCallback(async (targetCity) => {
    if (!targetCity || targetCity.latitude === undefined || targetCity.longitude === undefined) {
      targetCity = {
        name: targetCity?.name || 'London',
        country: targetCity?.country || 'United Kingdom',
        latitude: targetCity?.lat ?? 51.5085,
        longitude: targetCity?.lon ?? -0.1257,
        timezone: targetCity?.timezone || 'Europe/London'
      };
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherForecast(
        targetCity.latitude,
        targetCity.longitude,
        targetCity.timezone || 'auto'
      );
      setWeather(data);
      // Persist last chosen city
      localStorage.setItem('aetheria_saved_city', JSON.stringify(targetCity));
    } catch (err) {
      console.error('Failed to load weather:', err);
      setError('Unable to load current weather data. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeatherData(city);
  }, [city, loadWeatherData]);

  // Handle unit switch
  const handleToggleUnit = (newUnit) => {
    setUnit(newUnit);
    localStorage.setItem('aetheria_unit', newUnit);
  };

  // Handle city selection
  const handleSelectCity = (newCity) => {
    setCity({
      name: newCity.name,
      country: newCity.country,
      latitude: newCity.latitude ?? newCity.lat,
      longitude: newCity.longitude ?? newCity.lon,
      timezone: newCity.timezone || 'auto'
    });
  };

  // Handle GPS location
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const locationInfo = await getCityByCoordinates(lat, lon);
          const userCity = {
            name: locationInfo.name || 'Your Location',
            country: locationInfo.country || '',
            latitude: lat,
            longitude: lon,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
          };
          setCity(userCity);
        } catch (e) {
          console.warn('Geolocation fallback:', e);
          setCity({
            name: 'Local Coordinates',
            country: '',
            latitude: lat,
            longitude: lon,
            timezone: 'auto'
          });
        }
      },
      (err) => {
        console.warn('GPS error:', err);
        setLoading(false);
        alert('Could not access your location. Permission might have been denied.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const currentTheme = weather?.current?.meta?.theme || 'clear';
  const isDay = weather?.current?.isDay ?? 1;

  return (
    <div className={`app-shell theme-mode-${currentTheme}`} data-theme={themeMode}>
      {/* Dynamic Background Atmosphere */}
      <WeatherBackground theme={currentTheme} isDay={isDay} themeMode={themeMode} />

      {/* Navigation & Header */}
      <Navbar
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onSelectCity={handleSelectCity}
        onLocateUser={handleLocateUser}
        onRefresh={() => loadWeatherData(city)}
        isLoading={loading}
        themeMode={themeMode}
        onToggleThemeMode={handleToggleThemeMode}
      />

      {/* Main App Content */}
      <main className="app-main-content">
        {/* Popular Cities Chips Bar */}
        <CityChips
          currentCityName={city.name}
          onSelectCity={handleSelectCity}
        />

        {/* Error Notification */}
        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={20} className="error-icon" />
            <span className="error-message">{error}</span>
            <button
              className="error-retry-btn"
              onClick={() => loadWeatherData(city)}
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton or Weather Dashboard */}
        {loading && !weather ? (
          <div className="loading-skeleton-container" aria-busy="true">
            <div className="skeleton-hero shimmer-block" />
            <div className="skeleton-grid">
              <div className="skeleton-card shimmer-block" />
              <div className="skeleton-card shimmer-block" />
              <div className="skeleton-card shimmer-block" />
              <div className="skeleton-card shimmer-block" />
            </div>
          </div>
        ) : weather ? (
          <div className="dashboard-grid">
            {/* Top Hero Section */}
            <HeroWeather weather={weather} city={city} unit={unit} />

            {/* 24-Hour Timeline */}
            <HourlyForecast
              hourly={weather.hourly}
              timezone={weather.rawTimezone}
              unit={unit}
            />

            {/* 2-Column Section: 7-Day Forecast & Bento Metrics */}
            <div className="detailed-forecast-section">
              <div className="section-column col-daily">
                <DailyForecast daily={weather.daily} unit={unit} />
              </div>

              <div className="section-column col-metrics">
                <MetricCards weather={weather} unit={unit} />
              </div>
            </div>
          </div>
        ) : null}
      </main>

      {/* Sleek Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-logo">Aetheria Weather</span>
            <span className="footer-tagline">Real-time Atmospheric Intelligence</span>
          </div>
          <div className="footer-right">
            <span>Powered by Open-Meteo High-Resolution Forecasting</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
