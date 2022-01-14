var locations = [];
var ApiKey = "eea7b744b9f61a893b33f6357289c128";

var locationFormEl = document.querySelector("#location");
var locationInputEl = document.querySelector("#location");
var locationSearchInputEl = document.querySelector("#location-searched");
var currentWeatherEl = document.querySelector("#current-weather-container");
var forecastEl = document.querySelector("#forecast");
var fiveDayEl = document.querySelector("#five-day-forecast");
var searchHistoryButtonEl = document.querySelector("#search-history-btn");

// get value from input element
var formSubmitHandler = function(event) {
    event.preventDefault();
    var location = locationInputEl.value.trim();
    if(location) {
        getWeatherForecast(location);
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



// pull information from openweathermap.org
var getWeatherForecast = function(city) {
    // format the weather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + ApiKey;

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayWeather(data, city);
            });   
        }
        else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to get weather information");
    });
}

var displayWeather = function(weather, locationSearch) {
    currentWeatherEl.textContent = "";
    locationSearchInputEl.textContent = locationSearch;
     console.log(weather);

    // create day to show when location is selected
    var currentDay = document.createElement("span");
    currentDay = "(" + moment(weather.date.value).format('L') + ") ";
    locationSearchInputEl.appendChild(currentDay);

    // temperature pull
    var currentTempEl = document.createElement("span");
    currentTempEl.textContent = "Temperature: " + weather.main.temp + " °F";
    currentTempEl.classList = "list-group";
    currentTempEl.appendChild(currentTempEl);

    // humidity pull
    var currentHumidityEl = document.createElement("span");
    currentHumidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    currentHumidityEl.classList = "list-group";
    currentHumidityEl.appendChild(currentHumidityEl);

    // wind speed pull
    var currentWindSpeedEl = document.createElement("span");
    currentWindSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    currentWindSpeedEl.classList = "list-group";
    currentWindSpeedEl.appendChild(currentWindSpeedEl);

    // Lat & Lon Variables Defined for UV Index
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat, lon);
}

// Pull UV Index, favorable, moderate, severe
var getUvIndex = function(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/uvi?lat" + lat + "&lon" + lon + "&appid=" + ApiKey;
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayUvIndex(data);
        })
    })
}
var displayUvIndex = function(index) {
    var indexEl = document.createElement("div");
    indexEl.textContent = "UV Index";
    indexEl.classList = "list-group";

    indexValue = document.createElement("span");
    indexValue = textContent = index.value;

    if(index.value <= 2) {
        indexEl.classList = "favorable"
    }
    else if(index.value > 2 && index.value <= 8) {
        indexEl.classList = "moderate"
    }
    else if(index.value > 8 ) {
        indexEl.classList = "severe"
    };

    indexEl.appendChild(indexValue);
    currentWeatherEl.appendChild(indexEl);
}