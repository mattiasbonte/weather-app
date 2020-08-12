(async () => {
  //---------//
  // ON LOAD //
  //---------//
  // User can press enter to submit input
  pushEnter();
  // Check previous city, if set, add to input field
  if (localStorage.getItem('Previous City') !== null) {
    getCity();
  }

  //---------//
  // ON TYPE //
  //---------//
  // TODO: Autocomplete.js the city.list.json

  //--------//
  // SUBMIT //
  //--------//
  // Handle submit click button
  document.querySelector('#submit').onclick = () => {
    animInputDiv();
    const country = 'BE';
    const city = document.querySelector('input').value;
    const weather = getWeather(city).catch(error);
    getWeather(city, country).catch(error);
    printTemp(weather);
  };

  //-----------//
  // FUNCTIONS //
  //-----------//
  // Save/Update submitted city in local storage
  function getCity() {
    if (localStorage.getItem('Previous City') !== null) {
      const city = localStorage.getItem('Previous City').toString();
      document.querySelector('#input').value = city;
    }
  }
  // Get previous city from local storage
  function setCity(city) {
    localStorage.setItem('Previous City', city);
  }
  // Handle enter key push
  function pushEnter() {
    const html = document.querySelector('html');
    html.addEventListener('keyup', function (enter) {
      // Number 13 is the "Enter" key on the keyboard
      if (enter.keyCode === 13) {
        enter.preventDefault();
        document.querySelector('#submit').click();
      }
    });
  }

  // WIND directional notation (N,NNE,NE...)
  function windDir(windDegree) {
    let deg = [0];
    for (let i = 0; i < 16; i++) {
      deg.push(i * 22.5 + 11.25);
    }
    const direction = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ];
    let windDir;
    for (let i = 0; i < deg.length; i++) {
      if (windDegree >= deg[i] && windDegree <= deg[i + 1]) {
        windDir = direction[i];
      }
    }
    return windDir;
  }

  // ANIMATION & SOUND
  // Input Div
  function animInputDiv() {
    // Sound
    const audio = new Audio('audio/tick.mp3');
    audio.play();
    // Animate
    document.querySelector('#inputDiv').classList.add('animate-bounce');
    const timeout = setTimeout(() => {
      document.querySelector('#inputDiv').classList.remove('animate-bounce');
      clearTimeout(timeout);
    }, 1520);
  }

  // Compare Button
  function animCompare() {
    // audio
    const audioWhoop = new Audio('../audio/whoop.mp3');
    audioWhoop.play();
    // Open/Close compareDiv on click
    const compareDiv = document.querySelector('#compareDiv');
    let compClick = 1;
    // TODO: NEED TO FIND A WAY TO ACCESS A GRID

    if (compClick === 1) {
      /* gameInfo.classList.remove('hidden');
      gameInfo.classList.add('flex'); */
      compClick = 0;
    } else {
      /* gameInfo.classList.remove('flex');
      gameInfo.classList.add('hidden'); */
      compClick = 1;
    }
  }

  // ========== //
  // FETCH DATA //
  // ========== //
  async function getWeather(city, country) {
    const apiKey = '16b8985dd4d01e5dda0af6d392345499';
    const countryCode = country;
    const weatherCall = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&appid=${apiKey}`;
    // this gets the data from every 3 hours for the next 5 days, (24/3)*5= 40 data points
    const response = await fetch(weatherCall);
    return response.json();
  }
  async function error(error) {
    await error;
    console.error(error);
  }

  // ============= //
  // PRINTING HTML //
  // ============= //
  async function printTemp(weather) {
    // Wait for Data from API
    const data = await weather;

    // City Name
    const cityName = data.city.name;
    setCity(cityName);

    // Show WeatherBox
    const weatherBox = document.querySelector('#weatherBox').classList;
    weatherBox.remove('hidden');

    // WEATHER ICON SWAP
    const weatherIcon = document.querySelector('#weatherIcon');
    const icon = data.list[0].weather[0].icon;
    const src = 'images/status/';
    switch (icon) {
      case '01d': //day: clear sky
        weatherIcon.src = `${src}sun.svg`;
        break;
      case '01n': //night: clear sky
        weatherIcon.src = `${src}night-cloud-full.svg`;
        break;
      case '02d': //day: few clouds
        weatherIcon.src = `${src}cloud-sun.svg`;
        break;
      case '02n': //night: few clouds
        weatherIcon.src = `${src}night-cloud-half.svg`;
        break;
      case '03d': //day: scattered clouds
        weatherIcon.src = `${src}clouds.svg`;
        break;
      case '03n': //night: scattered clouds
        weatherIcon.src = `${src}night-cloud-half.svg`;
        break;
      case '04d': //day: broken clouds
        weatherIcon.src = `${src}clouds.svg`;
        break;
      case '04n': //night: broken clouds
        weatherIcon.src = `${src}night-cloud-half.svg`;
        break;
      case '09d': //day: shower rain
        weatherIcon.src = `${src}rain.svg`;
        break;
      case '09n': //night: shower rain
        weatherIcon.src = `${src}rain.svg`;
        break;
      case '10d': //day: light rain
        weatherIcon.src = `${src}rain-sun.svg`;
        break;
      case '10n': //night: light rain
        weatherIcon.src = `${src}rain.svg`;
        break;
      case '11d': //day: thunderstorm
        weatherIcon.src = `${src}thunder-storm.svg`;
        break;
      case '11n': //night: thunderstorm
        weatherIcon.src = `${src}thunder-storm.svg`;
        break;
      case '13d': //day: snow
        weatherIcon.src = `${src}snowy.svg`;
        break;
      case '13n': //night: snow
        weatherIcon.src = `${src}snowy.svg`;
        break;
      case '50d': //day: fog
        weatherIcon.src = `${src}fog.svg`;
        break;
      case '50n': //night: fog
        weatherIcon.src = `${src}fog-night.svg`;
        break;
      default:
        weatherIcon.src = `${src}default.svg`;
        break;
    }

    // Print CURRENT [0] //
    // TEMPS
    const temp = document.querySelector('#temp');
    const currentTemp = `${(data.list[0].main.temp - 273).toFixed(0)}°`;
    const min = document.querySelector('#min');
    const minTemp = `${(data.list[0].main.temp_min - 273).toFixed(0)}°`;
    const max = document.querySelector('#max');
    const maxTemp = `${(data.list[0].main.temp_max - 273).toFixed(0)}°`;
    temp.textContent = currentTemp;
    min.textContent = minTemp;
    max.textContent = maxTemp;
    temp.title = `It's currently ${currentTemp} Celsius in ${cityName}`;
    min.title = `It will be minimum ${minTemp} Celsius in ${cityName}`;
    max.title = `It will be maximum ${maxTemp} Celsius in ${cityName}`;
    // FEELS
    const feels = document.querySelector('#feels');
    const feelsTemp = `${(data.list[0].main.feels_like - 273).toFixed(0)}°`;
    feels.textContent = feelsTemp;
    feels.title = `It feels like ${feelsTemp} Celsius in ${cityName}`;
    // TIME
    const thisTime = document.querySelector('#thisTime');
    const date = new Date();
    const day = date.getDate();
    const hours = date.getHours();
    let minutes = date.getMinutes();
    minutes < 10 ? (minutes = `0${minutes}`) : '';
    thisTime.textContent = `${hours}:${minutes}`;
    // CITY
    const thisCity = document.querySelector('#thisCity');
    thisCity.textContent = cityName;
    // Probability RAIN
    const probRain = document.querySelector('#probRain');
    probRain.textContent = data.list[0].pop * 100;
    probRain.title = `There is a ${
      data.list[0].pop * 100
    }% chance of rain in ${cityName}`;
    // Probability CLOUDS
    const probCloud = document.querySelector('#probCloud');
    const probCld = data.list[0].clouds.all;
    probCloud.textContent = probCld;
    probCloud.title = `${probCld}% of the sky in ${cityName} is covered by clouds`;
    // HUMIDITY
    const humidity = document.querySelector('#humidity');
    const humid = data.list[0].main.humidity;
    humidity.textContent = humid;
    humidity.title = `There is ${humid}% humidity in the air in ${cityName}`;
    // VISIBILITY
    const visibility = document.querySelector('#visibility');
    const sight = data.list[0].visibility;
    sight > 900 ? (visibility.textContent = '+900') : (visibility.textContent = sight);
    visibility.title = `It's possible to see ${sight} meters far in ${cityName}`;
    // WIND
    const windSpeed = document.querySelector('#windSpeed');
    const windDeg = document.querySelector('#windDeg');
    const windSpd = data.list[0].wind.speed.toFixed(0);
    const windDegree = data.list[0].wind.deg;
    const windPos = windDir(windDegree);
    windSpeed.textContent = windSpd;
    windDeg.style.transform = `rotate(${windDegree}deg)`;
    windDeg.title = `The wind in ${cityName} is blowing to ${windPos} at ${windSpd}m/s `;
    // PRESSURES
    const sea = document.querySelector('#presSea');
    const seaPress = data.list[0].main.sea_level;
    const land = document.querySelector('#presLand');
    const landPress = data.list[0].main.grnd_level;
    sea.textContent = seaPress;
    land.textContent = landPress;
    sea.title = `Atmospheric pressure at sea level is ${seaPress} hPa`;
    land.title = `Atmospheric pressure at ${cityName}'s ground level is ${landPress} hPa`;
    // STATUS
    const status = document.querySelector('#status');
    const statusIcon = document.querySelector('#statusIcon');
    const description = data.list[0].weather[0].description;
    status.textContent = description;
    statusIcon.src = `https://openweathermap.org/img/w/${icon}.png`;
    statusIcon.alt = `${description} icon`;
    statusIcon.title = `${description} in ${cityName}`;

    // ===================== //
    // Print FORECAST [1-39] //
    // ===================== //
    const forecast = document.querySelector('#forecast');
    let forecastPrint = '';
    data.list.forEach((interval, i) => {
      // Get Date/Time
      const time = interval.dt_txt;
      const date = new Date(time);
      let day = date.getDay();
      let fullDay;
      let hours = date.getHours();
      hours < 10 ? (hours = `0${hours}`) : '';
      hours = `${hours}:00`;
      switch (day) {
        case 0:
          day = 'Sun';
          break;
        case 1:
          day = 'Mon';
          break;
        case 2:
          day = 'Tue';
          break;
        case 3:
          day = 'Wed';
          break;
        case 4:
          day = 'Thu';
          break;
        case 5:
          day = 'Fri';
          break;
        case 6:
          day = 'Sat';
          break;
      }
      switch (day) {
        case 'Sun':
          fullDay = 'Sunday';
          break;
        case 'Mon':
          fullDay = 'Monday';
          break;
        case 'Tue':
          fullDay = 'Tuesday';
          break;
        case 'Wed':
          fullDay = 'Wednesday';
          break;
        case 'Thu':
          fullDay = 'Thursday';
          break;
        case 'Fri':
          fullDay = 'Friday';
          break;
        case 'Sat':
          fullDay = 'Saturday';
          break;
      }
      // Get Temp
      const temp = `${(interval.main.temp - 273).toFixed(0)}°`;
      // Get Prob Rain
      const probRain = (interval.pop * 100).toFixed(0);
      // Get Wind Speed & Direction
      const windSpeed = interval.wind.speed;
      const windDegree = interval.wind.deg;
      const windPos = windDir(windDegree);
      // Get Weather Icon
      const description = interval.weather[0].description;
      const icon = interval.weather[0].icon;
      const source = `https://openweathermap.org/img/w/${icon}.png`;

      // Print Segments Per Time Interval
      const segment = `
        <!-- 3H INTERVAL #${i + 1} -->
        <div
          class="grid items-center grid-cols-1 grid-rows-2 p-3 m-1 bg-gray-900 border border-gray-600 rounded-lg shadow sm:grid-rows-4"
        >
          <div class="text-gray-500">
            <p>${day}</p>
            <p>${hours}</p>
          </div>
          <img src="${source}" class="w-8 mx-auto" alt="${description} icon" title="${description} on ${day} at ${hours}" />
          <p class="text-lg" title="It will be ${temp} Celsius at ${hours} in ${cityName}">${temp}</p>
          <div class="hidden text-gray-400 sm:block">
            <p title="There is ${probRain}% change of rain on ${fullDay} around ${hours} in ${cityName}">${probRain}</p>
            <p title="The wind at ${fullDay} around ${hours} in ${cityName} will blow ${windPos} at ${windSpeed}m/s">${windSpeed.toFixed(
        1
      )}</p>
          </div>
        </div>
        `;
      forecastPrint += segment;
    });
    // Add all Segments to html
    forecast.innerHTML = forecastPrint;
  }

  // TODO: Display line graph of temp over time chart.js
  // PHOTO
  // TODO: use unsplash.com to show photo of requested city

  // ======= //
  // COMPARE //
  // ======= //
  /* document.querySelector('#compare').onclick = () => {
    animCompare();
    console.log('compared!!');
  }; */

  // TODO: Give option to compare 2 cities

  //
})();
