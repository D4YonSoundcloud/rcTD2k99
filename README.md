# Roller Coaster Defense: 3D Tower Defense Game

## Project Overview

Roller Coaster Defense is an innovative Player versus Enemy (PvE) tower defense game that combines the nostalgia of classic roller coaster building games with the strategic depth of tower defense. Built with modern web technologies, this game features a unique twist where roller coasters serve as your primary defense against waves of incoming enemies.

### Key Features

- **Roller Coaster Building**: Design and construct intricate roller coasters inspired by RollerCoaster Tycoon 1 and 2 mechanics.
- **Tower Defense Gameplay**: Use your roller coasters as defensive structures to fend off enemy waves.
- **3D Graphics with Retro Feel**: Enjoy immersive 3D graphics enhanced with a pixel art shader for a nostalgic aesthetic.
- **Cart Upgrade System**: Customize your coaster carts with various weapons and skills.
- **Enemy Variety**: Face off against a diverse array of enemies, each with unique abilities and weaknesses.
- **Progressive Difficulty**: Experience increasing challenges as you advance through the game.
- **Mobile-Friendly**: Optimized for both desktop and mobile play with responsive design and touch controls.

## Technology Stack

- **Frontend Framework**: Three.js
- **Language**: TypeScript
- **Build Tool**: Vite
- **3D Graphics**: WebGL
- **Styling**: CSS3 with Flexbox/Grid for responsive layouts

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/roller-coaster-defense.git
   cd roller-coaster-defense
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to see the game in action.

## Development

### Project Structure

```
roller-coaster-defense/
├── src/
│   ├── components/
│   │   └── CameraSystem.ts
│   │   └── ActionsMenu.ts
│   ├── scenes/
│   ├── shaders/
│   ├── utils/
│   ├── main.ts
│   └── style.css
├── public/
│   ├── assets/
├── tests/
└── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Key Commands

- `npm run dev`: Start the development server
- `npm run build`: Build the project for production
- `npm run preview`: Preview the production build locally
- `npm run test`: Run the test suite
- `npm run lint`: Lint the codebase

### Coding Standards

- Follow the TypeScript best practices and coding standards.
- Use meaningful variable and function names.
- Write clear, concise comments and documentation.
- Ensure all new code is covered by appropriate tests.

## Performance Optimization

To ensure smooth gameplay across various devices:

1. Implement level of detail (LOD) for distant objects.
2. Use occlusion culling to avoid rendering hidden objects.
3. Optimize shaders for mobile GPUs.
4. Employ asset streaming techniques for efficient resource management.

## Accessibility

We strive to make Roller Coaster Defense accessible to all players:

- Implement colorblind modes.
- Provide options for adjustable text sizes and UI scaling.
- Include reduced motion settings.
- Ensure keyboard navigation for menus and essential functions.

## Acknowledgments

- Inspiration: RollerCoaster Tycoon 1 and 2
- 3D Graphics: Three.js community
- Build Tool: Vite team

---

For more detailed documentation on specific components and systems, please refer to the `docs/` directory in the project root.
