import { BaseScene } from '../base/BaseScene';
import { Player } from '../../entities/player/Player';

/**
 * PlayerExample - A scene demonstrating the Player entity with different configurations
 * 
 * This scene shows how to use the Player entity with both the default rectangle
 * and with a spritesheet for animations.
 */
export class PlayerExample extends BaseScene {
  // Physics groups
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private coins!: Phaser.Physics.Arcade.StaticGroup;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  
  // Player
  private player!: Player;
  
  // Game objects
  private scoreText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private score: number = 0;
  private finishFlag!: Phaser.GameObjects.Rectangle;
  private deathZone!: Phaser.GameObjects.Zone;
  
  // Game state
  private gameStartTime: number = 0;
  private elapsedTime: number = 0;
  private isGameOver: boolean = false;
  
  // Camera
  private followCamera: boolean = true;
  
  // World size
  private readonly worldWidth: number = 5000;
  private readonly worldHeight: number = 2000;
  
  constructor() {
    super('PlayerExample');
  }
  
  protected initialize(): void {
    // Initialize scene-specific properties
  }
  
  protected preloadScene(): void {
    // Load player spritesheet directly using a relative path
    this.load.spritesheet('player-example-dude', './assets/sprites/player/dude.png', { frameWidth: 200, frameHeight: 200 });
    
    // Create coin texture if it doesn't exist
    if (!this.textures.exists('coin')) {
      const graphics = this.make.graphics({ x: 0, y: 0 });
      graphics.fillStyle(0xFFD700, 1); // Gold color
      graphics.fillCircle(8, 8, 8);
      graphics.generateTexture('coin', 16, 16);
      graphics.destroy();
    }
    
    // Create obstacle texture if it doesn't exist
    if (!this.textures.exists('obstacle')) {
      const graphics = this.make.graphics({ x: 0, y: 0 });
      graphics.lineStyle(4, 0xFF0000, 1); // Red outline
      graphics.fillStyle(0xFF6666, 0.8); // Light red fill
      graphics.fillCircle(16, 16, 16);
      graphics.strokeCircle(16, 16, 16);
      graphics.generateTexture('obstacle', 32, 32);
      graphics.destroy();
    }
    
    // Create finish flag texture if it doesn't exist
    if (!this.textures.exists('finish-flag')) {
      const graphics = this.make.graphics({ x: 0, y: 0 });
      graphics.fillStyle(0x00FF00, 1); // Green color
      graphics.fillRect(0, 0, 10, 50);
      graphics.fillStyle(0xFFFFFF, 1); // White color
      graphics.fillRect(10, 0, 40, 30);
      graphics.generateTexture('finish-flag', 50, 50);
      graphics.destroy();
    }
  }
  
  protected createScene(): void {
    // Set up world bounds - much larger than the camera view
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);
    
    // Initialize game state
    this.gameStartTime = this.time.now;
    this.isGameOver = false;
    
    // Create background
    this.createBackground();
    
    // Create platforms
    this.createPlatforms();
    
    // Create death zone at the bottom
    this.createDeathZone();
    
    // Create player
    this.createPlayer();
    
    // Create coins
    this.createCoins();
    
    // Create obstacles
    this.createObstacles();
    
    // Create finish flag
    this.createFinishFlag();
    
    // Set up collisions
    this.physics.add.collider(this.player.getSprite(), this.platforms);
    this.physics.add.overlap(this.player.getSprite(), this.coins, this.collectCoin as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
    this.physics.add.overlap(this.player.getSprite(), this.obstacles, this.hitObstacle as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
    this.physics.add.overlap(this.player.getSprite(), this.finishFlag, this.reachFinish as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
    this.physics.add.overlap(this.player.getSprite(), this.deathZone, this.fallOutOfWorld as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
    
    // Set up camera
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    if (this.followCamera) {
      this.cameras.main.startFollow(this.player.getSprite(), true, 0.1, 0.1);
      this.cameras.main.setZoom(0.8);
    }
    
    // Add UI elements
    this.createUI();
  }
  
  protected updateScene(time: number, delta: number): void {
    // Skip updates if game is over
    if (this.isGameOver) return;
    
    // Update player
    this.player.update();
    
    // Rotate obstacles
    this.obstacles.getChildren().forEach((obstacle) => {
      (obstacle as Phaser.GameObjects.Sprite).angle += 2; // Rotate by 2 degrees per frame
    });
    
    // Update elapsed time
    this.elapsedTime = time - this.gameStartTime;
    
    // Update time display
    const minutes = Math.floor(this.elapsedTime / 60000);
    const seconds = Math.floor((this.elapsedTime % 60000) / 1000);
    this.timeText.setText(`Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }
  
  private createBackground(): void {
    // Create a gradient background
    const background = this.add.graphics();
    background.fillGradientStyle(0x0000AA, 0x0000AA, 0x000066, 0x000066, 1);
    background.fillRect(0, 0, this.worldWidth, this.worldHeight);
    
    // Add some decorative elements
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, this.worldWidth);
      const y = Phaser.Math.Between(0, this.worldHeight);
      const size = Phaser.Math.Between(1, 3);
      const star = this.add.circle(x, y, size, 0xFFFFFF, 0.7);
    }
  }
  
  private createPlatforms(): void {
    this.platforms = this.physics.add.staticGroup();
    
    // Create ground - brown rectangle
    const ground = this.add.rectangle(0, this.worldHeight - 32, this.worldWidth, 32, 0x8B4513);
    ground.setOrigin(0, 0);
    this.platforms.add(ground);
    
    // Create starting platform
    const startPlatform = this.add.rectangle(100, this.worldHeight - 150, 300, 20, 0x228B22);
    this.platforms.add(startPlatform);
    
    // Create platforms throughout the level
    const platformPositions = [
      { x: 500, y: 1800, width: 200, height: 20 },
      { x: 800, y: 1700, width: 150, height: 20 },
      { x: 1100, y: 1600, width: 180, height: 20 },
      { x: 1400, y: 1500, width: 200, height: 20 },
      { x: 1700, y: 1400, width: 150, height: 20 },
      { x: 2000, y: 1300, width: 180, height: 20 },
      { x: 2300, y: 1200, width: 200, height: 20 },
      { x: 2600, y: 1100, width: 150, height: 20 },
      { x: 2900, y: 1000, width: 180, height: 20 },
      { x: 3200, y: 900, width: 200, height: 20 },
      { x: 3500, y: 800, width: 150, height: 20 },
      { x: 3800, y: 700, width: 180, height: 20 },
      { x: 4100, y: 600, width: 200, height: 20 },
      { x: 4400, y: 500, width: 300, height: 20 },
      // Add some vertical platforms
      // { x: 1200, y: 1400, width: 20, height: 200 },
      // { x: 2400, y: 900, width: 20, height: 300 },
      // { x: 3600, y: 500, width: 20, height: 250 },
      // Add some floating platforms
      { x: 700, y: 1500, width: 100, height: 20 },
      { x: 1300, y: 1300, width: 100, height: 20 },
      { x: 1900, y: 1100, width: 100, height: 20 },
      { x: 2500, y: 900, width: 100, height: 20 },
      { x: 3100, y: 700, width: 100, height: 20 },
      { x: 3700, y: 500, width: 100, height: 20 },
      { x: 4300, y: 300, width: 100, height: 20 },
    ];
    
    // Create all platforms
    platformPositions.forEach(platform => {
      const rect = this.add.rectangle(platform.x, platform.y, platform.width, platform.height, 0x228B22);
      this.platforms.add(rect);
    });
    
    // Refresh all bodies
    this.platforms.refresh();
  }
  
  private createPlayer(): void {
    // Create player with spritesheet animations
    this.player = new Player({
      scene: this, 
      x: 150,
      y: this.worldHeight - 200, // Start position
      texture: 'player-example-dude',
      spritesheet: {
        key: 'player-example-dude',
        mirrorFrames: true, // Enable mirrored frames for left/right animations
        animations: {
          right: {
            frames: { start: 48, end: 59 },
            frameRate: 10,
            repeat: -1
          },
          idle: {
            frames: { start: 24, end: 35 },
            frameRate: 20,
            repeat: -1
          }
        }
      }
    });
    
    // Make player a bit smaller
    this.player.getSprite().setScale(0.3);
  }
  
  private createCoins(): void {
    this.coins = this.physics.add.staticGroup();
    
    // Create coins throughout the level
    const coinPositions = [
      { x: 500, y: 1750 },
      { x: 800, y: 1650 },
      { x: 1100, y: 1550 },
      { x: 1400, y: 1450 },
      { x: 1700, y: 1350 },
      { x: 2000, y: 1250 },
      { x: 2300, y: 1150 },
      { x: 2600, y: 1050 },
      { x: 2900, y: 950 },
      { x: 3200, y: 850 },
      { x: 3500, y: 750 },
      { x: 3800, y: 650 },
      { x: 4100, y: 550 },
      { x: 4400, y: 450 },
      // Add some extra coins for bonus points
      { x: 700, y: 1450 },
      { x: 1300, y: 1250 },
      { x: 1900, y: 1050 },
      { x: 2500, y: 850 },
      { x: 3100, y: 650 },
      { x: 3700, y: 450 },
      { x: 4300, y: 250 },
    ];
    
    // Create all coins
    coinPositions.forEach(pos => {
      const coin = this.add.sprite(pos.x, pos.y, 'coin');
      coin.setScale(2);
      this.coins.add(coin);
      
      // Add a pulsating glow effect instead of movement
      this.tweens.add({
        targets: coin,
        alpha: 0.7,
        scale: 2.2,
        duration: 1000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });
    });
    
    // Refresh the static group to update physics bodies
    (this.coins as any).refresh();
  }
  
  private createObstacles(): void {
    // Use StaticGroup instead of regular group to prevent obstacles from falling
    this.obstacles = this.physics.add.staticGroup();
    
    // Create spinning obstacles throughout the level
    const obstaclePositions = [
      { x: 650, y: 1700 },
      { x: 950, y: 1600 },
      { x: 1250, y: 1500 },
      { x: 1550, y: 1400 },
      { x: 1850, y: 1300 },
      { x: 2150, y: 1200 },
      { x: 2450, y: 1100 },
      { x: 2750, y: 1000 },
      { x: 3050, y: 900 },
      { x: 3350, y: 800 },
      { x: 3650, y: 700 },
      { x: 3950, y: 600 },
      { x: 4250, y: 500 },
    ];
    
    // Create all obstacles
    obstaclePositions.forEach(pos => {
      const obstacle = this.add.sprite(pos.x, pos.y, 'obstacle');
      obstacle.setScale(2);
      this.obstacles.add(obstacle);
    });
    
    // Refresh the static group to update physics bodies
    (this.obstacles as any).refresh();
  }
  
  private createFinishFlag(): void {
    // Create finish flag at the end of the level
    this.finishFlag = this.add.rectangle(4600, 450, 100, 100, 0x00FF00);
    this.physics.add.existing(this.finishFlag);
    
    // Configure the finish flag physics body
    const flagBody = this.finishFlag.body as Phaser.Physics.Arcade.Body;
    flagBody.setAllowGravity(false);
    flagBody.setImmovable(true);
    
    // Add a flag image
    const flagImage = this.add.image(4600, 450, 'finish-flag');
    flagImage.setScale(2);
    
    // Add a text to indicate finish
    this.add.text(4550, 380, 'FINISH', {
      fontSize: '24px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 4
    });
    
    // Debug visualization for the finish flag hitbox
    if (this.physics.config.debug) {
      this.finishFlag.setStrokeStyle(2, 0xFF0000);
    }
  }
  
  private createUI(): void {
    // Create score text that stays fixed to the camera
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '24px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 4
    }).setScrollFactor(0); // Fixed to camera
    
    // Create time text
    this.timeText = this.add.text(16, 50, 'Time: 00:00', {
      fontSize: '24px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 4
    }).setScrollFactor(0); // Fixed to camera
    
    // Add instructions
    this.add.text(16, 84, 'Arrow keys to move. Up arrow to jump.', {
      fontSize: '18px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 3
    }).setScrollFactor(0); // Fixed to camera
    
    // Add warning about obstacles
    this.add.text(16, 114, 'Avoid red spinning obstacles!', {
      fontSize: '18px',
      color: '#FF5555',
      stroke: '#000',
      strokeThickness: 3
    }).setScrollFactor(0); // Fixed to camera
    
    // Add warning about falling
    this.add.text(16, 144, 'Don\'t fall off the platforms!', {
      fontSize: '18px',
      color: '#FF5555',
      stroke: '#000',
      strokeThickness: 3
    }).setScrollFactor(0); // Fixed to camera
  }
  
  private collectCoin(player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, coin: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile): void {
    // Skip if coin is already collected
    if (!(coin as Phaser.GameObjects.Sprite).active) return;
    
    // Mark the coin as inactive but keep it visible with a different appearance
    (coin as Phaser.GameObjects.Sprite).setActive(false);
    (coin as Phaser.GameObjects.Sprite).setTint(0x555555); // Gray out the coin
    
    // Add to score
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
    
    // Play a sound effect
    // this.sound.play('coin-collect');
    
    // Create a particle effect
    const particles = this.add.particles((coin as Phaser.GameObjects.Sprite).x, (coin as Phaser.GameObjects.Sprite).y, 'coin', {
      speed: 100,
      lifespan: 500,
      scale: { start: 0.5, end: 0 },
      quantity: 5,
      emitting: false
    });
    
    // Explode and then destroy particles (but keep the coin visible)
    particles.explode();
    this.time.delayedCall(500, () => particles.destroy());
    
    // Add a flash effect
    this.tweens.add({
      targets: coin,
      alpha: 0.3,
      yoyo: true,
      duration: 200,
      repeat: 2
    });
  }
  
  private hitObstacle(player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, obstacle: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile): void {
    // Skip if game is already over
    if (this.isGameOver) return;
    
    // Set game over flag
    this.isGameOver = true;
    
    // Flash the camera
    this.cameras.main.flash(500, 255, 0, 0);
    
    // Disable player controls
    this.player.getSprite().setVelocity(0, 0);
    const body = this.player.getSprite().body;
    if (body && 'allowGravity' in body) {
      (body as any).allowGravity = false;
    }
    
    // Go to game over scene after a short delay
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', {
        score: this.score,
        timeTaken: this.elapsedTime,
        isVictory: false
      });
    });
  }
  
  private reachFinish(player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, flag: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile): void {
    // Skip if game is already over
    if (this.isGameOver) return;
    
    // Set game over flag
    this.isGameOver = true;
    
    // Disable player controls
    this.player.getSprite().setVelocity(0, 0);
    const body = this.player.getSprite().body;
    if (body && 'allowGravity' in body) {
      (body as any).allowGravity = false;
    }
    
    // Go to game over scene with victory status
    this.cameras.main.fade(1000, 0, 0, 0, false, (_camera: any, progress: number) => {
      if (progress === 1) {
        this.scene.start('GameOverScene', {
          score: this.score,
          timeTaken: this.elapsedTime,
          isVictory: true
        });
      }
    });
  }
  
  private createDeathZone(): void {
    // Create a zone at the bottom of the world that will trigger game over when touched
    this.deathZone = this.add.zone(this.worldWidth / 2, this.worldHeight, this.worldWidth, 50);
    
    // Enable physics for the death zone
    this.physics.world.enable(this.deathZone);
    
    // Configure the death zone body
    const deathBody = this.deathZone.body as Phaser.Physics.Arcade.Body;
    deathBody.setAllowGravity(false);
    deathBody.setImmovable(true);
    
    // Make sure the death zone has a proper collision box
    // The zone origin is at the center, so we need to position it accordingly
    deathBody.setSize(this.worldWidth, 50);
    
    // Debug visualization for the death zone
    if (this.physics.config.debug) {
      // Add a red rectangle to visualize the death zone in debug mode
      this.add.rectangle(this.worldWidth / 2, this.worldHeight, this.worldWidth, 50)
        .setStrokeStyle(2, 0xFF0000)
        .setFillStyle(0xFF0000, 0.3);
    }
  }
  
  private fallOutOfWorld(player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile, zone: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile): void {
    // Skip if game is already over
    if (this.isGameOver) return;
    
    // Set game over flag
    this.isGameOver = true;
    
    // Flash the camera
    this.cameras.main.flash(500, 0, 0, 0);
    
    // Go to game over scene after a short delay
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', {
        score: this.score,
        timeTaken: this.elapsedTime,
        isVictory: false
      });
    });
  }
}
