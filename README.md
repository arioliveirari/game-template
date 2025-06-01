# Phaser Game Template

A robust, modular, and extensible template for building games with Phaser 3, TypeScript, and Next.js.

## Features

- **TypeScript Support**: Full TypeScript integration for type safety and better developer experience
- **Modular Architecture**: Well-organized codebase with clear separation of concerns
- **Entity Component System**: Flexible ECS pattern for game object composition
- **Scene Management**: Robust scene lifecycle and transition system
- **Asset Management**: Centralized asset loading and caching
- **Event System**: Global event bus for communication between game components
- **State Management**: Persistent game state with localStorage support
- **Configuration System**: Centralized, type-safe game configuration

## Project Structure

```
game/
├── config/               # Game configuration
│   ├── game.ts          # Main game configuration
│   └── types.ts         # TypeScript interfaces for configuration
├── core/                # Core game systems
│   ├── assetManager.ts  # Asset loading and management
│   ├── game.ts          # Main game class
│   ├── sceneRegistry.ts # Scene registration and management
│   └── stateManager.ts  # Game state persistence
├── entities/            # Game entities
│   └── base/            # Base entity classes
│       ├── Component.ts # Base component class
│       └── Entity.ts    # Base entity class
├── scenes/              # Game scenes
│   ├── base/            # Base scene classes
│   │   └── BaseScene.ts # Abstract base scene
│   └── boot/            # Boot scene
│       └── BootScene.ts # Initial game loading
└── services/           # Game services
    └── eventSystem.ts  # Event management
```

## Core Systems

### Configuration System

The configuration system provides a centralized place to define game settings:

- **Game dimensions**: Width, height, and scaling options
- **Physics settings**: Gravity, debug options
- **Asset paths**: Base paths for different asset types
- **Scene configuration**: Default scene transitions
- **Input settings**: Default input configurations
- **Audio settings**: Volume levels and audio options

```typescript
// Example usage
import { GAME_CONFIG } from './config/game';

console.log(GAME_CONFIG.width); // Access game width
```

### Asset Management

The `AssetManager` handles loading and retrieving game assets:

- **Manifest-based loading**: Define assets in a structured format
- **Multiple asset types**: Support for images, audio, spritesheets, atlases, videos, JSON
- **Asset caching**: Efficient asset retrieval
- **Progress tracking**: Loading progress events

```typescript
// Example usage
const assetManager = AssetManager.getInstance();
assetManager.setScene(this); // Set current scene
assetManager.preloadAssets(); // Load all assets
const texture = assetManager.getAsset('player'); // Get loaded asset
```

### Scene Management

The scene system provides a structured approach to scene creation and transitions:

- **Base Scene**: Abstract base class with lifecycle methods
- **Scene Registry**: Centralized scene registration and management
- **Scene Transitions**: Smooth transitions with fade effects
- **Event Notifications**: Events for scene lifecycle changes

```typescript
// Example scene
export class GameScene extends BaseScene {
  constructor() {
    super('GameScene');
  }
  
  protected initialize(): void {
    // Initialize scene
  }
  
  protected preloadScene(): void {
    // Preload assets
  }
  
  protected createScene(): void {
    // Create game objects
  }
  
  protected updateScene(time: number, delta: number): void {
    // Update logic
  }
}
```

### Entity Component System

The ECS architecture allows for modular game object composition:

- **Entity**: Container for components with lifecycle management
- **Component**: Reusable behaviors that can be attached to entities
- **Event Integration**: Components can communicate via the event system

```typescript
// Example usage
const player = new Entity(this.scene);
player.addComponent(new MovementComponent());
player.addComponent(new SpriteComponent('player_sprite'));
player.init(); // Initialize all components
```

### Event System

The event system provides a centralized way to communicate between game components:

- **Event Registration**: Subscribe to game events
- **Event Emission**: Trigger events with data
- **Event Cleanup**: Automatic cleanup to prevent memory leaks

```typescript
// Example usage
const eventSystem = EventSystem.getInstance();
eventSystem.on('player-hit', this.onPlayerHit, this);
eventSystem.emit('player-hit', { damage: 10 });
```

### State Management

The state manager handles global game state with persistence:

- **State Storage**: Store and retrieve game state
- **Persistence**: Save state to localStorage
- **Event Notifications**: Events for state changes
- **Import/Export**: Save and load game progress

```typescript
// Example usage
const stateManager = StateManager.getInstance();
stateManager.setState('level', 5);
stateManager.saveState(); // Save to localStorage
const level = stateManager.getState('level'); // Get state value
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/game-template.git
   cd game-template
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Creating a New Game

1. **Create a new scene**
   - Extend `BaseScene` and implement the required methods
   - Register your scene in the `SceneRegistry`

2. **Create game entities**
   - Extend the `Entity` class for game objects
   - Create components by extending the `Component` class

3. **Configure your game**
   - Update settings in `game/config/game.ts`

4. **Add your assets**
   - Create an asset manifest for your game
   - Use the `AssetManager` to load assets

## Best Practices

- **Use the ECS pattern** for game objects to keep code modular and reusable
- **Leverage the event system** for communication between components
- **Keep scenes focused** on specific game states or levels
- **Use the state manager** for persistent game data
- **Follow TypeScript best practices** for type safety

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Phaser](https://phaser.io/) - The game framework used
- [Next.js](https://nextjs.org/) - The React framework for production
- [TypeScript](https://www.typescriptlang.org/) - The typed superset of JavaScript