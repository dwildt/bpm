// ============================================
// 8-BIT BPM CALCULATOR
// ============================================

// State
const state = {
  taps: [],                    // Array of tap timestamps
  maxTaps: 16,                 // Maximum number of taps to keep (for rolling average)
  resetTimeout: 3000,          // Auto-reset after 3 seconds of inactivity
  resetTimer: null,            // Timer reference for auto-reset
  // Metronome state
  fixedBPM: null,              // Locked BPM value (null = not fixed)
  metronomeActive: false,      // Whether metronome is playing
  metronomeTimer: null,        // setInterval reference
  currentBeat: 0,              // Current beat in measure (0-3 for 4/4)
  audioContext: null,          // Web Audio API context (lazy initialized)
};

// DOM Elements
const elements = {
  tapButton: document.getElementById('tapButton'),
  resetButton: document.getElementById('resetButton'),
  bpmValue: document.getElementById('bpmValue'),
  tapCount: document.getElementById('tapCount'),
  // Metronome elements
  fixBpmButton: document.getElementById('fixBpmButton'),
  playMetronomeButton: document.getElementById('playMetronomeButton'),
  fixedBpmValue: document.getElementById('fixedBpmValue'),
  beatIndicator: document.getElementById('beatIndicator'),
  // Manual BPM elements
  setBpmButton: document.getElementById('setBpmButton'),
  bpmModal: document.getElementById('bpmModal'),
  bpmInput: document.getElementById('bpmInput'),
  confirmBpmButton: document.getElementById('confirmBpmButton'),
  cancelBpmButton: document.getElementById('cancelBpmButton'),
  bpmError: document.getElementById('bpmError'),
};

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Calculate BPM from current state
 * @returns {number|null} BPM value or null if not enough taps
 */
function calculateBPM() {
  return BPMCalculator.calculateBPM(state.taps);
}

/**
 * Update the UI with current state
 */
function updateDisplay() {
  const bpm = calculateBPM();

  // Update BPM display
  if (bpm !== null) {
    elements.bpmValue.textContent = bpm;
    // Enable fix button if not already fixed and metronome not playing
    if (state.fixedBPM === null && !state.metronomeActive) {
      elements.fixBpmButton.disabled = false;
    }
  } else {
    elements.bpmValue.textContent = '---';
    elements.fixBpmButton.disabled = true;
  }

  // Update tap count
  elements.tapCount.textContent = state.taps.length;

  // Update metronome display
  updateMetronomeDisplay();

  // Update SET BPM button state
  updateSetBpmButtonState();
}

/**
 * Handle a tap event
 */
function handleTap() {
  const now = Date.now();

  // Add tap to array using BPMCalculator
  state.taps = BPMCalculator.addTap(state.taps, now, state.maxTaps);

  // Update display
  updateDisplay();

  // Visual feedback - add pressed class
  elements.tapButton.classList.add('active');
  setTimeout(() => {
    elements.tapButton.classList.remove('active');
  }, 100);

  // Reset the auto-reset timer
  clearTimeout(state.resetTimer);
  state.resetTimer = setTimeout(reset, state.resetTimeout);
}

/**
 * Reset the calculator
 */
function reset() {
  // Stop metronome if playing
  if (state.metronomeActive) {
    stopMetronome();
  }

  // Clear taps
  state.taps = [];

  // Clear any pending reset timer
  clearTimeout(state.resetTimer);
  state.resetTimer = null;

  // Unlock fixed BPM
  if (state.fixedBPM !== null) {
    unlockBPM();
  }

  // Update all displays
  updateDisplay();
}

// ============================================
// METRONOME FUNCTIONS
// ============================================

/**
 * Update the metronome fixed BPM display
 */
function updateMetronomeDisplay() {
  if (state.fixedBPM !== null) {
    elements.fixedBpmValue.textContent = state.fixedBPM;
  } else {
    elements.fixedBpmValue.textContent = '---';
  }
}

/**
 * Update the beat indicator visual feedback
 */
function updateBeatIndicator() {
  const beatDots = document.querySelectorAll('.beat-dot');

  beatDots.forEach((dot, index) => {
    if (index === state.currentBeat && state.metronomeActive) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

/**
 * Fix/lock the current BPM for metronome use
 */
function fixBPM() {
  const bpm = calculateBPM();

  if (bpm !== null && MetronomeLogic.isValidMetronomeBPM(bpm)) {
    // Clear any pending auto-reset timer when fixing BPM
    if (state.resetTimer) {
      clearTimeout(state.resetTimer);
      state.resetTimer = null;
    }

    state.fixedBPM = bpm;
    updateMetronomeDisplay();

    // Enable play button
    elements.playMetronomeButton.disabled = false;

    // Update fix button text to show it's locked
    elements.fixBpmButton.textContent = 'UNLOCK';
    elements.fixBpmButton.classList.add('locked');

    // Visual feedback
    elements.fixBpmButton.classList.add('active');
    setTimeout(() => {
      elements.fixBpmButton.classList.remove('active');
    }, 200);
  } else if (bpm !== null && !MetronomeLogic.isValidMetronomeBPM(bpm)) {
    console.warn(`BPM ${bpm} is outside valid metronome range (30-300)`);
  }
}

/**
 * Unlock the fixed BPM
 */
function unlockBPM() {
  // Stop metronome if playing
  if (state.metronomeActive) {
    stopMetronome();
  }

  // Clear fixed BPM
  state.fixedBPM = null;
  updateMetronomeDisplay();

  // Reset taps to start fresh
  state.taps = [];

  // Clear any pending reset timer
  clearTimeout(state.resetTimer);
  state.resetTimer = null;

  // Disable play button
  elements.playMetronomeButton.disabled = true;

  // Update fix button text
  elements.fixBpmButton.textContent = 'FIX BPM';
  elements.fixBpmButton.classList.remove('locked');

  // Update all displays
  updateDisplay();
}

/**
 * Toggle fix/unlock BPM
 */
function toggleFixBPM() {
  if (state.fixedBPM === null) {
    fixBPM();
  } else {
    unlockBPM();
  }
}

/**
 * Play a single metronome beat
 */
function playMetronomeBeat() {
  if (!state.metronomeActive) {
    return;
  }

  const frequency = MetronomeLogic.getFrequencyForBeat(state.currentBeat);
  const isAccent = state.currentBeat === 0;

  try {
    MetronomeLogic.playBeep(state.audioContext, frequency, 0.05, isAccent);
  } catch (error) {
    console.error('Error playing beep:', error);
  }

  // Update visual indicator
  updateBeatIndicator();

  // Advance to next beat (wrap around at 4 for 4/4 time)
  state.currentBeat = (state.currentBeat + 1) % 4;
}

/**
 * Start the metronome
 */
function startMetronome() {
  if (state.fixedBPM === null) {
    console.warn('Cannot start metronome: no fixed BPM');
    return;
  }

  try {
    // Initialize audio context lazily (requires user interaction)
    if (!state.audioContext) {
      state.audioContext = MetronomeLogic.createAudioContext();
    }

    // Resume if suspended (required by some browsers)
    if (state.audioContext.state === 'suspended') {
      state.audioContext.resume();
    }

    // Clear any pending auto-reset timer to prevent it from stopping the metronome
    if (state.resetTimer) {
      clearTimeout(state.resetTimer);
      state.resetTimer = null;
    }

    state.metronomeActive = true;
    state.currentBeat = 0;

    // Update button UI
    elements.playMetronomeButton.innerHTML =
      '<span class="play-icon">■</span><span class="play-text">STOP</span>';
    elements.playMetronomeButton.classList.add('playing');
    elements.playMetronomeButton.setAttribute('aria-label', 'Stop metronome');

    // Disable fix button while playing
    elements.fixBpmButton.disabled = true;

    // Disable SET BPM button while playing
    updateSetBpmButtonState();

    // Play first beat immediately
    playMetronomeBeat();

    // Set up interval for subsequent beats
    const interval = MetronomeLogic.calculateInterval(state.fixedBPM);
    state.metronomeTimer = setInterval(() => {
      playMetronomeBeat();
    }, interval);
  } catch (error) {
    console.error('Failed to start metronome:', error);
    // Reset state if initialization failed
    state.metronomeActive = false;

    // Show error to user
    alert('Failed to start metronome. Please check browser console for details.');
  }
}

/**
 * Stop the metronome
 */
function stopMetronome() {
  state.metronomeActive = false;

  // Clear interval
  if (state.metronomeTimer) {
    clearInterval(state.metronomeTimer);
    state.metronomeTimer = null;
  }

  // Reset beat indicator
  state.currentBeat = 0;
  updateBeatIndicator();

  // Update button UI
  elements.playMetronomeButton.innerHTML =
    '<span class="play-icon">▶</span><span class="play-text">PLAY</span>';
  elements.playMetronomeButton.classList.remove('playing');
  elements.playMetronomeButton.setAttribute('aria-label', 'Start metronome');

  // Re-enable fix button
  elements.fixBpmButton.disabled = false;

  // Re-enable SET BPM button
  updateSetBpmButtonState();
}

/**
 * Toggle metronome play/stop
 */
function toggleMetronome() {
  if (state.metronomeActive) {
    stopMetronome();
  } else {
    startMetronome();
  }
}

// ============================================
// MANUAL BPM INPUT FUNCTIONS
// ============================================

/**
 * Open the BPM input modal
 */
function openBpmModal() {
  // Clear previous input and errors
  elements.bpmInput.value = '';
  elements.bpmError.textContent = '';

  // Show modal
  elements.bpmModal.hidden = false;

  // Focus input for immediate typing
  elements.bpmInput.focus();
}

/**
 * Close the BPM input modal
 */
function closeBpmModal() {
  elements.bpmModal.hidden = true;
  elements.bpmInput.value = '';
  elements.bpmError.textContent = '';
}

/**
 * Validate and apply manual BPM input
 */
function applyManualBPM() {
  const inputValue = elements.bpmInput.value.trim();

  // Check if empty
  if (inputValue === '') {
    elements.bpmError.textContent = 'Please enter a BPM value';
    elements.bpmInput.focus();
    return;
  }

  const bpm = parseInt(inputValue, 10);

  // Check if valid number
  if (isNaN(bpm)) {
    elements.bpmError.textContent = 'Invalid number';
    elements.bpmInput.focus();
    return;
  }

  // Validate range using existing metronome validation
  if (!MetronomeLogic.isValidMetronomeBPM(bpm)) {
    elements.bpmError.textContent = 'BPM must be between 30 and 300';
    elements.bpmInput.focus();
    return;
  }

  // Valid BPM - apply it
  setManualBPM(bpm);
  closeBpmModal();
}

/**
 * Set a manual BPM value and prepare for metronome playback
 * @param {number} bpm - The BPM value to set
 */
function setManualBPM(bpm) {
  // Clear any pending auto-reset timer
  if (state.resetTimer) {
    clearTimeout(state.resetTimer);
    state.resetTimer = null;
  }

  // Clear existing taps
  state.taps = [];

  // Set fixed BPM directly
  state.fixedBPM = bpm;

  // Update displays
  updateDisplay();
  updateMetronomeDisplay();

  // Enable play button
  elements.playMetronomeButton.disabled = false;

  // Update fix button to show locked state
  elements.fixBpmButton.textContent = 'UNLOCK';
  elements.fixBpmButton.classList.add('locked');
  elements.fixBpmButton.disabled = false;

  // Show visual feedback
  elements.bpmValue.textContent = bpm;
}

/**
 * Update SET BPM button state based on metronome state
 */
function updateSetBpmButtonState() {
  // Disable SET BPM button when metronome is playing
  if (state.metronomeActive) {
    elements.setBpmButton.disabled = true;
  } else {
    elements.setBpmButton.disabled = false;
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Handle mouse click on tap button
 */
elements.tapButton.addEventListener('click', (e) => {
  e.preventDefault();
  handleTap();
});

/**
 * Handle keyboard events (spacebar)
 */
document.addEventListener('keydown', (e) => {
  // Check if spacebar is pressed
  if (e.code === 'Space' || e.key === ' ') {
    e.preventDefault(); // Prevent page scroll
    handleTap();
  }
});

/**
 * Handle reset button click
 */
elements.resetButton.addEventListener('click', (e) => {
  e.preventDefault();
  reset();
});

/**
 * Prevent spacebar from triggering buttons when they have focus
 */
elements.tapButton.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.key === ' ') {
    e.preventDefault();
  }
});

elements.resetButton.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.key === ' ') {
    e.stopPropagation();
  }
});

/**
 * Handle fix BPM button click
 */
elements.fixBpmButton.addEventListener('click', (e) => {
  e.preventDefault();
  toggleFixBPM();
});

/**
 * Handle play metronome button click
 */
elements.playMetronomeButton.addEventListener('click', (e) => {
  e.preventDefault();
  toggleMetronome();
});

/**
 * Prevent spacebar from triggering metronome buttons
 */
elements.fixBpmButton.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.key === ' ') {
    e.stopPropagation();
  }
});

elements.playMetronomeButton.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.key === ' ') {
    e.stopPropagation();
  }
});

/**
 * Handle SET BPM button click
 */
elements.setBpmButton.addEventListener('click', (e) => {
  e.preventDefault();
  openBpmModal();
});

/**
 * Handle modal confirm button
 */
elements.confirmBpmButton.addEventListener('click', (e) => {
  e.preventDefault();
  applyManualBPM();
});

/**
 * Handle modal cancel button
 */
elements.cancelBpmButton.addEventListener('click', (e) => {
  e.preventDefault();
  closeBpmModal();
});

/**
 * Handle Enter key in BPM input
 */
elements.bpmInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    applyManualBPM();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    closeBpmModal();
  }
});

/**
 * Clear error message when user starts typing
 */
elements.bpmInput.addEventListener('input', () => {
  elements.bpmError.textContent = '';
});

/**
 * Close modal when clicking on overlay background
 */
elements.bpmModal.addEventListener('click', (e) => {
  // Only close if clicking the overlay itself, not the modal content
  if (e.target === elements.bpmModal) {
    closeBpmModal();
  }
});

/**
 * Prevent spacebar from triggering tap when SET BPM button has focus
 */
elements.setBpmButton.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.key === ' ') {
    e.stopPropagation();
  }
});

/**
 * Handle page visibility changes - stop metronome when tab is hidden
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.metronomeActive) {
    stopMetronome();
  }
});

// ============================================
// THEME MANAGEMENT
// ============================================

/**
 * Theme system with localStorage persistence
 */
const ThemeManager = {
  storageKey: 'bpm-theme',
  defaultTheme: 'classic',
  themeButtons: document.querySelectorAll('.theme-button'),

  /**
   * Get the current theme from localStorage or default
   */
  getCurrentTheme() {
    return localStorage.getItem(this.storageKey) || this.defaultTheme;
  },

  /**
   * Set the theme and save to localStorage
   */
  setTheme(themeName) {
    // Update HTML data-theme attribute
    document.documentElement.setAttribute('data-theme', themeName);

    // Save to localStorage
    localStorage.setItem(this.storageKey, themeName);

    // Update UI - mark active button
    this.updateActiveButton(themeName);
  },

  /**
   * Update the active state of theme buttons
   */
  updateActiveButton(themeName) {
    this.themeButtons.forEach(button => {
      if (button.dataset.theme === themeName) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  },

  /**
   * Initialize theme system
   */
  init() {
    // Load saved theme or use default
    const savedTheme = this.getCurrentTheme();
    this.setTheme(savedTheme);

    // Add click handlers to theme buttons
    this.themeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const theme = button.dataset.theme;
        this.setTheme(theme);
      });
    });
  }
};

// ============================================
// INITIALIZATION
// ============================================

// Initialize display
updateDisplay();

// Initialize theme system
ThemeManager.init();
