import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import SimulatorDashboard from '../components/Simulator/SimulatorDashboard';
import { Swords, Loader2 } from 'lucide-react';

const SESSION_KEY = 'investsafe_arena_session';

export default function SimulatorPage({ darkMode = true }) {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const createNewSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/simulator/portfolio/create');
      const sid = res.data.session_id;
      localStorage.setItem(SESSION_KEY, sid);
      setSessionId(sid);
    } catch (err) {
      console.error('Failed to create arena session:', err);
      setError('Could not start Arena. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const validateSession = useCallback(async (sid) => {
    try {
      const res = await api.get(`/simulator/portfolio/${sid}`);
      if (res.data && res.data.session_id) {
        setSessionId(sid);
        setLoading(false);
        return;
      }
    } catch {
      // Session expired or invalid — create new one
      localStorage.removeItem(SESSION_KEY);
    }
    await createNewSession();
  }, [createNewSession]);

  useEffect(() => {
    const savedSession = localStorage.getItem(SESSION_KEY);
    if (savedSession) {
      validateSession(savedSession);
    } else {
      createNewSession();
    }
  }, [validateSession, createNewSession]);

  const handleReset = async () => {
    localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
    await createNewSession();
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050A18',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <Loader2
          style={{ width: 48, height: 48, color: '#3B82F6', animation: 'spin 1s linear infinite' }}
        />
        <p style={{ color: '#94A3B8', fontSize: '1.1rem' }}>
          Preparing your Arena...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050A18',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <Swords style={{ width: 48, height: 48, color: '#EF4444' }} />
        <p style={{ color: '#EF4444', fontSize: '1.1rem' }}>{error}</p>
        <button
          onClick={createNewSession}
          style={{
            padding: '12px 28px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050A18', paddingTop: '70px' }}>
      <SimulatorDashboard
        sessionId={sessionId}
        darkMode={darkMode}
        onReset={handleReset}
      />
    </div>
  );
}
