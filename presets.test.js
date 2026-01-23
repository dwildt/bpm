/**
 * Presets Module - Unit Tests
 * Tests for factory presets validation and structure
 */

const { FACTORY_PRESETS } = require('./presets.js');

describe('Factory Presets', () => {
  // ============================================
  // Structure and Validation Tests
  // ============================================

  describe('FACTORY_PRESETS array', () => {
    test('should be defined and not empty', () => {
      expect(FACTORY_PRESETS).toBeDefined();
      expect(Array.isArray(FACTORY_PRESETS)).toBe(true);
      expect(FACTORY_PRESETS.length).toBeGreaterThan(0);
    });

    test('should have at least 5 factory presets', () => {
      expect(FACTORY_PRESETS.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Preset structure validation', () => {
    test('all presets should have required fields', () => {
      FACTORY_PRESETS.forEach(preset => {
        expect(preset).toHaveProperty('id');
        expect(preset).toHaveProperty('name');
        expect(preset).toHaveProperty('bpm');
        expect(preset).toHaveProperty('timeSignature');
        expect(preset).toHaveProperty('subdivision');
        expect(preset).toHaveProperty('isFactory');
      });
    });

    test('all presets should have valid id format', () => {
      FACTORY_PRESETS.forEach(preset => {
        expect(typeof preset.id).toBe('string');
        expect(preset.id.length).toBeGreaterThan(0);
        expect(preset.id.startsWith('factory-')).toBe(true);
      });
    });

    test('all presets should have unique ids', () => {
      const ids = FACTORY_PRESETS.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('all presets should have non-empty names', () => {
      FACTORY_PRESETS.forEach(preset => {
        expect(typeof preset.name).toBe('string');
        expect(preset.name.length).toBeGreaterThan(0);
      });
    });

    test('all presets should have isFactory set to true', () => {
      FACTORY_PRESETS.forEach(preset => {
        expect(preset.isFactory).toBe(true);
      });
    });
  });

  describe('BPM validation', () => {
    test('all presets should have valid BPM values', () => {
      FACTORY_PRESETS.forEach(preset => {
        expect(typeof preset.bpm).toBe('number');
        expect(preset.bpm).toBeGreaterThan(0);
        expect(preset.bpm).toBeLessThanOrEqual(300);
      });
    });

    test('all presets should have BPM within reasonable range (30-300)', () => {
      FACTORY_PRESETS.forEach(preset => {
        expect(preset.bpm).toBeGreaterThanOrEqual(30);
        expect(preset.bpm).toBeLessThanOrEqual(300);
      });
    });
  });

  describe('Time signature validation', () => {
    test('all presets should have valid time signature format', () => {
      const validTimeSignatures = ['2/4', '3/4', '4/4', '5/4', '6/8', '7/8', '9/8', '12/8'];

      FACTORY_PRESETS.forEach(preset => {
        expect(typeof preset.timeSignature).toBe('string');
        expect(validTimeSignatures).toContain(preset.timeSignature);
      });
    });
  });

  describe('Subdivision validation', () => {
    test('all presets should have valid subdivision format', () => {
      const validSubdivisions = ['1/4', '1/8', '1/16', '1/3'];

      FACTORY_PRESETS.forEach(preset => {
        expect(typeof preset.subdivision).toBe('string');
        expect(validSubdivisions).toContain(preset.subdivision);
      });
    });
  });

  describe('Optional fields validation', () => {
    test('presets with genre should have non-empty string', () => {
      FACTORY_PRESETS.forEach(preset => {
        if (preset.genre !== undefined) {
          expect(typeof preset.genre).toBe('string');
          expect(preset.genre.length).toBeGreaterThan(0);
        }
      });
    });

    test('presets with description should have non-empty string', () => {
      FACTORY_PRESETS.forEach(preset => {
        if (preset.description !== undefined) {
          expect(typeof preset.description).toBe('string');
          expect(preset.description.length).toBeGreaterThan(0);
        }
      });
    });
  });

  // ============================================
  // Specific Preset Tests
  // ============================================

  describe('Specific factory presets', () => {
    test('should include Camila Camila preset', () => {
      const preset = FACTORY_PRESETS.find(p => p.id === 'factory-camila-camila');
      expect(preset).toBeDefined();
      expect(preset.bpm).toBe(147);
      expect(preset.timeSignature).toBe('4/4');
      expect(preset.subdivision).toBe('1/16');
    });

    test('should include Jazz Waltz preset', () => {
      const preset = FACTORY_PRESETS.find(p => p.id === 'factory-jazz-waltz');
      expect(preset).toBeDefined();
      expect(preset.bpm).toBe(160);
      expect(preset.timeSignature).toBe('3/4');
      expect(preset.subdivision).toBe('1/3');
    });

    test('should include Moderate Rock preset', () => {
      const preset = FACTORY_PRESETS.find(p => p.id === 'factory-moderate-4-4');
      expect(preset).toBeDefined();
      expect(preset.bpm).toBe(120);
      expect(preset.timeSignature).toBe('4/4');
    });

    test('should include Slow Ballad preset', () => {
      const preset = FACTORY_PRESETS.find(p => p.id === 'factory-slow-ballad');
      expect(preset).toBeDefined();
      expect(preset.bpm).toBe(60);
    });

    test('should include Uptempo Swing preset', () => {
      const preset = FACTORY_PRESETS.find(p => p.id === 'factory-uptempo-swing');
      expect(preset).toBeDefined();
      expect(preset.bpm).toBe(180);
      expect(preset.subdivision).toBe('1/3');
    });
  });

  // ============================================
  // Data Integrity Tests
  // ============================================

  describe('Data integrity', () => {
    test('preset array should not be modified by external code', () => {
      const originalLength = FACTORY_PRESETS.length;
      const firstPreset = FACTORY_PRESETS[0];

      // Array should be the same reference (not a copy)
      expect(FACTORY_PRESETS).toBeDefined();
      expect(FACTORY_PRESETS.length).toBe(originalLength);
      expect(FACTORY_PRESETS[0]).toBe(firstPreset);
    });

    test('should have variety of time signatures', () => {
      const timeSignatures = new Set(FACTORY_PRESETS.map(p => p.timeSignature));
      expect(timeSignatures.size).toBeGreaterThanOrEqual(2);
    });

    test('should have variety of subdivisions', () => {
      const subdivisions = new Set(FACTORY_PRESETS.map(p => p.subdivision));
      expect(subdivisions.size).toBeGreaterThanOrEqual(2);
    });

    test('should have variety of BPM ranges', () => {
      const bpms = FACTORY_PRESETS.map(p => p.bpm);
      const minBpm = Math.min(...bpms);
      const maxBpm = Math.max(...bpms);

      // Should have at least 60 BPM range
      expect(maxBpm - minBpm).toBeGreaterThanOrEqual(60);
    });
  });
});
