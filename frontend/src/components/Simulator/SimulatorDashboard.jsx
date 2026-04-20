import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../api';
import { formatINR, formatPct } from '../../utils/formatters';
import AssetCard from './AssetCard';
import HoldingsTable from './HoldingsTable';
import PriceChart from './PriceChart';
import PortfolioAnalysis from './PortfolioAnalysis';
import BuyModal from './BuyModal';
import MarketEventBanner from './MarketEventBanner';
import { gsap } from 'gsap';
import {
  Wallet, TrendingUp, TrendingDown, BarChart3, PieChart,
  MessageCircle, RotateCcw, Play, Swords, Calendar,
} from 'lucide-react';

export default function SimulatorDashboard({ sessionId, darkMode = true, onReset }) {
  const [portfolio, setPortfolio] = useState(null);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeTab, setActiveTab] = useState('holdings');
  const [buyModal, setBuyModal] = useState({ open: false, asset: null });
  const [crashEvent, setCrashEvent] = useState(null);
  const [finbuddyMsg, setFinbuddyMsg] = useState('');
  const [advancing, setAdvancing] = useState(false);
  const [loading, setLoading] = useState(true);

  const valueRef = useRef(null);
  const pnlRef = useRef(null);

  // ── Fetch portfolio state ──
  const fetchPortfolio = useCallback(async () => {
    try {
      const res = await api.get(`/simulator/portfolio/${sessionId}`);
      setPortfolio(res.data);
    } catch (err) {
      console.error('Failed to fetch portfolio:', err);
    }
  }, [sessionId]);

  // ── Fetch asset prices ──
  const fetchAssets = useCallback(async (day = 0) => {
    try {
      const res = await api.get(`/simulator/prices?day=${day}`);
      setAssets(res.data);
      if (!selectedAsset && res.data.length > 0) {
        setSelectedAsset(res.data[0].symbol);
      }
    } catch (err) {
      console.error('Failed to fetch prices:', err);
    }
  }, [selectedAsset]);

  // ── Initial load ──
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchPortfolio();
      await fetchAssets(0);
      setLoading(false);
    };
    init();
  }, [fetchPortfolio, fetchAssets]);

  // ── Advance Day ──
  const handleAdvanceDay = async () => {
    if (advancing) return;
    setAdvancing(true);
    try {
      const res = await api.post(`/simulator/portfolio/${sessionId}/advance-day`);
      const data = res.data;

      if (data.crash_event) {
        setCrashEvent({
          crashes: data.crash_details,
          message: data.crash_message || data.finbuddy_message,
        });
      }

      setFinbuddyMsg(data.finbuddy_message || '');
      await fetchPortfolio();
      await fetchAssets(data.new_day);

      // Animate value change
      if (valueRef.current) {
        gsap.fromTo(valueRef.current, { scale: 1.15, color: '#3B82F6' }, { scale: 1, color: '#fff', duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      }
      if (pnlRef.current) {
        gsap.fromTo(pnlRef.current, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
      }
    } catch (err) {
      const msg = err.response?.data?.detail || 'Could not advance day.';
      setFinbuddyMsg(msg);
    } finally {
      setAdvancing(false);
    }
  };

  // ── Buy handler ──
  const handleBuyComplete = async () => {
    setBuyModal({ open: false, asset: null });
    await fetchPortfolio();
    await fetchAssets(portfolio?.current_day || 0);
  };

  // ── Sell handler ──
  const handleSellComplete = async () => {
    await fetchPortfolio();
  };

  if (loading || !portfolio) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ color: '#94A3B8', fontSize: '1.1rem' }}>Loading Arena...</div>
      </div>
    );
  }

  const pnl = formatPct(portfolio.total_pnl_pct);
  const cardStyle = {
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(59, 130, 246, 0.1)',
    borderRadius: '16px',
    padding: '20px',
    backdropFilter: 'blur(12px)',
  };

  const tabs = [
    { id: 'holdings', label: 'My Holdings', icon: BarChart3 },
    { id: 'analysis', label: 'Analysis', icon: PieChart },
    { id: 'finbuddy', label: 'FinBuddy', icon: MessageCircle },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px 100px' }}>

      {/* ── Crash Event Banner ── */}
      {crashEvent && (
        <MarketEventBanner
          crashes={crashEvent.crashes}
          message={crashEvent.message}
          onDismiss={() => setCrashEvent(null)}
        />
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Swords style={{ width: 28, height: 28, color: '#3B82F6' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            InvestSafe Arena
          </h1>
          <span style={{
            padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
            background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.2)',
          }}>
            <Calendar style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />
            Day {portfolio.current_day}
          </span>
        </div>
        <button onClick={onReset} style={{
          padding: '8px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)', color: '#F87171', fontWeight: 600,
          fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <RotateCcw style={{ width: 14, height: 14 }} /> Reset
        </button>
      </div>

      {/* ── Stats Bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Value', value: formatINR(portfolio.total_portfolio_value), icon: Wallet, ref: valueRef },
          { label: 'Cash Available', value: formatINR(portfolio.cash_balance), icon: Wallet },
          { label: 'Invested', value: formatINR(portfolio.total_invested), icon: TrendingUp },
          {
            label: 'P&L',
            value: `${formatINR(portfolio.total_pnl)} (${pnl.text})`,
            icon: portfolio.total_pnl >= 0 ? TrendingUp : TrendingDown,
            color: pnl.isPositive ? '#10B981' : '#EF4444',
            ref: pnlRef,
          },
        ].map((stat, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <stat.icon style={{ width: 16, height: 16, color: stat.color || '#3B82F6' }} />
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </span>
            </div>
            <p ref={stat.ref} style={{ fontSize: '1.25rem', fontWeight: 800, color: stat.color || '#fff', margin: 0 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>

        {/* ── Left: Asset Market ── */}
        <div>
          <h3 style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Market ({assets.length} Assets)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '600px', overflowY: 'auto', paddingRight: '4px' }}>
            {assets.map(asset => (
              <AssetCard
                key={asset.symbol}
                asset={asset}
                selected={selectedAsset === asset.symbol}
                onSelect={() => setSelectedAsset(asset.symbol)}
                onBuy={() => setBuyModal({ open: true, asset })}
                sessionId={sessionId}
                currentDay={portfolio.current_day}
              />
            ))}
          </div>
        </div>

        {/* ── Right: Tabs ── */}
        <div>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px',
                  background: activeTab === tab.id ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)',
                  color: activeTab === tab.id ? '#60A5FA' : '#64748B',
                  transition: 'all 0.2s',
                }}
              >
                <tab.icon style={{ width: 14, height: 14 }} />
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ ...cardStyle, minHeight: '400px' }}>
            {activeTab === 'holdings' && (
              <HoldingsTable
                holdings={portfolio.holdings}
                sessionId={sessionId}
                onSellComplete={handleSellComplete}
              />
            )}
            {activeTab === 'analysis' && (
              <PortfolioAnalysis sessionId={sessionId} />
            )}
            {activeTab === 'finbuddy' && (
              <div>
                <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageCircle style={{ width: 18, height: 18, color: '#3B82F6' }} />
                  FinBuddy Says
                </h3>
                {/* Context-aware advice based on holdings */}
                {(() => {
                  const holdingsArr = Object.values(portfolio.holdings || {});
                  if (holdingsArr.length === 0) {
                    return (
                      <div style={{
                        background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
                        borderRadius: '16px', padding: '16px 20px',
                      }}>
                        <p style={{ color: '#CBD5E1', fontSize: '0.9rem', margin: 0, lineHeight: 1.7 }}>
                          You haven't bought any assets yet! Start by picking stocks from the Market panel on the left. 
                          Try diversifying across different risk levels — mix some LOW risk funds with a MEDIUM or HIGH risk stock. 🌱
                        </p>
                      </div>
                    );
                  }

                  const losers = holdingsArr.filter(h => h.unrealized_pnl < 0).sort((a, b) => a.unrealized_pnl - b.unrealized_pnl);
                  const winners = holdingsArr.filter(h => h.unrealized_pnl > 0).sort((a, b) => b.unrealized_pnl - a.unrealized_pnl);
                  const totalPnl = portfolio.total_pnl || 0;

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Overall portfolio status */}
                      <div style={{
                        background: totalPnl >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                        border: `1px solid ${totalPnl >= 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`,
                        borderRadius: '12px', padding: '12px 16px',
                      }}>
                        <p style={{ color: '#CBD5E1', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
                          <strong style={{ color: totalPnl >= 0 ? '#10B981' : '#EF4444' }}>
                            Portfolio is {totalPnl >= 0 ? 'in profit' : 'in loss'}: ₹{Math.abs(totalPnl).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                          </strong>
                          {' '}with {holdingsArr.length} holding{holdingsArr.length > 1 ? 's' : ''}.
                          {totalPnl >= 0 ? ' Great job! Consider booking partial profits on your top performers.' : ' Stay calm — market dips are normal in simulation. Focus on the long term.'}
                        </p>
                      </div>

                      {/* Specific holding advice */}
                      {losers.length > 0 && losers.slice(0, 2).map(h => (
                        <div key={h.symbol} style={{
                          background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)',
                          borderRadius: '12px', padding: '10px 14px',
                        }}>
                          <p style={{ color: '#FCA5A5', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
                            📉 <strong>{h.symbol}</strong> is down ₹{Math.abs(h.unrealized_pnl).toLocaleString('en-IN', {maximumFractionDigits: 0})} ({h.unrealized_pnl_pct?.toFixed(1)}%).
                            {h.risk === 'HIGH'
                              ? ' High-risk assets are volatile — consider if this fits your risk tolerance.'
                              : h.risk === 'LOW'
                                ? ' This is a low-risk asset. It typically recovers — hold steady.'
                                : ' Consider holding — medium-risk stocks often recover in 3-5 days in simulation.'}
                          </p>
                        </div>
                      ))}

                      {winners.length > 0 && winners.slice(0, 1).map(h => (
                        <div key={h.symbol} style={{
                          background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.1)',
                          borderRadius: '12px', padding: '10px 14px',
                        }}>
                          <p style={{ color: '#6EE7B7', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
                            📈 <strong>{h.symbol}</strong> is up ₹{h.unrealized_pnl.toLocaleString('en-IN', {maximumFractionDigits: 0})} ({h.unrealized_pnl_pct?.toFixed(1)}%).
                            {' '}Consider booking partial profit if it's a significant portion of your portfolio.
                          </p>
                        </div>
                      ))}

                      {/* FinBuddy backend message if any */}
                      {finbuddyMsg && (
                        <div style={{
                          background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
                          borderRadius: '12px', padding: '10px 14px',
                        }}>
                          <p style={{ color: '#CBD5E1', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
                            💡 {finbuddyMsg}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Price Chart ── */}
      {selectedAsset && (
        <div style={{ marginTop: '24px' }}>
          <PriceChart
            assetSymbol={selectedAsset}
            sessionId={sessionId}
            currentDay={portfolio.current_day}
            assets={assets}
            onAssetChange={setSelectedAsset}
          />
        </div>
      )}

      {/* ── Buy Modal ── */}
      {buyModal.open && buyModal.asset && (
        <BuyModal
          asset={buyModal.asset}
          cashAvailable={portfolio.cash_balance}
          sessionId={sessionId}
          currentDay={portfolio.current_day}
          investorProfile={portfolio.investor_profile}
          onClose={() => setBuyModal({ open: false, asset: null })}
          onBuyComplete={handleBuyComplete}
        />
      )}

      {/* ── Advance Day FAB ── */}
      <button
        onClick={handleAdvanceDay}
        disabled={advancing || portfolio.current_day >= 89}
        style={{
          position: 'fixed', bottom: '100px', right: '32px', zIndex: 60,
          padding: '16px 28px', borderRadius: '16px', border: 'none', cursor: 'pointer',
          background: advancing ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg, #2563EB, #7C3AED)',
          color: '#fff', fontWeight: 800, fontSize: '1rem',
          boxShadow: '0 8px 32px rgba(37,99,235,0.4), 0 0 60px rgba(37,99,235,0.15)',
          display: 'flex', alignItems: 'center', gap: '8px',
          opacity: portfolio.current_day >= 89 ? 0.4 : 1,
          transition: 'all 0.3s',
        }}
      >
        <Play style={{ width: 18, height: 18, fill: '#fff' }} />
        {advancing ? 'Simulating...' : portfolio.current_day >= 89 ? 'Complete!' : 'Advance 1 Day'}
      </button>

      {/* ── Responsive ── */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '1fr 1.5fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
