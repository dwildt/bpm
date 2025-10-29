// ============================================
// BPM CALCULATOR - UNIT TESTS
// ============================================

const {
    calculateBPM,
    addTap,
    calculateIntervals,
    calculateAverage
} = require('./bpm.js');

describe('BPM Calculator', () => {
    // ============================================
    // calculateBPM Tests
    // ============================================

    describe('calculateBPM', () => {
        test('should return null when no taps provided', () => {
            expect(calculateBPM([])).toBeNull();
        });

        test('should return null when only one tap provided', () => {
            expect(calculateBPM([1000])).toBeNull();
        });

        test('should return null when taps is undefined', () => {
            expect(calculateBPM(undefined)).toBeNull();
        });

        test('should return null when taps is null', () => {
            expect(calculateBPM(null)).toBeNull();
        });

        test('should calculate BPM correctly for two taps 1 second apart (60 BPM)', () => {
            const taps = [0, 1000]; // 1 second = 1000ms
            // BPM = 60000 / 1000 = 60
            expect(calculateBPM(taps)).toBe(60);
        });

        test('should calculate BPM correctly for two taps 0.5 seconds apart (120 BPM)', () => {
            const taps = [0, 500]; // 0.5 seconds = 500ms
            // BPM = 60000 / 500 = 120
            expect(calculateBPM(taps)).toBe(120);
        });

        test('should calculate BPM correctly for three consistent taps (120 BPM)', () => {
            const taps = [0, 500, 1000]; // Two intervals of 500ms each
            // Average interval = 500ms
            // BPM = 60000 / 500 = 120
            expect(calculateBPM(taps)).toBe(120);
        });

        test('should calculate average BPM for varying intervals', () => {
            const taps = [0, 400, 900]; // Intervals: 400ms, 500ms
            // Average interval = (400 + 500) / 2 = 450ms
            // BPM = 60000 / 450 = 133.33 -> 133 (rounded)
            expect(calculateBPM(taps)).toBe(133);
        });

        test('should handle larger number of taps', () => {
            // Create 10 taps, 500ms apart (120 BPM)
            const taps = Array.from({ length: 10 }, (_, i) => i * 500);
            expect(calculateBPM(taps)).toBe(120);
        });

        test('should calculate BPM for fast tempo (180 BPM)', () => {
            const taps = [0, 333, 666]; // ~333ms intervals
            // BPM = 60000 / 333 ≈ 180
            expect(calculateBPM(taps)).toBe(180);
        });

        test('should calculate BPM for slow tempo (40 BPM)', () => {
            const taps = [0, 1500, 3000]; // 1500ms intervals
            // BPM = 60000 / 1500 = 40
            expect(calculateBPM(taps)).toBe(40);
        });
    });

    // ============================================
    // addTap Tests
    // ============================================

    describe('addTap', () => {
        test('should add tap to empty array', () => {
            const result = addTap([], 1000);
            expect(result).toEqual([1000]);
        });

        test('should add tap to existing array', () => {
            const result = addTap([1000], 2000);
            expect(result).toEqual([1000, 2000]);
        });

        test('should not modify original array', () => {
            const original = [1000, 2000];
            const result = addTap(original, 3000);
            expect(original).toEqual([1000, 2000]);
            expect(result).toEqual([1000, 2000, 3000]);
        });

        test('should limit array to maxTaps size (default 16)', () => {
            const taps = Array.from({ length: 16 }, (_, i) => i * 100);
            const result = addTap(taps, 1600);
            expect(result.length).toBe(16);
            expect(result[0]).toBe(100); // Oldest tap removed
            expect(result[15]).toBe(1600); // New tap added
        });

        test('should respect custom maxTaps parameter', () => {
            const taps = [100, 200, 300];
            const result = addTap(taps, 400, 3);
            expect(result.length).toBe(3);
            expect(result).toEqual([200, 300, 400]);
        });

        test('should handle maxTaps of 1', () => {
            const result = addTap([100, 200], 300, 1);
            expect(result).toEqual([300]);
        });
    });

    // ============================================
    // calculateIntervals Tests
    // ============================================

    describe('calculateIntervals', () => {
        test('should return empty array for no taps', () => {
            expect(calculateIntervals([])).toEqual([]);
        });

        test('should return empty array for one tap', () => {
            expect(calculateIntervals([1000])).toEqual([]);
        });

        test('should return empty array for undefined', () => {
            expect(calculateIntervals(undefined)).toEqual([]);
        });

        test('should return empty array for null', () => {
            expect(calculateIntervals(null)).toEqual([]);
        });

        test('should calculate interval for two taps', () => {
            const result = calculateIntervals([1000, 1500]);
            expect(result).toEqual([500]);
        });

        test('should calculate intervals for three taps', () => {
            const result = calculateIntervals([1000, 1500, 2200]);
            expect(result).toEqual([500, 700]);
        });

        test('should calculate intervals for multiple taps', () => {
            const taps = [0, 100, 300, 600, 1000];
            const result = calculateIntervals(taps);
            expect(result).toEqual([100, 200, 300, 400]);
        });
    });

    // ============================================
    // calculateAverage Tests
    // ============================================

    describe('calculateAverage', () => {
        test('should return null for empty array', () => {
            expect(calculateAverage([])).toBeNull();
        });

        test('should return null for undefined', () => {
            expect(calculateAverage(undefined)).toBeNull();
        });

        test('should return null for null', () => {
            expect(calculateAverage(null)).toBeNull();
        });

        test('should calculate average for single number', () => {
            expect(calculateAverage([100])).toBe(100);
        });

        test('should calculate average for two numbers', () => {
            expect(calculateAverage([100, 200])).toBe(150);
        });

        test('should calculate average for multiple numbers', () => {
            expect(calculateAverage([100, 200, 300, 400])).toBe(250);
        });

        test('should handle decimal averages', () => {
            expect(calculateAverage([100, 200, 250])).toBeCloseTo(183.33, 2);
        });

        test('should handle negative numbers', () => {
            expect(calculateAverage([-100, 100])).toBe(0);
        });
    });

    // ============================================
    // Integration Tests
    // ============================================

    describe('Integration: Complete BPM workflow', () => {
        test('should calculate correct BPM through full tap workflow', () => {
            let taps = [];
            const startTime = 0;
            const interval = 500; // 120 BPM

            // Simulate 5 taps at 500ms intervals
            for (let i = 0; i < 5; i++) {
                taps = addTap(taps, startTime + (i * interval), 16);
            }

            expect(taps.length).toBe(5);
            expect(calculateBPM(taps)).toBe(120);
        });

        test('should handle rolling window of 16 taps', () => {
            let taps = [];
            const startTime = 0;
            const interval = 500; // 120 BPM

            // Add 20 taps (should only keep last 16)
            for (let i = 0; i < 20; i++) {
                taps = addTap(taps, startTime + (i * interval), 16);
            }

            expect(taps.length).toBe(16);
            expect(calculateBPM(taps)).toBe(120);
        });

        test('should adapt to tempo changes', () => {
            let taps = [];

            // Start with 120 BPM (500ms intervals)
            taps = addTap(taps, 0, 16);
            taps = addTap(taps, 500, 16);
            taps = addTap(taps, 1000, 16);

            expect(calculateBPM(taps)).toBe(120);

            // Speed up to 180 BPM (333ms intervals)
            taps = addTap(taps, 1333, 16);
            taps = addTap(taps, 1666, 16);

            // Should now reflect the average across all taps
            const bpm = calculateBPM(taps);
            expect(bpm).toBeGreaterThan(120);
            expect(bpm).toBeLessThan(180);
        });
    });
});
