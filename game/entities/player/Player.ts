import Phaser from 'phaser';

/**
 * Configuration interface for the Player entity
 */
export interface PlayerConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture?: string;
  frame?: string | number;
  spritesheet?: {
    key: string;
    mirrorFrames?: boolean; // If true, use the same frames for left/right but flip the sprite
    animations?: {
      left?: {
        frames?: number[] | { start: number; end: number };
        frameRate?: number;
        repeat?: number;
      };
      right?: {
        frames?: number[] | { start: number; end: number };
        frameRate?: number;
        repeat?: number;
      };
      idle?: {
        frames?: number[] | { start: number; end: number } | number;
        frameRate?: number;
        repeat?: number;
      };
    };
  };
}

/**
 * Player entity class
 * 
 * A reusable player component that can be added to any scene.
 * Supports both simple rectangle-based rendering and spritesheet animations.
 */
export class Player {
  private scene: Phaser.Scene;
  private sprite: Phaser.Physics.Arcade.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private config: PlayerConfig;
  
  /**
   * Creates a new Player instance
   * 
   * @param config The player configuration
   */
  constructor(config: PlayerConfig) {
    this.scene = config.scene;
    this.config = config;
    
    // Create the appropriate sprite based on configuration
    if (config.texture && config.spritesheet) {
      // Create sprite with the provided texture/spritesheet
      this.sprite = this.scene.physics.add.sprite(config.x, config.y, config.texture, config.frame);
      
      // Set up animations from the spritesheet
      this.createAnimations(config.spritesheet);
    } else {
      // Create default red rectangle player
      this.createDefaultTexture();
      this.sprite = this.scene.physics.add.sprite(config.x, config.y, 'player-rect');
    }
    
    // Set up physics properties
    // this.sprite.setBounce(0.2);
    this.sprite.setCollideWorldBounds(true);
    
    // Set up controls
    this.cursors = this.scene.input.keyboard?.createCursorKeys() || this.scene.input.keyboard!.createCursorKeys();
  }
  
  /**
   * Creates a default red rectangle texture for the player
   */
  private createDefaultTexture(): void {
    const playerWidth = 32;
    const playerHeight = 48;
    
    // Check if the texture already exists
    if (!this.scene.textures.exists('player-rect')) {
      const graphics = this.scene.make.graphics({ x: 0, y: 0 });
      graphics.fillStyle(0xFF0000, 1); // Red color
      graphics.fillRect(0, 0, playerWidth, playerHeight);
      graphics.generateTexture('player-rect', playerWidth, playerHeight);
      graphics.destroy();
    }
  }
  
  /**
   * Creates animations from the provided spritesheet configuration
   * 
   * @param spritesheet The spritesheet configuration
   */
  private createAnimations(spritesheet: PlayerConfig['spritesheet']): void {
    if (!spritesheet) return;
    
    const anims = this.scene.anims;
    const key = spritesheet.key;
    
    // If using mirrored frames, we only need to create the right animation
    // since we'll flip the sprite for left movement
    if (spritesheet.mirrorFrames) {
      // Only create right animation if it exists
      if (spritesheet.animations?.right) {
        const right = spritesheet.animations.right;
        anims.create({
          key: 'player-right',
          frames: typeof right.frames === 'object' && 'start' in right.frames 
            ? anims.generateFrameNumbers(key, right.frames)
            : anims.generateFrameNumbers(key, { frames: right.frames as number[] }),
          frameRate: right.frameRate || 10,
          repeat: right.repeat !== undefined ? right.repeat : -1
        });
      }
      // If no right animation but left exists, use left frames for both directions
      else if (spritesheet.animations?.left) {
        const left = spritesheet.animations.left;
        anims.create({
          key: 'player-right',
          frames: typeof left.frames === 'object' && 'start' in left.frames 
            ? anims.generateFrameNumbers(key, left.frames)
            : anims.generateFrameNumbers(key, { frames: left.frames as number[] }),
          frameRate: left.frameRate || 10,
          repeat: left.repeat !== undefined ? left.repeat : -1
        });
      }
    } else {
      // Standard mode - create separate animations for left and right
      // Create left animation
      if (spritesheet.animations?.left) {
        const left = spritesheet.animations.left;
        anims.create({
          key: 'player-left',
          frames: typeof left.frames === 'object' && 'start' in left.frames 
            ? anims.generateFrameNumbers(key, left.frames)
            : anims.generateFrameNumbers(key, { frames: left.frames as number[] }),
          frameRate: left.frameRate || 10,
          repeat: left.repeat !== undefined ? left.repeat : -1
        });
      }
      
      // Create right animation
      if (spritesheet.animations?.right) {
        const right = spritesheet.animations.right;
        anims.create({
          key: 'player-right',
          frames: typeof right.frames === 'object' && 'start' in right.frames 
            ? anims.generateFrameNumbers(key, right.frames)
            : anims.generateFrameNumbers(key, { frames: right.frames as number[] }),
          frameRate: right.frameRate || 10,
          repeat: right.repeat !== undefined ? right.repeat : -1
        });
      }
    }
    
    // Create idle animation (same for both modes)
    if (spritesheet.animations?.idle) {
      const idle = spritesheet.animations.idle;
      if (typeof idle.frames === 'number') {
        anims.create({
          key: 'player-idle',
          frames: [{ key, frame: idle.frames }],
          frameRate: idle.frameRate || 10,
          repeat: idle.repeat !== undefined ? idle.repeat : -1
        });
      } else {
        anims.create({
          key: 'player-idle',
          frames: typeof idle.frames === 'object' && 'start' in idle.frames 
            ? anims.generateFrameNumbers(key, idle.frames)
            : anims.generateFrameNumbers(key, { frames: idle.frames as number[] }),
          frameRate: idle.frameRate || 10,
          repeat: idle.repeat !== undefined ? idle.repeat : -1
        });
      }
    }
  }
  
  /**
   * Updates the player's position and animation based on input
   */
  public update(): void {
    // Handle left/right movement
    if (this.cursors && this.cursors.left && this.cursors.left.isDown) {
      this.sprite.setVelocityX(-160);
      
      // If using mirrored frames, flip the sprite and use the same animation
      if (this.config.spritesheet?.mirrorFrames) {
        this.sprite.setFlipX(true);
        this.sprite.anims.play('player-right', true);
      } else if (this.config.spritesheet?.animations?.left) {
        this.sprite.anims.play('player-left', true);
      }
    } else if (this.cursors && this.cursors.right && this.cursors.right.isDown) {
      this.sprite.setVelocityX(160);
      
      // If using mirrored frames, ensure sprite is not flipped
      if (this.config.spritesheet?.mirrorFrames) {
        this.sprite.setFlipX(false);
        this.sprite.anims.play('player-right', true);
      } else if (this.config.spritesheet?.animations?.right) {
        this.sprite.anims.play('player-right', true);
      }
    } else {
      this.sprite.setVelocityX(0);
      if (this.config.spritesheet?.animations?.idle) {
        this.sprite.anims.play('player-idle', true);
      }
    }
    
    // Handle jumping
    if (this.cursors && this.cursors.up && this.cursors.up.isDown && 
        this.sprite.body && this.sprite.body.touching && this.sprite.body.touching.down) {
      this.sprite.setVelocityY(-330);
    }
  }
  
  /**
   * Gets the player sprite for collision detection
   */
  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }
  
  /**
   * Sets the player's position
   * 
   * @param x The x coordinate
   * @param y The y coordinate
   */
  public setPosition(x: number, y: number): void {
    this.sprite.setPosition(x, y);
  }
  
  /**
   * Destroys the player instance
   */
  public destroy(): void {
    this.sprite.destroy();
  }
}
