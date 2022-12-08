import React from 'react';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import { Location } from './features/location/Location'
import './App.css';

function App() {
  return (
    <div className="App">
      <Location />
    </div>
  );
}

export default App;
