/**
 * Tests for Metronome Logic Module
 * Following the pattern of bpm.test.js
 */

const {
  calculateInterval,
  getFrequencyForBeat,
  isValidMetronomeBPM,
  getTimeSignatureConfig,
  getAvailableTimeSignatures,
  getSubdivisionConfig,
  getAvailableSubdivisions,
  calculateSubdivisionInterval,
  isSubdivisionValidForBPM,
  getSubdivisionFrequency,
  isAccentedBeat
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

  // ============================================
  // Time Signature Tests
  // ============================================

  describe('getTimeSignatureConfig', () => {
    test('should return config for 4/4 time signature', () => {
      const config = getTimeSignatureConfig('4/4');
      expect(config).toBeDefined();
      expect(config.beatsPerMeasure).toBe(4);
      expect(config.primaryAccent).toContain(0);
    });

    test('should return config for 3/4 time signature', () => {
      const config = getTimeSignatureConfig('3/4');
      expect(config).toBeDefined();
      expect(config.beatsPerMeasure).toBe(3);
    });

    test('should throw error for invalid time signature', () => {
      expect(() => getTimeSignatureConfig('5/5')).toThrow('Unknown time signature');
    });
  });

  describe('getAvailableTimeSignatures', () => {
    test('should return array of available time signatures', () => {
      const signatures = getAvailableTimeSignatures();
      expect(Array.isArray(signatures)).toBe(true);
      expect(signatures.length).toBeGreaterThan(0);
      expect(signatures).toContain('4/4');
      expect(signatures).toContain('3/4');
    });
  });

  describe('isAccentedBeat', () => {
    test('should return true for downbeat in 4/4', () => {
      expect(isAccentedBeat(0, '4/4')).toBe(true);
    });

    test('should return true for downbeat in 3/4', () => {
      expect(isAccentedBeat(0, '3/4')).toBe(true);
    });

    test('should return false for non-accented beat', () => {
      expect(isAccentedBeat(1, '4/4')).toBe(false); // Beat 2 not accented in 4/4
      expect(isAccentedBeat(2, '4/4')).toBe(false); // Beat 3 not accented
    });
  });

  // ============================================
  // Subdivision Tests
  // ============================================

  describe('getSubdivisionConfig', () => {
    test('should return config for quarter note subdivision', () => {
      const config = getSubdivisionConfig('1/4');
      expect(config).toBeDefined();
      expect(config.count).toBe(1);
      expect(config.label).toContain('Quarter');
    });

    test('should return config for eighth note subdivision', () => {
      const config = getSubdivisionConfig('1/8');
      expect(config).toBeDefined();
      expect(config.count).toBe(2);
    });

    test('should return config for sixteenth note subdivision', () => {
      const config = getSubdivisionConfig('1/16');
      expect(config).toBeDefined();
      expect(config.count).toBe(4);
    });

    test('should return config for triplet subdivision', () => {
      const config = getSubdivisionConfig('1/3');
      expect(config).toBeDefined();
      expect(config.count).toBe(3);
    });

    test('should throw error for invalid subdivision', () => {
      expect(() => getSubdivisionConfig('1/5')).toThrow('Unknown subdivision');
    });
  });

  describe('getAvailableSubdivisions', () => {
    test('should return array of available subdivisions', () => {
      const subdivisions = getAvailableSubdivisions();
      expect(Array.isArray(subdivisions)).toBe(true);
      expect(subdivisions.length).toBeGreaterThan(0);
      expect(subdivisions).toContain('1/4');
      expect(subdivisions).toContain('1/8');
      expect(subdivisions).toContain('1/16');
      expect(subdivisions).toContain('1/3');
    });
  });

  describe('calculateSubdivisionInterval', () => {
    test('should calculate correct interval for quarter notes at 60 BPM', () => {
      expect(calculateSubdivisionInterval(60, '1/4')).toBe(1000);
    });

    test('should calculate correct interval for eighth notes at 60 BPM', () => {
      expect(calculateSubdivisionInterval(60, '1/8')).toBe(500);
    });

    test('should calculate correct interval for sixteenth notes at 120 BPM', () => {
      expect(calculateSubdivisionInterval(120, '1/16')).toBe(125);
    });

    test('should calculate correct interval for triplets at 90 BPM', () => {
      expect(calculateSubdivisionInterval(90, '1/3')).toBeCloseTo(222.22, 2);
    });
  });

  describe('isSubdivisionValidForBPM', () => {
    test('should return true for quarter notes at any BPM', () => {
      expect(isSubdivisionValidForBPM('1/4', 60)).toBe(true);
      expect(isSubdivisionValidForBPM('1/4', 200)).toBe(true);
    });

    test('should return false for sixteenth notes at very fast BPM (>180)', () => {
      expect(isSubdivisionValidForBPM('1/16', 250)).toBe(false);
      expect(isSubdivisionValidForBPM('1/16', 181)).toBe(false);
    });

    test('should return true for sixteenth notes at moderate BPM', () => {
      expect(isSubdivisionValidForBPM('1/16', 120)).toBe(true);
      expect(isSubdivisionValidForBPM('1/16', 180)).toBe(true); // At limit
    });

    test('should return true for other subdivisions at any BPM', () => {
      expect(isSubdivisionValidForBPM('1/8', 250)).toBe(true);
      expect(isSubdivisionValidForBPM('1/3', 300)).toBe(true);
    });
  });

  describe('getSubdivisionFrequency', () => {
    test('should return high frequency for downbeat first subdivision', () => {
      const result = getSubdivisionFrequency(0, 0, '4/4', '1/8');
      expect(result.frequency).toBe(1000);
      expect(result.volume).toBeDefined();
    });

    test('should return medium frequency for non-downbeat first subdivision', () => {
      const result = getSubdivisionFrequency(1, 0, '4/4', '1/8');
      expect(result.frequency).toBe(900);
    });

    test('should return different frequency for non-first subdivision', () => {
      const result = getSubdivisionFrequency(0, 1, '4/4', '1/8');
      expect(result.frequency).toBeLessThan(900);
    });

    test('should handle sixteenth note subdivisions', () => {
      const result = getSubdivisionFrequency(0, 2, '4/4', '1/16');
      expect(result).toHaveProperty('frequency');
      expect(result).toHaveProperty('volume');
    });
  });
});
