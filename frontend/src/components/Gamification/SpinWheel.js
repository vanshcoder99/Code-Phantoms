import React, { useRef, useState, useEffect } from 'react';

const WHEEL_SIZE = 320;
const SLICE_COUNT = 8;
const SPIN_DURATION = 4000;

// Slice colors matching the design system
const SLICE_COLORS = [
  '#3B82F6', '#059669', '#2563EB', '#047857',
  '#1D4ED8', '#7C3AED', '#D97706', '#DC2626'
];

export default function SpinWheel({ slots = [], onSpin, canSpin, lastReward, loading }) {
  const wheelRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [reward, setReward] = useState(null);

  const sliceAngle = 360 / SLICE_COUNT;

  // Build conic-gradient for the wheel
  const conicStops = SLICE_COLORS.map((color, i) => {
    const start = (i / SLICE_COUNT) * 100;
    const end = ((i + 1) / SLICE_COUNT) * 100;
    return `${color} ${start}% ${end}%`;
  }).join(', ');

  const handleSpin = async () => {
    if (spinning || !canSpin || loading) return;

    setSpinning(true);
    setShowReward(false);
    setReward(null);

    // Call the API
    const result = await onSpin();

    if (!result || result.already_spun) {
      setSpinning(false);
      return;
    }

    const winIndex = result.winning_index;
    // Calculate target rotation: multiple full spins + offset to land on winning slice
    const targetSliceCenter = (winIndex * sliceAngle) + (sliceAngle / 2);
    const fullSpins = 360 * (5 + Math.floor(Math.random() * 3)); // 5-7 full rotations
    const targetRotation = currentRotation + fullSpins + (360 - targetSliceCenter);

    // Apply rotation with CSS transition
    if (wheelRef.current) {
      wheelRef.current.style.transition = `transform ${SPIN_DURATION}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
      wheelRef.current.style.transform = `rotate(${targetRotation}deg)`;
    }

    setCurrentRotation(targetRotation);

    // Show reward after spin animation completes
    setTimeout(() => {
      setSpinning(false);
      setReward(result.reward);
      setShowReward(true);
    }, SPIN_DURATION + 200);
  };

  // Reset reward display after 5 seconds
  useEffect(() => {
    if (showReward) {
      const timer = setTimeout(() => setShowReward(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showReward]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
      {/* Wheel Container */}
      <div style={{ position: 'relative', width: WHEEL_SIZE + 40, height: WHEEL_SIZE + 40 }}>
        {/* Outer glow ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, rgba(59,130,246,0.3), rgba(124,58,237,0.3), rgba(5,150,105,0.3), rgba(59,130,246,0.3))',
          filter: 'blur(12px)',
          animation: spinning ? 'spinGlow 1s linear infinite' : 'pulseGlow 3s ease-in-out infinite',
        }} />

        {/* Pointer / Ticker at top */}
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          width: 0,
          height: 0,
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderTop: '28px solid #fff',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
        }} />

        {/* The Wheel */}
        <div
          ref={wheelRef}
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            width: WHEEL_SIZE,
            height: WHEEL_SIZE,
            borderRadius: '50%',
            background: `conic-gradient(${conicStops})`,
            boxShadow: '0 0 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)',
            border: '4px solid rgba(255,255,255,0.15)',
            overflow: 'hidden',
          }}
        >
          {/* Slice labels */}
          {(slots.length > 0 ? slots : Array(SLICE_COUNT).fill(null)).map((slot, i) => {
            const angle = i * sliceAngle + sliceAngle / 2;
            const label = slot ? slot.label : '';
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: WHEEL_SIZE / 2 - 20,
                  transformOrigin: '0 0',
                  transform: `rotate(${angle - 90}deg) translateY(-50%)`,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '30px',
                }}
              >
                <span style={{
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.02em',
                }}>
                  {label}
                </span>
              </div>
            );
          })}

          {/* Center circle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0C1222, #1C2640)',
            border: '3px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            zIndex: 5,
          }}>
            <span style={{ fontSize: '22px' }}>🎡</span>
          </div>

          {/* Slice divider lines */}
          {Array(SLICE_COUNT).fill(null).map((_, i) => (
            <div
              key={`line-${i}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: WHEEL_SIZE / 2,
                height: '1px',
                transformOrigin: '0 0',
                transform: `rotate(${i * sliceAngle}deg)`,
                background: 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpin}
        disabled={!canSpin || spinning || loading}
        style={{
          padding: '14px 48px',
          borderRadius: '16px',
          border: 'none',
          fontWeight: 800,
          fontSize: '1.1rem',
          letterSpacing: '0.05em',
          cursor: canSpin && !spinning ? 'pointer' : 'not-allowed',
          color: '#fff',
          background: canSpin && !spinning
            ? 'linear-gradient(135deg, #2563EB, #7C3AED)'
            : 'rgba(100,116,139,0.3)',
          boxShadow: canSpin && !spinning
            ? '0 4px 20px rgba(37,99,235,0.4)'
            : 'none',
          transition: 'all 0.3s ease',
          textTransform: 'uppercase',
        }}
      >
        {spinning ? '🎡 Spinning...' : !canSpin ? '⏳ Come Back Tomorrow' : '🎰 SPIN!'}
      </button>

      {/* Reward Reveal */}
      {showReward && reward && (
        <div style={{
          padding: '20px 32px',
          borderRadius: '16px',
          background: reward.type === 'jackpot'
            ? 'linear-gradient(135deg, rgba(220,38,38,0.2), rgba(234,179,8,0.2))'
            : 'rgba(37,99,235,0.1)',
          border: `1px solid ${reward.color || '#3B82F6'}40`,
          textAlign: 'center',
          animation: 'rewardReveal 0.5s ease-out forwards',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
            {reward.type === 'jackpot' ? '🎰🎉🎰' :
             reward.type === 'coins' ? '💰' :
             reward.type === 'multiplier' ? '⚡' :
             reward.type === 'tip' ? '💡' : '✨'}
          </div>
          <div style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            color: reward.color || '#3B82F6',
            marginBottom: '4px',
          }}>
            {reward.label}
          </div>
          {reward.xp_gained > 0 && (
            <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>+{reward.xp_gained} XP earned</div>
          )}
          {reward.coins_gained > 0 && (
            <div style={{ fontSize: '0.85rem', color: '#059669' }}>+{reward.coins_gained} Coins</div>
          )}
          {reward.tip_text && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(217,119,6,0.1)',
              border: '1px solid rgba(217,119,6,0.2)',
              fontSize: '0.85rem',
              color: '#FCD34D',
              fontStyle: 'italic',
              lineHeight: 1.5,
            }}>
              {reward.tip_text}
            </div>
          )}
        </div>
      )}

      {/* Last reward hint */}
      {!showReward && lastReward && (
        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
          Last spin: {lastReward}
        </div>
      )}

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes spinGlow {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }
        @keyframes rewardReveal {
          0% { opacity: 0; transform: scale(0.8) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
