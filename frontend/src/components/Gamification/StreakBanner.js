import React from 'react';
import { Flame, Zap, Trophy, Target } from 'lucide-react';

export default function StreakBanner({ profile = {} }) {
  const {
    xp = 0,
    level = 1,
    streak_days = 0,
    longest_streak = 0,
    virtual_coins = 0,
    active_multiplier = 1,
    progress_pct = 0,
    xp_in_level = 0,
    xp_needed = 100,
    total_predictions = 0,
    correct_predictions = 0,
    prediction_accuracy = 0,
    total_spins = 0,
  } = profile;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Level + XP Bar */}
      <div style={{
        padding: '20px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))',
        border: '1px solid rgba(37,99,235,0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              fontWeight: 900,
              color: '#fff',
              boxShadow: '0 4px 15px rgba(37,99,235,0.4)',
            }}>
              {level}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Level</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F1F5F9' }}>{xp.toLocaleString()} XP</div>
            </div>
          </div>
          {active_multiplier > 1 && (
            <div style={{
              padding: '6px 12px',
              borderRadius: '10px',
              background: 'rgba(124,58,237,0.2)',
              border: '1px solid rgba(124,58,237,0.3)',
              color: '#A78BFA',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              animation: 'multiplierPulse 1.5s ease-in-out infinite',
            }}>
              <Zap style={{ width: 14, height: 14 }} />
              {active_multiplier}× Active
            </div>
          )}
        </div>

        {/* XP Progress Bar */}
        <div style={{
          height: 10,
          borderRadius: 5,
          background: 'rgba(15,23,42,0.6)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            height: '100%',
            width: `${progress_pct}%`,
            borderRadius: 5,
            background: 'linear-gradient(90deg, #2563EB, #7C3AED)',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 10px rgba(37,99,235,0.5)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{xp_in_level} / {xp_needed} XP to Level {level + 1}</span>
          <span style={{ fontSize: '0.7rem', color: '#64748B' }}>{progress_pct}%</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px',
      }}>
        {/* Streak */}
        <div style={{
          padding: '16px',
          borderRadius: '14px',
          background: 'rgba(234,88,12,0.08)',
          border: '1px solid rgba(234,88,12,0.15)',
          textAlign: 'center',
        }}>
          <Flame style={{ width: 24, height: 24, color: '#F97316', margin: '0 auto 6px' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FB923C' }}>{streak_days}</div>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Day Streak
          </div>
          <div style={{ fontSize: '0.65rem', color: '#64748B', marginTop: '4px' }}>
            Best: {longest_streak} days
          </div>
        </div>

        {/* Coins */}
        <div style={{
          padding: '16px',
          borderRadius: '14px',
          background: 'rgba(234,179,8,0.08)',
          border: '1px solid rgba(234,179,8,0.15)',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '6px' }}>💰</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FBBF24' }}>{virtual_coins}</div>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Coins
          </div>
        </div>

        {/* Accuracy */}
        <div style={{
          padding: '16px',
          borderRadius: '14px',
          background: 'rgba(5,150,105,0.08)',
          border: '1px solid rgba(5,150,105,0.15)',
          textAlign: 'center',
        }}>
          <Target style={{ width: 24, height: 24, color: '#10B981', margin: '0 auto 6px' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>{prediction_accuracy}%</div>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Accuracy
          </div>
          <div style={{ fontSize: '0.65rem', color: '#64748B', marginTop: '4px' }}>
            {correct_predictions}/{total_predictions} correct
          </div>
        </div>

        {/* Total Spins */}
        <div style={{
          padding: '16px',
          borderRadius: '14px',
          background: 'rgba(124,58,237,0.08)',
          border: '1px solid rgba(124,58,237,0.15)',
          textAlign: 'center',
        }}>
          <Trophy style={{ width: 24, height: 24, color: '#A78BFA', margin: '0 auto 6px' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#A78BFA' }}>{total_spins}</div>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Spins
          </div>
        </div>
      </div>

      <style>{`
        @keyframes multiplierPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.2); }
          50% { box-shadow: 0 0 12px 4px rgba(124,58,237,0.3); }
        }
      `}</style>
    </div>
  );
}
