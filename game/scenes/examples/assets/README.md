# Scene-Specific Assets

This folder contains assets that are specific to the PlayerExample scene. By organizing assets this way, we can:

1. Keep scene-specific assets close to the scenes that use them
2. Make it easier to understand which assets are used by which scenes
3. Improve maintainability by co-locating related code and assets

## Loading Scene-Specific Assets

To load scene-specific assets, use relative paths in the scene's `preloadScene` method:

```typescript
protected preloadScene(): void {
  // Use a unique key prefix to avoid conflicts with global assets
  this.load.spritesheet('player-example-dude', './assets/sprites/player/dude.png', {
    frameWidth: 32,
    frameHeight: 48
  });
}
```

## Asset Organization

Each scene with custom assets should follow this structure:

```
scenes/
  ├── scene-name/
  │   ├── SceneName.ts
  │   └── assets/
  │       ├── sprites/
  │       ├── audio/
  │       └── etc...
```

## Global vs. Scene-Specific Assets

- **Global Assets**: Store in `public/assets/` and load via the AssetManager
- **Scene-Specific Assets**: Store in `game/scenes/[scene-name]/assets/` and load directly in the scene

This approach keeps the public folder clean for React assets while organizing game assets close to their usage.
