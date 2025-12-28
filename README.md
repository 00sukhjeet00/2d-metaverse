# 2D Metaverse 🚀

Welcome to the **2D Metaverse** - where the term "metaverse" is used *very* generously! 

A real-time multiplayer virtual world that currently features circles moving around and chatting. But hey, the WebSocket magic works! 🎩✨

Try it!: https://spriteworld.netlify.app/

![Hero Banner](screenshots/game.png)
*Screenshot may look better than actual product. Results may vary.*

## ⚠️ Current Status: "It Works On My Machine" ™

This is very much a **Work In Progress**. Think of it as a digital construction site where the foundation is solid, but we're still figuring out where the walls go.

### ✅ What Actually Works

- **Real-time Multiplayer**: Powered by **Socket.io** - Players can see each other move! (as circles, but still)
- **Live Chat**: You can chat with other circles in real-time. Revolutionary stuff.
- **User Authentication**: JWT tokens keeping those circles secure.
- **Session Persistence**: Your circle remembers where it was. Fancy!
- **Room Management**: Join different rooms. Same circles, different backgrounds.

### 🚧 What's Gloriously Missing (aka The TODO List From Hell)

- **Character Sprites**: Currently using circles because "minimalism is trendy," definitely not because I haven't added sprites yet
- **Animations**: Static circles are a design choice. A terrible one, but a choice nonetheless.
- **Collision Detection**: Players phase through walls like ghosts. Working as intended? 👻
- **Physics**: Gravity is just a suggestion here
- **Sound Effects**: Experience the beauty of silence
- **Smooth Movement**: More like "jittery teleportation with style"
- **Proper UI/UX**: Currently channeling 1995 GeoCities energy
- **Sprites**: Did I mention sprites? Because we really need sprites
- **Interactive Objects**: Walls are decorative only
- **Particle Effects**: We have... pixels?
- **Mobile Support**: Works on mobile if you squint and pray
- **Literally Everything That Makes Games Look Good**: Coming Soon™

## 🎮 "Features" (Generous Interpretations)

### Real-time Multiplayer
Translation: *Two circles can see each other awkwardly slide around*

### Dynamic Room Management  
Translation: *You can switch between empty rooms with different colored backgrounds*

### Premium Dark Aesthetics
Translation: *The background is black because that's easier than designing something*

### Infinite Scaling (Lazy Loading)
Translation: *It loads slowly, but we're calling it "strategic resource management"*

### Atomic Design System
Translation: *The folder structure looks professional even if the code doesn't*

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

## 🐛 Known Issues (aka "Features")

- Players can walk through walls (it's not a bug, they're just really determined)
- Sometimes players teleport (quantum mechanics, probably)
- Chat messages occasionally arrive in a different timeline
- Graphics look like they're from the Atari era (retro is in, right?)
- Performance drops when... well, when you run it
- The "Infinite Scaling" is more like "Definitely Finite Scaling"

## 📋 The Actual Roadmap

**Phase 1: Make It Not Look Like MS Paint** 🎨
- [ ] Add actual character sprites
- [ ] Implement walking animations
- [ ] Make UI not hurt people's eyes

**Phase 2: Make Physics Exist** ⚛️
- [ ] Collision detection (walls should wall)
- [ ] Smooth movement (less jitter, more glide)
- [ ] Proper hitboxes

**Phase 3: Make It Actually Fun** 🎮
- [ ] Interactive objects
- [ ] Mini-games
- [ ] Sound effects
- [ ] Particle effects
- [ ] Literally anything engaging

**Phase 4: The Dream** ✨
- [ ] Custom avatars
- [ ] Voice chat
- [ ] Mobile support that actually works
- [ ] NFTs? (just kidding... unless? 👀)

## 🤝 Contributing

Please, I'm begging you, contribute. 

Found a bug? Congratulations, you've played the game!

Want to add features? Please do, we need all the help we can get.

Have sprites? PLEASE SEND SPRITES.

## 📝 License

MIT License - Feel free to use this code, improve it, and most importantly, make it actually look good.

## 🙏 Acknowledgments

- Stack Overflow (for basically writing 60% of this)
- Coffee (for making the other 40% possible)
- My rubber duck (best debugging partner)
- Future contributors (you're the real heroes)

## ⚡ Fun Stats

- **Lines of Code**: Too many
- **Bugs Fixed**: Some
- **New Bugs Created**: More
- **Coffee Consumed**: Yes
- **Time Spent**: Don't ask
- **Pride Level**: Medium-Low (but growing!)

## 💭 Developer's Note

> "Is it perfect? No.  
> Does it work? Mostly.  
> Am I proud of it? Surprisingly, yes.  
> Should you use it in production? Please don't.  
> Is it a learning experience? Absolutely!"

---

## 🎯 The Truth

This is a **real working multiplayer system** with WebSocket synchronization, authentication, and persistence. The bones are solid. The skin is... well, we're working on it.

Every big project starts somewhere. This is that somewhere. A somewhere that looks like circles on a black screen, but a somewhere nonetheless!

**Current Version**: 0.1.0-alpha-circles-edition  
**Status**: Aggressively Work In Progress  
**Stability**: It runs!  
**Polish**: What's that?

---

Built with ❤️, ☕, and a concerning amount of Stack Overflow tabs.

**Remember**: Rome wasn't built in a day, and neither is a metaverse. Especially when you're one person with circles for graphics. 🎨

---

## 🔗 Links

- **Live Demo**: [Try it here](your-url) *(at your own risk)*
- **Report Bugs**: GitHub Issues *(or just assume they exist)*
- **Support**: Close your eyes and pray

---

*"It's not a bug, it's an undocumented feature"* - Every developer ever

*P.S. - If you're a sprite artist, please help. I'm dying here.* 💀
