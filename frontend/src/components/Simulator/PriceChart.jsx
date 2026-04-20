import React, { useState, useEffect } from 'react';
import { formatINR } from '../../utils/formatters';
import api from '../../api';
import {
  ComposedChart, Area, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';

export default function PriceChart({ assetSymbol, sessionId, currentDay, assets, onAssetChange }) {
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, predRes] = await Promise.all([
          api.get(`/simulator/prices/${assetSymbol}/history`),
          api.get(`/simulator/portfolio/${sessionId}/prediction/${assetSymbol}`),
        ]);
        setHistory(histRes.data || []);
        setPrediction(predRes.data || null);
      } catch {
        setHistory([]);
        setPrediction(null);
      }
    };
    fetchData();
  }, [assetSymbol, sessionId]);

  // Build chart data: historical + prediction extension
  const chartData = history.map(d => ({
    day: d.day,
    price: d.close,
    high: d.high,
    low: d.low,
    predicted: undefined,
    predHigh: undefined,
    predLow: undefined,
  }));

  // Add prediction points if available
  if (prediction && history.length > 0) {
    const lastPrice = history[history.length - 1]?.close || prediction.current_price;
    const lastDay = history.length - 1;
    const vol = prediction.technical_indicators?.volatility_14d || 0.02;

    // 7-day prediction point
    const day7 = lastDay + 7;
    const band7 = lastPrice * vol * 3;
    chartData.push({
      day: day7,
      price: undefined,
      predicted: prediction.predicted_7d,
      predHigh: prediction.predicted_7d + band7,
      predLow: prediction.predicted_7d - band7,
    });

    // 30-day prediction point
    const day30 = lastDay + 30;
    const band30 = lastPrice * vol * 6;
    chartData.push({
      day: day30,
      price: undefined,
      predicted: prediction.predicted_30d,
      predHigh: prediction.predicted_30d + band30,
      predLow: prediction.predicted_30d - band30,
    });

    // Connect last historical to first prediction
    if (chartData.length > history.length) {
      chartData[history.length - 1].predicted = lastPrice;
      chartData[history.length - 1].predHigh = lastPrice;
      chartData[history.length - 1].predLow = lastPrice;
    }
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const d = payload[0]?.payload;
    return (
      <div style={{
        background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: '10px', padding: '10px 14px', fontSize: '0.8rem',
      }}>
        <p style={{ color: '#64748B', margin: '0 0 4px', fontWeight: 600 }}>Day {d?.day}</p>
        {d?.price !== undefined && (
          <>
            <p style={{ color: '#fff', margin: '0', fontWeight: 700 }}>Close: {formatINR(d.price, 2)}</p>
            {d.high && <p style={{ color: '#10B981', margin: '0', fontSize: '0.75rem' }}>H: {formatINR(d.high, 2)}</p>}
            {d.low && <p style={{ color: '#EF4444', margin: '0', fontSize: '0.75rem' }}>L: {formatINR(d.low, 2)}</p>}
          </>
        )}
        {d?.predicted !== undefined && d?.price === undefined && (
          <p style={{ color: '#A78BFA', margin: '0', fontWeight: 700 }}>Predicted: {formatINR(d.predicted, 2)}</p>
        )}
      </div>
    );
  };

  const signalColors = { BUY: '#10B981', SELL: '#EF4444', HOLD: '#F59E0B' };

  return (
    <div style={{
      background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(59,130,246,0.1)',
      borderRadius: '16px', padding: '20px', backdropFilter: 'blur(12px)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ color: '#fff', fontWeight: 800, margin: 0, fontSize: '1rem' }}>Price Chart</h3>
          {prediction && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.7rem', padding: '3px 10px', borderRadius: '6px', fontWeight: 700,
                background: `${signalColors[prediction.signal]}20`, color: signalColors[prediction.signal],
              }}>
                {prediction.signal}
              </span>
              <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '6px', fontWeight: 700, background: 'rgba(255,255,255,0.05)', color: '#94A3B8' }}>
                {prediction.confidence} confidence
              </span>
              <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                RSI: {prediction.technical_indicators?.rsi}
              </span>
            </div>
          )}
        </div>
        <select
          value={assetSymbol}
          onChange={e => onAssetChange(e.target.value)}
          style={{
            padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(15,23,42,0.8)', color: '#E2E8F0', fontWeight: 600, fontSize: '0.85rem',
            cursor: 'pointer', outline: 'none',
          }}
        >
          {(assets || []).map(a => (
            <option key={a.symbol} value={a.symbol}>{a.symbol}</option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
          <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} width={65}
            tickFormatter={v => formatINR(v)} domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />

          {/* Current day marker */}
          <ReferenceLine x={currentDay} stroke="#3B82F6" strokeDasharray="4 4" strokeOpacity={0.5} />

          {/* Prediction confidence band */}
          <Area type="monotone" dataKey="predHigh" stroke="none" fill="url(#predGrad)" fillOpacity={1} />
          <Area type="monotone" dataKey="predLow" stroke="none" fill="transparent" />

          {/* Historical price area */}
          <Area type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={2} fill="url(#priceGrad)" dot={false} />

          {/* Prediction dashed line */}
          <Line type="monotone" dataKey="predicted" stroke="#A78BFA" strokeWidth={2} strokeDasharray="6 4" dot={{ fill: '#A78BFA', r: 4 }} connectNulls={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
