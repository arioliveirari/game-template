import Phaser from 'phaser';
import { BaseScene } from '../base/BaseScene';

/**
 * Game Over Scene that displays score, time, and provides retry/menu options
 */
export class GameOverScene extends BaseScene {
  // Game data passed from the previous scene
  private score: number = 0;
  private timeTaken: number = 0;
  private isVictory: boolean = false;
  
  // UI elements
  private titleText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private retryButton!: Phaser.GameObjects.Rectangle;
  private menuButton!: Phaser.GameObjects.Rectangle;
  
  constructor() {
    super('GameOverScene');
  }
  
  // Override the initialize method from BaseScene to handle data from init
  protected initialize(): void {
    // Initialize scene-specific properties
  }
  
  // Method to receive data from the previous scene
  init(data?: { score?: number; timeTaken?: number; isVictory?: boolean }): void {
    this.score = data?.score || 0;
    this.timeTaken = data?.timeTaken || 0;
    this.isVictory = data?.isVictory || false;
  }
  
  protected preloadScene(): void {
    // No assets to preload for this scene
  }
  
  protected createScene(): void {
    // Create background
    this.createBackground();
    
    // Create UI elements
    this.createUI();
    
    // Add button functionality
    this.setupButtons();
    
    // Fade in the scene
    this.cameras.main.fadeIn(1000);
  }
  
  protected updateScene(time: number, delta: number): void {
    // No update logic needed for this scene
  }
  
  private createBackground(): void {
    // Create a gradient background
    const background = this.add.graphics();
    
    // Different background colors based on victory or defeat
    if (this.isVictory) {
      background.fillGradientStyle(0x005500, 0x005500, 0x003300, 0x003300, 1);
    } else {
      background.fillGradientStyle(0x550000, 0x550000, 0x330000, 0x330000, 1);
    }
    
    background.fillRect(0, 0, this.getSceneWidth(), this.getSceneHeight());
    
    // Add some decorative elements
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, this.getSceneWidth());
      const y = Phaser.Math.Between(0, this.getSceneHeight());
      const size = Phaser.Math.Between(1, 3);
      const star = this.add.circle(x, y, size, 0xFFFFFF, 0.7);
    }
  }
  
  private createUI(): void {
    const centerX = this.getSceneWidth() / 2;
    
    // Create title
    this.titleText = this.add.text(centerX, 100, this.isVictory ? 'LEVEL COMPLETE!' : 'GAME OVER', {
      fontSize: '48px',
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5);
    
    // Create score text
    this.scoreText = this.add.text(centerX, 200, `Score: ${this.score}`, {
      fontSize: '32px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5);
    
    // Format time (seconds to MM:SS)
    const minutes = Math.floor(this.timeTaken / 60000);
    const seconds = Math.floor((this.timeTaken % 60000) / 1000);
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Create time text
    this.timeText = this.add.text(centerX, 250, `Time: ${timeString}`, {
      fontSize: '32px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5);
    
    // Create retry button
    const retryButtonBg = this.add.rectangle(centerX - 100, 350, 150, 50, 0x228B22);
    const retryButtonText = this.add.text(centerX - 100, 350, 'RETRY', {
      fontSize: '24px',
      color: '#fff',
      align: 'center'
    }).setOrigin(0.5);
    
    // Create menu button
    const menuButtonBg = this.add.rectangle(centerX + 100, 350, 150, 50, 0x4682B4);
    const menuButtonText = this.add.text(centerX + 100, 350, 'MENU', {
      fontSize: '24px',
      color: '#fff',
      align: 'center'
    }).setOrigin(0.5);
    
    // Make buttons interactive
    this.retryButton = retryButtonBg.setInteractive();
    this.menuButton = menuButtonBg.setInteractive();
    
    // Add hover effects
    this.setupButtonHoverEffects(retryButtonBg, retryButtonText);
    this.setupButtonHoverEffects(menuButtonBg, menuButtonText);
  }
  
  private setupButtonHoverEffects(button: Phaser.GameObjects.Rectangle, text: Phaser.GameObjects.Text): void {
    button.on('pointerover', () => {
      button.setScale(1.1);
      text.setScale(1.1);
    });
    
    button.on('pointerout', () => {
      button.setScale(1);
      text.setScale(1);
    });
  }
  
  private setupButtons(): void {
    // Retry button
    this.retryButton.on('pointerdown', () => {
      this.cameras.main.fade(500, 0, 0, 0, false, (camera: Phaser.Cameras.Scene2D.Camera, progress: number) => {
        if (progress === 1) {
          this.scene.start('PlayerExample');
        }
      });
    });
    
    // Menu button
    this.menuButton.on('pointerdown', () => {
      this.cameras.main.fade(500, 0, 0, 0, false, (camera: Phaser.Cameras.Scene2D.Camera, progress: number) => {
        if (progress === 1) {
          this.scene.start('Menu');
        }
      });
    });
  }
}
