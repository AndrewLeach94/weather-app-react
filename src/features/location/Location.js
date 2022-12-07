import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { submitLocation, fetchWeatherData, currentLocation } from './locationSlice';

export const Location = ({ weather }) => {
    const location = useSelector(currentLocation);
    const locationStatus = useSelector(state => state.location.status);
    const currentWeather = useSelector(state => state.location.currentWeather);
    const error = useSelector(state => state.location.error);
    const dispatch = useDispatch();
    const [typedLocation, setTypedLocation] = useState('');
    
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

    const updateCurrentWeather = () => {
        dispatch(submitLocation(typedLocation));
        dispatch(fetchWeatherData());
    }

    useEffect(() => {
        if (locationStatus === 'idle') {
            getUserGpsLocation();
        }
        // dispatch(fetchWeatherData())
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
                    <h1>Status: Data Received!</h1>
                    <h2>{location}</h2>
                    <div className="location-container">
                        <div className="measurement-container">
                            <button id="metric" className="button_measurement" type="button">C</button>
                            <button id="imperial" className="button_measurement-selected" type="button">F</button>
                        </div>
                        <label>
                            <input className="input_location" placeholder="Choose Location" onChange={handleInputChange} />
                        </label>
                        <button className="submit_location" type="button" onClick={updateCurrentWeather}>Update<i className="fas fa-arrow-right"></i></button>        
                    </div>    
                    <div className="current-weather-container-primary">
                        <span className="current-conditions">{currentWeather.weather[0].main}</span>
                        <span className="current-city">{currentWeather.name}</span>
                        <span className="current-temperature">{currentWeather.main.temp}</span>
                    </div>
                    <div className="current-weather-container-secondary">
                        <span className="current-feel">{currentWeather.main.feels_like}</span>
                        <span className="current-humidity">{currentWeather.main.humidity}</span>
                        <span className="current-wind">{currentWeather.wind.speed}</span>
                    </div>
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