var weatherKey = "4ebc980d0382a8548f724bafaf6fd83f";
var cities = JSON.parse(localStorage.getItem("cities")) || [];
var searchButton = document.getElementById('search-button');
var historyList = document.getElementById('historyList');
var forecastContainer = document.getElementById('forecastContainer');

// Attach event listeners to the search button
searchButton.addEventListener('click', function () {
    var cityName = document.getElementById('city-input').value;
    getApi(cityName);
    getFiveDay(cityName);
});

// Display search history
function displayHistory() {
    historyList.innerHTML = "";
    cities.forEach(city => {
        var listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.addEventListener('click', function () {
            getApi(city);
            getFiveDay(city);
        });
        historyList.appendChild(listItem);
    });
}

// Function to save searched cities to local storage
function saveToLocalStorage(city) {
    // Check if the city is already in the list
    if (!cities.includes(city)) {
        // Save only the last 5 cities
        cities = [city, ...cities.slice(0, 4)];
        localStorage.setItem("cities", JSON.stringify(cities));
        displayHistory();
    }
}

//this function displays and pulls the API
function getApi(cityName) {
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + weatherKey;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            console.log("API Data:", data);
            
            // Displays the details of the present day weather
            document.getElementById('cityName').textContent = "City: " + data.name;
            document.getElementById('date').textContent = "Date: " + new Date().toLocaleDateString();
            document.getElementById('icon').innerHTML = "<img src='http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png'>";
            document.getElementById('temperature').textContent = "Temperature: " + data.main.temp.toFixed(1) + " °F";
            document.getElementById('humidity').textContent = "Humidity: " + data.main.humidity + "%";
            document.getElementById('windSpeed').textContent = "Wind Speed: " + data.wind.speed + " m/s";

            saveToLocalStorage(cityName);
        });
}

//this function pull in the API so that the webpage can use data of the weather in the next 5 days
function getFiveDay(cityName) {
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + weatherKey;

    fetch(fiveDayURL)
        .then(response => response.json())
        .then(data => {
            console.log("Five Day Forecast Data:", data);
            displayFiveDayForecast(data.list);
        });
}

// Displays the weather over 5 days
function displayFiveDayForecast(forecastList) {
    forecastContainer.innerHTML = ""; 

    // Creates a box for each day and goes through the date for each day
    for (var i = 0; i < forecastList.length; i += 8) {
        var dayForecast = forecastList[i];
        var forecastBox = document.createElement('div');
        forecastBox.classList.add('forecast-box');

        var date = new Date(dayForecast.dt * 1000);
        var formattedDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

        var icon = document.createElement('img');
        icon.src = "http://openweathermap.org/img/wn/" + dayForecast.weather[0].icon + ".png";

        var temperature = document.createElement('div');
        var temperatureFahrenheit = (dayForecast.main.temp - 273.15) * 9/5 + 32;
        temperature.textContent = "Temp: " + temperatureFahrenheit.toFixed(1) + " °F";

        var windSpeed = document.createElement('div');
        windSpeed.textContent = "Wind: " + dayForecast.wind.speed + " m/s";

        var humidity = document.createElement('div');
        humidity.textContent = "Humidity: " + dayForecast.main.humidity + "%";

        var dateDiv = document.createElement('div');
        dateDiv.textContent = formattedDate;
        dateDiv.classList.add('date');

        forecastBox.appendChild(dateDiv);
        forecastBox.appendChild(icon);
        forecastBox.appendChild(temperature);
        forecastBox.appendChild(windSpeed);
        forecastBox.appendChild(humidity);

        forecastContainer.appendChild(forecastBox);
    }
}

displayHistory();
