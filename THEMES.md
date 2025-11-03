# Theme Documentation

Welcome to the BPM Calculator theme system! This guide will help you create custom themes and contribute them to the project.

## Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
- [CSS Variables Reference](#css-variables-reference)
- [Creating a Custom Theme](#creating-a-custom-theme)
- [Adding Your Theme to the Project](#adding-your-theme-to-the-project)
- [Testing Your Theme](#testing-your-theme)
- [Contribution Guidelines](#contribution-guidelines)
- [Examples](#examples)

---

## Overview

The BPM Calculator uses a theme system based on CSS custom properties (variables). Each theme defines a complete color palette that affects all visual elements of the application.

**Current Themes:**
- **Classic** - 8-bit retro gaming aesthetic with neon green, magenta, and cyan
- **Severance** - Dark and mysterious theme inspired by the TV series
- **Wildtech** - Warm earth tones with orange and brown

---

## Quick Start

To create a new theme, you need to:
1. Define CSS variables for your color palette
2. Add HTML for the theme selector button
3. The theme system handles the rest automatically!

---

## CSS Variables Reference

Every theme must define these CSS custom properties:

### Core Colors

```css
--color-bg           /* Main background color */
--color-primary      /* Primary accent color (borders, main text highlights) */
--color-secondary    /* Secondary accent color (reset button, tap count) */
--color-accent       /* Accent color (BPM display border, footer links) */
--color-text         /* Main text color */
--color-border       /* Border color for container and elements */
--color-shadow       /* Shadow color (rgba recommended) */
```

### Button-Specific Colors

```css
--color-button-dark   /* Darker shade for button shadow/3D effect */
--color-button-light  /* Lighter shade for button hover state */
--color-button-shadow /* Button shadow color (rgba recommended) */
```

### Transparent Overlays

```css
--color-container-inset  /* Inset shadow for container (rgba recommended) */
--color-accent-glow      /* Glow effect for accent elements (rgba recommended) */
```

### Usage Notes
- Use `rgba()` values for shadow and overlay colors to maintain transparency
- Ensure sufficient contrast between text and background colors for accessibility
- Test colors in both hover and active states

---

## Creating a Custom Theme

### Step 1: Design Your Color Palette

Choose colors that work well together. Consider:
- **Background**: Usually dark for readability
- **Primary**: Your main accent color (used heavily throughout)
- **Secondary**: Complementary color for variety
- **Accent**: Highlight color for special elements
- **Text**: High contrast with background

**Example Palette Planning:**
```
Background: #1a1a2e (dark blue)
Primary:    #16213e (steel blue)
Secondary:  #0f3460 (deep blue)
Accent:     #e94560 (coral red)
Text:       #eaeaea (light gray)
```

### Step 2: Add Theme Definition to CSS

Open `styles.css` and add your theme definition after the existing themes:

```css
/* Your Theme Name */
[data-theme="your-theme-name"] {
    /* Core Colors */
    --color-bg: #1a1a2e;
    --color-primary: #16213e;
    --color-secondary: #0f3460;
    --color-accent: #e94560;
    --color-text: #eaeaea;
    --color-border: #16213e;
    --color-shadow: rgba(22, 33, 62, 0.5);

    /* Button Colors */
    --color-button-dark: #0f1829;
    --color-button-light: #1f2f4e;
    --color-button-shadow: rgba(22, 33, 62, 0.4);

    /* Overlays */
    --color-container-inset: rgba(22, 33, 62, 0.1);
    --color-accent-glow: rgba(233, 69, 96, 0.3);
}
```

**Tips:**
- Use the theme name in kebab-case (lowercase with hyphens)
- For button colors, use darker/lighter variations of your primary color
- Shadow colors should match the primary color with 0.4-0.5 opacity
- Glow colors should match their corresponding elements with 0.3 opacity

### Step 3: Add Theme Selector Button

Open `index.html` and add a new button to the `.theme-selector` div:

```html
<button class="theme-button" data-theme="your-theme-name" aria-label="Your Theme Name" title="Your Theme">
    <span class="theme-color" style="background: #16213e;"></span>
    <span class="theme-color" style="background: #0f3460;"></span>
    <span class="theme-color" style="background: #e94560;"></span>
</button>
```

**Notes:**
- Use 3 representative colors from your palette for the preview
- The `data-theme` attribute must match your CSS selector name
- Choose colors that best represent your theme visually

### Step 4: Test Your Theme

1. Open `index.html` in a browser
2. Click your new theme button
3. Verify all elements look correct:
   - Background color
   - Button colors and hover states
   - Text readability
   - Border and shadow effects
   - Theme persists after page reload

---

## Adding Your Theme to the Project

Ready to share your theme? Follow these steps:

### 1. Test Thoroughly
- Check all interactive states (hover, active, focus)
- Test on mobile and desktop
- Verify localStorage persistence
- Ensure accessibility (contrast ratios)

### 2. Take Screenshots
Create screenshots showing:
- The full calculator with your theme
- Different states (resting, tapping, with BPM displayed)

### 3. Document Your Theme
Add details about your theme:
- Name and inspiration
- Color palette with hex codes
- Any special design considerations

### 4. Submit a Pull Request
1. Fork the repository
2. Create a new branch: `git checkout -b theme/your-theme-name`
3. Add your theme changes to `styles.css` and `index.html`
4. Commit your changes with a clear message
5. Push and create a pull request

---

## Testing Your Theme

### Checklist

Use this checklist to ensure your theme is complete:

#### Visual Elements
- [ ] Background color is applied
- [ ] Container border and shadow use theme colors
- [ ] Title text and glow animation work correctly
- [ ] BPM display border and shadow are visible
- [ ] BPM value text is readable
- [ ] Tap button colors are correct
- [ ] Tap button hover state looks good
- [ ] Tap button active state (pressed) works
- [ ] Tap count border uses theme color
- [ ] Reset button border and hover state work
- [ ] Footer links use accent color
- [ ] Theme selector buttons are visible
- [ ] Active theme button is highlighted

#### Interaction States
- [ ] All hover effects work smoothly
- [ ] Button press animations are visible
- [ ] Focus states are clearly visible (keyboard navigation)
- [ ] Text shadows and glows are subtle but effective

#### Technical
- [ ] Theme persists after page reload
- [ ] Theme selection is saved in localStorage
- [ ] No console errors
- [ ] All colors have sufficient contrast (WCAG AA)
- [ ] Works on mobile devices
- [ ] Works in different browsers

---

## Contribution Guidelines

### Color Accessibility

Ensure your theme meets accessibility standards:
- **Text contrast**: Minimum 4.5:1 ratio for normal text
- **Large text**: Minimum 3:1 ratio for large text (18pt+)
- **UI elements**: Minimum 3:1 ratio for interactive elements

**Tools to check contrast:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Contrast Ratio](https://contrast-ratio.com/)

### Design Principles

Good themes should:
- Have a clear visual identity
- Use colors that complement each other
- Maintain readability in all states
- Work well with the 8-bit aesthetic
- Be inspired by something (game, movie, nature, etc.)

### Code Style

When contributing themes:
- Use consistent indentation (2 spaces)
- Add comments explaining your theme's inspiration
- Group related properties together
- Use meaningful color values (not random choices)

### Theme Naming

- Use descriptive names: `cyberpunk`, `forest`, `sunset`
- Avoid generic names: `blue`, `dark`, `light`
- Keep names short (1-2 words)
- Use kebab-case for CSS: `data-theme="cyberpunk-city"`

---

## Examples

### Example 1: Synthwave Theme

**Inspiration:** 80s synthwave aesthetic with purple and pink gradients

```css
/* Synthwave Theme */
[data-theme="synthwave"] {
    --color-bg: #2b1055;
    --color-primary: #7f00ff;
    --color-secondary: #e100ff;
    --color-accent: #ff006e;
    --color-text: #f5f5ff;
    --color-border: #7f00ff;
    --color-shadow: rgba(127, 0, 255, 0.5);

    --color-button-dark: #5a0099;
    --color-button-light: #9f00ff;
    --color-button-shadow: rgba(127, 0, 255, 0.4);

    --color-container-inset: rgba(127, 0, 255, 0.1);
    --color-accent-glow: rgba(255, 0, 110, 0.3);
}
```

**HTML:**
```html
<button class="theme-button" data-theme="synthwave" aria-label="Synthwave theme" title="Synthwave">
    <span class="theme-color" style="background: #7f00ff;"></span>
    <span class="theme-color" style="background: #e100ff;"></span>
    <span class="theme-color" style="background: #ff006e;"></span>
</button>
```

### Example 2: Forest Theme

**Inspiration:** Natural forest colors with greens and browns

```css
/* Forest Theme */
[data-theme="forest"] {
    --color-bg: #1a2f1a;
    --color-primary: #4a7c4e;
    --color-secondary: #7c5c3d;
    --color-accent: #9ccc65;
    --color-text: #e8f5e9;
    --color-border: #4a7c4e;
    --color-shadow: rgba(74, 124, 78, 0.5);

    --color-button-dark: #2d4a2e;
    --color-button-light: #5a9c5e;
    --color-button-shadow: rgba(74, 124, 78, 0.4);

    --color-container-inset: rgba(74, 124, 78, 0.1);
    --color-accent-glow: rgba(156, 204, 101, 0.3);
}
```

### Example 3: Minimal Monochrome

**Inspiration:** Clean, minimal design with grayscale

```css
/* Minimal Theme */
[data-theme="minimal"] {
    --color-bg: #0f0f0f;
    --color-primary: #e0e0e0;
    --color-secondary: #999999;
    --color-accent: #ffffff;
    --color-text: #e0e0e0;
    --color-border: #666666;
    --color-shadow: rgba(224, 224, 224, 0.5);

    --color-button-dark: #555555;
    --color-button-light: #ffffff;
    --color-button-shadow: rgba(224, 224, 224, 0.4);

    --color-container-inset: rgba(224, 224, 224, 0.1);
    --color-accent-glow: rgba(255, 255, 255, 0.3);
}
```

---

## Troubleshooting

### Theme doesn't apply
- Check that `data-theme` attribute matches exactly (including hyphens)
- Verify CSS selector uses square brackets: `[data-theme="name"]`
- Clear browser cache and localStorage

### Colors look wrong
- Ensure all required CSS variables are defined
- Check for typos in variable names (they're case-sensitive)
- Use browser DevTools to inspect computed styles

### Theme doesn't persist
- Check browser console for errors
- Verify localStorage is enabled in browser
- Test in an incognito window to rule out extensions

### Poor contrast
- Use a contrast checker tool
- Adjust lightness/darkness of colors
- Test with different screen brightness settings

---

## Resources

### Color Tools
- [Coolors](https://coolors.co/) - Color palette generator
- [Adobe Color](https://color.adobe.com/) - Color wheel and palettes
- [Paletton](https://paletton.com/) - Color scheme designer

### Inspiration
- [Dribble](https://dribbble.com/colors) - Design inspiration
- [Color Hunt](https://colorhunt.co/) - Color palettes
- [LOL Colors](https://www.webdesignrankings.com/resources/lolcolors/) - Curated color palettes

### Accessibility
- [WebAIM](https://webaim.org/) - Accessibility guidelines
- [A11y Project](https://www.a11yproject.com/) - Accessibility checklist
- [WAVE Tool](https://wave.webaim.org/) - Accessibility evaluation

---

## Questions?

If you have questions about creating themes:
1. Check existing themes in `styles.css` for reference
2. Open an issue on GitHub with the "question" label
3. Review this documentation thoroughly

We love seeing creative themes! Don't hesitate to experiment and share your creations.

Happy theming! 🎨
