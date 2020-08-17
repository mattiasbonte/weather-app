(async () => {
  //---------//
  // GLOBALS //
  //---------//
  let alertBoxClick = 1;

  //---------//
  // ON LOAD //
  //---------//
  // User can press enter to submit both inputs
  pushEnter();

  // Uncheck check boxes
  const forecastCheck = document.querySelector('#forecastCheck');
  const compareCheck = document.querySelector('#compareCheck');
  const photosCheck = document.querySelector('#photosCheck');
  forecastCheck.checked = false;
  compareCheck.checked = false;
  photosCheck.checked = false;

  // Check previous city, if set, add to input field
  if (localStorage.getItem('Prev City Left') !== null) {
    getCity('#inputLeft');
  }
  if (localStorage.getItem('Prev City Right') !== null) {
    getCity('#inputRight');
  }

  //----------//
  // HANDLERS //
  //----------//
  // Handle LEFT submit button
  document.querySelector('#submitLeft').onclick = () => {
    animInput('#inputDivLeft');
    const input = document.querySelector('#inputLeft').value;
    const country = input.split(',').pop();
    const cityName = input.split(',').shift();
    const city = document.querySelector('#inputLeft').value;
    const photos = getPhotos(cityName).catch(error);
    const weather = getWeather(city, country).catch(error);
    const forecast = getForecast(city, country).catch(error);
    printTemp(weather, forecast, 'Left');
    printPhotos(photos, cityName);
  };
  // Handle RIGHT submit button
  document.querySelector('#submitRight').onclick = () => {
    animInput('#inputDivRight');
    const input = document.querySelector('#inputRight').value;
    const country = input.split(',').pop();
    const city = document.querySelector('#inputRight').value;
    const weather = getWeather(city, country).catch(error);
    const forecast = getForecast(city, country).catch(error);
    printTemp(weather, forecast, 'Right');
  };
  // Chart ON/OFF
  document.querySelector('#forecastControl').onclick = () => {
    animForecast();
  };
  // Compare ON/OFF
  document.querySelector('#compareControl').onclick = () => {
    animCompare();
  };
  // Photos ON/OFF
  document.querySelector('#photosControl').onclick = () => {
    animPhotos();
  };
  // Handle AlertBox Click
  document.querySelector('#alertDiv').onclick = () => {
    const alert = document.querySelector('#alertDiv');
    alert.classList.add('hidden');
    alertBoxClick = 1;
  };

  // ========== //
  // FETCH DATA //
  // ========== //
  async function error(error) {
    await error;
    console.error(error);
  }

  async function getWeather(city, country) {
    // Fetch current weather data for a specific city
    const apiKey = '16b8985dd4d01e5dda0af6d392345499';
    const countryCode = country;
    const weatherFetch = `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}`;
    const response = await fetch(weatherFetch);
    return response.json();
  }

  async function getForecast(city, country) {
    // Fetch weather 5 day (3h interval) forecast data for a specific city (40 data points)
    const apiKey = '16b8985dd4d01e5dda0af6d392345499';
    const countryCode = country;
    const forecastFetch = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&appid=${apiKey}`;
    const response = await fetch(forecastFetch);
    return response.json();
  }

  async function getPhotos(cityName) {
    const apiKey = 'fT0XySJ5M9TWNQrMTeoMCTT4evMzdUy7Pb3fDGVj3gk';
    const city = cityName.replace(/\s+/g, '%20'); // Change spaces in city name with %20
    const photoFetch = `https://api.unsplash.com/photos/random?client_id=${apiKey}&query=${city}&orientation=squarish&count=9`;
    const response = await fetch(photoFetch);
    return response.json();
  }

  //-----------//
  // FUNCTIONS //
  //-----------//
  // Save/Update submitted city in local storage
  function getCity(id) {
    if (localStorage.getItem('Previous City') !== null) {
      const city = localStorage.getItem('Previous City').toString();
      document.querySelector(id).value = city;
    }
  }
  // Get previous city from local storage
  function setCity(city, country, id) {
    localStorage.setItem(`Prev City ${id}`, `${city}, ${country}`);
  }
  // Handle enter key push
  function pushEnter() {
    const html = document.querySelector('html');
    html.addEventListener('keyup', function (enter) {
      // Number 13 is the "Enter" key on the keyboard
      if (enter.keyCode === 13) {
        enter.preventDefault();
        document.querySelector('#submitLeft').click();
        document.querySelector('#submitRight').click();
      }
    });
  }

  // WIND directional notation (North ,NNE,NE...)
  function windDir(windDegree) {
    let deg = [0];
    for (let i = 0; i < 16; i++) {
      deg.push(i * 22.5 + 11.25);
    }
    const direction = [
      'North',
      'North North East',
      'Nort Eeast',
      'East North East',
      'East',
      'East South East',
      'South East',
      'South South East',
      'South',
      'South South West',
      'South West',
      'West South West',
      'West',
      'West North West',
      'North West',
      'North North West',
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
  function animInput(id) {
    // Sound
    const audio = new Audio('audio/tick.mp3');
    audio.play();
    // Animate
    document.querySelector(id).classList.add('animate-bounce');
    const timeout = setTimeout(() => {
      document.querySelector(id).classList.remove('animate-bounce');
      clearTimeout(timeout);
    }, 1520);
  }
  // Alert Box
  function animAlert(message) {
    const alertDiv = document.querySelector('#alertDiv');
    if (alertBoxClick === 1) {
      alertDiv.classList.remove('hidden');
      alertBoxClick = 0;
    }
  }

  // CONTROL SECTION
  function animForecast() {
    // audio
    const audioWhoop = new Audio('audio/whoop.mp3');
    audioWhoop.play();

    const forecastControl = document.querySelector('#forecastControl');
    const forecastCheck = document.querySelector('#forecastCheck');
    const forecastBoxLeft = document.querySelector('#forecastLeft');
    const forecastBoxRight = document.querySelector('#forecastRight');

    // Toggle checkbox on click
    forecastCheck.checked
      ? (forecastCheck.checked = false)
      : (forecastCheck.checked = true);

    if (forecastCheck.checked) {
      //on
      forecastControl.classList.remove('bg-blue-500', 'border-white');
      forecastControl.classList.add('bg-green-500', 'border-black');
      forecastBoxLeft.classList.remove('hidden');
      forecastBoxLeft.classList.add('flex');
      forecastBoxRight.classList.remove('hidden');
      forecastBoxRight.classList.add('flex');
    } else {
      //off
      forecastControl.classList.remove('bg-green-500', 'border-black');
      forecastControl.classList.add('bg-blue-500', 'border-white');
      forecastBoxLeft.classList.remove('flex');
      forecastBoxLeft.classList.add('hidden');
      forecastBoxRight.classList.remove('flex');
      forecastBoxRight.classList.add('hidden');
    }
  }

  function animCompare() {
    // audio
    const audioWhoop = new Audio('audio/whoop.mp3');
    audioWhoop.play();

    // Open/Close compareDiv on click
    const main = document.querySelector('main');
    const compareControl = document.querySelector('#compareControl');
    const compareRight = document.querySelector('#compareRight');
    const compareCheck = document.querySelector('#compareCheck');
    const iconLeft = document.querySelector('#weatherIconLeft');
    const iconRight = document.querySelector('#weatherIconRight');
    const inputDivLeft = document.querySelector('#inputDivLeft');
    const inputDivRight = document.querySelector('#inputDivRight');
    const photosControl = document.querySelector('#photosControl');

    // Toggle checkbox on click
    compareCheck.checked ? (compareCheck.checked = false) : (compareCheck.checked = true);

    if (compareCheck.checked) {
      //on
      compareControl.classList.remove('bg-blue-500', 'border-white');
      compareControl.classList.add('bg-green-500', 'border-black');
      main.classList.add('md:grid', 'md:grid-cols-2', 'md:gap-4');
      compareRight.classList.add('md:inline');
      iconLeft.classList.remove('sm:-translate-y-24', 'sm:w-40');
      iconLeft.classList.add('lg:-translate-y-24', 'lg:w-40');
      iconRight.classList.remove('sm:-translate-y-24', 'sm:w-40');
      iconRight.classList.add('lg:-translate-y-24', 'lg:w-40');
      inputDivLeft.classList.remove('sm:mb-32');
      inputDivRight.classList.remove('sm:mb-32');
      photosControl.classList.remove('md:inline');
    } else {
      //off
      compareControl.classList.remove('bg-green-500', 'border-black');
      compareControl.classList.add('bg-blue-500', 'border-white');
      main.classList.remove('md:grid', 'md:grid-cols-2', 'md:gap-4');
      compareRight.classList.remove('md:inline');
      iconLeft.classList.remove('lg:-translate-y-24', 'lg:w-40');
      iconLeft.classList.add('sm:-translate-y-24', 'sm:w-40');
      iconRight.classList.remove('lg:-translate-y-24', 'lg:w-40');
      iconRight.classList.add('sm:-translate-y-24', 'sm:w-40');
      inputDivLeft.classList.add('sm:mb-32');
      inputDivRight.classList.add('sm:mb-32');
      photosControl.classList.add('md:inline');
    }
  }

  function animPhotos() {
    // audio
    const audioWhoop = new Audio('audio/whoop.mp3');
    audioWhoop.play();

    const main = document.querySelector('main');
    const photosBox = document.querySelector('#photosBox');
    const photosControl = document.querySelector('#photosControl');
    const photosCheck = document.querySelector('#photosCheck');
    const compareControl = document.querySelector('#compareControl');

    // Toggle checkbox on click
    photosCheck.checked ? (photosCheck.checked = false) : (photosCheck.checked = true);

    if (photosCheck.checked) {
      //on
      photosControl.classList.remove('bg-blue-500', 'border-white');
      photosControl.classList.add('bg-green-500', 'border-black');
      main.classList.add('md:grid', 'md:grid-cols-2', 'md:gap-4');
      photosBox.classList.add('md:grid');
      compareControl.classList.remove('md:inline');
    } else {
      //off
      photosControl.classList.remove('bg-green-500', 'border-black');
      photosControl.classList.add('bg-blue-500', 'border-white');
      main.classList.remove('md:grid', 'md:grid-cols-2', 'md:gap-4');
      photosBox.classList.remove('md:grid');
      compareControl.classList.add('md:inline');
    }
  }

  // ============= //
  // PRINTING HTML //
  // ============= //
  // PRINT WEATHER & FORECAST
  async function printTemp(weather, forecast, id) {
    // Wait for Data from API
    const weatherData = await weather;
    const forecastData = await forecast;

    // City Name
    const cityName = await weatherData.name;
    const countryCode = await weatherData.sys.country;
    setCity(cityName, countryCode, id);

    // Show WeatherBox
    const weatherBox = document.querySelector(`#weatherBox${id}`).classList;
    weatherBox.remove('hidden');

    // WEATHER ICON SWAP
    const weatherIcon = document.querySelector(`#weatherIcon${id}`);
    const icon = await weatherData.weather[0].icon;
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
        weatherIcon.src = `${src}rain-cloud-sun.svg`;
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

    // ============================= //
    // Print CURRENT WEATHER SECTION //
    // ============================= //
    // TEMPS
    const temp = document.querySelector(`#temp${id}`);
    const currentTemp = `${(weatherData.main.temp - 273).toFixed(0)}°`;
    const min = document.querySelector(`#min${id}`);
    const minTemp = `${(weatherData.main.temp_min - 273).toFixed(0)}°`;
    const max = document.querySelector(`#max${id}`);
    const maxTemp = `${(weatherData.main.temp_max - 273).toFixed(0)}°`;
    temp.textContent = currentTemp;
    min.textContent = minTemp;
    max.textContent = maxTemp;
    temp.title = `It's currently ${currentTemp} Celsius in ${cityName}`;
    min.title = `It will be minimum ${minTemp} Celsius in ${cityName}`;
    max.title = `It will be maximum ${maxTemp} Celsius in ${cityName}`;
    // FEELS
    const feels = document.querySelector(`#feels${id}`);
    const feelsTemp = `${(weatherData.main.feels_like - 273).toFixed(0)}°`;
    feels.textContent = feelsTemp;
    feels.title = `It feels like ${feelsTemp} Celsius in ${cityName}`;
    // TIME
    const thisTime = document.querySelector(`#thisTime${id}`);
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    minutes < 10 ? (minutes = `0${minutes}`) : '';
    hours < 10 ? (hours = `0${hours}`) : '';
    thisTime.textContent = `${hours}:${minutes}`;
    // CITY
    const thisCity = document.querySelector(`#thisCity${id}`);
    thisCity.textContent = cityName;
    // Probability RAIN
    const probRain = document.querySelector(`#probRain${id}`);
    const probRainCalc = (forecastData.list[0].pop * 100).toFixed(0);
    probRain.textContent = probRainCalc;
    probRain.title = `There is a ${probRainCalc}% chance of rain in ${cityName}`;
    // Probability CLOUDS
    const probCloud = document.querySelector(`#probCloud${id}`);
    const probCld = weatherData.clouds.all.toFixed(0);
    probCloud.textContent = probCld;
    probCloud.title = `${probCld}% of the sky in ${cityName} is covered by clouds`;
    // HUMIDITY
    const humidity = document.querySelector(`#humidity${id}`);
    const humid = weatherData.main.humidity;
    humidity.textContent = humid;
    humidity.title = `There is ${humid}% humidity in the air in ${cityName}`;
    // VISIBILITY
    const visibility = document.querySelector(`#visibility${id}`);
    const sight = weatherData.visibility;
    sight > 900 ? (visibility.textContent = '+900') : (visibility.textContent = sight);
    visibility.title = `It's possible to see ${sight} meters far in ${cityName}`;
    // WIND
    const windSpeed = document.querySelector(`#windSpeed${id}`);
    const windDeg = document.querySelector(`#windDeg${id}`);
    const windSpd = weatherData.wind.speed.toFixed(0);
    const windDegree = weatherData.wind.deg;
    const windPos = windDir(windDegree);
    windSpeed.textContent = windSpd;
    windDeg.style.transform = `rotate(${windDegree}deg)`;
    windDeg.title = `Wind blows ${windPos} at ${windSpd}m/s in ${cityName}`;
    // PRESSURES
    const sea = document.querySelector(`#presSea${id}`);
    const seaPress = forecastData.list[0].main.sea_level;
    const land = document.querySelector(`#presLand${id}`);
    const landPress = forecastData.list[0].main.grnd_level;
    sea.textContent = seaPress;
    land.textContent = landPress;
    sea.title = `Atmospheric pressure at sea level is ${seaPress} hPa`;
    land.title = `Atmospheric pressure at ${cityName}'s ground level is ${landPress} hPa`;
    // STATUS
    const status = document.querySelector(`#status${id}`);
    const statusIcon = document.querySelector(`#statusIcon${id}`);
    const description = weatherData.weather[0].description;
    status.textContent = description;
    statusIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    statusIcon.alt = `${description} icon`;
    statusIcon.title = `${description} in ${cityName}`;
    weatherIcon.alt = `${description} icon`;
    weatherIcon.title = `${description} in ${cityName}`;

    // ===================== //
    // Print FORECAST [1-39] //
    // ===================== //

    // Make individual alert Messages possible
    let alertMessage = [];

    const forecastDiv = document.querySelector(`#forecast${id}`);
    let forecastPrint = '';
    forecastData.list.forEach((interval, i) => {
      // Get Date/Time
      const time = interval.dt_txt;
      const adaptTime = time.replace(' ', 'T');
      const date = new Date(adaptTime);
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
      const source = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      // Print Segments Per Time Interval
      const segment = `
        <!-- 3H SEGMENT #${i + 1} -->
        <div
          class="segment${id} grid items-center grid-cols-1 grid-rows-2 p-3 m-1 border border-gray-700 hover:bg-gray-900 hover:border-gray-600 rounded-lg shadow cursor-pointer"
        >
          <div class="text-gray-500">
            <p>${day}</p>
            <p>${hours}</p>
          </div>
          <img src="${source}" class="w-8 mx-auto" alt="${description} icon" title="${description} on ${day} at ${hours}" />
          <p class="text-lg" title="${temp} Celsius at ${fullDay} ${hours} in ${cityName}">${temp}</p>
        </div>
        `;
      forecastPrint += segment;

      // Create Descriptive text for each segment
      const describeSegment = `
      <div class="flex flex-wrap">
        <p class="mx-2"><i>${fullDay} ${hours} at ${cityName}:</i></p><p class="mx-2">Temperature ${temp} and ${description}.</p><p class="mx-2">${windPos}er wind, ${windSpeed}m/s.</p>
      </div>`;
      alertMessage.push(describeSegment);
    });
    // Add all Segments to html
    forecastDiv.innerHTML = forecastPrint;

    // Click Info Box Per Segment
    const allSegments = document.querySelectorAll(`.segment${id}`);
    const alertMsg = document.querySelector('#alertMessage');
    allSegments.forEach((segment, i) =>
      segment.addEventListener('click', () => {
        alertMsg.innerHTML = alertMessage[i];
        animAlert(alertMessage[i]);
      })
    );
  }

  // PRINT PHOTO
  async function printPhotos(photos, city) {
    const photosData = await photos;
    const photosBox = document.querySelector('#photosBox');
    let photosInject = '';

    if (photosData.errors === undefined) {
      photosData.forEach((pics, i) => {
        const photo = pics.urls.regular;
        let alt = pics.alt_description;
        alt === null ? (alt = 'random unsplash image') : '';
        const html = `
        <img
          src="${photo}"
          alt="${alt}"
          title="${alt}"
          class="object-cover max-h-xs border shadow-lg rounded-lg border-white"
        />
      `;
        photosInject += html;
      });
      photosBox.innerHTML = photosInject;
    } else {
      photosBox.innerHTML = `<p class="shadow-md bg-gray-100 text-gray-700 text-center self-start p-8 border rounded-lg">${city} has no photo's available 😔</p>`;
    }
  }

  //
})();
