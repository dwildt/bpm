# BPM Calculator

Find the current BPM (Beats Per Minute) of any song by tapping along to the beat. Built with a retro 8-bit game aesthetic.

![BPM Calculator](https://img.shields.io/badge/style-8--bit-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Tap Detection**: Click the button or press spacebar to tap along with music
- **Real-time BPM Calculation**: Automatic calculation based on tap intervals
- **8-bit Aesthetic**: Retro game-inspired UI with neon colors and pixel fonts
- **Auto-reset**: Automatically resets after 3 seconds of inactivity
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Accessible**: Full keyboard navigation support

## Demo

Visit the live demo: [https://dwildt.github.io/bpm/](https://dwildt.github.io/bpm/)

## How to Use

1. Play a song you want to measure the BPM of
2. Tap the button or press **SPACEBAR** on the beat
3. After a few taps, the BPM will be calculated and displayed
4. Keep tapping to improve accuracy
5. Click **RESET** or wait 3 seconds to start over

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

2. Start a local server:
```bash
npx serve -p 8081
```

3. Open your browser and navigate to:
```
http://localhost:8081
```

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
├── index.html      # Main HTML structure
├── styles.css      # 8-bit aesthetic styles
├── app.js          # BPM calculation logic
├── package.json    # Node.js dependencies and scripts
├── eslint.config.js # ESLint configuration
├── claude.md       # Claude Code development notes
├── tasks/          # Project planning documents
│   └── plan.md
└── README.md       # This file
```

## How It Works

The BPM calculator uses a simple but effective algorithm:

1. **Capture Timestamps**: Each tap records the current timestamp
2. **Calculate Intervals**: Compute time differences between consecutive taps
3. **Average Intervals**: Calculate the average interval across all taps
4. **Convert to BPM**: Use the formula: `BPM = 60000 / average_interval_ms`
5. **Rolling Average**: Keeps the last 16 taps for a rolling average calculation

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, flexbox, animations
- **Vanilla JavaScript**: No frameworks or dependencies
- **Google Fonts**: Press Start 2P for 8-bit typography

### Development Tools

- **Jest**: Unit testing framework for JavaScript
- **ESLint**: Code quality and linting tool

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
