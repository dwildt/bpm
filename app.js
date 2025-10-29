// ============================================
// 8-BIT BPM CALCULATOR
// ============================================

// State
const state = {
    taps: [],                    // Array of tap timestamps
    maxTaps: 16,                 // Maximum number of taps to keep (for rolling average)
    resetTimeout: 3000,          // Auto-reset after 3 seconds of inactivity
    resetTimer: null,            // Timer reference for auto-reset
};

// DOM Elements
const elements = {
    tapButton: document.getElementById('tapButton'),
    resetButton: document.getElementById('resetButton'),
    bpmValue: document.getElementById('bpmValue'),
    tapCount: document.getElementById('tapCount'),
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
    } else {
        elements.bpmValue.textContent = '---';
    }

    // Update tap count
    elements.tapCount.textContent = state.taps.length;
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
    state.taps = [];
    updateDisplay();

    // Clear any pending reset timer
    clearTimeout(state.resetTimer);
    state.resetTimer = null;
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

// ============================================
// INITIALIZATION
// ============================================

// Initialize display
updateDisplay();

console.log('BPM Calculator loaded! Press spacebar or click the button to tap along with the beat.');
