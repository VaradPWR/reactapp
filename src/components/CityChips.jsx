import React from 'react';
import { POPULAR_CITIES } from '../services/weatherService';

export default function CityChips({ currentCityName, onSelectCity }) {
  return (
    <div className="city-chips-bar" aria-label="Popular cities">
      <div className="city-chips-scroll">
        {POPULAR_CITIES.map((city) => {
          const isActive = currentCityName?.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              type="button"
              className={`city-chip ${isActive ? 'chip-active' : ''}`}
              onClick={() =>
                onSelectCity({
                  name: city.name,
                  country: city.country,
                  latitude: city.lat,
                  longitude: city.lon,
                  timezone: city.timezone
                })
              }
            >
              <span className="chip-name">{city.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
