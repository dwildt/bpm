# Theme Gallery Implementation Plan

## Overview
Add a theme gallery system to the BPM calculator that allows users to select different color themes. Theme selection will be saved in localStorage for persistence across sessions.

## User Requirements
- Enable theme gallery for visual variety
- Theme selector in footer (icon-based with color previews)
- Three themes: Classic 8-bit (current), Severance (dark/mysterious), Wildtech (warm earth tones)
- localStorage persistence for theme selection
- Create documentation for contributors to add new themes

## Theme Definitions

### 1. Classic 8-bit (Current/Default)
- **Background**: #0a0a0a (black)
- **Primary**: #00ff00 (neon green)
- **Secondary**: #ff00ff (magenta)
- **Accent**: #00ffff (cyan)
- **Text**: #ffffff (white)
- **Aesthetic**: Retro 8-bit gaming with neon colors

### 2. Severance
Dark/mysterious theme inspired by the TV series, using blues, greens, and blacks.
- **Background**: #0d1117 (deep blue-black)
- **Primary**: #2f4858 (steel blue)
- **Secondary**: #1a3a3a (dark teal)
- **Accent**: #4a7c7e (muted cyan-green)
- **Text**: #c9d1d9 (cool gray)
- **Aesthetic**: Corporate/mysterious, cool and sterile

### 3. Wildtech
Warm earth tones theme complementing orange and brown.
- **Background**: #2b1a0f (dark brown)
- **Primary**: #ff7b00 (bright orange)
- **Secondary**: #8b4513 (saddle brown)
- **Accent**: #d4a574 (tan/beige)
- **Text**: #f5deb3 (wheat/cream)
- **Aesthetic**: Natural, organic, warm

## Implementation Details

### File Changes Required

#### 1. **styles.css**
- Convert ALL hardcoded colors to CSS variables
  - Currently hardcoded: tap button shadows (#00aa00), hover states (#00dd00)
- Create theme-specific CSS using `[data-theme]` attribute selectors
- Keep scanline effect for all themes (as requested)
- Add smooth transitions for theme changes

#### 2. **index.html**
- Add icon-based theme switcher to footer
- Display color preview circles for each theme
- Integrate seamlessly with existing footer design

#### 3. **app.js**
- Add theme switching functionality
- localStorage integration:
  - Key: `'bpm-theme'`
  - Values: `'classic'`, `'severance'`, `'wildtech'`
- Load saved theme on page initialization
- Update active theme indicator in UI
- Add event listeners for theme selection

#### 4. **THEMES.md** (New Documentation)
- Complete guide for creating custom themes
- CSS variable reference
- Color palette structure and requirements
- Example theme template
- Contribution guidelines
- Testing instructions for theme development

## Technical Architecture

### CSS Structure
```css
/* Base variables (defaults) */
:root {
  --color-bg: #0a0a0a;
  --color-primary: #00ff00;
  /* ... etc */
}

/* Theme-specific overrides */
[data-theme="severance"] {
  --color-bg: #0d1117;
  --color-primary: #2f4858;
  /* ... etc */
}

[data-theme="wildtech"] {
  --color-bg: #2b1a0f;
  --color-primary: #ff7b00;
  /* ... etc */
}
```

### localStorage Structure
```javascript
{
  "bpm-theme": "classic" // or "severance" or "wildtech"
}
```

### JavaScript Theme Management
```javascript
// Load theme on initialization
const savedTheme = localStorage.getItem('bpm-theme') || 'classic';
document.documentElement.setAttribute('data-theme', savedTheme);

// Switch theme
function setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('bpm-theme', themeName);
  updateThemeUI(themeName);
}
```

## User Experience

### Theme Switcher UI
- Located in footer for easy access
- Icon-based design with color preview circles
- Each theme shows 2-3 representative colors
- Active theme visually highlighted
- Smooth color transitions (CSS transitions)

### Persistence
- Theme choice saved immediately on selection
- Persists across browser sessions
- Defaults to 'classic' theme for first-time visitors

## Design Decisions

1. **Scanline Effect**: Keep for all themes (maintains retro aesthetic)
2. **UI Style**: Icon-based switcher (compact, visual, intuitive)
3. **Severance Palette**: Dark/mysterious interpretation (blues, greens, blacks)
4. **Wildtech Palette**: Warm earth tones complementing orange and brown
5. **Default Theme**: Classic 8-bit (current design)

## Testing Checklist

- [ ] All themes display correctly
- [ ] Theme switching works smoothly
- [ ] localStorage saves theme selection
- [ ] Theme persists after page reload
- [ ] Theme persists across browser sessions
- [ ] Active theme indicator updates correctly
- [ ] All buttons and elements use theme colors
- [ ] Scanlines visible on all themes
- [ ] No hardcoded colors remaining
- [ ] Responsive on mobile devices
- [ ] Keyboard accessible
- [ ] Documentation is clear and complete

## Future Enhancements (Not in Scope)

- Theme builder/customizer UI
- More theme presets
- Import/export custom themes
- Theme preview before applying
- Dark/light mode toggle
- Font variations per theme
- Optional scanline toggle

---

**Created**: 2025-11-01
**Status**: Ready for implementation
