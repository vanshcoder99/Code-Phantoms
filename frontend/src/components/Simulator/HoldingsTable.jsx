import React, { useState } from 'react';
import { formatINR, formatPct } from '../../utils/formatters';
import api from '../../api';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

export default function HoldingsTable({ holdings, sessionId, onSellComplete }) {
  const [selling, setSelling] = useState(null);
  const [sellResult, setSellResult] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const holdingsList = Object.values(holdings || {});

  const handleSell = async (symbol, shares) => {
    if (selling) return;
    const confirmed = window.confirm(`Sell all ${shares.toFixed(4)} shares of ${symbol}?`);
    if (!confirmed) return;

    setSelling(symbol);
    setSellResult(null);
    try {
      const res = await api.post(`/simulator/portfolio/${sessionId}/sell`, {
        asset_symbol: symbol,
        shares: shares,
      });
      setSellResult({ symbol, ...res.data });
      if (onSellComplete) onSellComplete();
    } catch (err) {
      setSellResult({ symbol, success: false, finbuddy_message: err.response?.data?.detail || 'Sell failed.' });
    } finally {
      setSelling(null);
    }
  };

  if (holdingsList.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '8px' }}>No holdings yet</p>
        <p style={{ color: '#334155', fontSize: '0.85rem' }}>Buy assets from the market to start building your portfolio.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Sell Result Bubble */}
      {sellResult && sellResult.finbuddy_message && (
        <div style={{
          background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
          borderRadius: '14px', padding: '12px 16px', marginBottom: '16px', position: 'relative',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6', position: 'absolute', top: -4, left: 14 }} />
          <p style={{ color: '#CBD5E1', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
            {sellResult.finbuddy_message}
          </p>
        </div>
      )}

      {/* Table Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 1fr 0.8fr 0.8fr 0.6fr',
        gap: '8px', padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '4px',
      }}>
        {['Asset', 'Shares', 'Avg Buy', 'Current', 'Value', 'P&L ₹', 'P&L %', ''].map((h, i) => (
          <span key={i} style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {holdingsList.map(h => {
        const pnl = formatPct(h.unrealized_pnl_pct);
        const isProfit = h.unrealized_pnl >= 0;
        const isExpanded = expandedRow === h.symbol;

        return (
          <div key={h.symbol}>
            <div
              onClick={() => setExpandedRow(isExpanded ? null : h.symbol)}
              style={{
                display: 'grid', gridTemplateColumns: '1.5fr 0.8fr 0.8fr 0.8fr 1fr 0.8fr 0.8fr 0.6fr',
                gap: '8px', padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                background: isProfit ? 'rgba(16,185,129,0.03)' : 'rgba(239,68,68,0.03)',
                border: `1px solid ${isProfit ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)'}`,
                marginBottom: '4px', alignItems: 'center', transition: 'background 0.2s',
              }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#E2E8F0', margin: 0 }}>{h.symbol}</p>
                <p style={{ fontSize: '0.65rem', color: '#64748B', margin: 0 }}>{h.full_name}</p>
              </div>
              <span style={{ color: '#CBD5E1', fontSize: '0.85rem', fontWeight: 600 }}>{h.shares.toFixed(4)}</span>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{formatINR(h.avg_buy_price, 2)}</span>
              <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>{formatINR(h.current_price, 2)}</span>
              <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>{formatINR(h.current_value)}</span>
              <span style={{ color: isProfit ? '#10B981' : '#EF4444', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                {isProfit ? <TrendingUp style={{ width: 12, height: 12 }} /> : <TrendingDown style={{ width: 12, height: 12 }} />}
                {formatINR(h.unrealized_pnl)}
              </span>
              <span style={{ color: isProfit ? '#10B981' : '#EF4444', fontSize: '0.85rem', fontWeight: 700 }}>
                {pnl.text}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); handleSell(h.symbol, h.shares); }}
                disabled={selling === h.symbol}
                style={{
                  padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)',
                  background: 'rgba(239,68,68,0.08)', color: '#F87171', fontWeight: 700,
                  fontSize: '0.7rem', cursor: 'pointer',
                }}
              >
                {selling === h.symbol ? <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} /> : 'SELL'}
              </button>
            </div>

            {/* Expanded Row */}
            {isExpanded && (
              <div style={{
                padding: '12px 16px', marginBottom: '4px', marginLeft: '16px',
                borderLeft: '2px solid rgba(59,130,246,0.2)',
                background: 'rgba(59,130,246,0.04)', borderRadius: '0 10px 10px 0',
              }}>
                <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
                  Invested: <strong style={{ color: '#CBD5E1' }}>{formatINR(h.invested)}</strong> · 
                  Current: <strong style={{ color: '#CBD5E1' }}>{formatINR(h.current_value)}</strong> · 
                  Type: <strong style={{ color: '#CBD5E1' }}>{h.type}</strong> · 
                  Risk: <strong style={{ color: h.risk === 'HIGH' ? '#EF4444' : h.risk === 'MEDIUM' ? '#F59E0B' : '#10B981' }}>{h.risk}</strong>
                </p>
              </div>
            )}
          </div>
        );
      })}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
