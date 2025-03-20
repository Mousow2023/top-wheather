/* eslint-disable no-undef */
// import { container } from "webpack";
import "./styles.css";

// Get the weather data
async function getWeatherData(location) {
  try {
    const API_KEY = "HZJX3HCM8AL3HB33BK3GXMLSL";
    const response = await fetch(
      // `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`,
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`,
    );

    if (!response.ok) {
      // console.error("HTTP error", response.status);
      throw new Error("HTTP error", response.status);
    }

    const json = await response.json();
    // console.log(json);
    return json;
  } catch (error) {
    // console.error("Fetch error", error);
    throw new Error("Fetch error", error);
  }
}

// Process the content of the six next days
function processForecastDays(days) {
  const datesContainer = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 6; i++) {
    const day = days[i + 1];

    const options = { day: "2-digit", month: "short" };

    const date = new Date(day.datetime).toLocaleDateString("en-US", options);
    const { icon, temp } = day;

    datesContainer.push({ date, temperature: temp, icon });
  }
  return datesContainer;
}

// Process the weather data
function processWeatherData(data) {
  if (!data) {
    console.error("Invalid data resolved");
    return null;
  }

  const { currentConditions, days } = data || data.days[0];
  if (!currentConditions) {
    console.error("No weather data found");
    return null;
  }

  const { feelslike, humidity, conditions, precip, icon, temp, windspeed } =
    currentConditions;

  return {
    location: data.resolvedAddress,
    address: data.address,
    feelsLike: feelslike,
    humidity,
    conditions,
    precipitation: precip,
    icon,
    temperature: temp,
    windSpeed: windspeed,
    days,
  };
}

// Display the data on the page
function displayData(dataObj) {
  const weatherInfoContainer = document.querySelector(".weather-info");
  const countryContent = weatherInfoContainer.querySelector(".location-txt");
  const conditionsDescriptionContent =
    weatherInfoContainer.querySelector(".conditions-text");
  const temperatureContent = weatherInfoContainer.querySelector(".temp-text");
  const currentDateContent =
    weatherInfoContainer.querySelector(".current-date-txt");
  const humidityContent = weatherInfoContainer.querySelector(".humidity-value");
  const windSpeedContent =
    weatherInfoContainer.querySelector(".wind-speed-value");
  const feelsLikeContent =
    weatherInfoContainer.querySelector(".feels-like-value");
  const precipValueContent =
    weatherInfoContainer.querySelector(".precip-value");
  const weatherSummaryIcon = weatherInfoContainer.querySelector(
    ".weather-summary-img",
  );

  weatherSummaryIcon.src = `assets/vcsvgs/${dataObj.icon}.svg`;

  // Format todays data
  const todaysDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Display Forecast Date
  const forecastDays = processForecastDays(dataObj.days);
  const forecastContainer = document.querySelector(".forecast-items-container");
  const forecastItems = forecastContainer.querySelectorAll(".forecast-item");
  for (let i = 0; i < forecastDays.length; i += 1) {
    const element = forecastDays[i];

    forecastItems[i].querySelector("h5.forecast-item-date").textContent =
      element.date;
    forecastItems[i].querySelector("h5.forecast-item-temp").textContent =
      `${Math.round(element.temperature)} ℃`;
    forecastItems[i].querySelector(".forecast-item-icon").src =
      `assets/vcsvgs/${element.icon}.svg`;
  }

  // Convert the temperature from Fahrenheit to Celcius
  // const tempInCelcius = Math.round((5 / 9) * (dataObj.temperature - 32));

  countryContent.textContent = dataObj.address;
  currentDateContent.textContent = todaysDate;
  conditionsDescriptionContent.textContent = dataObj.conditions;
  temperatureContent.textContent = `${Math.round(dataObj.temperature)} ℃`;
  humidityContent.textContent = `${Math.round(dataObj.humidity)}%`;
  windSpeedContent.textContent = `${Math.round(dataObj.windSpeed)} Km/h`;
  feelsLikeContent.textContent = `${Math.round(dataObj.feelsLike)} ℃`;
  precipValueContent.textContent = `${Math.round(dataObj.precipitation)}%`;
}

// Handle search form submission
const weatherInfoContainerSection = document.querySelector(
  "section.weather-info",
);
const searchLocationMessageSection = document.querySelector(
  "section.search-location",
);
const locationNotFoundSection = document.querySelector("section.not-found");
const searchForm = document.querySelector("form");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const locationInput = searchForm.querySelector(".location-input");

  getWeatherData(locationInput.value)
    .then((data) => {
      // Process the data
      const processedData = processWeatherData(data);
      // Display the data on the page
      displayData(processedData);

      // Hide the search locataion section
      searchLocationMessageSection.style.display = "none";
      locationNotFoundSection.style.display = "none";

      // Show the weather data container section
      weatherInfoContainerSection.style.display = "";

      // Capture the buttons from the DOM
      const toCelsiusButton = document.querySelector(".to-celcius");
      const toFahrenheitButton = document.querySelector(".to-fahrenheit");

      // Activate Celsius on page load
      toFahrenheitButton.classList.remove("active");
      toCelsiusButton.classList.add("active");

      // Switch the temperature Celsuis
      toCelsiusButton.addEventListener("click", () => {
        if (!toCelsiusButton.classList.contains("active")) {
          toFahrenheitButton.classList.remove("active");
          toCelsiusButton.classList.add("active");
        }

        document.querySelector(".temp-text").textContent =
          `${Math.round(processedData.temperature)} ℃`;
      });

      // Switch the temperature Fahrenheit
      toFahrenheitButton.addEventListener("click", () => {
        if (!toFahrenheitButton.classList.contains("active")) {
          toCelsiusButton.classList.remove("active");
          toFahrenheitButton.classList.add("active");
        }

        // Convert the Celsius temprature to Fahrenheit
        const tempInFahrenheit = (processedData.temperature * 9) / 5 + 32;

        // Display the temperature in Fahrenheit
        document.querySelector(".temp-text").textContent =
          `${Math.round(tempInFahrenheit)} ℉`;
      });
    })
    .catch((error) => {
      console.error("Error", error);

      // Show the not found message section
      locationNotFoundSection.style.display = "";
      searchLocationMessageSection.style.display = "none";
      weatherInfoContainerSection.style.display = "none";
    });
});
