# 2D Metaverse 🚀

Welcome to the **2D Metaverse** - where the term "metaverse" is used _very_ generously!

A real-time multiplayer virtual world that currently features circles moving around and chatting. But hey, the WebSocket magic works! 🎩✨

Try it!: https://spriteworld.netlify.app/

![Hero Banner](screenshots/game.png)
_Screenshot may look better than actual product. Results may vary._

## ⚠️ Current Status: "It Works On My Machine" ™

This is very much a **Work In Progress**. Think of it as a digital construction site where the foundation is solid, but we're still figuring out where the walls go.

### ✅ What Actually Works

- **Real-time Multiplayer**: Powered by **Socket.io** - Players can see each other move in real-time!
- **Live Chat**: Chat with other players in real-time. Actually works smoothly!
- **User Authentication**: JWT tokens keeping your sessions secure.
- **Session Persistence**: Your position is saved and restored on reload. No more starting over!
- **Room Management**: Create, join, and manage multiple rooms with custom backgrounds and collision maps.
- **Collision Detection**: Proper wall collision with smooth sliding mechanics. No more ghost mode! 🎯
- **Clean Architecture**: Refactored with proper classes (Player, Boundary, Background) for maintainability.
- **Keyboard Controls**: WASD + Arrow keys for smooth movement.
- **Player Visuals**: Circles with eyes, shadows, and color-coded players (purple for you, green for others).
- **Dark Theme UI**: Modern purple-themed interface that doesn't hurt your eyes.
- **Lazy Loading**: Optimized performance with code splitting.
- **Context API**: Centralized state management for authentication.

### 🚧 What's Still Missing (The Actual TODO List)

- **Character Sprites**: Still using circles with eyes. They're cute, but not exactly AAA graphics.
- **Walking Animations**: Players slide around like they're on ice skates.
- **Sound Effects**: Experience the beauty of silence (for now).
- **Particle Effects**: No sparkles, explosions, or fancy effects yet.
- **Mobile Support**: Works on desktop. Mobile is... optimistic.
- **Interactive Objects**: Doors, items, NPCs - all coming soon™
- **Custom Avatars**: Everyone gets a circle. Democracy!
- **Voice Chat**: Type or stay silent, those are your options.
- **Mini-games**: It's a chat room with collision detection. We'll get there!

## 🎮 Features (Actually Real This Time!)

### Real-time Multiplayer

**What it is:** Multiple players can join the same room and see each other move in real-time with WebSocket synchronization. Position updates are smooth and responsive.

### Dynamic Room Management

**What it is:** Create custom rooms with background images, collision maps (JSON format), and player limits. Rooms persist in MongoDB and support multiple concurrent sessions.

### Collision Detection System

**What it is:** Grid-based collision detection with smooth wall sliding. Players can't walk through walls, and movement feels natural when sliding along obstacles.

### Modern UI/UX

**What it is:** Dark theme with purple accents, responsive design, lazy loading, and proper form validation. Actually looks professional!

### Persistent Sessions

**What it is:** Your position, room, and authentication state are saved. Reload the page and you're right back where you were.

### Clean Code Architecture

**What it is:** Refactored from spaghetti code to proper TypeScript classes. Player, Boundary, and Background classes with separation of concerns. Future you will thank present you!

## 🛠️ Technology Stack

**What it says:**

- Frontend: React, TypeScript, Vite, TailwindCSS, Framer Motion
- Backend: Node.js, Express, Socket.io, Mongoose (MongoDB)

**What it means:**

- We used every trendy framework we could find
- The bundle size is... concerning
- But it works! (mostly)

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **MongoDB** (Local or Atlas)
- **Patience** (not available via npm)
- **Low expectations** (highly recommended)

### Installation

1.  **Clone the repository**:

```bash
    git clone https://github.com/00sukhjeet00/2d-metaverse.git
    cd 2d-metaverse
    # Take a deep breath
```

2.  **Server Setup**:

```bash
    yarn
    # Create a .env file with DATABASE_URL and JWT_SECRET
    # (Don't use 'password123' as your secret, I'm watching you)
    yarn dev
    # Cross your fingers
```

3.  **Client Setup**:

```bash
    cd client
    npm install
    # Go make coffee, this takes a while
    npm run dev
    # If it doesn't work, try turning it off and on again
```

4.  **Enjoy**:
    - Open `http://localhost:3000`
    - Marvel at the circles
    - Question your life choices
    - But hey, it's real-time multiplayer! 🎉

## 🐛 Known Issues

- **No sprite animations**: Players slide around without walking animations
- **Chat UI could be better**: Messages work but the interface needs polish
- **Mobile controls**: Touch controls aren't implemented yet
- **Performance on large maps**: Rendering could be optimized for bigger collision grids
- **No sound**: Complete silence. Peaceful or boring? You decide.
- **Limited player customization**: Everyone's a circle (with eyes!)

## 🤝 Contributing

Contributions are welcome! Whether you want to:

- 🎨 Add sprite artwork or animations
- 🐛 Fix bugs or improve performance
- ✨ Implement new features
- 📝 Improve documentation
- 🧪 Add tests

Feel free to open an issue or submit a pull request!

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

MIT License - Feel free to use this code, improve it, and most importantly, make it actually look good.

## 🙏 Acknowledgments

- The Socket.io team for excellent real-time communication tools
- The React and TypeScript communities for great documentation
- Everyone who tested the early versions and provided feedback
- Coffee (still essential)

## ⚡ Project Stats

- **Architecture**: Clean, refactored TypeScript classes
- **Features Completed**: Core multiplayer, collision detection, room management
- **Code Quality**: Improved from spaghetti to structured
- **Coffee Consumed**: Still yes
- **Pride Level**: High and growing! 🚀

## 💭 Developer's Note

> "Is it perfect? No.  
> Does it work? Actually, yes!  
> Am I proud of it? Definitely.  
> Should you use it in production? With proper testing, maybe!  
> Is it a learning experience? Absolutely, and it shows!"

---

## 🎯 The Truth

This is a **real working multiplayer system** with WebSocket synchronization, authentication, persistence, **and collision detection**. The architecture is solid, the code is clean (thanks to refactoring!), and the features actually work.

We've gone from "circles phasing through walls" to "circles with eyes that respect boundaries." That's progress! 🎉

The foundation is strong. The gameplay is functional. The UI is modern. We're past the prototype phase and into actual feature development.

**Current Version**: 0.2.0-beta  
**Status**: Actively Developed  
**Stability**: Solid core, growing features  
**Polish**: Getting there!

---

Built with ❤️, ☕, and a solid understanding of WebSocket architecture.

**Remember**: Rome wasn't built in a day, and neither is a metaverse. But we've got collision detection, real-time multiplayer, and circles with personality. We're getting there! 🎨

---

## 🔗 Links

- **Live Demo**: [Try it here](https://spriteworld.netlify.app/)
- **Report Bugs**: [GitHub Issues](https://github.com/00sukhjeet00/2d-metaverse/issues)
- **Contribute**: See Contributing section above

---

_"First, make it work. Then, make it right. Then, make it fast."_ - Kent Beck

_P.S. - Sprite artists welcome! Let's make these circles even better._ 🎨✨
