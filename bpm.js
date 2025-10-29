// ============================================
// BPM CALCULATOR - PURE LOGIC MODULE
// ============================================
// This module contains the core BPM calculation logic
// separated from DOM manipulation for easy testing

/**
 * Calculate BPM from an array of tap timestamps
 * @param {number[]} taps - Array of timestamps in milliseconds
 * @returns {number|null} BPM value or null if not enough taps
 */
function calculateBPM(taps) {
  // Need at least 2 taps to calculate BPM
  if (!taps || taps.length < 2) {
    return null;
  }

  // Calculate intervals between consecutive taps
  const intervals = [];
  for (let i = 1; i < taps.length; i++) {
    intervals.push(taps[i] - taps[i - 1]);
  }

  // Calculate average interval
  const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

  // Convert to BPM (60000 ms in a minute / average interval in ms)
  const bpm = Math.round(60000 / avgInterval);

  return bpm;
}

/**
 * Add a tap to the taps array and maintain max size
 * @param {number[]} taps - Current array of taps
 * @param {number} timestamp - New tap timestamp
 * @param {number} maxTaps - Maximum number of taps to keep
 * @returns {number[]} Updated taps array
 */
function addTap(taps, timestamp, maxTaps = 16) {
  const newTaps = [...taps, timestamp];

  // Limit array size (keep most recent taps)
  while (newTaps.length > maxTaps) {
    newTaps.shift(); // Remove oldest tap
  }

  return newTaps;
}

/**
 * Calculate intervals between consecutive taps
 * @param {number[]} taps - Array of timestamps
 * @returns {number[]} Array of intervals in milliseconds
 */
function calculateIntervals(taps) {
  if (!taps || taps.length < 2) {
    return [];
  }

  const intervals = [];
  for (let i = 1; i < taps.length; i++) {
    intervals.push(taps[i] - taps[i - 1]);
  }

  return intervals;
}

/**
 * Calculate average of an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number|null} Average value or null if empty array
 */
function calculateAverage(numbers) {
  if (!numbers || numbers.length === 0) {
    return null;
  }

  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

// Export for Node.js (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateBPM,
    addTap,
    calculateIntervals,
    calculateAverage
  };
}

// Export for browser (globals)
if (typeof window !== 'undefined') {
  window.BPMCalculator = {
    calculateBPM,
    addTap,
    calculateIntervals,
    calculateAverage
  };
}
