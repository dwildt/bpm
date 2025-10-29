# BPM Calculator - Implementation Plan

## Overview
Build a BPM (Beats Per Minute) calculator with an 8-bit game aesthetic that runs on GitHub Pages.

## Technology Stack
**Vanilla JavaScript**
- **Testing**: Jest for unit testing
- **Linting**: ESLint for code quality and consistency 

## File Structure
```
bpm/
├── tasks/
│   └── plan.md        # This implementation plan document
├── index.html          # Main HTML file
├── styles.css          # 8-bit game styling
├── app.js             # BPM calculation logic
├── claude.md          # Claude Code development notes
├── package.json       # Node.js dependencies and scripts
├── eslint.config.js   # ESLint configuration
└── README.md          # Project documentation
```

## Development Tools

### Testing with Jest
- Unit tests for BPM calculation logic
- Run tests: `npm test`
- Watch mode: `npm run test:watch`
- Coverage report: `npm run test:coverage`

### Code Quality with ESLint
- Enforce consistent code style
- Catch potential errors early
- Run linter: `npm run lint`
- Auto-fix issues: `npm run lint:fix`
- Configuration: `eslint.config.js`

## Core Features

### 1. BPM Calculation Logic
- Track tap timestamps in an array
- Calculate intervals between consecutive taps
- Compute average BPM from intervals (60000ms / average interval)
- Auto-reset after period of inactivity (e.g., 3 seconds)
- Display current BPM in real-time
- Show tap count

### 2. UI Components
- **Large tap button** - Center of screen, main interaction point
- **BPM display** - Large, prominent, retro font showing current BPM
- **Tap counter** - Shows number of taps recorded
- **Reset button** - Manual reset option
- **Instructions** - Brief guide on how to use

### 3. 8-bit Game Aesthetic
- Pixel/retro fonts (Press Start 2P from Google Fonts)
- Dark background (#000000 or #0a0a0a)
- Neon/bright accent colors (#00ff00, #ff00ff, #00ffff)
- Pixelated/chunky button styling
- CRT screen effect (optional scanlines)
- Box shadows for depth
- Retro color palette

### 4. Interactions
- **Mouse click** - Click the tap button
- **Spacebar** - Press spacebar to tap
- **Visual feedback** - Button animation on tap (scale/color change)
- **Accessibility** - Keyboard navigation support

### 5. GitHub Pages Deployment
- Pure static files (HTML, CSS, JS)
- No build process required
- Deploy directly from main branch

## Implementation Steps

1. ✅ Create tasks folder and save this plan
2. ✅ Create index.html with semantic HTML structure
3. ✅ Create styles.css with 8-bit game aesthetic
4. ✅ Create app.js with BPM calculation logic
5. ✅ Add keyboard and mouse event listeners
6. ✅ Test the application locally
7. ✅ Update README.md with deployment instructions
8. ✅ Add footer with GitHub repo, sponsor link, and Claude Code credit
9. ✅ Create claude.md documentation
10. ✅ Update tasks/plan.md with completion status
11. ✅ Set up Jest for unit testing
12. ✅ Set up ESLint for code quality
13. ✅ Update documentation with testing and linting information

## Status: ✅ COMPLETED

All features implemented and tested. Application is ready for deployment to GitHub Pages.

## Algorithm Details

### BPM Calculation
```
BPM = 60000 / average_interval_ms

Where:
- 60000 = milliseconds in a minute
- average_interval_ms = average time between taps
```

### Example
If user taps at: 0ms, 500ms, 1000ms, 1500ms
- Intervals: [500, 500, 500]
- Average interval: 500ms
- BPM: 60000 / 500 = 120 BPM

### Edge Cases
- First tap: Don't calculate BPM (need at least 2 taps)
- Reset after inactivity: Clear taps if >3 seconds since last tap
- Minimum taps: Show BPM after at least 2 taps
- Maximum taps: Keep last 8-16 taps for rolling average

## Design Mockup (Text)

```
┌─────────────────────────────────────┐
│         🎵 BPM CALCULATOR 🎵        │
├─────────────────────────────────────┤
│                                     │
│            BPM: 120                 │
│                                     │
│        ┌───────────────────┐        │
│        │                   │        │
│        │    TAP HERE       │        │
│        │  (or spacebar)    │        │
│        │                   │        │
│        └───────────────────┘        │
│                                     │
│          Taps: 8                    │
│                                     │
│          [RESET]                    │
│                                     │
└─────────────────────────────────────┘
```

## GitHub Pages Deployment Steps

1. Push code to GitHub repository
2. Go to repository Settings
3. Navigate to Pages section
4. Select "main" branch as source
5. Save and wait for deployment
6. Access at: https://dwildt.github.io/bpm/

## Additional Features Implemented

### Footer Enhancement
- Added GitHub repository link
- Added GitHub sponsor link
- Added Claude Code credit with link
- Styled links with 8-bit aesthetic (cyan/green colors with hover effects)

### Documentation
- **claude.md**: Comprehensive documentation about the development process using Claude Code
- **README.md**: Complete guide with setup, deployment, and usage instructions
- **tasks/plan.md**: Implementation plan with completion tracking
