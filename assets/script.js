//User City Search Section Variables
var searchButton = document.getElementById("search"); //refers to search button
var userInput = document.querySelector("#cityName"); //refers to user input in the form

//Search History Button Area
var historySearch = document.getElementById("history-search");

//Current Weather Card
var currentCity = document.querySelector("#card-city");
var currentDate = document.querySelector("#card-date");
var currentTemp = document.querySelector("#temp");
var currentWind = document.querySelector("#wind");
var currentHumidity = document.querySelector("#humidity");

// 5 Day Forecast Area
var forecastCard = document.querySelectorAll(".forecast-card");
var forecastDate = document.querySelectorAll(".forecast-date");
var forecastTemp = document.querySelectorAll(".forecast-temp");
var forecastWind = document.querySelectorAll(".forecast-wind");
var forecastHumidity = document.querySelectorAll(".forecast-humidity");

var cityCurrent = document.getElementById("chosen-city"); //refers to card with current weather data
var forecastData = document.getElementById("five-day"); //refers to card with five day forecast

var apiUrl = "https://api.openweathermap.org";
var apiKey = "&appid=657bfeb8db7dbd62e8b8662389b81dd7";
var oneCall = "/data/3.0/onecall?";

//Moment (already linked in html)
var today = moment().format("M/DD/YYYY");

// Local Storage
var searchHistory = []; //this is where all the previous cities will be stored and eventually parsed at very bottom of page

getWeather = (cityName) => {
  //note that cityName is a parameter and could have any name

  var coordsUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityName +
    "&appid=657bfeb8db7dbd62e8b8662389b81dd7";
  // Return coordinnates in order to use the second API
  fetch(coordsUrl)
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (data) {
      fetchWeather(data);
      console.log(data);
      // console.log(data[0].lat);
      // console.log(data[0].lon);
    })
    .catch(function (error) {
      alert("Incorrect entry. Please type the name of a city.");
    });
};

fetchWeather = (weatherData) => {
  var latParam = weatherData[0].lat;
  var lonParam = weatherData[0].lon;
  var weatherUrl =
    "https://api.openweathermap.org/data/3.0/onecall?lat=" +
    latParam +
    "&lon=" +
    lonParam +
    "&units=imperial" +
    "&appid=657bfeb8db7dbd62e8b8662389b81dd7";
  //Coordinates for Lat & Lon that yield 5 day forecast
  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      appendToSearchHistory(weatherData);
      renderCurrentWeather(weatherData, data); //weatherData will become coordinatesData just as data become openWeatherdata
      renderForecast(data);
    });
};

renderCurrentWeather = (coordinatesData, openWeatherData) => {
  // Current Weather Card
  currentCity.textContent = coordinatesData[0].name;
  currentTemp.textContent = openWeatherData.current.temp + " ℉";
  currentWind.textContent = openWeatherData.current.wind_speed + " mph";
  currentHumidity.textContent = openWeatherData.current.humidity + " %";
};

renderForecast = (openWeatherData) => {
  for (let i = 0; i < forecastCard.length; i++) {
    // Forecast Content
    // console.log(forecastDate[i].textContent);
    console.log(openWeatherData.daily[i]);
    forecastDate[i].textContent = moment()
      .add(i + 1, "days")
      .format("M/DD/YYYY");
    forecastTemp[i].textContent = openWeatherData.daily[i].temp.day + " ℉";
    forecastWind[i].textContent = openWeatherData.daily[i].wind_speed + " mph";
    forecastHumidity[i].textContent = openWeatherData.daily[i].humidity + " %";
  }
};

appendToSearchHistory = (weatherData) => {
  var city = weatherData[0].name;

  searchHistory.push(city);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  renderSearchHistory();
};

renderSearchHistory = () => {
  historySearch.textContent = "";

  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  citySearch = searchHistory[0];

  // creates a button for each user entry
  for (let i = 0; i < searchHistory.length; i++) {
    var button = document.createElement("button");
    button.textContent = searchHistory[i];

    button.classList.add("btn");
    button.classList.add("btn-secondary");
    button.classList.add("btn-block");
    button.classList.add("mb-2");
    button.classList.add("searched-cities-btn");
    button.addEventListener("click", function (event) {
      getWeather();
    });
    historySearch.appendChild(button);
  }
};

//search button click event
searchButton.addEventListener("click", function (event) {
  event.preventDefault();

  getWeather(userInput.value); //this input value will run through the getWeather function and be stored as cityName

  console.log(userInput.value);
});
console.log(JSON.parse(localStorage.getItem("searchHistory"))); //if there are cities in local storage from user inputs, they will be parsed out here 
if (JSON.parse(localStorage.getItem("searchHistory"))) {
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  renderSearchHistory();
}
