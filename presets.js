/**
 * Factory Presets for BPM Metronome
 *
 * These are read-only presets that ship with the application.
 * Users cannot delete these, but can add their own custom presets.
 *
 * Community contributions welcome via pull requests!
 */

const FACTORY_PRESETS = [
  {
    id: 'factory-camila-camila',
    name: '🎵 Camila Camila (Nenhum de Nós)',
    bpm: 147,
    timeSignature: '4/4',
    subdivision: '1/16',
    isFactory: true,
    genre: 'Rock Brasileiro',
    description: 'Classic Brazilian rock anthem'
  },
  {
    id: 'factory-jazz-waltz',
    name: '🎷 Jazz Waltz',
    bpm: 160,
    timeSignature: '3/4',
    subdivision: '1/3',
    isFactory: true,
    genre: 'Jazz',
    description: 'Standard jazz waltz tempo with triplet feel'
  },
  {
    id: 'factory-moderate-4-4',
    name: '🎸 Moderate Rock (4/4)',
    bpm: 120,
    timeSignature: '4/4',
    subdivision: '1/8',
    isFactory: true,
    genre: 'Rock',
    description: 'Standard rock tempo with eighth note subdivision'
  },
  {
    id: 'factory-slow-ballad',
    name: '🎹 Slow Ballad',
    bpm: 60,
    timeSignature: '4/4',
    subdivision: '1/4',
    isFactory: true,
    genre: 'Ballad',
    description: 'Slow, expressive tempo for ballads'
  },
  {
    id: 'factory-uptempo-swing',
    name: '🎺 Uptempo Swing',
    bpm: 180,
    timeSignature: '4/4',
    subdivision: '1/3',
    isFactory: true,
    genre: 'Jazz',
    description: 'Fast swing feel with triplets'
  }
];

// Dual export: CommonJS for tests, ES6 for browser
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS export for Jest
  module.exports = { FACTORY_PRESETS };
} else {
  // ES6 export for browser (will be evaluated as global assignment in browser)
  window.FACTORY_PRESETS = FACTORY_PRESETS;
}
