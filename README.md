# 🐱 Paws & Preferences

A delightful Tinder-style cat swiping app built with React and TypeScript. Swipe through adorable cat photos, like your favorites, and share your collection with friends!

![Paws & Preferences](https://img.shields.io/badge/React-18.x-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8)

## 🎬 Live Demo

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=flat&logo=github)](https://absolute-orez.github.io/paws-and-preferences/)

## ✨ Featuresdar

### 🎯 Core Functionality
- **Swipe Gestures** - Smooth touch and mouse swipe interactions with physics-based animations
- **Double-Tap to Like** - Instagram-style double-tap with animated logo feedback
- **Visual Feedback** - Glowing borders (pink for like, gray for nope) during interactions
- **Badge Overlays** - "LIKE" and "NOPE" badges appear as you swipe
- **Progress Tracking** - Dots indicator showing your progress through the stack

### 💫 Animations
- Smooth card transitions with rotation and flying effects
- Pop-up logo animation on double-tap
- Character-by-character rotating text during loading
- Spring-based physics animations using Framer Motion

### 🎨 UI/UX Features
- Responsive design - works on mobile, tablet, and desktop
- Loading states with rotating cat-themed messages
- Summary view with grid layout of liked cats
- Share functionality with custom display names
- Session-based ownership detection

### 🔗 Sharing System
- Shareable URLs with encoded cat preferences
- Custom display names for personalized sharing
- Owner vs. viewer experience
- Native share API integration for mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/Absolute-oreZ/paws-and-preferences.git
cd paws-and-preferences
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173/paws-and-preferences`

## 🏗️ Tech Stack

### Core
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Framer Motion** - Animation library
- **React Bits** - Community maintained animated componnets

### APIs
- **Cataas API** - Cat image provider (https://cataas.com)

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (Button, Card, Dialog, Input)
│   ├── cat-card.tsx     # Main swipeable card component
│   ├── cat-stack.tsx    # Stack manager with loading and actions
│   ├── header.tsx       # App header
│   ├── progress-dots.tsx # Progress indicator
│   ├── rotating-text.tsx # Animated text component
│   └── summary-view.tsx # Results and sharing view
├── hooks/
│   ├── use-swipe.ts     # Custom swipe gesture hook
│   └── use-cat-stack.ts # Cat stack state management
├── lib/
│   └── utils.ts         # Utility functions (encoding/decoding, cn helper)
└── App.tsx              # Main app component with routing logic
```

## 🎮 How to Use

### Basic Usage
1. **Swipe Right** or click ❤️ to like a cat
2. **Swipe Left** or click 👎 to pass
3. **Double-tap** anywhere on the card for a quick like with animation
4. Complete all 16 cats to see your favorites

### Sharing Your Favorites
1. After swiping through all cats, you'll see your favorites grid
2. Click **Share** button
3. Add a display name (optional)
4. Use the share link or native share functionality
5. Friends can view your favorites via the shared URL

## 🔧 Configuration

### Adjust Number of Cats
In `App.tsx`, modify the count prop:
```typescript
<CatStack count={16} onFinish={onFinish} />
```

### Customize Swipe Threshold
In `cat-card.tsx`, adjust the threshold:
```typescript
useSwipe(ref, {
  threshold: 110, // pixels required to trigger swipe
  onLeft: () => animateOut(-1, false),
  onRight: () => animateOut(1, false),
})
```

### Change Animation Timings
In `cat-card.tsx`:
```typescript
// Swipe animation duration
setTimeout(() => {
  onSwiped(dir === 1)
}, 220) // milliseconds

// Double-tap delay before like
setTimeout(() => {
  animateOut(1, true)
}, 600) // milliseconds
```

## 🎨 Customization

### Logo
Place your custom logo at `public/logo.png` (transparent PNG recommended) for the double-tap animation.

### Colors
Modify the glow colors in `cat-card.tsx`:
```typescript
// Like glow - currently pink
el.style.boxShadow = '0 0 40px 8px rgba(236, 72, 153, 0.8)'

// Nope glow - currently gray
el.style.boxShadow = '0 0 40px 8px rgba(100, 116, 139, 0.6)'
```

### Loading Messages
Customize in `cat-stack.tsx`:
```typescript
<RotatingText
  texts={[
    'Your custom message 1',
    'Your custom message 2',
    // Add more messages...
  ]}
/>
```

## 📱 Mobile Optimization

The app is fully optimized for mobile devices with:
- Touch gesture support
- Responsive layouts
- Native share API integration
- Optimized image loading with lazy loading
- Viewport-relative sizing for consistent experience

## 🐛 Known Issues & Limitations

- Cat images are fetched fresh on each session (no caching)
- Share links encode image IDs, not the actual images
- Maximum 16 cats per session (configurable)
- Double-tap detection may conflict with text selection on desktop

## 🚧 Future Enhancements

- [ ] Undo last swipe
- [ ] Dark mode support
- [ ] Keyboard shortcuts
- [ ] Save favorites to device
- [ ] Cat fact API integration
- [ ] PWA support for offline usage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Cat images provided by [Cataas API](https://cataas.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Inspired by Tinder's swipe interface

## 📧 Contact

Project Link: [https://github.com/Absolute-oreZ/paws-and-preferences](https://github.com/Absolute-oreZ/paws-and-preferences)

---

Made with ❤️ and 🐱 by Young