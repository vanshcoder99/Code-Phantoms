import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Loader from './components/Loader';
import PageTransition from './components/PageTransition';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RiskSimulator from './components/RiskSimulator';
import AIExplainer from './components/AIExplainer';
import LossProbabilityMeter from './components/LossProbabilityMeter';
import LearningSection from './components/LearningSection';
import Footer from './components/Footer';
import FloatingChatbot from './components/FloatingChatbot';
import SectionRibbon from './components/SectionRibbon';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import SimulationHistory from './pages/SimulationHistory';
import About from './pages/About';
import SIPCalculator from './pages/SIPCalculator';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FearQuiz from './pages/FearQuiz';
import SimulatorPage from './pages/SimulatorPage';
import './App.css';

// ScrollToTop component to reset scroll position on navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Protected Route - redirects to login if not authenticated
function ProtectedRoute({ children, darkMode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className={darkMode ? 'text-white' : 'text-quaternary'}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Guest Route - redirects to dashboard if already logged in
function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return children;
}

function Home({ darkMode, onStartSimulation }) {
  return (
    <>
      <HeroSection darkMode={darkMode} onStartSimulation={onStartSimulation} />
      <SectionRibbon variant="wave" darkMode={darkMode} />
      <RiskSimulator darkMode={darkMode} />
      <SectionRibbon variant="diagonal" darkMode={darkMode} />
      <LossProbabilityMeter darkMode={darkMode} riskLevel="medium" />
      <SectionRibbon variant="split" darkMode={darkMode} />
      <AIExplainer darkMode={darkMode} />
      <SectionRibbon variant="stagger" darkMode={darkMode} />
      <LearningSection darkMode={darkMode} />
    </>
  );
}

function AppContent() {
  const [darkMode, setDarkMode] = useState(true);
  const [showLoader, setShowLoader] = useState(() => {
    // Only show loader once per session
    return !sessionStorage.getItem('loaderShown');
  });
  const [appReady, setAppReady] = useState(!showLoader);

  const handleLoaderComplete = useCallback(() => {
    sessionStorage.setItem('loaderShown', 'true');
    setShowLoader(false);
    setAppReady(true);
  }, []);

  const handleStartSimulation = () => {
    document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {showLoader && <Loader onComplete={handleLoaderComplete} />}
      <div
        className={darkMode ? 'bg-quaternary text-white min-h-screen' : 'bg-white text-quaternary min-h-screen'}
        style={{
          opacity: appReady ? 1 : 0,
          transition: 'opacity 0.5s ease-out',
        }}
      >
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <PageTransition>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home darkMode={darkMode} onStartSimulation={handleStartSimulation} />} />
        <Route path="/about" element={<About darkMode={darkMode} />} />
        <Route path="/resources" element={<Resources darkMode={darkMode} />} />
        <Route path="/sip" element={<SIPCalculator darkMode={darkMode} />} />
        <Route path="/fear-quiz" element={<FearQuiz darkMode={darkMode} />} />
        <Route path="/simulator" element={<SimulatorPage darkMode={darkMode} />} />

        {/* Auth Routes (guest only) */}
        <Route path="/login" element={
          <GuestRoute><Login darkMode={darkMode} /></GuestRoute>
        } />
        <Route path="/signup" element={
          <GuestRoute><Signup darkMode={darkMode} /></GuestRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute darkMode={darkMode}><Dashboard darkMode={darkMode} /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute darkMode={darkMode}><Profile darkMode={darkMode} /></ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute darkMode={darkMode}><SimulationHistory darkMode={darkMode} /></ProtectedRoute>
        } />
        <Route path="/portfolio" element={
          <ProtectedRoute darkMode={darkMode}><Portfolio darkMode={darkMode} /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </PageTransition>
      <Footer darkMode={darkMode} />

      {/* Floating AI Chatbot - visible on every page */}
      <FloatingChatbot darkMode={darkMode} />
      </div>
    </>
  );
}

function AppWithRouting() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default AppWithRouting;
