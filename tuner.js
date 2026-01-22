/**
 * Tuner Logic Module
 * Pure functions for pitch detection and note conversion
 * Framework-agnostic, fully testable
 */

// Musical constants
const A4_FREQUENCY = 440; // Standard reference pitch
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SEMITONES_PER_OCTAVE = 12;

/**
 * Calculate frequency for a given note
 * @param {string} noteName - Note name with octave (e.g., "A4", "C#3")
 * @param {number} referenceA4 - Reference frequency for A4 (default 440 Hz)
 * @returns {number} Frequency in Hz
 */
function getNoteFrequency(noteName, referenceA4 = A4_FREQUENCY) {
  // Parse note name and octave
  const match = noteName.match(/^([A-G]#?)(\d)$/);
  if (!match) {
    throw new Error(`Invalid note name: ${noteName}`);
  }

  const note = match[1];
  const octave = parseInt(match[2], 10);

  // Calculate semitones from A4
  const noteIndex = NOTES.indexOf(note);
  if (noteIndex === -1) {
    throw new Error(`Unknown note: ${note}`);
  }

  // A4 is note 9 (A) in octave 4
  const semitonesFromA4 = (octave - 4) * SEMITONES_PER_OCTAVE + (noteIndex - 9);

  // Frequency formula: f = f0 * 2^(n/12)
  return referenceA4 * Math.pow(2, semitonesFromA4 / SEMITONES_PER_OCTAVE);
}

/**
 * Convert frequency to nearest note name
 * @param {number} frequency - Frequency in Hz
 * @param {number} referenceA4 - Reference frequency for A4 (default 440 Hz)
 * @returns {string|null} Note name with octave (e.g., "A4") or null if out of range
 */
function frequencyToNote(frequency, referenceA4 = A4_FREQUENCY) {
  if (frequency <= 0 || !isFinite(frequency)) {
    return null;
  }

  // Valid range: C0 (16.35 Hz) to C8 (4186 Hz)
  if (frequency < 16 || frequency > 4200) {
    return null;
  }

  // Calculate semitones from A4
  const semitones = SEMITONES_PER_OCTAVE * Math.log2(frequency / referenceA4);
  const roundedSemitones = Math.round(semitones);

  // Convert back to note and octave
  const noteIndex = (9 + roundedSemitones) % SEMITONES_PER_OCTAVE;
  const octave = 4 + Math.floor((9 + roundedSemitones) / SEMITONES_PER_OCTAVE);

  // Handle negative modulo
  const normalizedNoteIndex = noteIndex < 0 ? noteIndex + SEMITONES_PER_OCTAVE : noteIndex;

  return NOTES[normalizedNoteIndex] + octave;
}

/**
 * Calculate tuning offset in cents
 * Cents = 1200 * log2(detected / target)
 * @param {number} detectedFrequency - Detected frequency in Hz
 * @param {number} targetFrequency - Target frequency in Hz
 * @returns {number} Offset in cents (positive = sharp, negative = flat)
 */
function calculateCentOffset(detectedFrequency, targetFrequency) {
  if (detectedFrequency <= 0 || targetFrequency <= 0) {
    throw new Error('Frequencies must be positive');
  }

  return Math.round(1200 * Math.log2(detectedFrequency / targetFrequency));
}

/**
 * Check if frequency is in tune within tolerance
 * @param {number} centOffset - Offset in cents
 * @param {number} tolerance - Tolerance in cents (default ±5)
 * @returns {boolean} True if in tune
 */
function isInTune(centOffset, tolerance = 5) {
  return Math.abs(centOffset) <= tolerance;
}

/**
 * Autocorrelation-based pitch detection
 * Detects fundamental frequency from time-domain audio buffer
 * @param {Float32Array} buffer - Audio samples
 * @param {number} sampleRate - Sample rate (e.g., 44100 Hz)
 * @returns {number|null} Detected frequency in Hz, or null if no pitch detected
 */
function detectPitch(buffer, sampleRate) {
  if (!buffer || buffer.length === 0) {
    return null;
  }

  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);

  // Calculate RMS to check if there's enough signal
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);

  // Threshold for silence
  if (rms < 0.01) {
    return null;
  }

  // Autocorrelation
  const correlations = new Float32Array(MAX_SAMPLES);

  for (let lag = 0; lag < MAX_SAMPLES; lag++) {
    let sum = 0;
    for (let i = 0; i < MAX_SAMPLES; i++) {
      sum += buffer[i] * buffer[i + lag];
    }
    correlations[lag] = sum;
  }

  // Normalize by first value (lag 0)
  const firstValue = correlations[0];
  if (firstValue === 0) {
    return null;
  }

  for (let i = 0; i < MAX_SAMPLES; i++) {
    correlations[i] = correlations[i] / firstValue;
  }

  // Find the first dip below 0.5 (finding fundamental period)
  let minLag = 0;
  for (let i = 1; i < MAX_SAMPLES; i++) {
    if (correlations[i] < 0.5) {
      minLag = i;
      break;
    }
  }

  // If no dip found, use a minimum lag based on highest frequency (4200 Hz)
  if (minLag === 0) {
    minLag = Math.floor(sampleRate / 4200);
  }

  // Find the highest peak after the dip
  let peakLag = 0;
  let peakValue = 0;

  for (let i = minLag; i < MAX_SAMPLES; i++) {
    if (correlations[i] > peakValue) {
      peakValue = correlations[i];
      peakLag = i;
    }
  }

  // No significant peak found
  if (peakLag === 0 || peakValue < 0.5) {
    return null;
  }

  // Convert lag to frequency
  const frequency = sampleRate / peakLag;

  // Filter out unrealistic frequencies
  if (frequency < 16 || frequency > 4200) {
    return null;
  }

  return Math.round(frequency * 10) / 10; // Round to 1 decimal
}

// CommonJS exports for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getNoteFrequency,
    frequencyToNote,
    calculateCentOffset,
    isInTune,
    detectPitch,
    NOTES,
    A4_FREQUENCY,
  };
}

// ES6 exports for browser
if (typeof window !== 'undefined') {
  window.TunerLogic = {
    getNoteFrequency,
    frequencyToNote,
    calculateCentOffset,
    isInTune,
    detectPitch,
    NOTES,
    A4_FREQUENCY,
  };
}
