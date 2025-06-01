import { BaseScene } from '../base/BaseScene';
import { EventSystem } from '../../services/eventSystem';
import { Player } from '../../entities/player/Player';

/**
 * MainScene - A simple rectangle-based platform game
 * 
 * This scene contains basic platform game mechanics using only colored rectangles
 * for simplicity and maintainability.
 */
export class MainScene extends BaseScene {
    private eventSystem: EventSystem;
    
    // Game objects
    private player!: Player;
    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private collectibles!: Phaser.Physics.Arcade.Group;
    
    // UI elements
    private scoreText!: Phaser.GameObjects.Text;
    private score: number = 0;

    constructor() {
        super('MainScene');
        this.eventSystem = EventSystem.getInstance();
    }

    protected initialize(): void {
        // Initialize scene-specific properties
    }

    protected preloadScene(): void {
        // No assets to preload - we'll create everything with graphics
    }

    protected createScene(): void {
        // Add background - a blue rectangle
        const bg = this.add.rectangle(0, 0, this.getSceneWidth(), this.getSceneHeight(), 0x87CEEB);
        bg.setOrigin(0, 0);
        
        // Create platforms
        this.createPlatforms();
        
        // Create player
        this.createPlayer();
        
        // Create collectibles
        this.createCollectibles();
        
        // Set up collisions
        this.physics.add.collider(this.player.getSprite(), this.platforms);
        this.physics.add.collider(this.collectibles, this.platforms);
        
        this.physics.add.overlap(
            this.player.getSprite(), 
            this.collectibles, 
            this.collectItem as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, 
            undefined, 
            this
        );
        
        // Create score display
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            color: '#000',
            fontFamily: 'Arial'
        });
        this.scoreText.setDepth(10); // Make sure it's on top
        
        // Player controls are handled by the Player entity
        
        // Fade in the scene
        this.fadeInScene();
    }

    protected updateScene(time: number, delta: number): void {
        // Handle player movement
        this.updatePlayer();
        
        // Check if player fell off the screen
        if (this.player.getSprite().y > this.getSceneHeight()) {
            this.gameOver();
        }
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
        const platform2 = this.add.rectangle(50, 250, 200, 20, 0x228B22);
        const platform3 = this.add.rectangle(750, 220, 200, 20, 0x228B22);
        
        // Add platforms to the physics group
        this.platforms.add(platform1);
        this.platforms.add(platform2);
        this.platforms.add(platform3);
        
        // Refresh all bodies
        this.platforms.refresh();
    }
    
    private createPlayer(): void {
        // Create player entity at position (100, 450)
        // Using the default red rectangle since we're not providing a texture
        this.player = new Player({
            scene: this,
            x: 100,
            y: 450
            // No texture or spritesheet provided, so it will use the default red rectangle
        });
    }
    
    private createCollectibles(): void {
        this.collectibles = this.physics.add.group();
        
        // Create yellow circles as collectibles
        const collectibleSize = 16;
        
        // Create a yellow circle texture
        const collectibleGraphics = this.make.graphics({ x: 0, y: 0 });
        collectibleGraphics.fillStyle(0xFFFF00, 1); // Yellow color
        collectibleGraphics.fillCircle(collectibleSize/2, collectibleSize/2, collectibleSize/2);
        collectibleGraphics.generateTexture('collectible-circle', collectibleSize, collectibleSize);
        collectibleGraphics.destroy();
        
        // Create multiple collectibles
        for (let i = 0; i < 12; i++) {
            const x = 12 + i * 70;
            const y = 0;
            const collectible = this.collectibles.create(x, y, 'collectible-circle');
            collectible.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }
    }
    
    // No enemies in this simple version
    
    private updatePlayer(): void {
        // Player movement is now handled by the Player entity
        this.player.update();
    }
    
    private collectItem(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, collectible: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
        (collectible as Phaser.Physics.Arcade.Sprite).disableBody(true, true);
        
        // Update score
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        
        // Check if all collectibles collected
        if (this.collectibles.countActive(true) === 0) {
            // Respawn collectibles
            this.collectibles.getChildren().forEach((child) => {
                const item = child as Phaser.Physics.Arcade.Sprite;
                item.enableBody(true, item.x, 0, true, true);
            });
        }
    }
    
    private gameOver(): void {
        // Display game over text
        const gameOverText = this.add.text(
            this.getSceneWidth() / 2,
            this.getSceneHeight() / 2,
            'GAME OVER\nScore: ' + this.score + '\nClick to restart',
            {
                fontSize: '48px',
                color: '#fff',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                align: 'center',
                stroke: '#000',
                strokeThickness: 6
            }
        );
        gameOverText.setOrigin(0.5);
        
        // Reset player position
        this.player.setPosition(100, 450);
        
        // Reset score
        this.score = 0;
        this.scoreText.setText('Score: 0');
        
        // Wait for click to restart
        this.input.once('pointerdown', () => {
            this.scene.restart();
        });
    }
}
