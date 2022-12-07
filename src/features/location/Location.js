import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  submitLocation,
  fetchWeatherData,
  currentLocation,
} from './locationSlice';

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

    useEffect(() => {
        if (locationStatus === 'idle')
        dispatch(fetchWeatherData())
        // return () => {
        //     cleanup
        // };
    }, [location, dispatch, locationStatus]);

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
                    <div class="location-container">
                        <div class="measurement-container">
                            <button id="metric" class="button_measurement" type="button">C</button>
                            <button id="imperial" class="button_measurement-selected" type="button">F</button>
                        </div>
                        <label>
                            <input class="input_location" placeholder="Choose Location" onChange={handleInputChange} />
                        </label>
                        <button class="submit_location" type="button" onClick={() => dispatch(submitLocation(typedLocation))}>Update<i class="fas fa-arrow-right"></i></button>        
                    </div>    
                    <div class="current-weather-container-primary">
                        <span class="current-conditions">{currentWeather.weather[0].main}</span>
                        <span class="current-city">{currentWeather.name}</span>
                        <span class="current-temperature">{currentWeather.main.temp}</span>
                    </div>
                    <div class="current-weather-container-secondary">
                        <span class="current-feel">{currentWeather.main.feels_like}</span>
                        <span class="current-humidity">{currentWeather.main.humidity}</span>
                        <span class="current-wind">{currentWeather.wind.speed}</span>
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
  