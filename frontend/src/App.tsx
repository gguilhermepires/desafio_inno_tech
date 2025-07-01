import React from 'react';
import ItemList from './components/ItemList';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* ItemList será o conteúdo principal rolável */}
        {/* Wrap the application with Router */}
        <Router>
          <Routes>
            {/* Define a route for the ItemList component */}
            <Route path="/" element={<ItemList />} />
            <Route path="/home" element={<ItemList />} />
            {/* You can add more routes here later, e.g., <Route path="/about" element={<AboutPage />} /> */}
          </Routes>
        </Router>
      </header>
      {/* A área de input será gerenciada dentro de ItemList, mas estilizada para ser fixa */}
    </div>
  );
}

export default App;
