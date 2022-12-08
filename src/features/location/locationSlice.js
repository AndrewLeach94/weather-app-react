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
  try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${locationData.latitude}&lon=${locationData.longitude}&appid=62559260c941ebf6fd752e2570f6c760`, {mode: 'cors'});
      const weatherData = await response.json();
      console.log(weatherData)
      return weatherData;
  } catch(err) {
    console.error('There was an error fetching current weather data')
  }

})


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
