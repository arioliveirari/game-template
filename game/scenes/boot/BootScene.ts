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
    }

    protected preloadScene(): void {
        // Create fallback assets in memory if they don't exist
        this.createFallbackAssets();
        
        // Load minimal assets needed for boot
        this.load.image('logo', 'assets/logo.png');
        this.load.image('loading-bar-bg', 'assets/loading-bar-bg.png');
        
        // Load asset manifest
        this.load.json('asset-manifest', 'assets/asset-manifest.json');
        
        // Register event for when assets are loaded
        this.eventSystem.on('assets-loaded', this.onAssetsLoaded, this);
    }
    
    /**
     * Create fallback assets in memory if files don't exist
     * This prevents errors during initial loading
     */
    private createFallbackAssets(): void {
        // Create a simple logo texture if the file doesn't exist
        if (!this.textures.exists('logo')) {
            const graphics = this.make.graphics({ x: 0, y: 0 });
            graphics.fillStyle(0x3498db, 1);
            graphics.fillRect(0, 0, 200, 100);
            graphics.fillStyle(0xffffff, 1);
            graphics.fillRect(20, 20, 160, 60);
            graphics.generateTexture('logo', 200, 100);
            graphics.destroy();
        }
        
        // Create a loading bar background texture if the file doesn't exist
        if (!this.textures.exists('loading-bar-bg')) {
            const graphics = this.make.graphics({ x: 0, y: 0 });
            graphics.fillStyle(0x222222, 1);
            graphics.fillRect(0, 0, 400, 40);
            graphics.generateTexture('loading-bar-bg', 400, 40);
            graphics.destroy();
        }
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
