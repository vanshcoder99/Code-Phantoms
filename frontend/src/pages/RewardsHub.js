import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import SpinWheel from '../components/Gamification/SpinWheel';
import PredictionCard from '../components/Gamification/PredictionCard';
import StreakBanner from '../components/Gamification/StreakBanner';
import { Gift, Crown, Loader2, RefreshCw } from 'lucide-react';

export default function RewardsHub({ darkMode = true }) {
  const [profile, setProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [assets, setAssets] = useState([]);
  const [predictions, setPredictions] = useState({ pending: [], resolved: [], pending_count: 0 });
  const [spinHistory, setSpinHistory] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spinLoading, setSpinLoading] = useState(false);
  const [predictLoading, setPredictLoading] = useState(false);
  const [loginClaimed, setLoginClaimed] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [error, setError] = useState(null);

  // ── Load all data ──
  const loadAll = useCallback(async () => {
    try {
      const [profileRes, slotsRes, assetsRes, predsRes, histRes, lbRes] = await Promise.all([
        api.get('/api/v1/gamification/profile'),
        api.get('/api/v1/gamification/spin-slots'),
        api.get('/api/v1/gamification/assets'),
        api.get('/api/v1/gamification/predictions'),
        api.get('/api/v1/gamification/spin-history'),
        api.get('/api/v1/gamification/leaderboard'),
      ]);
      setProfile(profileRes.data);
      setSlots(slotsRes.data);
      setAssets(assetsRes.data);
      setPredictions(predsRes.data);
      setSpinHistory(histRes.data);
      setLeaderboard(lbRes.data);
      setError(null);
    } catch (err) {
      console.error('Failed to load gamification data:', err);
      setError('Failed to load Rewards Hub. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Claim daily login on mount ──
  const claimDailyLogin = useCallback(async () => {
    try {
      const res = await api.post('/api/v1/gamification/daily-login');
      setLoginMessage(res.data.message);
      setLoginClaimed(true);
      // Auto-dismiss after 4 seconds
      setTimeout(() => setLoginMessage(''), 4000);
    } catch (err) {
      console.error('Daily login error:', err);
    }
  }, []);

  useEffect(() => {
    loadAll().then(() => claimDailyLogin());
  }, [loadAll, claimDailyLogin]);

  // ── Spin handler ──
  const handleSpin = async () => {
    setSpinLoading(true);
    try {
      const res = await api.post('/api/v1/gamification/spin');
      // Refresh profile after spin
      setTimeout(async () => {
        const profileRes = await api.get('/api/v1/gamification/profile');
        setProfile(profileRes.data);
        const histRes = await api.get('/api/v1/gamification/spin-history');
        setSpinHistory(histRes.data);
      }, 4500); // After spin animation
      return res.data;
    } catch (err) {
      console.error('Spin error:', err);
      return { already_spun: true };
    } finally {
      setSpinLoading(false);
    }
  };

  // ── Prediction handler ──
  const handlePredict = async (symbol, direction) => {
    setPredictLoading(true);
    try {
      await api.post('/api/v1/gamification/predict', {
        asset_symbol: symbol,
        direction,
      });
      // Refresh predictions and assets
      const [predRes, assetsRes, profileRes] = await Promise.all([
        api.get('/api/v1/gamification/predictions'),
        api.get('/api/v1/gamification/assets'),
        api.get('/api/v1/gamification/profile'),
      ]);
      setPredictions(predRes.data);
      setAssets(assetsRes.data);
      setProfile(profileRes.data);
    } catch (err) {
      console.error('Prediction error:', err);
      alert(err.response?.data?.detail || 'Failed to make prediction');
    } finally {
      setPredictLoading(false);
    }
  };

  // ── Resolve predictions handler ──
  const handleResolve = async () => {
    try {
      const res = await api.post('/api/v1/gamification/resolve-predictions');
      // Refresh all
      const [predRes, profileRes] = await Promise.all([
        api.get('/api/v1/gamification/predictions'),
        api.get('/api/v1/gamification/profile'),
      ]);
      setPredictions(predRes.data);
      setProfile(profileRes.data);

      if (res.data.resolved?.length > 0) {
        setLoginMessage(res.data.message);
        setTimeout(() => setLoginMessage(''), 4000);
      }
    } catch (err) {
      console.error('Resolve error:', err);
    }
  };

  // ── Loading state ──
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
        <Loader2 style={{ width: 48, height: 48, color: '#7C3AED', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#94A3B8', fontSize: '1.1rem' }}>Loading Rewards Hub...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error state ──
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
        <Gift style={{ width: 48, height: 48, color: '#EF4444' }} />
        <p style={{ color: '#EF4444', fontSize: '1.1rem' }}>{error}</p>
        <button
          onClick={() => { setLoading(true); loadAll(); }}
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
    <div style={{
      minHeight: '100vh',
      background: '#050A18',
      paddingTop: '80px',
      paddingBottom: '60px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* ── Page Header ── */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
          animation: 'fadeInDown 0.6s ease-out forwards',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <Gift style={{ width: 36, height: 36, color: '#A78BFA' }} />
            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #3B82F6, #A78BFA, #F59E0B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Rewards Hub
            </h1>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Spin. Predict. Earn. Level up your investing journey!
          </p>
        </div>

        {/* ── Login Toast ── */}
        {loginMessage && (
          <div style={{
            maxWidth: '500px',
            margin: '0 auto 24px',
            padding: '14px 20px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(234,88,12,0.1), rgba(234,179,8,0.1))',
            border: '1px solid rgba(234,88,12,0.2)',
            textAlign: 'center',
            color: '#FCD34D',
            fontWeight: 600,
            fontSize: '0.95rem',
            animation: 'slideInDown 0.4s ease-out forwards',
          }}>
            {loginMessage}
          </div>
        )}

        {/* ── Main Layout: 3-column on desktop ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 320px) 1fr minmax(280px, 340px)',
          gap: '24px',
          alignItems: 'start',
        }}
        className="rewards-grid"
        >
          {/* ── LEFT: Stats ── */}
          <div style={{ animation: 'fadeInLeft 0.5s ease-out 0.1s both' }}>
            <StreakBanner profile={profile} />
          </div>

          {/* ── CENTER: Spin Wheel ── */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'fadeInUp 0.5s ease-out 0.2s both',
          }}>
            <div style={{
              padding: '30px',
              borderRadius: '24px',
              background: 'rgba(19,27,46,0.5)',
              border: '1px solid rgba(37,99,235,0.1)',
              backdropFilter: 'blur(12px)',
              width: '100%',
              maxWidth: '420px',
            }}>
              <h3 style={{
                textAlign: 'center',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#F1F5F9',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}>
                🎡 Smart Spin Engine
              </h3>
              <SpinWheel
                slots={slots}
                onSpin={handleSpin}
                canSpin={profile?.can_spin_today}
                lastReward={spinHistory[0]?.reward_label}
                loading={spinLoading}
              />
            </div>

            {/* Spin History */}
            {spinHistory.length > 0 && (
              <div style={{
                marginTop: '16px',
                width: '100%',
                maxWidth: '420px',
                padding: '16px',
                borderRadius: '14px',
                background: 'rgba(19,27,46,0.4)',
                border: '1px solid rgba(37,99,235,0.08)',
              }}>
                <h4 style={{
                  fontSize: '0.75rem',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '10px',
                }}>
                  Recent Spins
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {spinHistory.slice(0, 5).map((spin, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: 'rgba(15,23,42,0.4)',
                      fontSize: '0.8rem',
                    }}>
                      <span style={{ color: '#94A3B8' }}>{spin.spin_date}</span>
                      <span style={{ color: '#CBD5E1', fontWeight: 600 }}>{spin.reward_label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Predictions ── */}
          <div style={{
            padding: '20px',
            borderRadius: '20px',
            background: 'rgba(19,27,46,0.5)',
            border: '1px solid rgba(37,99,235,0.1)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeInRight 0.5s ease-out 0.3s both',
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#F1F5F9',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              🎯 Predictive Loot
            </h3>
            <PredictionCard
              assets={assets}
              pendingPredictions={predictions.pending}
              resolvedPredictions={predictions.resolved}
              pendingCount={predictions.pending_count}
              onPredict={handlePredict}
              onResolve={handleResolve}
              loading={predictLoading}
            />
          </div>
        </div>

        {/* ── Leaderboard ── */}
        {leaderboard.length > 0 && (
          <div style={{
            marginTop: '40px',
            padding: '24px',
            borderRadius: '20px',
            background: 'rgba(19,27,46,0.5)',
            border: '1px solid rgba(37,99,235,0.1)',
            backdropFilter: 'blur(12px)',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto',
            animation: 'fadeInUp 0.5s ease-out 0.4s both',
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#F1F5F9',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Crown style={{ width: 22, height: 22, color: '#FBBF24' }} />
              Leaderboard
              <button
                onClick={loadAll}
                style={{
                  marginLeft: 'auto',
                  padding: '6px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'rgba(37,99,235,0.1)',
                  color: '#64748B',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw style={{ width: 14, height: 14 }} />
              </button>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {leaderboard.map((entry) => (
                <div key={entry.rank} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: entry.rank <= 3
                    ? `rgba(${entry.rank === 1 ? '234,179,8' : entry.rank === 2 ? '148,163,184' : '180,83,9'},0.08)`
                    : 'rgba(15,23,42,0.4)',
                  border: entry.rank <= 3
                    ? `1px solid rgba(${entry.rank === 1 ? '234,179,8' : entry.rank === 2 ? '148,163,184' : '180,83,9'},0.2)`
                    : '1px solid transparent',
                }}>
                  {/* Rank */}
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: entry.rank <= 3 ? '1.2rem' : '0.8rem',
                    marginRight: '14px',
                    color: entry.rank === 1 ? '#FBBF24' : entry.rank === 2 ? '#94A3B8' : entry.rank === 3 ? '#D97706' : '#64748B',
                  }}>
                    {entry.rank <= 3
                      ? ['🥇', '🥈', '🥉'][entry.rank - 1]
                      : `#${entry.rank}`
                    }
                  </div>
                  {/* Name */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F1F5F9' }}>
                      {entry.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                      Level {entry.level} • {entry.streak_days} day streak
                    </div>
                  </div>
                  {/* XP */}
                  <div style={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: '#3B82F6',
                  }}>
                    {entry.xp.toLocaleString()} XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Responsive + Animation Styles ── */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .rewards-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .rewards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
