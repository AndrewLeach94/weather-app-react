import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeatherData } from './locationSlice';

export const Location = ({ weather }) => {
    const currentLocation = useSelector(state => state.location.currentLocation);
    const locationStatus = useSelector(state => state.location.status);
    const currentWeather = useSelector(state => state.location.currentWeather);
    const forecasts = useSelector(state => state.location.forecasts);
    const error = useSelector(state => state.location.error);
    const defaultLocation = localStorage.defaultLocation;
    const dispatch = useDispatch();
    
    const [typedLocation, setTypedLocation] = useState('');
    const [defaultToggle, setDefaultToggle] = useState('addDefault');
    const [viewing, setViewing] = useState('currentWeather');

    const toggleCurrentWeatherView = () => {
      setViewing('currentWeather');
    }
  
    const toggleForecastView = () => {
      setViewing('hourlyForecast');
    }
  
    
    const handleInputChange = (e) => {
        setTypedLocation(e.target.value);
    }

    const getUserGpsLocation = () => {
        return navigator.geolocation.getCurrentPosition(userGpsSuccessCallback, userGpsErrorCallback);
    }

    const userGpsSuccessCallback = (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        dispatch(fetchWeatherData({latitude: lat, longitude: lon, units: 'imperial'}));
    }
    
    const userGpsErrorCallback = (error) => {
        console.error(error);
    }

    const fetchLocationCoordinates = async (locationRequest) => {
        try {
          const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationRequest}&limit=5&appid=62559260c941ebf6fd752e2570f6c760`, {mode: 'cors'});
          const locationData = await response.json();
          const filteredLocation = locationData.filter(locations => locations.name === locationRequest)[0];
          dispatch(fetchWeatherData({latitude: filteredLocation.lat, longitude: filteredLocation.lon, units: 'imperial'}));
        } catch(err) {
          console.error("There was an error fetching location coordinates");
        }

      }
    const toggleLocationDefault = () => {
        if (defaultToggle === 'addDefault') {
            localStorage.setItem('defaultLocation', currentLocation);
            // dispatch(setLocationDefault(currentLocation));
            setDefaultToggle('removeDefault');
        } else {
            localStorage.removeItem('defaultLocation');
            // dispatch(setLocationDefault(''));
            setDefaultToggle('addDefault');
        }
    }

    useEffect(() => {
        if (localStorage.defaultLocation !== undefined && locationStatus === 'idle') {
            fetchLocationCoordinates(localStorage.defaultLocation);
            return () => {
                setDefaultToggle('removeDefault');
            };    
        }
        else if (locationStatus === 'idle') {
            getUserGpsLocation();
        }
    });

    let pageContent = () => {
        if (locationStatus === 'idle') {
            return(
                <h1>Status: Idle</h1>
            )
        } 
        else if (locationStatus === 'loading') {
            return(
                <h1>Status: Loading</h1>

            )
        } 

        else if (locationStatus === 'pending') {
            return(
                <h1>Status: Pending</h1>
            )
        } 
        else if (locationStatus === 'completed' && viewing === 'currentWeather') {
            return(
                <main className="current-weather-parent">
                    <div className="current-weather-container-primary">
                        <div className="current-conditions">{currentWeather.weatherType}</div>
                        <div className="current-city">{currentWeather.name}</div>
                        <div className="current-temperature">{currentWeather.temperature}°</div>
                    </div>
                    <div className="current-weather-container-secondary">
                        <div className="current-stat">Feels Like: {currentWeather.feelsLike}°</div>
                        <div className="current-stat">Humidity: {currentWeather.humidity}%</div>
                        <div className="current-stat">Wind: {currentWeather.windSpeed} mph</div>
                    </div>
                </main>
            )
        } 
        else if (locationStatus === 'completed' && viewing === 'hourlyForecast') {
            const listForecast = forecasts.map(forecast =>
                    <li key={`Forecast-${forecast.id}`} className="forecast_item-parent">
                        <div key={`Date-${forecast.id}`}>{forecast.date}</div>
                        <div className="forecast_item-temp-container">
                            <div className="forecast_item-temp" key={`Temp-${forecast.id}`}>{forecast.temp}°</div>
                            <div className="forecast_item-conditions" key={`Weather-${forecast.id}`}>{forecast.weatherType}</div>
                        </div>
                    </li>
                )
            return(
                <main>
                    <h1>Hourly Forecast</h1>
                    <ul className="forecast_table">
                        {listForecast}
                    </ul>
                </main>
            )
        }
        
        else {
            return(error);
        }
    }
        
  
    return (
        <div>
            <div className="save-location-container">
                <button className="button_default-location-inactive" onClick={() => toggleLocationDefault()}>{defaultToggle === 'addDefault' ? 'Save as Default Location' : 'Remove Default Location'}</button>
                <div className="button_default-subtext">{defaultLocation !== undefined ? `Currently: ${defaultLocation}` : ''}</div>
            </div>
            <div className="location-container">
                <div className="measurement-container">
                    <button id="metric" className="button_measurement" type="button">C</button>
                    <button id="imperial" className="button_measurement-selected" type="button">F</button>
                </div>
                <div className="input_container">
                    <label>
                        <input className="input_location" placeholder="Choose Location" onChange={handleInputChange} />
                    </label>
                    <button className="submit_location" type="button" onClick={() => fetchLocationCoordinates(typedLocation)}>Update<i className="fas fa-arrow-right"></i></button>
                </div>
                <nav>
                    <button 
                        className={`button_tab ${viewing === 'currentWeather' ? 'button_tab-active' : ''}`} 
                        onClick={toggleCurrentWeatherView}>
                        Current Weather
                    </button>
                    <button 
                        className={`button_tab ${viewing === 'hourlyForecast' ? 'button_tab-active' : ''}`}
                        onClick={toggleForecastView}>
                        Hourly Forecast
                    </button>
                </nav>    
            </div>
            {pageContent()}
        </div>
    );
  }  