import CurrentLocation from './CurrentLocation.js';
import { setLocationObject, getHomeLocation } from './dataFunctions.js';
import { addSpinner, displayError } from './domFuntions.js';

const currentLoc = new CurrentLocation();

const initApp = () => {
  // add listeners
  const geoButton = document.getElementById('getLocation');
  geoButton.addEventListener('click', getGeoWeather);
  const homeButton = document.getElementById('home');
  homeButton.addEventListener('click', loadWeather);
  const saveButton = document.getElementById('saveLocation');
  saveButton.addEventListener('click', saveLocation);
  // set up
  //load weather
  loadWeather();
};

document.addEventListener('DOMContentLoaded', initApp);

const getGeoWeather = (event) => {
  if (event) {
    if (event.type === 'click') {
      // add spinner
      const mapIcon = document.querySelector('.fa-map-marker-alt');
      addSpinner(mapIcon);
    }
  }
  if (!navigator.geolocation) return geoError();
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errObj) => {
  const errMsg = errObj ? errObj.message : 'Geolcation not supported';
  displayError(errMsg, errMsg);
};

const geoSuccess = (position) => {
  const myCoordsObj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`,
  };
  // set location object
  setLocationObject(currentLoc, myCoordsObj);
  //update data and display
  updateDataAndDisplay(currentLoc);
};

const loadWeather = (event) => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !event) return getGeoWeather();
  if (!savedLocation && event.type === 'click') {
    displayError('No Home Location Saved', 'Sorry Please save your location first');
  } else if (savedLocation && !event) {
    displayHomeLocationWeather(savedLocation);
  } else {
    const homeIcon = document.querySelector('.fa-home');
    addSpinner(homeIcon);
    displayHomeLocationWeather(savedLocation);
  }
};

const displayHomeLocationWeather = (home) => {
  if (typeof home === 'string') {
    const locationJson = JSON.parse(home);
    const myCoordsObj = {
      lat: locationJson.lat,
      lon: locationJson.lon,
      name: locationJson.name,
      unit: locationJson.unit,
    };
    setLocationObject(currentLoc, myCoordsObj);
    updateDataAndDisplay(currentLoc);
  }
};

const saveLocation = () => {
  if (currentLoc.getLat() && currentLoc.getLon()) {
    const saveIcon = document.querySelector('.fa-save');
    addSpinner(saveIcon);
    const location = {
      name: currentLoc.getName(),
      lat: currentLoc.getLat(),
      lon: currentLoc.getLon(),
      unit: currentLoc.getUnit(),
    };

    localStorage.setItem('defaultWeatherLocation', JSON.stringify(location));
  }
};

const updateDataAndDisplay = async (locationObj) => {
  console.log(locationObj);
  //   const weatherJson = await getWeatherFromCoords(locationObj);
  //   if (weatherJson) updateDisplay(weatherJson, locationObj);
};