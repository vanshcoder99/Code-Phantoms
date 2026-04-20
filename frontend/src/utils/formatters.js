/**
 * InvestSafe Formatters — Indian Number System
 * ₹1,00,000 (not ₹100,000)
 */

/**
 * Format a number in Indian number system with ₹ symbol.
 * Examples:
 *   formatINR(100000)    → "₹1,00,000"
 *   formatINR(5500000)   → "₹55,00,000"
 *   formatINR(1456.75)   → "₹1,456.75"
 *   formatINR(-2500)     → "-₹2,500"
 */
export function formatINR(amount, decimals = 0) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  // Split into integer and decimal parts
  const fixed = absAmount.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');

  // Indian numbering: last 3 digits, then groups of 2
  let result = '';
  const len = intPart.length;

  if (len <= 3) {
    result = intPart;
  } else {
    // Last 3 digits
    result = intPart.slice(-3);
    let remaining = intPart.slice(0, -3);

    // Groups of 2 from right
    while (remaining.length > 2) {
      result = remaining.slice(-2) + ',' + result;
      remaining = remaining.slice(0, -2);
    }
    if (remaining.length > 0) {
      result = remaining + ',' + result;
    }
  }

  // Add decimal part if needed
  if (decPart !== undefined && decimals > 0) {
    result += '.' + decPart;
  }

  return `${isNegative ? '-' : ''}₹${result}`;
}

/**
 * Format a percentage with sign and color class.
 * Returns { text: "+2.45%", isPositive: true }
 */
export function formatPct(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) {
    return { text: '0.00%', isPositive: true };
  }
  const sign = value >= 0 ? '+' : '';
  return {
    text: `${sign}${value.toFixed(decimals)}%`,
    isPositive: value >= 0,
  };
}

/**
 * Format large numbers in short form for compact display.
 * 1500 → "1.5K", 1500000 → "15L", 10000000 → "1Cr"
 */
export function formatCompact(amount) {
  if (amount === null || amount === undefined) return '0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 10000000) return `${sign}${(abs / 10000000).toFixed(1)}Cr`;
  if (abs >= 100000) return `${sign}${(abs / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(1)}K`;
  return `${sign}${abs.toFixed(0)}`;
}
