/* eslint-disable no-undef */
// import { container } from "webpack";
import "./styles.css";

// const mainContainer = document.querySelector(".main-container");
// const notFoundSection = document.querySelector(".not-found");

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
    console.log(json);
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

  // Format todays data
  const todaysDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  console.log(processForecastDays(dataObj.days));

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

getWeatherData("Paris")
  .then((data) => {
    // Process the data
    const processedData = processWeatherData(data);
    // Display the data on the page
    displayData(processedData);
  })
  .catch((error) => {
    console.error("Error", error);
  });

// getWeatherData("london")
//   .then((data) => {
//     console.log("Weather data", data);
//   })
//   .catch((error) => {
//     console.error("Error", error);
//   });
