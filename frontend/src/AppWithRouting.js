import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import RiskSimulator from './components/RiskSimulator';
import LossProbabilityMeter from './components/LossProbabilityMeter';
import AIExplainer from './components/AIExplainer';
import LearningSection from './components/LearningSection';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import SIPCalculator from './pages/SIPCalculator';
import Resources from './pages/Resources';
import Community from './pages/Community';
import SimulatorDetails from './pages/SimulatorDetails';
import './App.css';

function Home({ darkMode }) {
  const handleStartSimulation = () => {
    document.getElementById('simulator').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <HeroSection darkMode={darkMode} onStartSimulation={handleStartSimulation} />
      <RiskSimulator darkMode={darkMode} />
      <LossProbabilityMeter darkMode={darkMode} riskLevel="medium" />
      <AIExplainer darkMode={darkMode} />
      <LearningSection darkMode={darkMode} />
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <Router>
      <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home darkMode={darkMode} />} />

          {/* Main Pages */}
          <Route path="/dashboard" element={<Dashboard darkMode={darkMode} />} />
          <Route path="/portfolio" element={<Portfolio darkMode={darkMode} />} />
          <Route path="/sip-calculator" element={<SIPCalculator darkMode={darkMode} />} />
          <Route path="/resources" element={<Resources darkMode={darkMode} />} />
          <Route path="/community" element={<Community darkMode={darkMode} />} />

          {/* Nested Routes */}
          <Route path="/simulator/*" element={
            <Routes>
              <Route path="/" element={<RiskSimulator darkMode={darkMode} />} />
              <Route path="details" element={<SimulatorDetails darkMode={darkMode} />} />
            </Routes>
          } />

          {/* 404 Page */}
          <Route path="*" element={
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className={`text-xl mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Page not found</p>
                <a href="/" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition">
                  Go Home
                </a>
              </div>
            </div>
          } />
        </Routes>

        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
}

export default App;
