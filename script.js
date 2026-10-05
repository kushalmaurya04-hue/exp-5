// 1. Get elements from the page
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const result = document.getElementById("result");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

// 2. Convert the weather code from the API into readable text
function getCondition(code) {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
}

// 3. Main function: get weather for the city the user typed
async function getWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    showMessage("Please enter a city name.", true);
    return;
  }

  showMessage("Loading...", false);
  result.classList.add("hidden");

  try {
    // Step A: convert city name into latitude and longitude (geocoding API)
    const geoUrl =
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(city) +
      "&count=1";
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results) {
      showMessage("City not found. Try another name.", true);
      return;
    }

    const place = geoData.results[0];

    // Step B: get the current weather for that location (weather API)
    const weatherUrl =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      place.latitude +
      "&longitude=" +
      place.longitude +
      "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code";
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    const current = weatherData.current;

    // Step C: show the data on the page
    cityName.textContent = place.name + ", " + place.country;
    temperature.textContent = current.temperature_2m + " °C";
    condition.textContent = getCondition(current.weather_code);
    humidity.textContent = current.relative_humidity_2m + "%";
    wind.textContent = current.wind_speed_10m + " km/h";

    showMessage("", false);
    result.classList.remove("hidden");
  } catch (error) {
    // Runs if the internet is off or the API fails
    showMessage("Could not fetch weather. Check your internet connection.", true);
  }
}

// 4. Helper to show messages
function showMessage(text, isError) {
  message.textContent = text;
  message.className = isError ? "error" : "";
}

// 5. Events: click Search, or press Enter
searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});
