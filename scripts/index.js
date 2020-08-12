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
    const city = document.querySelector('input').value;
    setCity(city);
    const weather = getWeather(city).catch(error);
    getWeather(city).catch(error);
    printTemp(1, weather);
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
  // TODO: Show weather of next 5 days
  // TODO: Display line graph of temp over time chart.js

  // FETCH
  async function getWeather(city) {
    const apiKey = '16b8985dd4d01e5dda0af6d392345499';
    const countryCode = 'BE';
    const weatherCall = `https://api.openweathermap.org/data/2.5/forecast?q=${city},${countryCode}&appid=${apiKey}`;
    // this gets the data from every 3 hours for the next 5 days, (24/3)*5= 40 data points
    const response = await fetch(weatherCall);
    return response.json();
  }
  async function error(error) {
    await error;
    console.error(error);
  }

  // PRINT
  async function printTemp(days, weather) {
    // Wait for Data from API
    const data = await weather;

    // Show WeatherBox
    const weatherBox = document.querySelector('#weatherBox').classList;
    weatherBox.remove('hidden');

    // Print CURRENT [0]
    // TEMPS
    const temp = document.querySelector('#temp');
    temp.textContent = `${(data.list[0].main.temp - 273).toFixed(0)}°`;
    const min = document.querySelector('#min');
    min.textContent = `${(data.list[0].main.temp_min - 273).toFixed(0)}°`;
    const max = document.querySelector('#max');
    max.textContent = `${(data.list[0].main.temp_max - 273).toFixed(0)}°`;
    // FEELS
    const feels = document.querySelector('#feels');
    const feelsTemp = `${(data.list[0].main.feels_like - 273).toFixed(0)}°`;
    feels.textContent = feelsTemp;
    feels.title = `It feels like it's ${feelsTemp} outside`;
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
    thisCity.textContent = data.city.name;
    // Probability RAIN
    const probRain = document.querySelector('#probRain');
    probRain.textContent = data.list[0].pop;
    probRain.title = `There is a ${data.list[0].pop}% chance of rain in ${data.city.name}`;
    // Probability CLOUDS
    const probCloud = document.querySelector('#probCloud');
    probCloud.textContent = data.list[0].clouds.all;
    probCloud.title = `${data.list[0].clouds.all}% of the sky in ${data.city.name} is covered with clouds`;
    // HUMIDITY
    const humidity = document.querySelector('#humidity');
    humidity.textContent = data.list[0].main.humidity;
    // VISIBILITY in meters
    const visibility = document.querySelector('#visibility');
    const sight = data.list[0].visibility;
    sight > 900 ? (visibility.textContent = '+900') : (visibility.textContent = sight);
    visibility.title = `It's possible to see ${sight} meters far in ${data.city.name}`;
    // WIND
    const windSpeed = document.querySelector('#windSpeed');
    windSpeed.textContent = data.list[0].wind.speed.toFixed(0);
    const windDeg = document.querySelector('#windDeg');
    windDeg.style.transform = `rotate(${data.list[0].wind.deg}deg)`;
    windDeg.title = `The wind is blowing at ${data.list[0].wind.speed.toFixed(0)}m/s in ${
      data.city.name
    }`;
    // PRESSURES
    const sea = document.querySelector('#presSea');
    sea.textContent = data.list[0].main.sea_level;
    const land = document.querySelector('#presLand');
    land.textContent = data.list[0].main.grnd_level;
    // STATUS
    const status = document.querySelector('#status');
    status.textContent = data.list[0].weather[0].description;
    const statusIcon = document.querySelector('#statusIcon');
    statusIcon.src = `http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`;
    statusIcon.alt = `${data.list[0].weather[0].description} icon`;
    statusIcon.title = data.list[0].weather[0].description;

    // Print FORECAST [1-39]

    console.log('data :>> ', data);
    /* console.log(data.city.name, 'print city name');
    console.log('data.list.dt :>> ', data.list[0].dt);
    console.log('data.list.temp :>> ', data.list[0].main.temp);
    console.log('data.list.main.temp_min :>> ', data.list[0].main.temp_min);
    console.log('data.list.main.temp_max :>> ', data.list[0].main.temp_max); */
  }

  // TODO: Fetch weather of next 5 days

  // PHOTO
  // TODO: use unsplash.com to show photo of requested city

  // COMPARE
  // TODO: Give option to compare 2 cities

  //
})();
