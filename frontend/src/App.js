import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RiskSimulator from './components/RiskSimulator';
import AIExplainer from './components/AIExplainer';
import LossProbabilityMeter from './components/LossProbabilityMeter';
import LearningSection from './components/LearningSection';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import SimulationHistory from './pages/SimulationHistory';
import About from './pages/About';
import './App.css';

function Home({ darkMode, onStartSimulation }) {
  return (
    <>
      <HeroSection darkMode={darkMode} onStartSimulation={onStartSimulation} />
      <RiskSimulator darkMode={darkMode} />
      <LossProbabilityMeter darkMode={darkMode} riskLevel="medium" />
      <AIExplainer darkMode={darkMode} />
      <LearningSection darkMode={darkMode} />
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const handleStartSimulation = () => {
    document.getElementById('simulator').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Router>
      <div className={darkMode ? 'bg-quaternary text-white' : 'bg-white text-quaternary'}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} onStartSimulation={handleStartSimulation} />} />
          <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
          <Route path="/resources" element={<Resources darkMode={darkMode} />} />
          <Route path="/profile" element={<Profile darkMode={darkMode} />} />
          <Route path="/history" element={<SimulationHistory darkMode={darkMode} />} />
          <Route path="/about" element={<About darkMode={darkMode} />} />
        </Routes>
        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
}

export default App;
