# BPM Calculator

Find the current BPM (Beats Per Minute) of any song by tapping along to the beat. Built with a retro 8-bit game aesthetic.

![BPM Calculator](https://img.shields.io/badge/style-8--bit-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Tap Detection**: Click the button or press spacebar to tap along with music
- **Real-time BPM Calculation**: Automatic calculation based on tap intervals
- **Manual BPM Input**: Directly enter a BPM value for instant metronome use
- **Presets Management**: Save and load up to 20 custom configurations with factory presets included
- **Metronome**: Lock a BPM and play audible clicks with multiple time signatures
- **Multiple Time Signatures**: Support for 4/4, 3/4, and 2/4 time signatures
- **Subdivisions**: Practice with quarter notes, eighth notes, sixteenth notes, or triplets
- **8-bit Audio**: Retro square wave beeps generated with Web Audio API
- **Visual Beat Indicator**: Dynamic display showing the current beat position
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
3. Select your desired **TIME SIGNATURE** from the dropdown
4. Select your desired **SUBDIVISION** from the dropdown:
   - **Quarter Notes (♩)**: Main beats only (1 click per beat)
   - **Eighth Notes (♪)**: Two clicks per beat
   - **Sixteenth Notes (♬)**: Four clicks per beat (disabled above 180 BPM)
   - **Triplets (♪♪♪)**: Three clicks per beat (triplet feel)
5. Click **PLAY** to start the metronome
6. The metronome will play with accent patterns:
   - Downbeat (beat 1, first subdivision): 1000 Hz, loudest
   - Beat start (first subdivision of each beat): 900 Hz, loud
   - Mid-beat emphasis (e.g., 3rd sixteenth): 850 Hz, medium
   - Regular subdivisions: 800 Hz, quieter
7. Visual beat indicator shows the current beat position
8. Click **STOP** to stop playback
9. Click **UNLOCK** to unlock the BPM and measure a new tempo

**Note**: Time signature and subdivision can only be changed when the metronome is stopped.

### Setting BPM Manually

If you already know the desired BPM, you can enter it directly:

1. Click the **SET BPM** button
2. Enter a BPM value between 30 and 300
3. Press **Enter** or click **OK**
4. The BPM is automatically locked and ready to play
5. Click **PLAY** to start the metronome immediately

**Keyboard shortcuts in modal:**
- **Enter**: Confirm and set BPM
- **Escape**: Cancel and close modal
- **Tab**: Navigate between input and buttons

### Managing Presets

Save and load your favorite metronome configurations for quick access:

1. **Using Factory Presets:**
   - Click **PRESETS** to open the presets modal
   - Browse the factory presets section (includes popular songs and tempos)
   - Click **LOAD** on any preset to apply it instantly
   - Factory presets cannot be deleted

2. **Saving Your Own Presets:**
   - Fix a BPM and configure time signature + subdivision
   - Click **SAVE PRESET**
   - Enter a name for your preset (e.g., "My Practice Song")
   - Click **SAVE PRESET** in the modal
   - Your preset is saved in the "My Presets" section

3. **Loading Your Presets:**
   - Click **PRESETS** to open the modal
   - Find your preset in the "My Presets" section
   - Click **LOAD** to apply the saved configuration
   - The active preset is highlighted with a green glow

4. **Deleting Presets:**
   - Open the presets modal
   - Click **DELETE** on any user-created preset
   - Confirm the deletion
   - Factory presets cannot be deleted

**Preset Features:**
- Save up to 20 custom presets
- Each preset stores: BPM, time signature, and subdivision
- Factory presets ship with the app (popular songs and tempos)
- Presets persist across browser sessions
- Active preset highlighted in the list
- Preset cleared when manually changing settings

**Example Factory Presets:**
- **Camila Camila (Nenhum de Nós)** - 147 BPM, 4/4, Sixteenth Notes
- **Jazz Waltz** - 160 BPM, 3/4, Triplets
- **Moderate Rock** - 120 BPM, 4/4, Eighth Notes
- **Slow Ballad** - 60 BPM, 4/4, Quarter Notes
- **Uptempo Swing** - 180 BPM, 4/4, Triplets

**Community Contributions:**
Community members can contribute factory presets via pull requests to [presets.js](presets.js)!

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
├── presets.js         # Factory presets (ES6 module)
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
3. **Time Signature Support**:
   - **4/4 (Common Time)**: 4 beats per measure, accent on beat 1
   - **3/4 (Waltz)**: 3 beats per measure, accent on beat 1
   - **2/4 (March)**: 2 beats per measure, accent on beat 1
4. **Accent Patterns**:
   - Primary accent (beat 1): 1000 Hz frequency, 0.3 volume
   - Regular beats: 800 Hz frequency, 0.15 volume
5. **Visual Feedback**: Beat indicator dynamically adjusts to show correct number of beats
6. **BPM Range**: Validates BPM between 30-300 for practical metronome use

### Time Signatures

The calculator supports three essential time signatures:

| Time Signature | Beats | Description | Use Cases |
|----------------|-------|-------------|-----------|
| **4/4** | 4 | Common Time | Most popular music, rock, pop, marches |
| **3/4** | 3 | Waltz Time | Waltzes, folk music, ballads, country |
| **2/4** | 2 | March Time | Polkas, marches, simple dance music |

**Accent Patterns:**
- All time signatures: Accent on beat 1 (downbeat) only

The time signature selector allows you to choose the appropriate meter for your practice session. The visual beat indicator and audio accents automatically adjust to match the selected time signature.

### Subdivisions

The metronome supports four subdivision types to help you practice different rhythmic feels:

| Subdivision | Clicks per Beat | Description | Use Cases |
|-------------|-----------------|-------------|-----------|
| **Quarter Notes (♩)** | 1 | Main beats only | Standard practice, basic tempo keeping |
| **Eighth Notes (♪)** | 2 | Two clicks per beat | Faster practice, improving timing precision |
| **Sixteenth Notes (♬)** | 4 | Four clicks per beat | Advanced practice, very precise timing |
| **Triplets (♪♪♪)** | 3 | Three clicks per beat | Triplet feel, shuffle rhythms |

**Subdivision Intervals by BPM:**

At 120 BPM (beat interval = 500ms):
- Quarter notes: 1 click every 500ms
- Eighth notes: 1 click every 250ms
- Sixteenth notes: 1 click every 125ms
- Triplets: 1 click every 166.67ms

At 180 BPM (beat interval = 333ms):
- Quarter notes: 1 click every 333ms
- Eighth notes: 1 click every 166.5ms
- Triplets: 1 click every 111ms

**BPM Limitations:**
- Sixteenth notes are automatically disabled when BPM exceeds 180
- This is because intervals become too fast (<83ms) for precise timing with setInterval

**Accent Hierarchy:**

The metronome uses a 4-level frequency/volume system to distinguish different subdivision positions:
1. **Downbeat (1000 Hz, 0.3 volume)**: First subdivision of beat 1
2. **Beat start (900 Hz, 0.2 volume)**: First subdivision of any beat
3. **Mid-beat emphasis (850 Hz, 0.15 volume)**: 3rd of 4 sixteenths (weak beat emphasis)
4. **Regular subdivisions (800 Hz, 0.12 volume)**: All other subdivisions

This accent pattern helps you internalize the rhythmic structure while practicing.

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
