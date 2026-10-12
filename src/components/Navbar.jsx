import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, CloudSun, RotateCw, X, Sun, Moon } from 'lucide-react';
import { searchCities } from '../services/weatherService';

export default function Navbar({
  unit,
  onToggleUnit,
  onSelectCity,
  onLocateUser,
  onRefresh,
  isLoading,
  themeMode,
  onToggleThemeMode
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const data = await searchCities(query);
      setResults(data);
      setIsSearching(false);
      setIsOpen(true);
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onSelectCity(item);
    setQuery('');
    setIsOpen(false);
    setResults([]);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="brand-group" id="brand-logo">
          <div className="brand-icon-wrapper">
            <CloudSun className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Aetheria</span>
            <span className="brand-badge">Forecast</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="search-container" ref={searchRef}>
          <div className="search-input-box">
            <Search className="search-icon" size={18} />
            <input
              id="search-city-input"
              type="text"
              placeholder="Search city, state or country..."
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                if (val.trim().length < 2) {
                  setResults([]);
                  setIsSearching(false);
                } else {
                  setIsOpen(true);
                }
              }}
              onFocus={() => {
                if (results.length > 0) setIsOpen(true);
              }}
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
            {isSearching && <span className="search-spinner" />}
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && results.length > 0 && (
            <div className="search-dropdown-menu">
              <div className="dropdown-header">Locations matching "{query}"</div>
              <ul className="dropdown-list">
                {results.map((item) => (
                  <li
                    key={item.id}
                    className="dropdown-item"
                    onClick={() => handleSelect(item)}
                  >
                    <div className="dropdown-item-main">
                      <MapPin size={16} className="dropdown-pin-icon" />
                      <span className="dropdown-city-name">{item.name}</span>
                      {item.admin1 && (
                        <span className="dropdown-admin">{item.admin1},</span>
                      )}
                      <span className="dropdown-country">{item.country}</span>
                    </div>
                    {item.population && (
                      <span className="dropdown-population">
                        pop. {(item.population / 1000).toFixed(0)}k
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isOpen && query.trim().length >= 2 && !isSearching && results.length === 0 && (
            <div className="search-dropdown-menu">
              <div className="dropdown-empty">No cities found matching "{query}"</div>
            </div>
          )}
        </div>

        {/* Actions Group */}
        <div className="navbar-actions">
          {/* GPS Current Location Button */}
          <button
            id="gps-location-btn"
            className="action-btn gps-btn"
            onClick={onLocateUser}
            title="Use current GPS location"
            aria-label="Use current location"
          >
            <Navigation size={17} />
            <span className="btn-label-desktop">My Location</span>
          </button>

          {/* Refresh Button */}
          <button
            id="refresh-weather-btn"
            className={`action-btn refresh-btn ${isLoading ? 'is-spinning' : ''}`}
            onClick={onRefresh}
            title="Refresh weather data"
            aria-label="Refresh forecast"
          >
            <RotateCw size={17} />
          </button>

          {/* Theme Mode Toggle (Dark / Light) */}
          <button
            id="theme-mode-toggle-btn"
            type="button"
            className="action-btn theme-toggle-btn"
            onClick={onToggleThemeMode}
            title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle theme mode"
          >
            {themeMode === 'light' ? (
              <Moon size={17} className="theme-toggle-icon moon-icon" />
            ) : (
              <Sun size={17} className="theme-toggle-icon sun-icon" />
            )}
          </button>

          {/* Unit Toggle (°C / °F) */}
          <div className="unit-toggle-wrapper">
            <button
              id="unit-celsius-btn"
              type="button"
              className={`unit-pill ${unit === 'C' ? 'active' : ''}`}
              onClick={() => unit !== 'C' && onToggleUnit('C')}
            >
              °C
            </button>
            <button
              id="unit-fahrenheit-btn"
              type="button"
              className={`unit-pill ${unit === 'F' ? 'active' : ''}`}
              onClick={() => unit !== 'F' && onToggleUnit('F')}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
