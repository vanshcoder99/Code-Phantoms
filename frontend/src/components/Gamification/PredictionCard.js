import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Check, X, Clock, Lock } from 'lucide-react';

const RISK_COLORS = {
  LOW: '#059669',
  MEDIUM: '#D97706',
  HIGH: '#DC2626',
};

const TYPE_ICONS = {
  STOCK: '📈',
  MUTUAL_FUND: '📊',
  CRYPTO: '₿',
  GOLD: '🪙',
};

export default function PredictionCard({
  assets = [],
  pendingPredictions = [],
  resolvedPredictions = [],
  onPredict,
  onResolve,
  loading,
  pendingCount = 0,
}) {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [resolving, setResolving] = useState(false);

  const handlePredict = async (symbol, direction) => {
    if (loading) return;
    await onPredict(symbol, direction);
    setSelectedAsset(null);
  };

  const handleResolve = async () => {
    setResolving(true);
    await onResolve();
    setResolving(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Resolve Button */}
      {pendingCount > 0 && (
        <button
          onClick={handleResolve}
          disabled={resolving}
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: '#fff',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(5,150,105,0.3)',
          }}
        >
          <Clock style={{ width: 16, height: 16 }} />
          {resolving ? 'Resolving...' : `Resolve ${pendingCount} Pending Prediction${pendingCount > 1 ? 's' : ''}`}
        </button>
      )}

      {/* Pending Predictions */}
      {pendingPredictions.length > 0 && (
        <div>
          <h4 style={{ color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
            ⏳ Pending Predictions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pendingPredictions.map((pred) => (
              <div key={pred.id} style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(37,99,235,0.06)',
                border: '1px solid rgba(37,99,235,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: 'pendingPulse 2s ease-in-out infinite',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{TYPE_ICONS[assets.find(a => a.symbol === pred.asset_symbol)?.type] || '📊'}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F1F5F9' }}>{pred.asset_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>₹{pred.predicted_price?.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: pred.prediction === 'UP' ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.15)',
                  color: pred.prediction === 'UP' ? '#10B981' : '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  {pred.prediction === 'UP' ? <TrendingUp style={{ width: 14, height: 14 }} /> : <TrendingDown style={{ width: 14, height: 14 }} />}
                  {pred.prediction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolved Predictions */}
      {resolvedPredictions.length > 0 && (
        <div>
          <h4 style={{ color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
            📋 Recent Results
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {resolvedPredictions.slice(0, 5).map((pred) => (
              <div key={pred.id} style={{
                padding: '10px 14px',
                borderRadius: '10px',
                background: pred.is_correct ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.06)',
                border: `1px solid ${pred.is_correct ? 'rgba(5,150,105,0.15)' : 'rgba(220,38,38,0.1)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {pred.is_correct
                    ? <Check style={{ width: 16, height: 16, color: '#10B981' }} />
                    : <X style={{ width: 16, height: 16, color: '#EF4444' }} />
                  }
                  <span style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>{pred.asset_name}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: pred.prediction === 'UP' ? '#10B981' : '#EF4444',
                    fontWeight: 600,
                  }}>
                    {pred.prediction === 'UP' ? '▲' : '▼'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {pred.xp_earned > 0 && (
                    <span style={{ fontSize: '0.75rem', color: '#3B82F6', fontWeight: 600 }}>+{pred.xp_earned} XP</span>
                  )}
                  {pred.coins_earned > 0 && (
                    <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>+{pred.coins_earned} 💰</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Asset Selection Grid */}
      <div>
        <h4 style={{ color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
          📊 Make a Prediction {pendingCount >= 3 && <span style={{ color: '#EF4444' }}>(Max 3 reached)</span>}
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '10px',
        }}>
          {assets.map((asset) => {
            const disabled = asset.already_predicted || pendingCount >= 3;
            const isSelected = selectedAsset === asset.symbol;
            return (
              <div key={asset.symbol}>
                <button
                  onClick={() => !disabled && setSelectedAsset(isSelected ? null : asset.symbol)}
                  disabled={disabled}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: isSelected
                      ? '2px solid #3B82F6'
                      : '1px solid rgba(37,99,235,0.1)',
                    background: disabled
                      ? 'rgba(100,116,139,0.1)'
                      : isSelected
                        ? 'rgba(37,99,235,0.1)'
                        : 'rgba(19,27,46,0.6)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {disabled && asset.already_predicted && (
                    <Lock style={{ position: 'absolute', top: 8, right: 8, width: 12, height: 12, color: '#64748B' }} />
                  )}
                  <div style={{ fontSize: '1.1rem', marginBottom: '4px' }}>
                    {TYPE_ICONS[asset.type] || '📊'}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: disabled ? '#64748B' : '#F1F5F9',
                    marginBottom: '2px',
                  }}>
                    {asset.symbol.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    ₹{asset.current_price?.toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: asset.change_pct >= 0 ? '#10B981' : '#EF4444',
                    marginTop: '2px',
                  }}>
                    {asset.change_pct >= 0 ? '+' : ''}{asset.change_pct}%
                  </div>
                  <div style={{
                    marginTop: '4px',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: RISK_COLORS[asset.risk],
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {asset.risk} Risk
                  </div>
                </button>

                {/* UP/DOWN buttons appear when selected */}
                {isSelected && (
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    marginTop: '6px',
                    animation: 'rewardReveal 0.3s ease-out forwards',
                  }}>
                    <button
                      onClick={() => handlePredict(asset.symbol, 'UP')}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(5,150,105,0.2)',
                        color: '#10B981',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <TrendingUp style={{ width: 14, height: 14 }} /> UP
                    </button>
                    <button
                      onClick={() => handlePredict(asset.symbol, 'DOWN')}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(220,38,38,0.2)',
                        color: '#EF4444',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'all 0.2s',
                      }}
                    >
                      <TrendingDown style={{ width: 14, height: 14 }} /> DOWN
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pendingPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.1); }
          50% { box-shadow: 0 0 12px 2px rgba(37,99,235,0.15); }
        }
        @keyframes rewardReveal {
          0% { opacity: 0; transform: scale(0.8) translateY(5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
