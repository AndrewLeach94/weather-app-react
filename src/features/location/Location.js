import { render } from '@testing-library/react';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchWeatherData } from './locationSlice';

export const Location = ({ weather }) => {
    const currentLocation = useSelector(state => state.location.currentLocation);
    const locationStatus = useSelector(state => state.location.status);
    const currentWeather = useSelector(state => state.location.currentWeather);
    const error = useSelector(state => state.location.error);
    const dispatch = useDispatch();
    const [typedLocation, setTypedLocation] = useState('');
    const [defaultToggle, setDefaultToggle] = useState('addDefault');
    
    const handleInputChange = (e) => {
        setTypedLocation(e.target.value);
    }

    const getUserGpsLocation = () => {
        return navigator.geolocation.getCurrentPosition(userGpsSuccessCallback, userGpsErrorCallback);
    }

    const userGpsSuccessCallback = (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        dispatch(fetchWeatherData({latitude: lat, longitude: lon}));
    }
    
    const userGpsErrorCallback = (error) => {
        console.error(error);
    }

    const fetchLocationCoordinates = async (locationRequest) => {
        try {
          const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationRequest}&limit=5&appid=62559260c941ebf6fd752e2570f6c760`, {mode: 'cors'});
          const locationData = await response.json();
          const filteredLocation = locationData.filter(locations => locations.name === locationRequest)[0];
          dispatch(fetchWeatherData({latitude: filteredLocation.lat, longitude: filteredLocation.lon}));
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
            setDefaultToggle('removeDefault');
        }
        else if (locationStatus === 'idle') {
            getUserGpsLocation();
        }
        // return () => {
        //     cleanup
        // };
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
        else if (locationStatus === 'completed') {
            return(
                <main>
                    <div className="location-container">
                        <div className="measurement-container">
                            <button id="metric" className="button_measurement" type="button">C</button>
                            <button id="imperial" className="button_measurement-selected" type="button">F</button>
                        </div>
                        <label>
                            <input className="input_location" placeholder="Choose Location" onChange={handleInputChange} />
                        </label>
                        <button className="submit_location" type="button" onClick={() => fetchLocationCoordinates(typedLocation)}>Update<i className="fas fa-arrow-right"></i></button>        
                    </div>    
                    <div className="current-weather-container-primary">
                        <div className="current-conditions">{currentWeather.weatherType}</div>
                        <div className="current-city">{currentWeather.name}</div>
                        <div className="current-temperature">{currentWeather.temperature}</div>
                    </div>
                    <div className="current-weather-container-secondary">
                        <span className="current-feel">{currentWeather.feelsLike}</span>
                        <span className="current-humidity">{currentWeather.humidity}</span>
                        <span className="current-wind">{currentWeather.windSpeed}</span>
                    </div>
                    <button onClick={() => toggleLocationDefault()}>{defaultToggle === 'addDefault' ? 'Save as Default Location' : 'Remove Default Location'}</button>
                    <p>Status: Data Received!</p>
                </main>
            )
        } 
        
        else {
            return(error);
        }
    }
        
  
    return (
        <div>            
            {pageContent()}
        </div>
    );
  }  