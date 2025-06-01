import { BaseScene } from '../base/BaseScene';
import { AssetManager } from '../../core/assetManager';
import { EventSystem } from '../../services/eventSystem';
import { SceneRegistry } from '../../core/sceneRegistry';

/**
 * BootScene - The first scene loaded in the game
 * 
 * This scene handles initial setup, loading essential assets,
 * and transitioning to the preload scene.
 */
export class BootScene extends BaseScene {
    private assetManager: AssetManager;
    private eventSystem: EventSystem;
    private sceneRegistry: SceneRegistry;
    private loadingText!: Phaser.GameObjects.Text;

    constructor() {
        super('BootScene');
        this.assetManager = AssetManager.getInstance();
        this.eventSystem = EventSystem.getInstance();
        this.sceneRegistry = SceneRegistry.getInstance();
    }

    protected initialize(): void {
        // Set up the asset manager with this scene
        this.assetManager.setScene(this);
        
        // Register for events
        this.eventSystem.on('assets-loaded', this.onAssetsLoaded, this);
    }

    protected preloadScene(): void {
        // Load minimal assets needed for loading screen
        this.load.image('logo', 'assets/logo.png');
        this.load.image('loading-bar', 'assets/loading-bar.png');
        this.load.image('loading-bar-bg', 'assets/loading-bar-bg.png');
        
        // Load essential configuration files
        this.load.json('asset-manifest', 'assets/asset-manifest.json');
    }

    protected createScene(): void {
        // Display a simple loading message
        this.loadingText = this.add.text(
            this.getSceneWidth() / 2,
            this.getSceneHeight() / 2,
            'Starting game...',
            {
                fontSize: '24px',
                color: '#ffffff',
                fontFamily: 'Arial'
            }
        );
        this.loadingText.setOrigin(0.5);
        
        // Proceed to next scene after a short delay
        this.time.delayedCall(1000, this.proceedToNextScene, [], this);
    }

    protected updateScene(time: number, delta: number): void {
        // Update any animations or effects if needed
    }

    private proceedToNextScene(): void {
        // Load the asset manifest if available
        const assetManifest = this.cache.json.get('asset-manifest');
        if (assetManifest) {
            this.assetManager.loadAssetManifest(assetManifest);
        }
        
        // Transition to the preload scene
        this.fadeOutScene(500).then(() => {
            this.scene.start('PreloadScene');
        });
    }

    private onAssetsLoaded(): void {
        // Handle any post-loading tasks if needed
    }

    // Clean up when scene is shut down
    public destroy(): void {
        this.eventSystem.off('assets-loaded', this.onAssetsLoaded, this);
        // Remove any other event listeners or resources
    }
}
