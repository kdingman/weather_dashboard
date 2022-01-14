var locations = [];

var locationFormEl = document.querySelector("#location");
var locationInputEl = document.querySelector("#location");
var locationSearchInputEl = document.querySelector("#location-searched");
var currentWeatherEl = document.querySelector("#current-weather-container");
var forcastEl = document.querySelector("#forecast");
var fiveDayEl = document.querySelector("#five-day-forecast");
var searchHistoryButtonEl = document.querySelector("#search-history-btn");

// get value from input element
var formSubmitHandler = function(event) {
    event.preventDefault();
    var location = locationInputEl.value.trim();
    if(location) {
        getLocationWeather(location);
        getFiveDay(location);
        currentWeatherEl.textContent = "";
        locationInputEl.value = "";
    }
    else {
        alert("Please enter a location");
    }
    saveSearch();
    searchHistory(location);
}

// create day to show when location is selected
var currentDay = document.createElement("span");
currentDay.textContent = " (" + moment(weather.dt.value).format('L') + ") ";
locationSearchInputEl.appendChild(currentDay);