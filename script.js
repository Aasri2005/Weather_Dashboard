// ================= WEATHER ICONS =================
function getWeatherIcon(code, isDay = true) {
    const icons = {
        0:'☀',1:'⛅',2:'🌤',3:'☁',
        45:'🌫',48:'🌫',
        51:'🌦',53:'🌦',55:'🌦',
        61:'🌧',63:'🌧',65:'🌧',
        71:'❄',73:'❄',75:'❄',77:'❄',
        80:'🌧',81:'🌧',82:'🌧',
        85:'❄',86:'❄',
        95:'⛈',96:'⛈',99:'⛈'
    };
    return icons[code] || '🌤';
}

function getWeatherDescription(code) {
    const descriptions = {
        0:'Clear sky',1:'Mainly cloudy',2:'Partly cloudy',3:'Overcast',
        45:'Foggy',48:'Foggy',
        51:'Light drizzle',53:'Moderate drizzle',55:'Dense drizzle',
        61:'Slight rain',63:'Moderate rain',65:'Heavy rain',
        71:'Slight snow',73:'Moderate snow',75:'Heavy snow',
        77:'Snow grains',
        80:'Rain showers',81:'Heavy showers',82:'Violent showers',
        85:'Snow showers',86:'Heavy snow showers',
        95:'Thunderstorm',96:'Thunderstorm with hail',99:'Severe thunderstorm'
    };
    return descriptions[code] || 'Unknown weather';
}

// ================= MAIN WEATHER =================
async function getWeather() {
    const city = document.getElementById("cityInput").value;
    if (!city) return alert("Enter city name");

    const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    ).then(r => r.json());

    const { latitude, longitude, name, country } = geo.results[0];

    const weather = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}
        &hourly=temperature_2m,weathercode
        &daily=temperature_2m_max,temperature_2m_min,weathercode
        &current_weather=true
        &timezone=auto`
    ).then(r => r.json());

    showCurrent(weather, name, country);
    showHourly(weather);
    showDaily(weather);
}

// ================= CURRENT =================
function showCurrent(data, city, country) {
    const time = data.current_weather.time.replace("T", " ");
    document.getElementById("currentWeather").innerHTML = `
        <h2>${city}, ${country}</h2>
        <p>Time: ${time}</p>
        <div class="icon">${getWeatherIcon(data.current_weather.weathercode)}</div>
        <p>${data.current_weather.temperature} °C</p>
        <small>${getWeatherDescription(data.current_weather.weathercode)}</small>
    `;
}

// ================= HOURLY =================
function showHourly(data) {
    const container = document.getElementById("hourlyForecast");
    container.innerHTML = "";

    const now = new Date(data.current_weather.time).getHours();

    data.hourly.time.forEach((t, i) => {
        const hour = new Date(t).getHours();
        if (hour >= now) {
            container.innerHTML += `
                <div class="card">
                    <strong>${hour}:00</strong>
                    <div class="icon">${getWeatherIcon(data.hourly.weathercode[i])}</div>
                    <p>${data.hourly.temperature_2m[i]}°C</p>
                </div>
            `;
        }
    });
}

// ================= DAILY =================
function showDaily(data) {
    const container = document.getElementById("dailyForecast");
    container.innerHTML = "";

    data.daily.time.forEach((d, i) => {
        container.innerHTML += `
            <div class="card">
                <strong>${d}</strong>
                <div class="icon">${getWeatherIcon(data.daily.weathercode[i])}</div>
                <p>${data.daily.temperature_2m_max[i]}° /
                   ${data.daily.temperature_2m_min[i]}°</p>
            </div>
        `;
    });
}

// ================= SCROLL =================
function scrollHourly(dir) {
    document.getElementById("hourlyForecast")
        .scrollBy({ left: dir * 300, behavior: 'smooth' });
}
