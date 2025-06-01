import { BaseScene } from '../base/BaseScene';
import { Player } from '../../entities/player/Player';

/**
 * PlayerExample - A scene demonstrating the Player entity with different configurations
 * 
 * This scene shows how to use the Player entity with both the default rectangle
 * and with a spritesheet for animations.
 */
export class PlayerExample extends BaseScene {
  // Game objects
  private playerDefault!: Player;
  private playerWithSprite!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  
  // UI elements
  private infoText!: Phaser.GameObjects.Text;
  
  constructor() {
    super('PlayerExample');
  }
  
  protected initialize(): void {
    // Initialize scene-specific properties
  }
  
  protected preloadScene(): void {
    // Load player spritesheet directly using a relative path
    // Since we're not using the AssetManager for scene-specific assets
    this.load.spritesheet('player-example-dude', './assets/sprites/player/dude.png', { frameWidth: 200, frameHeight: 200 });
  }
  
  protected createScene(): void {
    // Add background - a light gray rectangle
    const bg = this.add.rectangle(0, 0, this.getSceneWidth(), this.getSceneHeight(), 0xEEEEEE);
    bg.setOrigin(0, 0);
    
    // Create platforms
    this.createPlatforms();
    
    // Create two players to demonstrate different configurations
    this.createPlayers();
    
    // Set up collisions
    this.physics.add.collider(this.playerDefault.getSprite(), this.platforms);
    this.physics.add.collider(this.playerWithSprite.getSprite(), this.platforms);
    
    // Add instructional text
    this.infoText = this.add.text(16, 16, 
      'Player Entity Example\n\n' +
      'Left: Default rectangle player\n' +
      'Right: Player with spritesheet animations\n\n' +
      'Use arrow keys to move both players', {
      fontSize: '18px',
      color: '#000',
      fontFamily: 'Arial'
    });
    
    // Fade in the scene
    this.fadeInScene();
  }
  
  protected updateScene(time: number, delta: number): void {
    // Update both players
    this.playerDefault.update();
    this.playerWithSprite.update();
  }
  
  private createPlatforms(): void {
    this.platforms = this.physics.add.staticGroup();
    
    // Create ground - brown rectangle
    const groundWidth = this.getSceneWidth();
    const groundHeight = 32;
    const ground = this.add.rectangle(0, this.getSceneHeight() - groundHeight, groundWidth, groundHeight, 0x8B4513);
    this.platforms.add(ground);
    ground.setOrigin(0, 0);
    
    // Create platforms - green rectangles
    const platform1 = this.add.rectangle(600, 400, 200, 20, 0x228B22);
    const platform2 = this.add.rectangle(200, 250, 200, 20, 0x228B22);
    const platform3 = this.add.rectangle(750, 220, 200, 20, 0x228B22);
    
    // Add platforms to the physics group
    this.platforms.add(platform1);
    this.platforms.add(platform2);
    this.platforms.add(platform3);
    
    // Refresh all bodies
    this.platforms.refresh();
  }
  
  private createPlayers(): void {
    // Create default player (red rectangle) on the left side
    this.playerDefault = new Player({
      scene: this,
      x: 200,
      y: 450
      // No texture or spritesheet provided, so it will use the default red rectangle
    });
    
    // Create player with spritesheet animations on the right side
    this.playerWithSprite = new Player({
      scene: this,
      x: 600,
      y: 450,
      texture: 'player-example-dude',
      spritesheet: {
        key: 'player-example-dude',
        animations: {
          left: {
            frames: { start: 0, end: 10 },
            frameRate: 10,
            repeat: -1
          },
          right: {
            frames: { start: 10, end: 20 },
            frameRate: 10,
            repeat: -1
          },
          idle: {
            frames: { start: 20, end: 30 },
            frameRate: 20,
            repeat: -1
          }
        }
      }
    });
  }
}
