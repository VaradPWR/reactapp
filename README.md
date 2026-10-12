# ⛅ Aetheria Weather

A modern, responsive, and aesthetically crafted React weather web application built with **React 19**, **Vite**, and pure **Vanilla CSS**.

![Aetheria Weather Preview](https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Features

- 🌍 **Real-Time Meteorological Data**: Hyper-local weather forecasting powered by the free Open-Meteo API.
- 🎨 **Adaptive Atmospheric Themes**: Dynamic gradient backdrops and ambient particles (sunshine, rain streaks, snow flurries, or night stars) that shift based on current weather conditions and daylight cycle.
- 🌓 **Dark & Light Modes**: Seamless one-tap toggle between sleek dark mode and airy light mode with automatic system theme detection.
- 🔎 **Global City Search & Autocomplete**: Debounced live geocoding search for worldwide cities, states, and countries with population statistics.
- ⚡ **Popular City Quick Chips**: Fast one-click forecast switching for Tokyo, London, New York, Paris, Sydney, Dubai, Mumbai, and San Francisco.
- 📍 **GPS Location Support**: HTML5 geolocation with reverse-geocoding for local weather.
- 🌡️ **Interactive Temperature Units**: Smooth switching between Celsius (°C) and Fahrenheit (°F).
- 🕒 **24-Hour Hourly Forecast**: Horizontal scrolling timeline with hourly conditions and precipitation probability.
- 📅 **7-Day Outlook**: Weekly forecast with visual iOS-style gradient min/max temperature range bars.
- 📊 **Detailed Bento Grid Metrics**:
  - UV Index with risk level evaluation and safety tips
  - Wind speed & direction with rotating compass dial
  - Humidity percentage & comfort meter
  - Sun Schedule with sunrise/sunset times and daylight progress cycle
  - Barometric pressure (hPa)
  - Precipitation measurement (mm)

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vite.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (Custom Design System, Glassmorphism, CSS Custom Properties)
- **API**: [Open-Meteo](https://open-meteo.com/) (No API key required)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Production Build

To build the project for production deployment:
```bash
npm run build
```
The optimized static files will be generated in the `dist/` directory.

---

## 📄 License

MIT License. Free to use and modify for personal and educational projects.
