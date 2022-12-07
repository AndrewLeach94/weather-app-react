import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: 'Fort Worth',
  gpsLocation: '',
  currentWeather: [],
  status: 'idle',
  error: null
}

export const fetchWeatherData = createAsyncThunk('', async (locationData) => {
  try {
    console.log(locationData);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${locationData.latitude}&lon=${locationData.longitude}&appid=62559260c941ebf6fd752e2570f6c760`, {mode: 'cors'});
    const weatherData = await response.json();
    return weatherData;
  } catch(err) {
    console.error('There was an error fetching current weather data')
  }

})

export const getUserLocation = createAsyncThunk('', async (state) => {
  try {
  } catch(err) {
    console.error("There was an error fetching user's GPS location");
  }

})


export const locationSlice = createSlice({
  name: 'location',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    submitLocation: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.currentLocation = action.payload;
    },
  },
  extraReducers(builder) {
    builder
    .addCase(fetchWeatherData.pending, (state, action) => {
      state.status = 'pending'
    })
    .addCase(fetchWeatherData.fulfilled, (state, action) => {
      state.status = 'completed'
      state.currentWeather = action.payload
    })
    .addCase(fetchWeatherData.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    })
  }
});

// Action creators are generated for each case reducer function
export const { submitLocation } = locationSlice.actions
export const currentLocation = (state) => state.location.currentLocation;

export default locationSlice.reducer;
