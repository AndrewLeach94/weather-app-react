import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import locationReducer from '../features/location/locationSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    location: locationReducer,
  },
});