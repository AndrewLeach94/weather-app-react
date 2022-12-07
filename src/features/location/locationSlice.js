import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: 'Fort Worth',
  currentWeather: [],
  status: 'idle',
  error: null
}

export const fetchWeatherData = createAsyncThunk('', async (state) => {
  try {
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=62559260c941ebf6fd752e2570f6c760', {mode: 'cors'});
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
    // state.currentWeather = weatherData;
    // console.log(state.currentWeather)
  } catch(err) {
    console.error('FUOOKIN WHOOPS')
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
    // updateCurrentWeather: (state, action) => {
    //   state.currentWeather = action.payload;
    // },
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
