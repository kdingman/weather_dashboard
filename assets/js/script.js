var locations = [];
var ApiKey = "eea7b744b9f61a893b33f6357289c128";

var locationFormEl = document.querySelector("#location");
var locationInputEl = document.querySelector("#location");
var locationSearchInputEl = document.querySelector("#location-searched");
var currentWeatherEl = document.querySelector("#current-weather-container");
var forecastEl = document.querySelector("#forecast");
var fiveDayEl = document.querySelector("#five-day-forecast");
var searchHistoryBtnEl = document.querySelector("#search-history");

// get value from input element
var formHandler = function(event) {
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
var getWeatherForecast = function(location) {
    // format the weather api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + ApiKey;

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayWeather(data, location);
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

// Display pulled information
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
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat" + lat + "&lon" + lon + "&exclude=minutely, hourly, dialy, alerts" + "&appid=" + ApiKey;
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

// Five Day Forecast Pull
var getFiveDay = function(location) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q" + location + "&appid=" + ApiKey;
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayFiveDay(data);
        })
    })
}

var displayFiveDay = function(weather) {
    fiveDayEl.textContent = "";
    forecastEl.textContent = "5-Day Forecast: "

    var forecast = weather.list;
        for (var i = 5; i < forecast.length; i = i+8) {
            var dailyForecast = forecast[i];

        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-light text-dark m-2";

        // date
        var forecastDay = document.createElement("h5");
        forecastDay.textContent = moment.unix(dailyForecast.dt).format('l');
        forecastDay.classList = "card-header text-center";
        forecastEl.appendChild(forecastDay);

        // 5-day forecast cards
        var tempForecastEl = document.createElement("span");
        tempForecastEl.textContent = dailyForecast.main.temp + " °F";
        tempForecastEl.classList = "card-body text-center";
        tempForecastEl.appendChild(tempForecastEl);

        var forecastHumidityEl = document.createElement("span");
        forecastHumidityEl.textContent = dailyForecast.main.humidity + " %"
        forecastHumidityEl.classList = " card-body text-center";
        forecastHumidityEl.appendChild(forecastHumidityEl);

        // images
        var weatherImg = document.createElement("img");
        weatherImg.classList = "card-body text-center";
        weatherImg.setAttribute("src", "http://openweathermap.org/img/wn${dailyForecast.weather[0].icon}10d@2x.png");
        forecastEl.appendChild(weatherImg);
        }

        fiveDayEl.appendChild(forecastEl);
}

    // History Logged
    var searchHistory = function(searchHistory) {

        searchHistoryEl = document.createElement("button");
        searchHistoryEl.textContent = searchHistory;
        searchHistoryEl.classList = "d-flex w-100 btn btn-ouline-dark border p-2";
        searchHistoryEl.setAttribute("data-location", searchHistory);
        searchHistoryEl.setAttribute("type", "submit");

        searchHistoryEl.prepend(searchHistoryEl);

    var searchHistoryHandler = function(event) {
        var location = event.target.getAttribute("data-location")
        if(location) {
            getWeatherForecast(location);
            getFiveDay(location);
        }
    }
    };

    // Event Listners
    locationFormEl.addEventListener("submit", formHandler);
    searchHistoryBtnEl.addEventListener("click", searchHistoryHandler);