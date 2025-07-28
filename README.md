# Weather Dashboard

![Weather Dashboard Screenshot](./assets/images/screenshot.png) <!-- Add your screenshot path -->

A responsive weather application that displays current weather conditions and 5-day forecast for searched cities.

## Features

- **Current Weather Display**:
  - City name, date, and weather icon
  - Temperature, humidity, wind speed, and UV index (with color-coded severity)
  
- **5-Day Forecast**:
  - Date, weather icon, temperature, and humidity for each day
  
- **Search Functionality**:
  - Search by city name
  - Search history saved in local storage
  - Clickable search history for quick access

- **Responsive Design**:
  - Works on desktop, tablet, and mobile devices

## Technologies Used

- **Frontend**:
  - HTML5, CSS3 (with Bootstrap for responsive layout)
  - JavaScript (ES6+)
  
- **APIs**:
  - OpenWeatherMap API (Current weather, 5-day forecast, and UV index)
  
- **Tools**:
  - Moment.js for date formatting
  - Font Awesome for icons
  - Git for version control

## Installation

1. Clone the repository:
   ```bash
   git clone https://mubashargithub.github.io/Weather-Dashboard/
   cd weather-dashboard
   bash```
Open index.html in your browser

## Usage
   -  Enter a city name in the search bar

   -  Click the search button or press Enter

   - View current weather and 4-day forecast

   - Click on previous searches in the history to quickly view that city's weather
## File Structure
   - weather-dashboard/
  ├── assets/
  │   ├── css/
  │   │   └── style.css
  │   ├── images/
  │   │   └── screenshot.png
  │   └── js/
  │       ├── config.js (create this file)
  │       └── script.js
  ├── index.html
  └── README.md

## Live Demo --->   https://github.com/mubashargithub/Weather-Dashboard/

## Contributing
  - Fork the project

  - Create your feature branch (git checkout -b feature/AmazingFeature)

  - Commit your changes (git commit -m 'Add some AmazingFeature')

  - Push to the branch (git push origin feature/AmazingFeature)

  - Open a Pull Request

## License
   - This project is licensed under the MIT License - see the LICENSE file for details.
