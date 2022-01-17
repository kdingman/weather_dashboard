var locations = [];
//var ApiKey = 'ae61d20ead0ce1595ad5f9392065ddf1';

var locationFormEl = document.querySelector("#location-form");
var locationInputEl = document.querySelector("#location");
var locationSearchInputEl = document.querySelector("#location-searched");
var currentWeatherEl = document.querySelector("#current-weather-container");
var forecastName = document.querySelector("#forecast");
var fiveDayEl = document.querySelector("#five-day-forecast");
var searchHistoryBtnEl = document.querySelector("#search-history-btn");

// get value from input element
var formSubmitHandler = function(event) {
    event.preventDefault();
    var locationName = locationInputEl.value.trim();
    if(locationName) {
        getWeatherForecast(locationName);
        getFiveDay(locationName);
        locations.unshift({locationName});
        locationInputEl.value = "";
    }
    else {
        alert("Please enter a location");
    }
    saveSearch();
    searchHistory(locationName);
}

// Local Storage Save
var saveSearch = function() {
    localStorage.setItem("locations", JSON.stringify(locations));
};

// pull information from openweathermap.org
var getWeatherForecast = function(location) {
    // format the weather api url
    //var ApiKey = 'ae61d20ead0ce1595ad5f9392065ddf1';
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=ae61d20ead0ce1595ad5f9392065ddf1";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(location) {
                displayWeather(location);
            });   
        }
        else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function() {
        alert("Unable to get weather information");
    });
}

// Display pulled information
var displayWeather = function(weather, locationSearch) {
    currentWeatherEl.textContent = "";
    locationSearchInputEl.textContent = locationSearch;
     

    // create day to show when location is selected
    var currentDay = document.createElement("span");
    currentDay.textContent = " (" + moment(weather.date).format('L') + ") ";
    locationSearchInputEl.appendChild(currentDay);

    // temperature pull
    var currentTempEl = document.createElement("span");
    currentTempEl.textContent = "Temperature: " + weather.current + " °F";
    currentTempEl.classList = "list-group";
    

    // humidity pull
    var currentHumidityEl = document.createElement("span");
    currentHumidityEl.textContent = "Humidity: " + weather.current + " %";
    currentHumidityEl.classList = "list-group";
    

    // wind speed pull
    var currentWindSpeedEl = document.createElement("span");
    currentWindSpeedEl.textContent = "Wind Speed: " + weather.current + " MPH";
    currentWindSpeedEl.classList = "list-group";
    

    currentWeatherEl.appendChild(currentTempEl);
    currentWeatherEl.appendChild(currentHumidityEl);
    currentWeatherEl.appendChild(currentWindSpeedEl);

    // Lat & Lon Variables Defined for UV Index
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat, lon);
}

// Pull UV Index, favorable, moderate, severe
var getUvIndex = function(lat, lon) {
    //var ApiKey = 'ae61d20ead0ce1595ad5f9392065ddf1';
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon="  + lon + "&exclude=minutely,hourly,dialy,alerts&appid=ae61d20ead0ce1595ad5f9392065ddf1";
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayUvIndex(data);
        });
    });
}
var displayUvIndex = function(index) {
    var indexEl = document.createElement("div");
    indexEl.textContent = "UV Index: ";
    indexEl.classList = "list-group";

    indexValue = document.createElement("span");
    indexValue.textContent = index.value;

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
    //var ApiKey = 'ae61d20ead0ce1595ad5f9392065ddf1';
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + location + "&appid=ae61d20ead0ce1595ad5f9392065ddf1";
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayFiveDay(data);
        });
    });
};

var displayFiveDay = function(weather) {
    fiveDayEl.textContent = ""
    forecastName.textContent = "Five-Day Forecast: ";

    var forecast = weather.list;
        for (var i = 0 ; i < forecast; i++) {
            var dailyForecast = forecast[i];
            
        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-light text-dark m-2";

        // date
        var forecastDay = document.createElement("h5");
        forecastDay.textContent = " (" + moment(weather.date).format('l') + " )";
        forecastDay.classList = "card-header text-center";
        forecastEl.appendChild(forecastDay);

        // 5-day forecast cards
        var tempForecastEl = document.createElement("span");
        tempForecastEl.textContent = dailyForecast.main.temp + " °F";
        tempForecastEl.classList = "card-body text-center";
        forecastEl.appendChild(tempForecastEl);
        

        var forecastHumidityEl = document.createElement("span");
        forecastHumidityEl.textContent = dailyForecast.main.humidity + " %";
        forecastHumidityEl.classList = " card-body text-center";
        forecastEl.appendChild(forecastHumidity);

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

        searchHistory = document.createElement("button");
        searchHistory.textContent = searchHistory;
        searchHistory.classList = "d-flex w-100 btn btn-ouline-dark border p-2";
        searchHistory.setAttribute("data-location", searchHistory);
        searchHistory.setAttribute("type", "submit");

        searchHistoryBtnEl.prepend(searchHistory);
    }

    var searchHistoryHandler = function(event) {
        var location = event.target.getAttribute("data-location");
        if(location) {
            getWeatherForecast(location);
            getFiveDay(location);
        }
    }

   

    // Event Listners
    locationFormEl.addEventListener("submit", formSubmitHandler);
    searchHistoryBtnEl.addEventListener("click", searchHistoryHandler);