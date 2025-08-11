import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Gallery from './components/Gallery/Gallery';
import ProjectPage from './components/ProjectPage/ProjectPage';
import SmokeBackground from './components/SmokeBackground/SmokeBackground';
import './App.css';

function App() {
  return (
    <Router>
      <SmokeBackground />
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/project/:id" element={<ProjectPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
