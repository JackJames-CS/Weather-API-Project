# Weather App

A simple weather application built with **HTML, CSS, and JavaScript** that fetches real-time weather data using the **OpenWeather API**.

This project was created as part of my learning process to practice working with APIs, asynchronous JavaScript, and dynamic DOM manipulation.

---

## Features

* Search weather by city name
* Displays:

  * Temperature
  * Humidity
  * Weather description
  * Weather emoji based on conditions
* Error handling for invalid or empty city input
* Clean, responsive UI using Flexbox

* This project uses a public OpenWeather API key for demonstration purposes.
For development, you may replace it with your own key if needed. If this were a real
deleveoped product it would be stored server-side for security 

---

## Technologies Used

* HTML5
* CSS3 (Flexbox, gradients)
* JavaScript (ES6+)
* OpenWeather API
* Fetch API / Async–Await

---

## Setup Instructions

1. Clone the repository

```
git clone https://github.com/JackJames-CS/Weather-App.git
```

2. Navigate to the project folder

3. Create a file called **config.js** in the root directory:

```js
const API_KEY = "your_openweather_api_key_here";
```

4. Open `index.html` in your browser

---

## Project Structure

```
Weather-App/
│── index.html
│── style.css
│── script.js
│── .gitignore
```

---

## Future Improvements

* City suggestion dropdown (handling multiple locations)
* Save recent searches
* Temperature unit toggle (°C / °F)
* Use current location (geolocation)
* Improved UI and animations
