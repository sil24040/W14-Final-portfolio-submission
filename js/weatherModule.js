// weatherModule.js — fetches current weather from OpenWeatherMap API

const WeatherModule = {

    // NOTE: Replace this with your own free API key from https://openweathermap.org/api
    API_KEY: 'YOUR_API_KEY_HERE',
  
    async fetchWeather(city, country) {
      const container = document.getElementById('weather-box');
      if (!container) return;
  
      container.innerHTML = '<div class="weather-loading">Loading weather...</div>';
  
      if (this.API_KEY === 'YOUR_API_KEY_HERE') {
        container.innerHTML = this.renderPlaceholder();
        return;
      }
  
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&appid=${this.API_KEY}&units=metric`;
        const response = await fetch(url);
  
        if (!response.ok) throw new Error('City not found');
  
        const data = await response.json();
        container.innerHTML = this.renderWeather(data);
      } catch (err) {
        console.error('Weather fetch failed:', err);
        container.innerHTML = this.renderError();
      }
    },
  
    renderWeather(data) {
      const temp = Math.round(data.main.temp);
      const feels = Math.round(data.main.feels_like);
      const desc = data.weather[0].description;
      const icon = this.getWeatherEmoji(data.weather[0].main);
      const humidity = data.main.humidity;
      const wind = Math.round(data.wind.speed);
  
      return `
        <div class="weather-content">
          <div class="weather-main">
            <span class="weather-emoji">${icon}</span>
            <div>
              <div class="weather-temp">${temp}°C</div>
              <div class="weather-desc">${desc.charAt(0).toUpperCase() + desc.slice(1)}</div>
            </div>
          </div>
          <div class="weather-details">
            <span>Feels like ${feels}°C</span>
            <span>Humidity ${humidity}%</span>
            <span>Wind ${wind} m/s</span>
          </div>
        </div>
      `;
    },
  
    renderPlaceholder() {
      return `
        <div class="weather-placeholder">
          <span class="weather-emoji">🌤️</span>
          <div>
            <div class="weather-temp">--°C</div>
            <div class="weather-desc">Add your API key in weatherModule.js to see live weather</div>
          </div>
        </div>
      `;
    },
  
    renderError() {
      return `<div class="weather-error">⚠️ Weather data unavailable for this location.</div>`;
    },
  
    getWeatherEmoji(condition) {
      const map = {
        'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️',
        'Drizzle': '🌦️', 'Thunderstorm': '⛈️', 'Snow': '❄️',
        'Mist': '🌫️', 'Fog': '🌫️', 'Haze': '🌫️', 'Wind': '💨'
      };
      return map[condition] || '🌤️';
    }
  };