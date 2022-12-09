import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: 'Fort Worth',
  gpsLocation: '',
  currentWeather: [],
  forecasts: [],
  status: 'idle',
  error: null
}

export const fetchWeatherData = createAsyncThunk('', async (locationData) => {
  try {
      const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${locationData.latitude}&lon=${locationData.longitude}&units=${locationData.units}&appid=62559260c941ebf6fd752e2570f6c760`, {mode: 'cors'});
      const currentWeatherData = await currentWeatherResponse.json();
      const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${locationData.latitude}&lon=${locationData.longitude}&units=${locationData.units}&cnt=8&appid=62559260c941ebf6fd752e2570f6c760`, {mode: 'cors'});
      const forecastData = await forecastResponse.json();

      return convertWeatherData(currentWeatherData, forecastData);
  } catch(err) {
    console.error('There was an error fetching current weather data')
  }
})

const convertWeatherData = (currentWeatherData, forecastData) => {
  const formatTemperature = (temperature) => {
    //temperature needs to be rounded to closest whole number
    const roundTemperature = (() => Math.round(temperature))();
    return roundTemperature;
  };

  const formatFeelsLike = (feel) => {
    //temperature needs to be rounded to closest whole number
    const roundTemperature = (() => Math.round(feel))();
    return roundTemperature;
  };

  const formatWind = (wind) => {
    //temperature needs to be rounded to closest whole number
    const roundSpeed= (() => Math.round(wind))();
    return roundSpeed;
  }

  const formatHourlyForecast = (forecast) => {
    const formatData = () => {
      let formattedData = [];
      forecast.forEach((element, index) => {
        formattedData.push({
          temp: formatTemperature(element.main.temp),
          weatherType: element.weather[0].main,
          date: element.dt_txt,
          id: index
        });
      })
      return formattedData;
    }
    const formattedData = formatData(forecast);
    return formattedData;
  }


  const name =  currentWeatherData.name;
  const temp =  formatTemperature(currentWeatherData.main.temp);
  const feelsLike =  formatFeelsLike(currentWeatherData.main.feels_like);
  const humidity =  currentWeatherData.main.humidity;
  const weatherType =  currentWeatherData.weather[0].main;
  const windSpeed =  formatWind(currentWeatherData.wind.speed);
  const formattedForecastData = formatHourlyForecast(forecastData.list);

  return {
    currentWeather: {
      name: name, 
      temperature: temp, 
      feelsLike: feelsLike, 
      humidity: humidity, 
      weatherType: weatherType, 
      windSpeed: windSpeed
    },
    forecast: formattedForecastData
  };
}

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
    .addCase(fetchWeatherData.pending, (state, action) => {
      state.status = 'pending'
    })
    .addCase(fetchWeatherData.fulfilled, (state, action) => {
      state.status = 'completed'
      state.currentLocation = action.payload.currentWeather.name
      state.currentWeather = action.payload.currentWeather
      state.forecasts = action.payload.forecast
    })
    .addCase(fetchWeatherData.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    })
  }
});

export const currentLocation = (state) => state.weather.currentLocation;

export default locationSlice.reducer;
