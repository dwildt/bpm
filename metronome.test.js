/**
 * Tests for Metronome Logic Module
 * Following the pattern of bpm.test.js
 */

const {
  calculateInterval,
  getFrequencyForBeat,
  isValidMetronomeBPM
} = require('./metronome.js');

describe('Metronome Logic', () => {
  describe('calculateInterval', () => {
    test('should calculate correct interval for 60 BPM', () => {
      expect(calculateInterval(60)).toBe(1000);
    });

    test('should calculate correct interval for 120 BPM', () => {
      expect(calculateInterval(120)).toBe(500);
    });

    test('should calculate correct interval for 180 BPM', () => {
      expect(calculateInterval(180)).toBeCloseTo(333.33, 2);
    });

    test('should calculate correct interval for 90 BPM', () => {
      expect(calculateInterval(90)).toBeCloseTo(666.67, 2);
    });

    test('should calculate correct interval for 40 BPM (slow)', () => {
      expect(calculateInterval(40)).toBe(1500);
    });

    test('should calculate correct interval for 240 BPM (fast)', () => {
      expect(calculateInterval(240)).toBe(250);
    });

    test('should throw error for zero BPM', () => {
      expect(() => calculateInterval(0)).toThrow('BPM must be a positive number');
    });

    test('should throw error for negative BPM', () => {
      expect(() => calculateInterval(-60)).toThrow('BPM must be a positive number');
    });

    test('should throw error for non-number input', () => {
      expect(() => calculateInterval('120')).toThrow('BPM must be a positive number');
    });
  });

  describe('getFrequencyForBeat', () => {
    test('should return higher frequency for downbeat (beat 0)', () => {
      expect(getFrequencyForBeat(0)).toBe(1000);
    });

    test('should return lower frequency for beat 1', () => {
      expect(getFrequencyForBeat(1)).toBe(800);
    });

    test('should return lower frequency for beat 2', () => {
      expect(getFrequencyForBeat(2)).toBe(800);
    });

    test('should return lower frequency for beat 3', () => {
      expect(getFrequencyForBeat(3)).toBe(800);
    });

    test('should handle beat index beyond 4/4 time (wrapping case)', () => {
      // If beat index wraps around, beat 4 should be treated like beat 0
      // But our function just checks if index === 0
      expect(getFrequencyForBeat(4)).toBe(800);
    });
  });

  describe('isValidMetronomeBPM', () => {
    test('should return true for BPM within valid range', () => {
      expect(isValidMetronomeBPM(60)).toBe(true);
      expect(isValidMetronomeBPM(120)).toBe(true);
      expect(isValidMetronomeBPM(180)).toBe(true);
    });

    test('should return true for minimum valid BPM (30)', () => {
      expect(isValidMetronomeBPM(30)).toBe(true);
    });

    test('should return true for maximum valid BPM (300)', () => {
      expect(isValidMetronomeBPM(300)).toBe(true);
    });

    test('should return false for BPM below minimum', () => {
      expect(isValidMetronomeBPM(29)).toBe(false);
      expect(isValidMetronomeBPM(10)).toBe(false);
      expect(isValidMetronomeBPM(0)).toBe(false);
    });

    test('should return false for BPM above maximum', () => {
      expect(isValidMetronomeBPM(301)).toBe(false);
      expect(isValidMetronomeBPM(500)).toBe(false);
    });

    test('should return false for negative BPM', () => {
      expect(isValidMetronomeBPM(-60)).toBe(false);
    });

    test('should return false for non-number input', () => {
      expect(isValidMetronomeBPM('120')).toBe(false);
      expect(isValidMetronomeBPM(null)).toBe(false);
      expect(isValidMetronomeBPM(undefined)).toBe(false);
    });
  });

  describe('Integration: BPM to interval conversions', () => {
    test('should convert common musical tempos correctly', () => {
      // Largo (40-60 BPM)
      expect(calculateInterval(40)).toBe(1500);
      expect(calculateInterval(60)).toBe(1000);

      // Andante (76-108 BPM)
      expect(calculateInterval(80)).toBe(750);
      expect(calculateInterval(100)).toBe(600);

      // Allegro (120-168 BPM)
      expect(calculateInterval(120)).toBe(500);
      expect(calculateInterval(150)).toBe(400);

      // Presto (168-200 BPM)
      expect(calculateInterval(180)).toBeCloseTo(333.33, 2);
      expect(calculateInterval(200)).toBe(300);
    });
  });
});
