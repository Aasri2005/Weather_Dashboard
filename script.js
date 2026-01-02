async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  // 🌍 Get city coordinates
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

  const geoRes = await fetch(geoUrl);
  const geoData = await geoRes.json();

  if (!geoData.results) {
    alert("City not found");
    return;
  }

  const { latitude, longitude, name, country } = geoData.results[0];

  document.getElementById("cityName").innerText =
    `${name}, ${country}`;

  showExactTimeOnce();
  fetchWeatherData(latitude, longitude);
}

// 🕒 Show exact time ONCE (no ticking)
function showExactTimeOnce() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  document.getElementById("time").innerText =
    `Time: ${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

// 🌦 Fetch weather data
async function fetchWeatherData(lat, lon) {

  // ⚠️ URL MUST BE IN ONE LINE
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

  const res = await fetch(weatherUrl);
  const data = await res.json();

  const currentHour = new Date().getHours();

  // 🌡 Current temperature
  document.getElementById("temp").innerText =
    `Temperature: ${data.hourly.temperature_2m[currentHour]} °C`;

  // ⏱ Hourly Forecast (next 6 hours)
  const hourlyDiv = document.getElementById("hourlyForecast");
  hourlyDiv.innerHTML = "";

  for (let i = currentHour; i < 24; i++) {
    hourlyDiv.innerHTML += `
      <div class="forecast-card">
        <p>${data.hourly.time[i].slice(11, 16)}</p>
        <p>${getWeatherIcon(data.hourly.weathercode[i])}</p>
        <p>${data.hourly.temperature_2m[i]}°C</p>
      </div>
    `;
  }

  // 📅 7-Day Forecast
  const dailyDiv = document.getElementById("dailyForecast");
  dailyDiv.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    dailyDiv.innerHTML += `
      <div class="forecast-card">
        <p>${data.daily.time[i]}</p>
        <p>${getWeatherIcon(data.daily.weathercode[i])}</p>
        <p>${data.daily.temperature_2m_max[i]}° /
           ${data.daily.temperature_2m_min[i]}°</p>
      </div>
    `;
  }
}

// 🌈 Weather Icons
function getWeatherIcon(code) {
  const icons = {
    0:'☀️',1:'🌤️',2:'⛅',3:'☁️',
    45:'🌫️',48:'🌫️',
    51:'🌦️',53:'🌦️',55:'🌧️',
    61:'🌧️',63:'🌧️',65:'🌧️',
    71:'❄️',73:'❄️',75:'❄️',
    80:'🌦️',81:'🌦️',82:'🌧️',
    95:'⛈️',96:'⛈️',99:'⛈️'
  };
  return icons[code] || '🌤️';
}
