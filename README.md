# BPM Calculator

Find the current BPM (Beats Per Minute) of any song by tapping along to the beat. Built with a retro 8-bit game aesthetic.

![BPM Calculator](https://img.shields.io/badge/style-8--bit-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Tap Detection**: Click the button or press spacebar to tap along with music
- **Real-time BPM Calculation**: Automatic calculation based on tap intervals
- **Metronome**: Lock a BPM and play audible clicks in 4/4 time with accented downbeats
- **8-bit Audio**: Retro square wave beeps generated with Web Audio API
- **Visual Beat Indicator**: See the current beat position while the metronome plays
- **8-bit Aesthetic**: Retro game-inspired UI with neon colors and pixel fonts
- **Three Themes**: Classic, Severance, and Wildtech color schemes
- **Auto-reset**: Automatically resets after 3 seconds of inactivity
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Accessible**: Full keyboard navigation support

## Demo

Visit the live demo: [https://dwildt.github.io/bpm/](https://dwildt.github.io/bpm/)

## How to Use

### Measuring BPM

1. Play a song you want to measure the BPM of
2. Tap the button or press **SPACEBAR** on the beat
3. After a few taps, the BPM will be calculated and displayed
4. Keep tapping to improve accuracy
5. Click **RESET** or wait 3 seconds to start over

### Using the Metronome

1. Tap to calculate a BPM (at least 2 taps required)
2. Click **FIX BPM** to lock the current BPM value
3. Click **PLAY** to start the metronome
4. The metronome will play in 4/4 time with:
   - Beat 1 (downbeat): Higher pitch (1000 Hz) and louder
   - Beats 2-4: Lower pitch (800 Hz) and quieter
5. Visual beat indicator shows the current beat position
6. Click **STOP** to stop playback
7. Click **UNLOCK** to unlock the BPM and measure a new tempo

## Local Development

### Prerequisites

- Node.js (for local server)
- A modern web browser

### Running Locally

1. Clone the repository:
```bash
git clone https://github.com/dwildt/bpm.git
cd bpm
```

2. Install dependencies:
```bash
npm install
```

3. Start a local server:
```bash
npm run serve
```

This will automatically open your browser to `http://localhost:8080`

### Testing

The project uses Jest for unit testing:

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Linting

The project uses ESLint to maintain code quality:

```bash
# Check for linting errors
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

ESLint configuration is in `eslint.config.js` and enforces:
- Consistent code style
- ES2021+ syntax
- Browser and Node.js environments
- Jest testing environment

## Deployment to GitHub Pages

1. **Push your code to GitHub**:
```bash
git add .
git commit -m "Add BPM calculator"
git push origin main
```

2. **Enable GitHub Pages**:
   - Go to your repository settings on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select `main` branch
   - Click **Save**

3. **Access your live site**:
   - Your site will be available at: `https://dwildt.github.io/bpm/`
   - It may take a few minutes for the site to deploy

## Project Structure

```
bpm/
├── index.html         # Main HTML structure
├── styles.css         # 8-bit aesthetic styles with theme support
├── app.js             # DOM manipulation and state management
├── bpm.js             # Pure BPM calculation logic
├── bpm.test.js        # Unit tests for BPM logic
├── metronome.js       # Pure metronome audio and timing logic
├── metronome.test.js  # Unit tests for metronome logic
├── package.json       # Node.js dependencies and scripts
├── eslint.config.js   # ESLint configuration
├── CLAUDE.md          # Claude Code development notes
├── THEMES.md          # Theme system documentation
└── README.md          # This file
```

## How It Works

### BPM Calculation Algorithm

The BPM calculator uses a simple but effective algorithm:

1. **Capture Timestamps**: Each tap records the current timestamp
2. **Calculate Intervals**: Compute time differences between consecutive taps
3. **Average Intervals**: Calculate the average interval across all taps
4. **Convert to BPM**: Use the formula: `BPM = 60000 / average_interval_ms`
5. **Rolling Average**: Keeps the last 16 taps for a rolling average calculation

### Metronome Implementation

The metronome uses Web Audio API for precise audio timing:

1. **Audio Generation**: Square wave oscillators create 8-bit style beeps
2. **Timing**: `setInterval` schedules beats, Web Audio API plays them precisely
3. **4/4 Time Signature**:
   - Beat 0 (downbeat): 1000 Hz frequency, 0.3 volume
   - Beats 1-3: 800 Hz frequency, 0.15 volume
4. **Visual Feedback**: Beat indicator syncs with audio playback
5. **BPM Range**: Validates BPM between 30-300 for practical metronome use

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, flexbox, animations
- **Vanilla JavaScript**: No frameworks or dependencies
- **Web Audio API**: 8-bit style audio generation for metronome
- **Google Fonts**: Press Start 2P for 8-bit typography

### Development Tools

- **Jest**: Unit testing framework for JavaScript
- **ESLint**: Code quality and linting tool
- **http-server**: Local development server (via npx)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

MIT License - feel free to use this project for your own purposes!

## Credits

Built with retro vibes as part of [#100DaysOfCode](https://www.100daysofcode.com/)

This project was built using [Claude Code](https://claude.ai/code), Anthropic's AI-powered coding assistant. See [claude.md](./claude.md) for details about the development process.

### Support

If you find this project useful, consider:
- [Sponsoring on GitHub](https://github.com/sponsors/dwildt)
- Starring this repository
- Sharing with others

---

**Tip**: For best accuracy, tap at least 4-8 times. The more taps, the more accurate the BPM calculation!
