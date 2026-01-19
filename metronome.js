/**
 * Metronome Logic Module
 * Pure functions for audio generation and timing calculations
 * Following the pattern of bpm.js for testability and framework-agnostic design
 */

/**
 * Time Signature Configuration
 * Defines available time signatures with their characteristics
 */
const TIME_SIGNATURES = {
  '4/4': {
    beatsPerMeasure: 4,
    primaryAccent: [0],      // Beat 1 gets primary accent
    secondaryAccent: [],     // No secondary accents
    label: '4/4 (Common Time)',
    description: 'Most common time signature, marching feel'
  },
  '3/4': {
    beatsPerMeasure: 3,
    primaryAccent: [0],      // Beat 1 gets primary accent
    secondaryAccent: [],     // No secondary accents
    label: '3/4 (Waltz)',
    description: 'Waltz time, flowing feel'
  },
  '2/4': {
    beatsPerMeasure: 2,
    primaryAccent: [0],      // Beat 1 gets primary accent
    secondaryAccent: [],     // No secondary accents
    label: '2/4 (March)',
    description: 'March time, bouncy feel'
  }
};

/**
 * Subdivision Configuration
 * Defines available note subdivisions with their characteristics
 */
const SUBDIVISIONS = {
  '1/4': {
    count: 1,
    label: '♩ Quarter Notes',
    description: 'Main beats only (1 click per beat)'
  },
  '1/8': {
    count: 2,
    label: '♪ Eighth Notes',
    description: 'Two clicks per beat'
  },
  '1/16': {
    count: 4,
    label: '♬ Sixteenth Notes',
    description: 'Four clicks per beat'
  },
  '1/3': {
    count: 3,
    label: '♪♪♪ Triplets',
    description: 'Three clicks per beat (triplet feel)'
  }
};

/**
 * Get time signature configuration
 * @param {string} timeSignature - Time signature (e.g., "4/4", "3/4")
 * @returns {object} Time signature configuration
 */
function getTimeSignatureConfig(timeSignature) {
  const config = TIME_SIGNATURES[timeSignature];
  if (!config) {
    throw new Error(`Unknown time signature: ${timeSignature}`);
  }
  return config;
}

/**
 * Get list of available time signatures
 * @returns {Array<string>} Array of time signature keys
 */
function getAvailableTimeSignatures() {
  return Object.keys(TIME_SIGNATURES);
}

/**
 * Get subdivision configuration
 * @param {string} subdivision - Subdivision (e.g., "1/4", "1/8", "1/16", "1/3")
 * @returns {object} Subdivision configuration
 */
function getSubdivisionConfig(subdivision) {
  const config = SUBDIVISIONS[subdivision];
  if (!config) {
    throw new Error(`Unknown subdivision: ${subdivision}`);
  }
  return config;
}

/**
 * Get list of available subdivisions
 * @returns {Array<string>} Array of subdivision keys
 */
function getAvailableSubdivisions() {
  return Object.keys(SUBDIVISIONS);
}

/**
 * Calculate interval for subdivision based on BPM
 * @param {number} bpm - Beats per minute
 * @param {string} subdivision - Subdivision (e.g., "1/4", "1/8")
 * @returns {number} Interval in milliseconds between subdivision clicks
 */
function calculateSubdivisionInterval(bpm, subdivision) {
  const beatInterval = calculateInterval(bpm);
  const config = getSubdivisionConfig(subdivision);
  return beatInterval / config.count;
}

/**
 * Check if subdivision is valid for given BPM
 * @param {string} subdivision - Subdivision to validate
 * @param {number} bpm - Current BPM
 * @returns {boolean} True if subdivision is valid for this BPM
 */
function isSubdivisionValidForBPM(subdivision, bpm) {
  // Sixteenth notes above 180 BPM = intervals < 83ms
  // Too fast and imprecise with setInterval
  if (subdivision === '1/16' && bpm > 180) {
    return false;
  }
  return true;
}

/**
 * Get frequency and volume for subdivision based on position
 * @param {number} beatIndex - Beat position (0-based)
 * @param {number} subdivisionIndex - Subdivision position within beat (0-based)
 * @param {string} timeSignature - Time signature (e.g., "4/4")
 * @param {string} subdivision - Subdivision type (e.g., "1/16")
 * @returns {object} Object with frequency (Hz) and volume properties
 */
function getSubdivisionFrequency(beatIndex, subdivisionIndex, timeSignature = '4/4', subdivision = '1/4') {
  const config = getTimeSignatureConfig(timeSignature);
  const subdivisionConfig = getSubdivisionConfig(subdivision);

  // First subdivision of downbeat (beat 1)
  if (beatIndex === 0 && subdivisionIndex === 0) {
    return { frequency: 1000, volume: 0.3 };
  }

  // First subdivision of any beat
  if (subdivisionIndex === 0) {
    return { frequency: 900, volume: 0.2 };
  }

  // Subdivision on main beat emphasis (e.g., 3rd sixteenth in groups of 4)
  if (subdivisionConfig.count === 4 && subdivisionIndex === 2) {
    return { frequency: 850, volume: 0.15 };
  }

  // Regular subdivisions
  return { frequency: 800, volume: 0.12 };
}

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
 * Get frequency for beat based on position in measure and accent pattern
 * @param {number} beatIndex - Beat position (0-based)
 * @param {string} timeSignature - Time signature (e.g., "4/4", "3/4")
 * @returns {number} Frequency in Hz
 */
function getFrequencyForBeat(beatIndex, timeSignature = '4/4') {
  const config = getTimeSignatureConfig(timeSignature);

  // Primary accent (beat 1): 1000 Hz
  if (config.primaryAccent.includes(beatIndex)) {
    return 1000;
  }

  // Secondary accent: 900 Hz
  if (config.secondaryAccent.includes(beatIndex)) {
    return 900;
  }

  // Regular beat: 800 Hz
  return 800;
}

/**
 * Check if beat should be accented (primary or secondary)
 * @param {number} beatIndex - Beat position (0-based)
 * @param {string} timeSignature - Time signature (e.g., "4/4", "3/4")
 * @returns {boolean} True if beat should be accented
 */
function isAccentedBeat(beatIndex, timeSignature = '4/4') {
  const config = getTimeSignatureConfig(timeSignature);
  return config.primaryAccent.includes(beatIndex) ||
         config.secondaryAccent.includes(beatIndex);
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
    isAccentedBeat,
    isValidMetronomeBPM,
    getTimeSignatureConfig,
    getAvailableTimeSignatures,
    TIME_SIGNATURES,
    // Subdivision functions
    getSubdivisionConfig,
    getAvailableSubdivisions,
    calculateSubdivisionInterval,
    isSubdivisionValidForBPM,
    getSubdivisionFrequency,
    SUBDIVISIONS
  };
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createAudioContext,
    playBeep,
    calculateInterval,
    getFrequencyForBeat,
    isAccentedBeat,
    isValidMetronomeBPM,
    getTimeSignatureConfig,
    getAvailableTimeSignatures,
    TIME_SIGNATURES,
    // Subdivision functions
    getSubdivisionConfig,
    getAvailableSubdivisions,
    calculateSubdivisionInterval,
    isSubdivisionValidForBPM,
    getSubdivisionFrequency,
    SUBDIVISIONS
  };
}
