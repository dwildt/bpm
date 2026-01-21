// ============================================
// 8-BIT BPM CALCULATOR
// ============================================

import { FACTORY_PRESETS } from './presets.js';

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
  currentBeat: 0,              // Current beat in measure (0-based index)
  audioContext: null,          // Web Audio API context (lazy initialized)
  // Time signature state
  timeSignature: '4/4',        // Current time signature
  beatsPerMeasure: 4,          // Number of beats in current time signature
  // Subdivision state
  subdivision: '1/4',          // Current subdivision (quarter, eighth, sixteenth, triplet)
  subdivisionCount: 1,         // Number of subdivisions per beat
  currentSubdivision: 0,       // Current subdivision index (0-based)
  // Preset state
  currentPresetId: null,       // Currently loaded preset ID
  // Menu state
  activeModule: 'bpm',         // Current active module ('bpm' | 'metronome' | 'tuner')
  menuOpen: false,             // Sidebar menu state
  lastCalculatedBPM: null,     // Track BPM from BPM Finder for auto-fix
};

// DOM Elements
const elements = {
  tapButton: document.getElementById('tapButton'),
  bpmValue: document.getElementById('bpmValue'),
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
  // Time signature elements
  timeSignatureSelector: document.getElementById('timeSignatureSelector'),
  // Subdivision elements
  subdivisionSelector: document.getElementById('subdivisionSelector'),
  // Preset elements
  savePresetButton: document.getElementById('savePresetButton'),
  managePresetsButton: document.getElementById('managePresetsButton'),
  presetsModal: document.getElementById('presetsModal'),
  presetNameInput: document.getElementById('presetNameInput'),
  saveNewPresetButton: document.getElementById('saveNewPresetButton'),
  closePresetsButton: document.getElementById('closePresetsButton'),
  presetsList: document.getElementById('presetsList'),
  presetError: document.getElementById('presetError'),
  // Menu elements
  hamburgerButton: document.getElementById('hamburgerButton'),
  sidebarMenu: document.getElementById('sidebarMenu'),
  closeMenuButton: document.getElementById('closeMenuButton'),
  menuOverlay: document.getElementById('menuOverlay'),
  menuItems: document.querySelectorAll('.menu-item'),
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

    // Update subdivision options based on BPM
    updateSubdivisionOptions();

    // Enable play button
    elements.playMetronomeButton.disabled = false;

    // Enable save preset button
    elements.savePresetButton.disabled = false;

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

  // Disable save preset button
  elements.savePresetButton.disabled = true;
  state.currentPresetId = null;

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

  // Get frequency and volume based on current beat, subdivision, and time signature
  const { frequency, volume } = MetronomeLogic.getSubdivisionFrequency(
    state.currentBeat,
    state.currentSubdivision,
    state.timeSignature,
    state.subdivision
  );

  // Accent is only on first subdivision of downbeat
  const isAccent = (state.currentBeat === 0 && state.currentSubdivision === 0);

  try {
    MetronomeLogic.playBeep(state.audioContext, frequency, 0.05, isAccent);
  } catch (error) {
    console.error('Error playing beep:', error);
  }

  // Update visual indicator (only when starting a new beat)
  if (state.currentSubdivision === 0) {
    updateBeatIndicator();
  }

  // Advance subdivision
  state.currentSubdivision = (state.currentSubdivision + 1) % state.subdivisionCount;

  // Advance to next beat when subdivisions complete
  if (state.currentSubdivision === 0) {
    state.currentBeat = (state.currentBeat + 1) % state.beatsPerMeasure;
  }
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
    state.currentSubdivision = 0;

    // Update button UI
    elements.playMetronomeButton.innerHTML =
      '<span class="play-icon">■</span><span class="play-text">STOP</span>';
    elements.playMetronomeButton.classList.add('playing');
    elements.playMetronomeButton.setAttribute('aria-label', 'Stop metronome');

    // Disable fix button while playing
    elements.fixBpmButton.disabled = true;

    // Disable SET BPM button while playing
    updateSetBpmButtonState();

    // Disable time signature selector while playing
    elements.timeSignatureSelector.disabled = true;

    // Disable subdivision selector while playing
    elements.subdivisionSelector.disabled = true;

    // Play first beat immediately
    playMetronomeBeat();

    // Set up interval for subsequent beats using subdivision interval
    const interval = MetronomeLogic.calculateSubdivisionInterval(state.fixedBPM, state.subdivision);
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

  // Re-enable time signature selector
  elements.timeSignatureSelector.disabled = false;

  // Re-enable subdivision selector
  elements.subdivisionSelector.disabled = false;
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

  // Update subdivision options based on BPM
  updateSubdivisionOptions();

  // Enable play button
  elements.playMetronomeButton.disabled = false;

  // Enable save preset button
  elements.savePresetButton.disabled = false;

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
// TIME SIGNATURE FUNCTIONS
// ============================================

/**
 * Change time signature
 * @param {string} newTimeSignature - Time signature (e.g., "3/4", "6/8")
 */
function changeTimeSignature(newTimeSignature) {
  // Can't change time signature while metronome is playing
  if (state.metronomeActive) {
    console.warn('Cannot change time signature while metronome is playing');
    return;
  }

  try {
    // Validate time signature exists
    const config = MetronomeLogic.getTimeSignatureConfig(newTimeSignature);

    // Update state
    state.timeSignature = newTimeSignature;
    state.beatsPerMeasure = config.beatsPerMeasure;
    state.currentBeat = 0;

    // Update beat indicator to show correct number of dots
    updateBeatIndicatorDots();

    console.log(`Changed time signature to ${newTimeSignature} (${config.label})`);
  } catch (error) {
    console.error('Error changing time signature:', error);
  }
}

/**
 * Update beat indicator dots based on current time signature
 */
function updateBeatIndicatorDots() {
  const beatIndicator = elements.beatIndicator;

  // Clear existing dots
  beatIndicator.innerHTML = '';

  // Create dots for current time signature
  for (let i = 0; i < state.beatsPerMeasure; i++) {
    const dot = document.createElement('div');
    dot.className = 'beat-dot';
    dot.setAttribute('data-beat', i);
    beatIndicator.appendChild(dot);
  }

  // Update active dot
  updateBeatIndicator();
}

// ============================================
// SUBDIVISION FUNCTIONS
// ============================================

/**
 * Change subdivision
 * @param {string} newSubdivision - Subdivision (e.g., "1/4", "1/8", "1/16", "1/3")
 */
function changeSubdivision(newSubdivision) {
  // Can't change subdivision while metronome is playing
  if (state.metronomeActive) {
    console.warn('Cannot change subdivision while metronome is playing');
    return;
  }

  try {
    // Validate subdivision exists
    const config = MetronomeLogic.getSubdivisionConfig(newSubdivision);

    // Check if subdivision is valid for current BPM
    if (state.fixedBPM !== null && !MetronomeLogic.isSubdivisionValidForBPM(newSubdivision, state.fixedBPM)) {
      console.warn(`Subdivision ${newSubdivision} is not valid for BPM ${state.fixedBPM}`);
      // Revert selector to current subdivision
      elements.subdivisionSelector.value = state.subdivision;
      return;
    }

    // Update state
    state.subdivision = newSubdivision;
    state.subdivisionCount = config.count;
    state.currentSubdivision = 0;

    console.log(`Changed subdivision to ${newSubdivision} (${config.label})`);
  } catch (error) {
    console.error('Error changing subdivision:', error);
  }
}

/**
 * Update subdivision selector options based on current BPM
 * Disables sixteenth notes if BPM > 180
 */
function updateSubdivisionOptions() {
  if (!elements.subdivisionSelector) return;

  const options = elements.subdivisionSelector.options;

  // Enable/disable sixteenth notes based on BPM
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const subdivision = option.value;

    if (state.fixedBPM !== null && !MetronomeLogic.isSubdivisionValidForBPM(subdivision, state.fixedBPM)) {
      option.disabled = true;
      // If current selection is being disabled, revert to quarter notes
      if (state.subdivision === subdivision) {
        state.subdivision = '1/4';
        state.subdivisionCount = 1;
        elements.subdivisionSelector.value = '1/4';
      }
    } else {
      option.disabled = false;
    }
  }
}

// ============================================
// PRESET FUNCTIONS
// ============================================

/**
 * Open presets modal
 */
function openPresetsModal() {
  elements.presetsModal.hidden = false;
  renderPresetsList();
  elements.presetNameInput.focus();
}

/**
 * Close presets modal
 */
function closePresetsModal() {
  elements.presetsModal.hidden = true;
  elements.presetNameInput.value = '';
  elements.presetError.textContent = '';
}

/**
 * Save new preset with current settings
 */
function saveNewPreset() {
  const name = elements.presetNameInput.value.trim();

  // Validation
  if (!name) {
    elements.presetError.textContent = 'Please enter a preset name';
    elements.presetNameInput.focus();
    return;
  }

  if (name.length > 30) {
    elements.presetError.textContent = 'Name must be 30 characters or less';
    elements.presetNameInput.focus();
    return;
  }

  if (!state.fixedBPM) {
    elements.presetError.textContent = 'Please fix a BPM first';
    return;
  }

  try {
    const preset = PresetManager.addPreset(
      name,
      state.fixedBPM,
      state.timeSignature,
      state.subdivision
    );

    state.currentPresetId = preset.id;
    elements.presetNameInput.value = '';
    elements.presetError.textContent = '';
    renderPresetsList();

    console.log(`Saved preset: ${name}`);
  } catch (error) {
    elements.presetError.textContent = error.message;
  }
}

/**
 * Load a preset by ID
 */
function loadPreset(presetId) {
  const preset = PresetManager.getPreset(presetId);
  if (!preset) {
    console.error('Preset not found:', presetId);
    return;
  }

  // Stop metronome if playing
  if (state.metronomeActive) {
    stopMetronome();
  }

  // Clear taps and timers
  state.taps = [];
  if (state.resetTimer) {
    clearTimeout(state.resetTimer);
    state.resetTimer = null;
  }

  // Load BPM
  state.fixedBPM = preset.bpm;

  // Load time signature
  state.timeSignature = preset.timeSignature;
  const tsConfig = MetronomeLogic.getTimeSignatureConfig(preset.timeSignature);
  state.beatsPerMeasure = tsConfig.beatsPerMeasure;
  state.currentBeat = 0;
  elements.timeSignatureSelector.value = preset.timeSignature;
  updateBeatIndicatorDots();

  // Load subdivision
  state.subdivision = preset.subdivision;
  const subdivConfig = MetronomeLogic.getSubdivisionConfig(preset.subdivision);
  state.subdivisionCount = subdivConfig.count;
  state.currentSubdivision = 0;
  elements.subdivisionSelector.value = preset.subdivision;

  // Update displays
  updateDisplay();
  updateMetronomeDisplay();
  updateSubdivisionOptions();

  // Enable play button
  elements.playMetronomeButton.disabled = false;

  // Update fix button to locked state
  elements.fixBpmButton.textContent = 'UNLOCK';
  elements.fixBpmButton.classList.add('locked');
  elements.fixBpmButton.disabled = false;

  // Enable save preset button
  elements.savePresetButton.disabled = false;

  // Visual feedback
  elements.bpmValue.textContent = preset.bpm;

  // Track current preset
  state.currentPresetId = presetId;

  // Close modal
  closePresetsModal();

  console.log(`Loaded preset: ${preset.name}`);
}

/**
 * Delete a preset by ID
 */
function deletePreset(presetId) {
  if (!confirm('Delete this preset?')) {
    return;
  }

  PresetManager.deletePreset(presetId);

  if (state.currentPresetId === presetId) {
    state.currentPresetId = null;
  }

  renderPresetsList();
}

/**
 * Render the presets list in the modal
 */
function renderPresetsList() {
  const presets = PresetManager.getAllPresets();
  const container = elements.presetsList;

  container.innerHTML = '';

  if (presets.length === 0) {
    container.innerHTML = `
      <div class="presets-empty">
        <p>No presets saved yet.</p>
        <p>Save your first preset above!</p>
      </div>
    `;
    return;
  }

  // Separate factory and user presets
  const factoryPresets = presets.filter(p => p.isFactory);
  const userPresets = presets.filter(p => !p.isFactory);

  // Render factory presets section
  if (factoryPresets.length > 0) {
    const factorySection = document.createElement('div');
    factorySection.className = 'preset-section';
    factorySection.innerHTML = '<h4 class="preset-section-title">🎵 FACTORY PRESETS</h4>';

    factoryPresets.forEach(preset => {
      const item = createPresetItem(preset, false); // false = no delete button
      factorySection.appendChild(item);
    });

    container.appendChild(factorySection);
  }

  // Render user presets section
  if (userPresets.length > 0) {
    const userSection = document.createElement('div');
    userSection.className = 'preset-section';
    userSection.innerHTML = '<h4 class="preset-section-title">💾 MY PRESETS</h4>';

    // Sort by date (newest first)
    userPresets.sort((a, b) => b.createdAt - a.createdAt);

    userPresets.forEach(preset => {
      const item = createPresetItem(preset, true); // true = show delete button
      userSection.appendChild(item);
    });

    container.appendChild(userSection);
  }
}

/**
 * Create a preset list item element
 */
function createPresetItem(preset, showDelete) {
  const item = document.createElement('div');
  item.className = 'preset-item';
  if (preset.id === state.currentPresetId) {
    item.classList.add('active');
  }

  const subdivConfig = MetronomeLogic.SUBDIVISIONS[preset.subdivision];
  const subdivLabel = subdivConfig ? subdivConfig.label : preset.subdivision;

  const deleteButton = showDelete
    ? `<button class="preset-delete-btn" data-preset-id="${preset.id}">DELETE</button>`
    : '';

  item.innerHTML = `
    <div class="preset-info">
      <div class="preset-name">${preset.name}</div>
      <div class="preset-details">
        ${preset.bpm} BPM · ${preset.timeSignature} · ${subdivLabel}
      </div>
    </div>
    <div class="preset-actions">
      <button class="preset-load-btn" data-preset-id="${preset.id}">LOAD</button>
      ${deleteButton}
    </div>
  `;

  // Event listeners
  const loadBtn = item.querySelector('.preset-load-btn');
  loadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loadPreset(preset.id);
  });

  if (showDelete) {
    const deleteBtn = item.querySelector('.preset-delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      deletePreset(preset.id);
    });
  }

  return item;
}

/**
 * Clear current preset ID (when user manually changes settings)
 */
function clearCurrentPreset() {
  state.currentPresetId = null;
}

// ============================================
// MENU FUNCTIONS
// ============================================

/**
 * Open sidebar menu
 */
function openMenu() {
  elements.sidebarMenu.classList.add('open');
  elements.menuOverlay.classList.add('visible');
  state.menuOpen = true;
}

/**
 * Close sidebar menu
 */
function closeMenu() {
  elements.sidebarMenu.classList.remove('open');
  elements.menuOverlay.classList.remove('visible');
  state.menuOpen = false;
}

/**
 * Toggle menu open/closed
 */
function toggleMenu() {
  if (state.menuOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

/**
 * Switch to a different module
 */
function switchModule(moduleName) {
  // Skip if same module or disabled
  const moduleButton = document.querySelector(`[data-module="${moduleName}"]`);
  if (state.activeModule === moduleName || moduleButton.classList.contains('disabled')) {
    return;
  }

  // HYBRID AUTO-FIX LOGIC
  // When switching TO metronome FROM bpm-finder: auto-fix if BPM calculated
  if (moduleName === 'metronome' && state.activeModule === 'bpm') {
    const calculatedBPM = calculateBPM();
    if (calculatedBPM !== null && MetronomeLogic.isValidMetronomeBPM(calculatedBPM)) {
      state.lastCalculatedBPM = calculatedBPM;
      // Auto-fix BPM
      state.fixedBPM = calculatedBPM;
      updateMetronomeDisplay();
      updateSubdivisionOptions();
      elements.playMetronomeButton.disabled = false;
      elements.savePresetButton.disabled = false;
      elements.fixBpmButton.textContent = 'UNLOCK';
      elements.fixBpmButton.classList.add('locked');
      elements.fixBpmButton.disabled = false;
      console.log(`Auto-fixed BPM to ${calculatedBPM} when switching to Metronome`);
    }
  }

  // Stop metronome if switching away from metronome module
  if (state.activeModule === 'metronome' && state.metronomeActive) {
    stopMetronome();
  }

  // Hide all modules
  document.querySelectorAll('.module').forEach(module => {
    module.hidden = true;
  });

  // Remove active class from all menu items
  elements.menuItems.forEach(item => {
    item.classList.remove('active');
  });

  // Show selected module
  document.getElementById(`${moduleName}-module`).hidden = false;

  // Add active class to selected menu item
  moduleButton.classList.add('active');

  // Update state
  state.activeModule = moduleName;

  // Close menu after selection
  closeMenu();

  console.log(`Switched to module: ${moduleName}`);
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
 * Handle keyboard events (spacebar and ESC)
 */
document.addEventListener('keydown', (e) => {
  // ESC key closes menu
  if (e.key === 'Escape' && state.menuOpen) {
    closeMenu();
    return;
  }

  // Prevent spacebar tap when menu is open
  if ((e.code === 'Space' || e.key === ' ') && state.menuOpen) {
    e.preventDefault();
    return;
  }

  // Check if spacebar is pressed
  if (e.code === 'Space' || e.key === ' ') {
    e.preventDefault(); // Prevent page scroll
    handleTap();
  }
});

/**
 * Prevent spacebar from triggering buttons when they have focus
 */
elements.tapButton.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.key === ' ') {
    e.preventDefault();
  }
});

/**
 * Hamburger button click
 */
elements.hamburgerButton.addEventListener('click', (e) => {
  e.preventDefault();
  toggleMenu();
});

/**
 * Close button click
 */
elements.closeMenuButton.addEventListener('click', (e) => {
  e.preventDefault();
  closeMenu();
});

/**
 * Overlay click (close menu)
 */
elements.menuOverlay.addEventListener('click', () => {
  closeMenu();
});

/**
 * Menu item clicks
 */
elements.menuItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const moduleName = item.dataset.module;
    switchModule(moduleName);
  });
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
 * Handle time signature selection change
 */
elements.timeSignatureSelector.addEventListener('change', (e) => {
  e.preventDefault();
  changeTimeSignature(e.target.value);
  clearCurrentPreset(); // Clear preset when user manually changes settings
});

/**
 * Handle subdivision selection change
 */
elements.subdivisionSelector.addEventListener('change', (e) => {
  e.preventDefault();
  changeSubdivision(e.target.value);
  clearCurrentPreset(); // Clear preset when user manually changes settings
});

/**
 * Handle SAVE PRESET button click
 */
elements.savePresetButton.addEventListener('click', (e) => {
  e.preventDefault();
  openPresetsModal();
});

/**
 * Handle PRESETS button click
 */
elements.managePresetsButton.addEventListener('click', (e) => {
  e.preventDefault();
  openPresetsModal();
});

/**
 * Handle save new preset button in modal
 */
elements.saveNewPresetButton.addEventListener('click', (e) => {
  e.preventDefault();
  saveNewPreset();
});

/**
 * Handle close presets modal button
 */
elements.closePresetsButton.addEventListener('click', (e) => {
  e.preventDefault();
  closePresetsModal();
});

/**
 * Handle Enter/Escape keys in preset name input
 */
elements.presetNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    saveNewPreset();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    closePresetsModal();
  }
});

/**
 * Clear error message when user starts typing preset name
 */
elements.presetNameInput.addEventListener('input', () => {
  elements.presetError.textContent = '';
});

/**
 * Close modal when clicking on overlay background
 */
elements.presetsModal.addEventListener('click', (e) => {
  if (e.target === elements.presetsModal) {
    closePresetsModal();
  }
});

/**
 * Prevent spacebar from triggering tap when preset buttons have focus
 */
elements.savePresetButton.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.key === ' ') {
    e.stopPropagation();
  }
});

elements.managePresetsButton.addEventListener('keydown', (e) => {
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
// PRESET MANAGEMENT
// ============================================

/**
 * Preset system with factory presets + localStorage for user presets
 */
const PresetManager = {
  storageKey: 'bpm-presets',
  maxPresets: 20,

  /**
   * Get all presets (factory + user)
   */
  getAllPresets() {
    const user = this.getUserPresets();
    return [...FACTORY_PRESETS, ...user];
  },

  /**
   * Get user-created presets from localStorage
   */
  getUserPresets() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading presets:', error);
      return [];
    }
  },

  /**
   * Add a new user preset
   */
  addPreset(name, bpm, timeSignature, subdivision) {
    const userPresets = this.getUserPresets();

    if (userPresets.length >= this.maxPresets) {
      throw new Error(`Maximum ${this.maxPresets} user presets allowed`);
    }

    const preset = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      bpm,
      timeSignature,
      subdivision,
      isFactory: false,
      createdAt: Date.now()
    };

    userPresets.push(preset);
    localStorage.setItem(this.storageKey, JSON.stringify(userPresets));
    return preset;
  },

  /**
   * Get a specific preset by ID
   */
  getPreset(id) {
    return this.getAllPresets().find(p => p.id === id);
  },

  /**
   * Delete a user preset (cannot delete factory presets)
   */
  deletePreset(id) {
    // Cannot delete factory presets
    if (id.startsWith('factory-')) {
      console.warn('Cannot delete factory preset');
      return;
    }

    let userPresets = this.getUserPresets();
    userPresets = userPresets.filter(p => p.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(userPresets));
  },

  /**
   * Initialize preset system
   */
  init() {
    renderPresetsList();
  }
};

// ============================================
// INITIALIZATION
// ============================================

// Initialize display
updateDisplay();

// Initialize theme system
ThemeManager.init();

// Initialize preset system
PresetManager.init();
