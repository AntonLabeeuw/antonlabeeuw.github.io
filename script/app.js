"use strict";

// constante variabelen
const APIkey = "10776e2683566e7e30557ee4f05397bc";


function _parseMillisecondsIntoReadableTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = "0" + date.getHours();
  const minutes = "0" + date.getMinutes();
  return hours.substr(-2) + ":" + minutes.substr(-2);
};


let IsNight = () => {
  document.querySelector("html").classList.add("is-night");
};


const UpdateSun = (sun, left, bottom, today) => {
  sun.style.setProperty('--sun-position-left', `${left}%`);
  sun.style.setProperty('--sun-position-bottom', `${bottom}`);

  const time = today.getHours().toString().padStart(2, "0") + ":" + today.getMinutes().toString().padStart(2, "0");

  sun.setAttribute("data-time", time);
};


const placeSunAndStartMoving = (totalMinutes, sunrise) => {
  const htmlSun = document.querySelector(".js-sun");
  let currentDate = new Date();

  let timeUp = new Date(currentDate.getTime() - sunrise);
  let minutesUp = (timeUp.getHours() - 1) * 60 + timeUp.getMinutes();

  let percentage = (minutesUp / totalMinutes) * 100;
  let sunLeft = percentage;
  let sunBottom = Math.sin((percentage / 50) * (Math.PI / 2)) * 100;

  UpdateSun(htmlSun, sunLeft, sunBottom, currentDate);

  document.querySelector("html").classList.add("is-loaded");

  let minutesLeft = totalMinutes - minutesUp;

  if (minutesUp < 0 || minutesUp > totalMinutes){
    IsNight();
  }

  const t = setInterval(function (){
    currentDate = new Date();
    if (minutesUp < 0 || minutesUp > totalMinutes){
      clearInterval(t);
      IsNight();
    } else{
      minutesUp++;
      percentage = (minutesUp / totalMinutes) * 100;
      sunLeft = percentage;
      let sunBottom = Math.abs(
        Math.sin((percentage / 50) * (Math.PI / 2)) * 100
      );

      UpdateSun(htmlSun, sunLeft, sunBottom, currentDate);
      document.querySelector("html").classList.add("is-day");
      document.querySelector("html").classList.remove("is-night");
    }
  }, 60 * 1000);
};


const showResult = (queryResponse) => {
    console.log(queryResponse);

    let celcius = (parseInt(queryResponse.main.temp) / 273.15).toFixed(0);

    let unixSunrise = queryResponse.sys.sunrise;
    let unixSunset = queryResponse.sys.sunset;

    let sunrise = _parseMillisecondsIntoReadableTime(unixSunrise);
    let sunset = _parseMillisecondsIntoReadableTime(unixSunset);

    document.querySelector(".js-favicon").setAttribute('href', `icons/${queryResponse.weather[0].icon}.png`);
    document.querySelector(".js-icon").setAttribute('src', `icons/${queryResponse.weather[0].icon}.png`);
    document.querySelector(".js-description").innerHTML = `${queryResponse.weather[0].description}`;
    document.querySelector(".js-wind").innerHTML = `Wind: ${queryResponse.wind.speed}m/s`;
    document.querySelector('.js-temperature').innerHTML = `${celcius} °C`;
    document.querySelector('.js-sunrise').innerHTML = `${sunrise}`;
    document.querySelector('.js-sunset').innerHTML = `${sunset}`;
    document.querySelector('.js-clouds').innerHTML = `Cloudiness: ${queryResponse.clouds.all}%`;

    let timeDifference = new Date(unixSunset * 1000 - unixSunrise * 1000);

    placeSunAndStartMoving(
      (timeDifference.getHours() - 1) * 60 + timeDifference.getMinutes(),
      unixSunrise * 1000
    );
};


const searchCity = (e) => {
  e.preventDefault();
  let newCity = document.getElementById('city').value;
  getAPI(newCity);
};


const getAPI = async (gemeente) => {

  
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${gemeente}&appid=${APIkey}`;
  

    const weatherResponse = await get(url);

    showResult(weatherResponse);
};
  

const get = (url) => fetch(url).then((r) => r.json());
  

document.addEventListener("DOMContentLoaded", function () {

    getAPI("lichtervelde");
    document.querySelector('.js-search').addEventListener('click', searchCity);

  });