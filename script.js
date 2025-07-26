// ==== Configuration ====
const config = {
    apiKey: "d1e5f4a3287993b0d3f203c370f2a9c6", // Replace with your OpenWeatherMap API key
    cities: [
        "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
        "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala",
        "Bahawalpur", "Sargodha", "Abbottabad", "Sukkur", "Hyderabad",
        "Larkana", "Mirpur Khas", "Nawabshah", "Rahim Yar Khan", "Dera Ghazi Khan",
        "Dera Ismail Khan", "Mardan", "Swat", "Chiniot", "Sheikhupura",
        "Jhelum", "Kasur", "Okara", "Vehari", "Burewala",
        "Hafizabad", "Khairpur", "Tando Adam", "Kamoke", "Nowshera",
        "Kohat", "Muzaffargarh", "Jacobabad", "Attock", "Tando Allahyar",
        "Khuzdar", "Layyah", "Bhakkar", "Mansehra", "Kotli",
        "Mirpur (AJK)", "Gilgit", "Skardu", "Gwadar", "Chaman"
    ],
    maxAutocompleteItems: 6,
    forecastDays: 4
};

// ==== DOM Elements ====
const elements = {
    cityInput: document.getElementById("city-input"),
    currentLocationBtn: document.querySelector(".current-location button"),
    searchBtn: document.querySelector(".search-btn button"),
    currentDate: document.getElementById("rb-date"),
    cityName: document.getElementById("rb-cityname"),
    currentTemp: document.querySelector(".WD.temp span"),
    currentWind: document.querySelector(".WD.wind"),
    currentHumidity: document.querySelector(".WD.hum"),
    weatherDescription: document.getElementById("r-u-logo-name"),
    weatherIcon: document.querySelector(".r-u-right img"),
    forecastBoxes: document.querySelectorAll(".forcast1234")
};

// ==== Utility Functions ====
function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getDayName(date) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function closeDropdown() {
    const dropdown = document.querySelector(".autocomplete-items");
    if (dropdown) dropdown.remove();
}

// ==== Autocomplete Cities Dropdown ====
elements.cityInput.addEventListener("input", function () {
    const inputValue = this.value.toLowerCase();
    closeDropdown();

    if (!inputValue) return;

    const filteredCities = config.cities
        .filter(city => city.toLowerCase().startsWith(inputValue))
        .slice(0, config.maxAutocompleteItems);

    if (filteredCities.length === 0) return;

    const dropdown = document.createElement("div");
    dropdown.className = "autocomplete-items";
    this.parentNode.appendChild(dropdown);

    filteredCities.forEach(city => {
        const item = document.createElement("div");
        item.innerHTML = `<strong>${city.substr(0, inputValue.length)}</strong>${city.substr(inputValue.length)}`;
        item.addEventListener("click", () => {
            elements.cityInput.value = city;
            closeDropdown();
            // fetchWeatherData(city);
        });
        dropdown.appendChild(item);
    });
});

document.addEventListener("click", (e) => {
    if (e.target !== elements.cityInput) closeDropdown();
});

==== Current Location Handler ====
elements.currentLocationBtn.addEventListener("click", async function () {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    }

    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const data = await response.json();
        
        const city = data.city || data.locality || data.principalSubdivision;
        if (city) {
            elements.cityInput.value = city;
            fetchWeatherData(city);
        } else {
            alert("Could not determine your city from location.");
        }
    } catch (error) {
        console.error("Geolocation error:", error);
        alert("Error getting your location. Please make sure location services are enabled.");
    }
});

// ==== Search Button Handler ====
elements.searchBtn.addEventListener("click", function () {
    const cityName = elements.cityInput.value.trim();
    if (cityName) {
        fetchWeatherData(cityName);
    } else {
        alert("Please enter a city name");
    }
});

// ==== Weather Data Fetching and Display ====
async function fetchWeatherData(city) {
    try {
        // Update current date
        elements.currentDate.textContent = formatDate(new Date());

        // Fetch current weather
        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.apiKey}&units=metric`);
        if (!currentResponse.ok) throw new Error("City not found");
        const currentData = await currentResponse.json();

        // Update current weather display
        elements.cityName.textContent = currentData.name;
        elements.currentTemp.textContent = `${Math.round(currentData.main.temp)}°C`;
        elements.currentWind.innerHTML = `Wind: ${currentData.wind.speed} km/h`;
        elements.currentHumidity.innerHTML = `Humidity: ${currentData.main.humidity}%`;
        elements.weatherDescription.textContent = currentData.weather[0].description;
        elements.weatherIcon.src = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`;
        elements.weatherIcon.alt = currentData.weather[0].description;

        // Fetch forecast data
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${config.apiKey}&units=metric`);
        const forecastData = await forecastResponse.json();

        // Process forecast data - get one reading per day at noon (or closest available)
        const forecastsByDay = {};
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toISOString().split('T')[0];
            
            // If we don't have data for this day yet, or this is a noon reading, store it
            if (!forecastsByDay[dateKey] || date.getHours() === 12) {
                forecastsByDay[dateKey] = item;
            }
        });

        // Display forecast for next 4 days (excluding today)
        const forecastDays = Object.values(forecastsByDay).slice(1, config.forecastDays + 1);
        
        forecastDays.forEach((dayData, index) => {
            if (index >= config.forecastDays) return;
            
            const date = new Date(dayData.dt * 1000);
            const box = elements.forecastBoxes[index];
            
            box.querySelector("#forcastdate").textContent = `${getDayName(date)} (${date.toISOString().split('T')[0]})`;
            box.querySelector("#forcastimg img").src = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png`;
            box.querySelector("#forcastimg img").alt = dayData.weather[0].description;
            box.querySelector(".forcast-temp span").textContent = `${Math.round(dayData.main.temp)}°C`;
            box.querySelector(".forcast-wind span").textContent = `${dayData.wind.speed} km/h`;
            box.querySelector(".forcast-humi span").textContent = `${dayData.main.humidity}%`;
            const ddt = document.querySelectorAll('#forcastdate');
            ddt.forEach(item =>{
                item.style.fontSize = '1.5rem';
            })
            
            
        });
        // let arr = ["forcast-temp","forcast-wind","forcast-humi"];
        //     arr.forEach((item1) => {
        //         const cn = document.getElementsByClassName(item1);
        //         cn.style.fontSize = '1.3rem';
        //     })

    } catch (error) {
        console.error("Weather fetch error:", error);
        alert(`Error: ${error.message || "Failed to fetch weather data"}`);
    }
}

// Initialize with default city
fetchWeatherData("Islamabad");