const WeatherModule = {
 
  // NOTE: Replace 'YOUR_API_KEY_HERE' with your free key from:
  // https://openweathermap.org/api
  API_KEY: 'b9edc8e44e6b9a8a016744d00bb1dabc',
 
  // --- fetchWeather: main method called from detailsModule ---
  // async/await used to handle the asynchronous fetch call
  async fetchWeather(city, country) {
    const container = document.getElementById('weather-box');
    if (!container) return;
 
    // DOM manipulation: show loading state while fetching
    container.innerHTML = '<div class="weather-loading">Loading weather...</div>';
 
    // If no API key is set, show a placeholder instead of calling the API
    if (this.API_KEY === 'YOUR_API_KEY_HERE') {
      container.innerHTML = this.renderPlaceholder();
      return;
    }
 
    try {
      // Fetch API: make a cross-origin request to OpenWeatherMap
      // encodeURIComponent ensures city/country names with spaces work correctly
      // units=metric returns Celsius temperatures
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&appid=${this.API_KEY}&units=metric`;
 
      const response = await fetch(url); // await pauses until response arrives
 
      // Error handling: throw if the API returned an error status
      if (!response.ok) throw new Error('City not found or API error');
 
      const data = await response.json(); // parse the JSON response body
 
      // DOM manipulation: replace loading state with real weather data
      container.innerHTML = this.renderWeather(data);
 
    } catch (err) {
      // try/catch: handle network errors or bad API responses gracefully
      console.error('Weather fetch failed:', err);
      container.innerHTML = this.renderError();
    }
  },
 
  // --- renderWeather: builds the weather display HTML ---
  // Template literal creates dynamic HTML from API response data
  renderWeather(data) {
    const temp = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const desc = data.weather[0].description;
    const icon = this.getWeatherEmoji(data.weather[0].main); // 'this' refers to WeatherModule
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
 
  // --- renderPlaceholder: shown when no API key is set ---
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
 
  // --- renderError: shown when the API call fails ---
  renderError() {
    return `<div class="weather-error">⚠️ Weather data unavailable for this location.</div>`;
  },
 
  // --- getWeatherEmoji: maps weather condition to emoji ---
  // Object used as a lookup map — a practical use of object literals
  getWeatherEmoji(condition) {
    const map = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️',
      'Wind': '💨'
    };
    // Return matched emoji or default if condition not in map
    return map[condition] || '🌤️';
  }
 
};