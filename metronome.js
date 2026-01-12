/**
 * Metronome Logic Module
 * Pure functions for audio generation and timing calculations
 * Following the pattern of bpm.js for testability and framework-agnostic design
 */

/**
 * Create and initialize Web Audio API context
 * @returns {AudioContext} Audio context instance
 */
function createAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('Web Audio API is not supported in this browser');
  }
  return new AudioContextClass();
}

/**
 * Generate an 8-bit style beep sound using Web Audio API
 * @param {AudioContext} audioContext - Web Audio API context
 * @param {number} frequency - Frequency in Hz (higher = higher pitch)
 * @param {number} duration - Duration in seconds (default: 0.05)
 * @param {boolean} isAccent - Whether this is an accented beat (beat 1)
 */
function playBeep(audioContext, frequency, duration = 0.05, isAccent = false) {
  if (!audioContext || audioContext.state === 'closed') {
    console.warn('AudioContext is not available or has been closed');
    return;
  }

  // Resume context if suspended (required by some browsers)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // 8-bit square wave for retro sound
  oscillator.type = 'square';
  oscillator.frequency.value = frequency;

  // Accent beats are louder
  const volume = isAccent ? 0.3 : 0.15;
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

  // Quick fade out for 8-bit click effect
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + duration
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

/**
 * Calculate interval in milliseconds for a given BPM
 * @param {number} bpm - Beats per minute
 * @returns {number} Interval in milliseconds between beats
 */
function calculateInterval(bpm) {
  if (typeof bpm !== 'number' || bpm <= 0) {
    throw new Error('BPM must be a positive number');
  }
  return 60000 / bpm;
}

/**
 * Get frequency for beat based on position in measure (4/4 time)
 * @param {number} beatIndex - Beat position (0-3 for 4/4)
 * @returns {number} Frequency in Hz
 */
function getFrequencyForBeat(beatIndex) {
  // Beat 0 (downbeat) is higher pitch, others are lower
  return beatIndex === 0 ? 1000 : 800;
}

/**
 * Validate BPM is within practical range for metronome
 * @param {number} bpm - Beats per minute to validate
 * @returns {boolean} True if BPM is in valid range
 */
function isValidMetronomeBPM(bpm) {
  return typeof bpm === 'number' && bpm >= 30 && bpm <= 300;
}

// Export for browser
if (typeof window !== 'undefined') {
  window.MetronomeLogic = {
    createAudioContext,
    playBeep,
    calculateInterval,
    getFrequencyForBeat,
    isValidMetronomeBPM
  };
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createAudioContext,
    playBeep,
    calculateInterval,
    getFrequencyForBeat,
    isValidMetronomeBPM
  };
}
