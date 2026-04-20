import React, { useState, useEffect } from 'react';
import { formatINR, formatPct } from '../../utils/formatters';
import api from '../../api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, ShieldCheck, MessageCircle, Clock } from 'lucide-react';

const TYPE_COLORS = {
  STOCK: '#3B82F6',
  MUTUAL_FUND: '#8B5CF6',
  CRYPTO: '#F97316',
  GOLD: '#F59E0B',
  CASH: '#64748B',
};

export default function PortfolioAnalysis({ sessionId }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/simulator/portfolio/${sessionId}/analysis`);
        setAnalysis(res.data);
      } catch { setAnalysis(null); }
      setLoading(false);
    };
    fetch();
  }, [sessionId]);

  if (loading) {
    return <p style={{ color: '#475569', textAlign: 'center', padding: '40px' }}>Analyzing portfolio...</p>;
  }

  if (!analysis) {
    return <p style={{ color: '#475569', textAlign: 'center', padding: '40px' }}>No analysis available. Make some trades first!</p>;
  }

  // Prepare pie data
  const pieData = Object.entries(analysis.allocation_pct || {})
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ name: key.replace('_', ' '), value, color: TYPE_COLORS[key] || '#64748B' }));

  const riskColors = { LOW: '#10B981', MEDIUM: '#F59E0B', HIGH: '#EF4444' };
  const alignment = analysis.profile_alignment_pct || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Pie Chart: Asset Allocation ── */}
      <div>
        <h4 style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          Asset Allocation
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: 160, height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '8px', fontSize: '0.8rem' }}
                  itemStyle={{ color: '#CBD5E1' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {pieData.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '3px', background: d.color }} />
                <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>{d.name}</span>
                <span style={{ color: '#CBD5E1', fontSize: '0.8rem', fontWeight: 700 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Risk Gauge ── */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '16px',
        border: '1px solid rgba(255,255,255,0.04)',
      }}>
        <h4 style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
          Portfolio Risk
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: `${riskColors[analysis.overall_risk]}15`,
            border: `2px solid ${riskColors[analysis.overall_risk]}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 800, color: riskColors[analysis.overall_risk],
          }}>
            {analysis.overall_risk}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Risk Score</span>
              <span style={{ fontSize: '0.75rem', color: '#CBD5E1', fontWeight: 700 }}>{analysis.avg_risk_score}/3.0</span>
            </div>
            <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                width: `${(analysis.avg_risk_score / 3) * 100}%`, height: '100%', borderRadius: '3px',
                background: `linear-gradient(90deg, #10B981, #F59E0B, #EF4444)`,
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile Alignment ── */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '16px',
        border: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <ShieldCheck style={{ width: 16, height: 16, color: '#3B82F6' }} />
          <h4 style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
            Profile Match
          </h4>
        </div>
        <p style={{ color: '#CBD5E1', fontSize: '0.9rem', marginBottom: '8px' }}>
          <strong style={{ color: '#fff' }}>{alignment}%</strong> aligned with your{' '}
          <strong style={{ color: '#60A5FA' }}>{analysis.investor_profile || 'Moderate'}</strong> profile
        </p>
        <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${alignment}%`, height: '100%', borderRadius: '4px',
            background: alignment > 70 ? 'linear-gradient(90deg, #3B82F6, #10B981)' : 'linear-gradient(90deg, #F59E0B, #EF4444)',
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* ── Best / Worst ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {analysis.best_asset && (
          <div style={{
            padding: '14px', borderRadius: '12px',
            background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <TrendingUp style={{ width: 14, height: 14, color: '#10B981' }} />
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Best</span>
            </div>
            <p style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{analysis.best_asset.name}</p>
            <p style={{ color: '#10B981', fontWeight: 800, fontSize: '0.85rem', margin: '2px 0 0' }}>
              {formatPct(analysis.best_asset.pnl_pct).text}
            </p>
          </div>
        )}
        {analysis.worst_asset && (
          <div style={{
            padding: '14px', borderRadius: '12px',
            background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <TrendingDown style={{ width: 14, height: 14, color: '#EF4444' }} />
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Worst</span>
            </div>
            <p style={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{analysis.worst_asset.name}</p>
            <p style={{ color: '#EF4444', fontWeight: 800, fontSize: '0.85rem', margin: '2px 0 0' }}>
              {formatPct(analysis.worst_asset.pnl_pct).text}
            </p>
          </div>
        )}
      </div>

      {/* ── FinBuddy Advice ── */}
      {analysis.finbuddy_advice && (
        <div style={{
          background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)',
          borderRadius: '14px', padding: '14px 18px', position: 'relative',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6', position: 'absolute', top: -4, left: 14 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <MessageCircle style={{ width: 14, height: 14, color: '#3B82F6' }} />
            <span style={{ fontSize: '0.75rem', color: '#60A5FA', fontWeight: 700 }}>FinBuddy Advice</span>
          </div>
          <p style={{ color: '#CBD5E1', lineHeight: 1.7, margin: 0, fontSize: '0.9rem' }}>
            {analysis.finbuddy_advice}
          </p>
        </div>
      )}

      {/* ── Transaction History ── */}
      {analysis.transactions && analysis.transactions.length > 0 && (
        <div>
          <h4 style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock style={{ width: 14, height: 14 }} /> Transaction History
          </h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
            {analysis.transactions.map((txn, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', borderRadius: '8px', marginBottom: '4px',
                background: txn.transaction_type === 'BUY' ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                    background: txn.transaction_type === 'BUY' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                    color: txn.transaction_type === 'BUY' ? '#10B981' : '#EF4444',
                  }}>
                    {txn.transaction_type}
                  </span>
                  <span style={{ color: '#E2E8F0', fontSize: '0.8rem', fontWeight: 600 }}>{txn.asset_symbol}</span>
                  <span style={{ color: '#475569', fontSize: '0.7rem' }}>Day {txn.day_number}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#CBD5E1', fontSize: '0.8rem', fontWeight: 700 }}>{formatINR(txn.total_amount)}</span>
                  {txn.transaction_type === 'SELL' && txn.realized_pnl !== 0 && (
                    <span style={{ color: txn.realized_pnl >= 0 ? '#10B981' : '#EF4444', fontSize: '0.7rem', marginLeft: '6px', fontWeight: 700 }}>
                      {txn.realized_pnl >= 0 ? '+' : ''}{formatINR(txn.realized_pnl)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
