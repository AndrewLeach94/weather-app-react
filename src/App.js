import React from 'react';
import { Weather } from './features/location/Weather'
import { Provider } from 'react-redux';
import store from './app/store';
import './App.css';

function App() {

  return (
    <Provider store={store}>
      <div className="App">
        <Weather />
      </div>
    </Provider>
  );
}

export default App;
