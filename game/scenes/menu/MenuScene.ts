import { BaseScene } from '../base/BaseScene';
import { SceneRegistry } from '../../core/sceneRegistry';

/**
 * MenuScene - The main menu scene with a play button
 * 
 * This scene displays the game title and a play button that transitions to the main game scene.
 */
export class MenuScene extends BaseScene {
    private sceneRegistry: SceneRegistry;
    private title!: Phaser.GameObjects.Text;
    private playButton!: Phaser.GameObjects.Text;
    private exampleButton!: Phaser.GameObjects.Text;

    constructor() {
        super('MenuScene');
        this.sceneRegistry = SceneRegistry.getInstance();
    }

    protected initialize(): void {
        // Initialize scene-specific properties
    }

    protected preloadScene(): void {
        // Preload any menu-specific assets
        this.load.image('button-bg', 'assets/button-bg.png');
    }

    protected createScene(): void {
        // Create a background
        const bg = this.add.rectangle(0, 0, this.getSceneWidth(), this.getSceneHeight(), 0x0c4a6e);
        bg.setOrigin(0, 0);

        // Create title text
        this.title = this.add.text(
            this.getSceneWidth() / 2,
            this.getSceneHeight() / 3,
            'PLATFORM ADVENTURE',
            {
                fontSize: '48px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            }
        );
        this.title.setOrigin(0.5);

        // Create play button with background
        const buttonX = this.getSceneWidth() / 2;
        const buttonY = this.getSceneHeight() / 2 + 20;
        
        // Button background
        const buttonBg = this.add.rectangle(buttonX, buttonY, 200, 60, 0x3498db, 1);
        buttonBg.setOrigin(0.5);
        buttonBg.setInteractive({ useHandCursor: true });
        
        // Add hover effect
        buttonBg.on('pointerover', () => {
            buttonBg.fillColor = 0x2980b9;
            this.playButton.setColor('#f0f0f0');
        });
        
        buttonBg.on('pointerout', () => {
            buttonBg.fillColor = 0x3498db;
            this.playButton.setColor('#ffffff');
        });
        
        // Add click event
        buttonBg.on('pointerdown', () => {
            this.handlePlayButtonClick();
        });

        // Button text
        this.playButton = this.add.text(
            buttonX,
            buttonY,
            'PLAY',
            {
                fontSize: '32px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        );
        this.playButton.setOrigin(0.5);

        // Create example button (to demonstrate Player entity)
        const exampleButtonX = this.getSceneWidth() / 2;
        const exampleButtonY = this.getSceneHeight() / 2 + 100;
        
        // Example button background
        const exampleButtonBg = this.add.rectangle(exampleButtonX, exampleButtonY, 300, 60, 0x27ae60, 1);
        exampleButtonBg.setOrigin(0.5);
        exampleButtonBg.setInteractive({ useHandCursor: true });
        
        // Add hover effect
        exampleButtonBg.on('pointerover', () => {
            exampleButtonBg.fillColor = 0x219653;
            this.exampleButton.setColor('#f0f0f0');
        });
        
        exampleButtonBg.on('pointerout', () => {
            exampleButtonBg.fillColor = 0x27ae60;
            this.exampleButton.setColor('#ffffff');
        });
        
        // Add click event
        exampleButtonBg.on('pointerdown', () => {
            this.handleExampleButtonClick();
        });

        // Example button text
        this.exampleButton = this.add.text(
            exampleButtonX,
            exampleButtonY,
            'PLAYER EXAMPLE',
            {
                fontSize: '24px',
                color: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }
        );
        this.exampleButton.setOrigin(0.5);
        
        // Fade in the scene
        this.fadeInScene();
    }

    protected updateScene(time: number, delta: number): void {
        // Update any animations or effects if needed
    }

    private handlePlayButtonClick(): void {
        // Play a click sound if available
        
        // Transition to the main game scene
        this.fadeOutScene().then(() => {
            this.sceneRegistry.transition('MenuScene', 'MainScene');
        });
    }
    
    private handleExampleButtonClick(): void {
        // Transition to the player example scene
        this.fadeOutScene().then(() => {
            this.sceneRegistry.transition('MenuScene', 'PlayerExample');
        });
    }
}
