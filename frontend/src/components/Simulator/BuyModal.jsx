import React, { useState, useEffect, useRef } from 'react';
import { formatINR } from '../../utils/formatters';
import api from '../../api';
import { gsap } from 'gsap';
import { X, AlertTriangle, ShieldAlert, TrendingUp, Loader2 } from 'lucide-react';

export default function BuyModal({ asset, cashAvailable, sessionId, currentDay, investorProfile, onClose, onBuyComplete }) {
  const [amount, setAmount] = useState(1000);
  const [prediction, setPrediction] = useState(null);
  const [buying, setBuying] = useState(false);
  const [result, setResult] = useState(null);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  const minAmount = 100;
  const maxAmount = Math.floor(cashAvailable);

  // GSAP slide-up entrance
  useEffect(() => {
    if (overlayRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
    }
    if (modalRef.current) {
      gsap.fromTo(modalRef.current, { y: 120, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' });
    }
  }, []);

  // Fetch prediction
  useEffect(() => {
    const fetchPred = async () => {
      try {
        const res = await api.get(`/simulator/portfolio/${sessionId}/prediction/${asset.symbol}`);
        setPrediction(res.data);
      } catch { setPrediction(null); }
    };
    fetchPred();
  }, [asset.symbol, sessionId]);

  const estimatedShares = asset.current_price > 0 ? amount / asset.current_price : 0;
  const isHighRisk = asset.risk === 'HIGH';
  const profileMismatch = isHighRisk && (investorProfile === 'Conservative' || investorProfile === 'Moderate');

  const handleBuy = async () => {
    if (buying || amount < minAmount || amount > maxAmount) return;
    setBuying(true);
    try {
      const res = await api.post(`/simulator/portfolio/${sessionId}/buy`, {
        asset_symbol: asset.symbol,
        amount_inr: amount,
      });
      setResult(res.data);
    } catch (err) {
      setResult({ success: false, finbuddy_message: err.response?.data?.detail || 'Purchase failed.' });
    } finally {
      setBuying(false);
    }
  };

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, { y: 80, opacity: 0, duration: 0.2, onComplete: () => {
        if (result?.success) onBuyComplete();
        else onClose();
      }});
    } else {
      if (result?.success) onBuyComplete();
      else onClose();
    }
  };

  const signalColors = { BUY: '#10B981', SELL: '#EF4444', HOLD: '#F59E0B' };

  return (
    <div ref={overlayRef} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
    }} onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}>
      <div ref={modalRef} style={{
        width: '100%', maxWidth: '480px',
        background: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: '20px', padding: '28px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(59,130,246,0.08)',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>
            Buy {asset.full_name}
          </h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
            <X style={{ width: 22, height: 22 }} />
          </button>
        </div>

        {/* Result state */}
        {result ? (
          <div>
            <div style={{
              background: result.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${result.success ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              borderRadius: '16px', padding: '20px', marginBottom: '16px', textAlign: 'center',
            }}>
              <p style={{ color: result.success ? '#10B981' : '#EF4444', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>
                {result.success ? '✅ Purchase Successful!' : '❌ Purchase Failed'}
              </p>
              {result.success && (
                <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0 }}>
                  Bought {result.shares_bought?.toFixed(4)} shares at {formatINR(result.price, 2)} each
                </p>
              )}
            </div>
            {/* FinBuddy bubble */}
            {result.finbuddy_message && (
              <div style={{
                background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
                borderRadius: '16px', padding: '14px 18px', position: 'relative',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6', position: 'absolute', top: -4, left: 14 }} />
                <p style={{ color: '#CBD5E1', lineHeight: 1.7, margin: 0, fontSize: '0.9rem' }}>
                  {result.finbuddy_message}
                </p>
              </div>
            )}
            <button onClick={handleClose} style={{
              width: '100%', marginTop: '16px', padding: '14px', borderRadius: '14px', border: 'none',
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff', fontWeight: 700,
              fontSize: '1rem', cursor: 'pointer',
            }}>Done</button>
          </div>
        ) : (
          <>
            {/* Price Info */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', padding: '14px 16px',
              background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '16px',
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Price</span>
                <p style={{ color: '#fff', fontWeight: 800, margin: 0 }}>{formatINR(asset.current_price, 2)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>Risk</span>
                <p style={{ color: asset.risk === 'HIGH' ? '#EF4444' : asset.risk === 'MEDIUM' ? '#F59E0B' : '#10B981', fontWeight: 800, margin: 0 }}>
                  {asset.risk}
                </p>
              </div>
            </div>

            {/* Amount Slider */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>Amount</span>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>{formatINR(amount)}</span>
              </div>
              <input
                type="range" min={minAmount} max={maxAmount} step={100} value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#3B82F6' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '0.7rem', color: '#475569' }}>{formatINR(minAmount)}</span>
                <span style={{ fontSize: '0.7rem', color: '#475569' }}>{formatINR(maxAmount)}</span>
              </div>
            </div>

            {/* Estimated Shares */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', padding: '12px 16px',
              background: 'rgba(59,130,246,0.06)', borderRadius: '10px', marginBottom: '16px',
            }}>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Estimated Shares</span>
              <span style={{ color: '#60A5FA', fontWeight: 800 }}>{estimatedShares.toFixed(4)}</span>
            </div>

            {/* Prediction Panel */}
            {prediction && (
              <div style={{
                padding: '14px 16px', borderRadius: '12px',
                background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.1)',
                marginBottom: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <TrendingUp style={{ width: 14, height: 14, color: '#10B981' }} />
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>AI Prediction</span>
                  <span style={{
                    fontSize: '0.65rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 700,
                    background: `${signalColors[prediction.signal]}20`, color: signalColors[prediction.signal],
                  }}>{prediction.signal}</span>
                  <span style={{
                    fontSize: '0.65rem', padding: '2px 8px', borderRadius: '6px', fontWeight: 700,
                    background: 'rgba(255,255,255,0.05)', color: '#94A3B8',
                  }}>{prediction.confidence}</span>
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.85rem', margin: 0 }}>
                  7-day: <strong style={{ color: prediction.expected_change_7d?.startsWith('+') ? '#10B981' : '#EF4444' }}>{prediction.expected_change_7d}</strong>
                  {' · '}
                  30-day: <strong style={{ color: prediction.expected_change_30d?.startsWith('+') ? '#10B981' : '#EF4444' }}>{prediction.expected_change_30d}</strong>
                </p>
              </div>
            )}

            {/* Risk Warning */}
            {isHighRisk && (
              <div style={{
                padding: '12px 16px', borderRadius: '10px', marginBottom: '12px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <AlertTriangle style={{ width: 18, height: 18, color: '#EF4444', flexShrink: 0 }} />
                <p style={{ color: '#FCA5A5', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>
                  High risk asset — value can drop 15-60% in a single day. Only invest what you can afford to lose.
                </p>
              </div>
            )}

            {/* Profile Mismatch */}
            {profileMismatch && (
              <div style={{
                padding: '12px 16px', borderRadius: '10px', marginBottom: '12px',
                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <ShieldAlert style={{ width: 18, height: 18, color: '#F59E0B', flexShrink: 0 }} />
                <p style={{ color: '#FDE68A', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>
                  Your profile is <strong>{investorProfile}</strong> — this asset is riskier than recommended. Consider NIFTY_50_INDEX instead.
                </p>
              </div>
            )}

            {/* Confirm Button */}
            <button
              onClick={handleBuy}
              disabled={buying || amount < minAmount || amount > maxAmount}
              style={{
                width: '100%', padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                background: buying ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg, #2563EB, #7C3AED)',
                color: '#fff', fontWeight: 800, fontSize: '1.05rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: amount < minAmount ? 0.4 : 1,
              }}
            >
              {buying ? <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> Buying...</> : `Confirm Buy · ${formatINR(amount)}`}
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
