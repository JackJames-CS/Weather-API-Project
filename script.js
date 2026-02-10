const weatherapp = document.querySelector(".weatherapp");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apikey = API_key;
const submitBtn = weatherapp.querySelector('button[type="submit"]');

const unitToggle = document.querySelector(".unitToggle");
const recentBox = document.querySelector("#recent");


renderRecentSearches();



let units = localStorage.getItem("units") || "metric";

function unitSymbol() {
    return units === "metric" ? "°C" : "°F";
}

unitToggle.textContent = unitSymbol();

unitToggle.addEventListener("click", () => {
    units = (units === "metric") ? "imperial" : "metric";
    localStorage.setItem("units", units);
    unitToggle.textContent = unitSymbol();
});


//for Nav bar
const navButtons = document.querySelectorAll(".navBtn");
const pages = document.querySelectorAll(".page");

function showPage(pageId){
  pages.forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  navButtons.forEach(b => b.classList.remove("active"));
  document.querySelector(`.navBtn[data-page="${pageId}"]`).classList.add("active");
}

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    showPage(btn.dataset.page);
  });
});



weatherapp.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if(city){
        try{
            // START loading state
            submitBtn.disabled = true;
            submitBtn.textContent = "Loading...";

            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
            saveRecentSearch(city);

        }
        catch(error){
            console.error(error);
            displayError(error.message);
        }
        finally{
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit";
        }
    }
    else{
        displayError("Please enter a City");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apikey}&units=${units}`;



    const response = await fetch(apiUrl);
    
    if(!response.ok){
    if(response.status === 404){
        throw new Error("City not found. Check the spelling and try again.");
    }
    if(response.status === 401){
        throw new Error("API key error (401).");
    }
    throw new Error("Could not fetch weather data.");
}
    return await response.json();
}

function displayWeatherInfo(data){

    const existingError = card.querySelector(".errorDisplay");
    if (existingError) existingError.remove();

    const {name: city, 
           main: {temp, humidity}, 
           weather: [{description, id}]} = data;

    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${temp.toFixed(1)}${unitSymbol()}`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    cityDisplay.classList.add("CityDisplay");
    tempDisplay.classList.add("TempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);


}

function getWeatherEmoji(weatherId){

    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧";
        case (weatherId >= 600 && weatherId < 700):
            return "❄";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫";
        case (weatherId === 800):
            return "☀";
        case (weatherId >= 801 && weatherId < 810):
            return "☁";
        default:
            return "❓";
    }
}

function displayError(message){

    card.textContent = "";
    card.style.display = "flex";

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.appendChild(errorDisplay);
}

function getRecentSearches(){
    return JSON.parse(localStorage.getItem("recentCities")) || [];
}

function saveRecentSearch(city){
    let cities = getRecentSearches();

    // remove duplicates (case-insensitive)
    cities = cities.filter(c => c.toLowerCase() !== city.toLowerCase());

    // add to front
    cities.unshift(city);

    // keep only 5
    cities = cities.slice(0, 5);

    localStorage.setItem("recentCities", JSON.stringify(cities));
    renderRecentSearches();
}

function renderRecentSearches(){
    const cities = getRecentSearches();
    recentBox.innerHTML = "";

    if(cities.length === 0) return;

    cities.forEach(city => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = city;

        btn.addEventListener("click", async () => {
            cityInput.value = city;
            try{
                submitBtn.disabled = true;
                submitBtn.textContent = "Loading...";

                const weatherData = await getWeatherData(city);
                displayWeatherInfo(weatherData);
            } catch(err){
                displayError(err.message);
            } finally{
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit";
            }
        });

        recentBox.appendChild(btn);
    });
}
