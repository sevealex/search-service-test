import { useState } from 'react';

import './App.css';
import SearchInput from './app/components/searchInput';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="searchBox flex">
            <SearchInput placeholder='Enter service, salon or business' typeList='services'/>
            <SearchInput placeholder='Your location' typeList='locations'/>
        </div>
      </header>
    </div>
  );
}

export default App;
