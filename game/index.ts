import { GameTemplate } from './core/game';
import { GAME_CONFIG } from './config/game';
import { SceneRegistry } from './core/sceneRegistry';
import { BootScene } from './scenes/boot/BootScene';
import { MenuScene } from './scenes/menu/MenuScene';
import { MainScene } from './scenes/main/MainScene';
import { PlayerExample } from './scenes/examples/PlayerExample';

/**
 * Main Game class that serves as the entry point for the game
 * This class initializes the game and registers all scenes
 */
export default class Game {
  private game?: GameTemplate;
  private sceneRegistry: SceneRegistry;

  /**
   * Create a new Game instance
   * @param canvas The canvas element to render the game on
   * @param options Additional options (like maps, etc.)
   */
  constructor(canvas: HTMLCanvasElement, options?: any) {
    // Initialize the scene registry
    this.sceneRegistry = SceneRegistry.getInstance();
    
    // Configure the game
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.CANVAS, // Explicitly set to CANVAS for Next.js environment
      width: GAME_CONFIG.width,
      height: GAME_CONFIG.height,
      canvas: canvas,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container'
      },
      physics: {
        default: GAME_CONFIG.physics.default,
        arcade: {
          gravity: { x: 0, y: GAME_CONFIG.physics.arcade.gravity.y },
          debug: GAME_CONFIG.physics.arcade.debug
        }
      },
      backgroundColor: '#000000',
      scene: [BootScene] // Only include BootScene here
    };
    
    // Create the game instance
    this.game = new GameTemplate(config);
    
    // Set the game instance in the scene registry
    this.sceneRegistry.setGame(this.game);
  }

  /**
   * Initialize the game
   * @returns The Phaser game instance
   */
  init(): GameTemplate {
    if (!this.game) {
      throw new Error('Game not initialized');
    }
    
    // Register scenes after game initialization to avoid duplicate scene registration
    this.sceneRegistry.registerMany([
      { key: 'MenuScene', scene: MenuScene },
      { key: 'MainScene', scene: MainScene },
      { key: 'PlayerExample', scene: PlayerExample }
    ]);
    
    // Start the boot scene
    this.game.scene.start('BootScene');
    
    return this.game;
  }
}
