import React, { useState, useEffect } from 'react';
import { formatINR, formatPct } from '../../utils/formatters';
import { TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import api from '../../api';

export default function AssetCard({ asset, selected, onSelect, onBuy, sessionId, currentDay }) {
  const [sparkData, setSparkData] = useState([]);
  const pct = formatPct(asset.change_24h_pct);

  const riskColors = { LOW: '#10B981', MEDIUM: '#F59E0B', HIGH: '#EF4444' };
  const typeLabels = { STOCK: 'Stock', MUTUAL_FUND: 'MF', GOLD: 'Gold', CRYPTO: 'Crypto' };

  // Fetch last 7 days for mini sparkline
  useEffect(() => {
    const fetchSpark = async () => {
      try {
        const res = await api.get(`/simulator/prices/${asset.symbol}/history`);
        const hist = res.data || [];
        const end = Math.min(currentDay + 1, hist.length);
        const start = Math.max(0, end - 7);
        setSparkData(hist.slice(start, end).map(d => ({ v: d.close })));
      } catch {
        setSparkData([]);
      }
    };
    fetchSpark();
  }, [asset.symbol, currentDay]);

  // Ticker letter color
  const letterColors = {
    STOCK: '#3B82F6', MUTUAL_FUND: '#8B5CF6', GOLD: '#F59E0B', CRYPTO: '#F97316',
  };

  return (
    <div
      onClick={onSelect}
      style={{
        background: selected ? 'rgba(59,130,246,0.08)' : 'rgba(15, 23, 42, 0.5)',
        border: `1px solid ${selected ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.05)'}`,
        borderRadius: '14px',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {/* Ticker Circle */}
      <div style={{
        width: 40, height: 40, borderRadius: '12px',
        background: `${letterColors[asset.type] || '#3B82F6'}15`,
        border: `1px solid ${letterColors[asset.type] || '#3B82F6'}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: '1rem', color: letterColors[asset.type] || '#3B82F6',
        flexShrink: 0,
      }}>
        {asset.symbol.charAt(0)}
      </div>

      {/* Name + Symbol */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#E2E8F0', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {asset.full_name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
          <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>{asset.symbol}</span>
          <span style={{
            fontSize: '0.6rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 700,
            background: `${riskColors[asset.risk]}15`, color: riskColors[asset.risk],
          }}>
            {asset.risk}
          </span>
          <span style={{ fontSize: '0.6rem', color: '#475569' }}>{typeLabels[asset.type]}</span>
        </div>
      </div>

      {/* Sparkline */}
      <div style={{ width: 60, height: 30, flexShrink: 0 }}>
        {sparkData.length > 1 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone" dataKey="v" dot={false}
                stroke={pct.isPositive ? '#10B981' : '#EF4444'}
                strokeWidth={1.5}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Price + Change */}
      <div style={{ textAlign: 'right', minWidth: 80, flexShrink: 0 }}>
        <p style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', margin: 0 }}>
          {formatINR(asset.current_price)}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px', marginTop: '2px' }}>
          {asset.change_24h === 0 ? (
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#60A5FA', background: 'rgba(59,130,246,0.15)', padding: '1px 6px', borderRadius: '4px' }}>
              NEW
            </span>
          ) : (
            <>
              {pct.isPositive
                ? <TrendingUp style={{ width: 12, height: 12, color: '#10B981' }} />
                : <TrendingDown style={{ width: 12, height: 12, color: '#EF4444' }} />}
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: pct.isPositive ? '#10B981' : '#EF4444' }}>
                {pct.text}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Buy Button */}
      <button
        onClick={(e) => { e.stopPropagation(); onBuy(); }}
        style={{
          padding: '8px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff',
          fontWeight: 700, fontSize: '0.75rem', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '4px',
          transition: 'opacity 0.2s',
        }}
      >
        <ShoppingCart style={{ width: 12, height: 12 }} /> BUY
      </button>
    </div>
  );
}
