var locations = [];
//var ApiKey = 'ae61d20ead0ce1595ad5f9392065ddf1';

var locationFormEl = document.querySelector("#location-form");
var locationInputEl = document.querySelector("#location");
var locationSearchInputEl = document.querySelector("#location-searched");
var currentWeatherEl = document.querySelector("#current-weather-container");
var forecastNameEl = document.querySelector("#forecast");
var fiveContainerEl = document.querySelector("#five-day-forecast");
var searchHistoryBtnEl = document.querySelector("#search-history-btn");

// get value from input element
var formSubmitHandler = function(event) {
    event.preventDefault();
    var location = locationInputEl.value.trim();
    if(location) {
        getlocalWeather(location);
        get5Day(location);
        locations.unshift({location});
        locationInputEl.value = "";
    }
    else {
        alert("Please enter a location");
    }
    saveSearch();
    searchHistory(location);
}

// Local Storage Save
var saveSearch = function() {
    localStorage.setItem("locations", JSON.stringify(locations));
};

// pull information from openweathermap.org
var getlocalWeather = function(location) {
    // format the weather api url
    //var ApiKey = 'ae61d20ead0ce1595ad5f9392065ddf1';
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=ae61d20ead0ce1595ad5f9392065ddf1";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
            displaylocalWeather(data, location)
        });
    }
        else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to get weather information");
    });
};

// Display pulled information
var displaylocalWeather = function(weather, searchLocation) {
    currentWeatherEl.textContent = "";
    locationSearchInputEl.textContent = searchLocation;
     

    // create day to show when location is selected
    var currentDay = document.createElement("span");
    currentDay.textContent = " (" + moment(weather.date).format("l") + ") ";
    locationSearchInputEl.appendChild(currentDay);

    // add weather icons
    var currentIcon = document.createElement("img");  
    currentIcon.setAttribute("src", "https://openweathermap.org/img/wn/" +weather.weather[0].icon + "@2x.png");
    locationSearchInputEl.appendChild(currentIcon);

    // temperature pull
    var currentTempEl = document.createElement("p");
    currentTempEl.textContent = "Temperature: " + weather.main.temp + " °F";
    currentTempEl.classList = "list-group";
    

    // humidity pull
    var currentHumidityEl = document.createElement("p");
    currentHumidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    currentHumidityEl.classList = "list-group";
    

    // wind speed pull
    var currentWindSpeedEl = document.createElement("p");
    currentWindSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    currentWindSpeedEl.classList = "list-group";


    currentWeatherEl.append(currentTempEl, currentHumidityEl, currentWindSpeedEl);


    // Lat & Lon Variables Defined for UV Index
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat, lon);
}

// Pull UV Index, favorable, moderate, severe
var getUvIndex = function(lat, lon) {
    //var ApiKey = 'ae61d20ead0ce1595ad5f9392065ddf1';
    var apiUvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon="  + lon + "&exclude=minutely,hourly,dialy,alerts&units=imperial&appid=ae61d20ead0ce1595ad5f9392065ddf1";
    return fetch(apiUvUrl)
    .then(function(response) {
        response.json().then(function(data) {
            displayUvIndex(data);
        });
    });
}
var displayUvIndex = function(index) {
    var indexEl = document.createElement("div");
    indexEl.textContent = "UV Index: ";
    indexEl.classList = "list-group d-inline-block";

    indexValue = document.createElement("span");
    indexValue.textContent = index.current.uvi;

    if(index.current.uvi <= 2) {
        indexValue.classList = "favorable"
    }
    else if(index.current.uvi > 2 && index.current.uvi <= 8) {
        indexValue.classList = "moderate"
    }
    else if(index.current.uvi > 8 ) {
        indexValue.classList = "severe"
    };

    indexEl.appendChild(indexValue);

    currentWeatherEl.appendChild(indexEl);
}

// Five Day Forecast Pull
var get5Day = function(location) {
    //var ApiKey = 'ae61d20ead0ce1595ad5f9392065ddf1';
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + location + "&units=imperial&appid=ae61d20ead0ce1595ad5f9392065ddf1";
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            display5Day(data, location);
        });
    });
};

var display5Day = function(weather) {
    fiveContainerEl.textContent = ""
    forecastNameEl.textContent = "Five-Day Forecast: ";

    //var fiveForecast = daily;
    var forecast = weather.list;
        for (var i = 1 ; i < 6; i++) {
            var cincoForecast = forecast[i];
          
        fiveForecastEl = document.createElement("div");
        fiveForecastEl.classList = "card bg-light text-dark m-1 border border-info border border-4";

        // date
        fiveForecastDateEl = document.createElement("h5");
        fiveForecastDateEl.textContent = moment().add(i + 1, 'days').format('l');
        fiveForecastDateEl.classList = "card-header text-center";
        fiveForecastEl.appendChild(fiveForecastDateEl);

        // images
        fiveIcon = document.createElement("img");
        fiveIcon.classList = "card-body text-center";
        fiveIcon.setAttribute("src", "https://openweathermap.org/img/wn/" +cincoForecast.weather[0].icon + "@2x.png");
        fiveForecastEl.appendChild(fiveIcon);

        // 5-day forecast cards
        fiveTempEl = document.createElement("span");
        fiveTempEl.textContent = cincoForecast.main.temp + " °F";
        fiveTempEl.classList = "card-body text-center";
        fiveForecastEl.appendChild(fiveTempEl);
        

        fiveHumEl = document.createElement("span");
        fiveHumEl.textContent = cincoForecast.main.humidity + " %";
        fiveHumEl.classList = "card-body text-center";
        fiveForecastEl.appendChild(fiveHumEl);



    
        fiveContainerEl.appendChild(fiveForecastEl);
    }
};

    // History Logged
    var searchHistory = function(searchHistory) {

        searchHistoryEl = document.createElement("button");
        searchHistoryEl.textContent = searchHistory;
        searchHistoryEl.classList = "d-flex w-100 btn btn btn-outline-info border-info mb-3 p-2";
        searchHistoryEl.setAttribute("data-location", searchHistory);
        searchHistoryEl.setAttribute("type", "submit");

        searchHistoryBtnEl.prepend(searchHistoryEl);
    }

    var searchHistoryHandler = function(event) {
        var location = event.target.getAttribute("data-location");
        if(location) {
            getlocalWeather(location);
            get5Day(location);
        }
    }

    // Event Listners
    locationFormEl.addEventListener("submit", formSubmitHandler);
    searchHistoryBtnEl.addEventListener("click", searchHistoryHandler);