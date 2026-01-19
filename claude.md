# Built with Claude Code

This project was created using [Claude Code](https://claude.ai/code), Anthropic's AI-powered coding assistant.

## About Claude Code

Claude Code is an intelligent coding assistant that helps developers:
- Write clean, well-structured code
- Plan and implement features systematically
- Follow best practices and modern standards
- Build complete applications from scratch

## Development Process

### Initial Planning

The project began with a clear request: build a BPM calculator with an 8-bit game aesthetic that can run on GitHub Pages. Claude Code:

1. **Analyzed Requirements**
   - Explored the existing (empty) codebase
   - Evaluated technology options (Remix vs. vanilla JavaScript)
   - Recommended vanilla JavaScript for simplicity and GitHub Pages compatibility

2. **Created Implementation Plan**
   - Defined file structure
   - Outlined core features
   - Documented the BPM calculation algorithm
   - Planned the 8-bit aesthetic approach

### Implementation

Claude Code built the entire application systematically:

#### 1. HTML Structure (`index.html`)
- Semantic HTML5 markup
- Accessibility features (ARIA labels, keyboard navigation)
- Clean, organized structure
- Google Fonts integration for retro typography

#### 2. 8-bit Styling (`styles.css`)
- CSS custom properties for consistent theming
- Neon color palette (green, pink, cyan)
- Press Start 2P pixel font
- Scanline effect for CRT monitor feel
- Responsive design with mobile support
- Smooth animations and transitions
- Hover states and visual feedback

#### 3. BPM Logic (`app.js`)
- Clean, well-documented JavaScript
- Efficient timestamp tracking
- Rolling average calculation (last 16 taps)
- Auto-reset functionality (3-second timeout)
- Keyboard and mouse event handling
- Real-time UI updates

#### 4. Documentation
- Comprehensive README with setup instructions
- Deployment guide for GitHub Pages
- Code comments and explanations
- This development notes file

### Key Features Implemented

- **Tap Detection**: Both mouse and keyboard (spacebar) support
- **BPM Calculation**: Real-time calculation using timestamp intervals
- **Manual BPM Input**: Direct BPM entry via modal dialog with validation
- **Visual Feedback**: Button animations, glow effects, color changes
- **Auto-reset**: Automatic reset after 3 seconds of inactivity
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Keyboard navigation and ARIA labels
- **8-bit Aesthetic**: Retro game-inspired UI with pixel fonts and neon colors

## Algorithm Details

The BPM calculation uses a simple but effective approach:

```javascript
// Formula: BPM = 60000 / average_interval_ms

1. Record timestamp for each tap
2. Calculate intervals between consecutive taps
3. Compute average interval
4. Convert to BPM using the formula above
5. Maintain rolling window of last 16 taps
```

## Code Quality

Claude Code ensured:
- **Clean Code**: Well-organized, readable, and maintainable
- **Best Practices**: Modern JavaScript, semantic HTML, efficient CSS
- **Documentation**: Inline comments and comprehensive README
- **Accessibility**: Keyboard support, ARIA labels, focus states
- **Responsiveness**: Mobile-first approach with responsive design
- **Performance**: No dependencies, pure vanilla JavaScript

## Git Commit Conventions

This project follows strict commit message conventions to maintain a clean history and automate issue management.

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependencies, tooling

**Subject:**
- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Maximum 50 characters

**Body:**
- Explain what and why (not how)
- Wrap at 72 characters
- Can include bullet points

### Development Workflow

**CRITICAL: Always create a GitHub issue BEFORE starting any development work.**

**Workflow:**
1. **Create GitHub Issue** describing the feature, bug fix, or task
2. **Plan the implementation** (if needed)
3. **Implement the changes** referencing the issue
4. **Claude Code commits** with proper message that closes the issue
5. **User pushes to main** - issue closes automatically

**Why this matters:**
- Maintains clear project history
- Enables discussion before implementation
- Provides context for future reference
- Automates issue tracking
- Documents decision-making process

**Claude Code Permissions:**
- ✅ Can: git status, git add, git commit
- ❌ Cannot: git push (user responsibility)

### Issue Referencing

**CRITICAL: Always reference related GitHub issues in commit messages.**

**Reference Format:**
```
feat: add manual BPM input with modal dialog

Implement modal dialog for direct BPM entry.

Related to #2
```

**Auto-closing Keywords:**

When a commit completes work on an issue, use closing keywords in the commit footer:

```
feat: implement feature X

Description of changes...

Fixes #123
Closes #456
Resolves #789
```

**Available Keywords:**
- `Fixes #issue` - Closes the issue
- `Closes #issue` - Closes the issue
- `Resolves #issue` - Closes the issue

**Multiple Issues:**
```
Fixes #123, #456
Closes #789
```

**Important Notes:**
- Keywords are case-insensitive (`Fixes`, `fixes`, `FIXES` all work)
- Must be in commit message body or footer (not just subject)
- Issues close automatically when commit is pushed to default branch (main)

### Co-authorship

All commits assisted by Claude Code should include:

```
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Complete Examples

**Example 1: Feature with Issue Reference**
```
feat: add manual BPM input with modal dialog

Add a "SET BPM" button that allows users to directly enter a BPM value
instead of tapping to calculate it. This provides a faster workflow for
users who already know their desired tempo.

Features:
- Modal dialog with BPM input field (30-300 range)
- Real-time validation with helpful error messages
- Keyboard shortcuts (Enter to confirm, Escape to cancel)
- Automatically fixes BPM and enables metronome
- Button disabled during metronome playback
- Maintains 8-bit aesthetic across all themes

Closes #2

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Example 2: Bug Fix**
```
fix: resolve metronome timing drift after 5 minutes

The metronome was experiencing timing drift due to setInterval
accumulation. Switched to a more precise scheduling mechanism
using AudioContext.currentTime.

Fixes #15

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Example 3: Documentation**
```
docs: update README with keyboard shortcuts

Add comprehensive keyboard shortcuts section to README.md
to improve discoverability of features.

Related to #20

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Example 4: Multiple Issues**
```
refactor: simplify metronome state management

Consolidate metronome state into single object and remove
redundant boolean flags. This improves code maintainability
and reduces potential for state inconsistencies.

Fixes #25, #27
Resolves #30

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Bad Examples (Avoid These)

❌ **No issue reference:**
```
feat: add new button
```

❌ **Vague subject:**
```
fix: fix bug
```

❌ **Wrong keyword:**
```
feat: add feature

Issue #123 is done now
```

❌ **Missing Co-authored-by:**
```
feat: add feature

Closes #123
```

❌ **Capital letter in subject:**
```
feat: Add new feature
```

### Workflow Summary

1. **Create GitHub issue** for the task
2. **Work on the feature/fix** in your branch
3. **Write commit message** following conventions
4. **Reference issue** with `Fixes #N` when complete
5. **Push to main** - issue closes automatically
6. **Always include** Claude co-authorship

This ensures:
- ✅ Clean commit history
- ✅ Automatic issue tracking
- ✅ Clear attribution
- ✅ Easy navigation between code and discussions

## Technology Choices

### Why Vanilla JavaScript?

Claude Code recommended vanilla JavaScript over Remix because:
1. **Simplicity**: No build process or server required
2. **GitHub Pages**: Perfect for static hosting
3. **Performance**: Zero dependencies, fast loading
4. **Learning**: Pure web fundamentals
5. **Maintainability**: No framework updates or dependencies

### Why These Tools?

- **Google Fonts**: Press Start 2P for authentic 8-bit typography
- **CSS Custom Properties**: Easy theming and maintenance
- **Flexbox**: Simple, powerful layout system
- **Modern JavaScript**: ES6+ features for clean code

## Development Timeline

The entire project was built in a single session:

1. ✅ Planning and exploration
2. ✅ HTML structure
3. ✅ CSS styling with 8-bit aesthetic
4. ✅ JavaScript BPM calculation logic
5. ✅ Event listeners and interactions
6. ✅ Testing and refinement
7. ✅ Documentation (README, this file)
8. ✅ Footer with links and credits

## What Made This Efficient

Claude Code's approach:
- **Systematic Planning**: Clear roadmap before coding
- **Best Practices**: Following web standards from the start
- **Complete Implementation**: All features working together
- **Documentation**: Explained decisions and how things work
- **No Iterations**: Right approach chosen from the beginning

## Learning from This Project

This project demonstrates:
- **Simple is Powerful**: Vanilla JavaScript can do a lot
- **Planning Matters**: Clear plan leads to clean implementation
- **Aesthetics Count**: Good design enhances user experience
- **Accessibility**: Building for everyone from the start
- **Documentation**: Code is read more than written

## Future Enhancements

Potential additions (not implemented):
- Sound effects on tap (8-bit beep)
- Visual beat indicator
- BPM history graph
- Save/load BPM presets
- Mobile app wrapper
- Multiple color themes

## Conclusion

Claude Code made it easy to build a complete, polished application from scratch. The result is a fast, accessible, and visually appealing BPM calculator that runs entirely in the browser with zero dependencies.

---

**Built with [Claude Code](https://claude.ai/code)** | **Developer: [dwildt](https://github.com/dwildt)**
