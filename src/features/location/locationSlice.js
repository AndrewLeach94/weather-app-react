import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: 'Fort Worth',
  // defaultLocation: '',
  gpsLocation: '',
  currentWeather: [],
  status: 'idle',
  error: null
}

export const fetchWeatherData = createAsyncThunk('', async (locationData) => {
  console.log(locationData)
  try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${locationData.latitude}&lon=${locationData.longitude}&units=${locationData.units}&appid=62559260c941ebf6fd752e2570f6c760`, {mode: 'cors'});
      const weatherData = await response.json();
      return convertWeatherData(weatherData);
  } catch(err) {
    console.error('There was an error fetching current weather data')
  }
})

const convertWeatherData = (weatherData) => {
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

    const name =  weatherData.name;
    const temp =  formatTemperature(weatherData.main.temp);
    const feelsLike =  formatFeelsLike(weatherData.main.feels_like);
    const humidity =  weatherData.main.humidity;
    const weatherType =  weatherData.weather[0].main;
    const windSpeed =  formatWind(weatherData.wind.speed);

    return {name: name, temperature: temp, feelsLike: feelsLike, humidity: humidity, weatherType: weatherType, windSpeed: windSpeed};
}

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    // setLocationDefault: (state, action) => {
    //   state.defaultLocation = action.payload;
    // },
  },
  extraReducers(builder) {
    builder
    .addCase(fetchWeatherData.pending, (state, action) => {
      state.status = 'pending'
    })
    .addCase(fetchWeatherData.fulfilled, (state, action) => {
      state.status = 'completed'
      state.currentLocation = action.payload.name
      state.currentWeather = action.payload
    })
    .addCase(fetchWeatherData.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    })
  }
});

// Action creators are generated for each case reducer function
// export const { setLocationDefault } = locationSlice.actions
export const currentLocation = (state) => state.location.currentLocation;

export default locationSlice.reducer;
