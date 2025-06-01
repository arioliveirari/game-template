import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/game';

export class GameTemplate extends Phaser.Game {
    constructor() {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: GAME_CONFIG.width,
            height: GAME_CONFIG.height,
            physics: {
                default: GAME_CONFIG.physics.default,
                arcade: {
                    gravity: { x: 0, y: GAME_CONFIG.physics.arcade.gravity.y },
                    debug: GAME_CONFIG.physics.arcade.debug
                }
            },
            scene: [],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            backgroundColor: '#000000',
            parent: 'game-container'
        };

        super(config);
    }

    // Add scene to the game
    public addScene(scene: Phaser.Scene, key?: string): void {
        const sceneKey = key || scene.constructor.name;
        this.scene.add(sceneKey, scene);
    }

    // Start a scene with transition
    public startScene(sceneKey: string, data?: any): Promise<void> {
        return new Promise((resolve) => {
            this.scene.start(sceneKey, data);
            resolve();
        });
    }

    // Get the current scene
    public getCurrentScene(): Phaser.Scene | undefined {
        return this.scene.getScene(GAME_CONFIG.scenes.initial);
    }

    // Add assets to the game
    public addAssets(scene: Phaser.Scene, assets: Array<{type: string, key: string, url: string}>): void {
        if (scene.load) {
            assets.forEach(asset => {
                if (asset.type === 'image') {
                    scene.load.image(asset.key, asset.url);
                } else if (asset.type === 'audio') {
                    scene.load.audio(asset.key, asset.url);
                } else if (asset.type === 'spritesheet') {
                    scene.load.spritesheet(asset.key, asset.url, { frameWidth: 32, frameHeight: 32 });
                }
                // Add more asset types as needed
            });
        }
    }

    // Preload assets in a specific scene
    public preloadAssets(scene: Phaser.Scene): void {
        // Add your global assets here
        // Example:
        // this.addAssets(scene, [
        //     { type: 'image', key: 'logo', url: 'assets/logo.png' }
        // ]);
    }
}
