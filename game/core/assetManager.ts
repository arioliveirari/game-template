import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/game';

export interface AssetDefinition {
    key: string;
    url: string;
    type: 'image' | 'audio' | 'spritesheet' | 'atlas' | 'video' | 'json';
    frameConfig?: Phaser.Types.Loader.FileTypes.ImageFrameConfig;
}

export interface AssetManifest {
    images?: AssetDefinition[];
    audio?: AssetDefinition[];
    spritesheets?: AssetDefinition[];
    atlases?: AssetDefinition[];
    videos?: AssetDefinition[];
    json?: AssetDefinition[];
}

export class AssetManager {
    private static instance: AssetManager;
    private scene: Phaser.Scene | null = null;
    private assetManifest: AssetManifest = {};
    private loadedAssets: Set<string> = new Set();
    private basePaths = GAME_CONFIG.assets.basePaths;

    private constructor() {}

    public static getInstance(): AssetManager {
        if (!AssetManager.instance) {
            AssetManager.instance = new AssetManager();
        }
        return AssetManager.instance;
    }

    public setScene(scene: Phaser.Scene): void {
        this.scene = scene;
    }

    public loadAssetManifest(manifest: AssetManifest): void {
        this.assetManifest = manifest;
    }

    public preloadAssets(
        types: Array<keyof AssetManifest> = ['images', 'audio', 'spritesheets', 'atlases', 'videos', 'json']
    ): void {
        if (!this.scene) {
            console.error('Scene not set. Call setScene() before preloadAssets()');
            return;
        }

        types.forEach(type => {
            const assets = this.assetManifest[type];
            if (assets && assets.length > 0) {
                this.loadAssetsByType(type, assets);
            }
        });
    }

    private loadAssetsByType(type: keyof AssetManifest, assets: AssetDefinition[]): void {
        if (!this.scene || !this.scene.load) {
            return;
        }

        assets.forEach(asset => {
            // Skip if already loaded
            if (this.loadedAssets.has(asset.key)) {
                return;
            }

            // Determine base path based on asset type
            let basePath = '';
            if (type === 'images') {
                basePath = this.basePaths.sprites;
            } else if (type === 'audio') {
                basePath = this.basePaths.audio;
            } else if (type === 'spritesheets' || type === 'atlases') {
                basePath = this.basePaths.sprites;
            }

            const url = `${basePath}${asset.url}`;

            // Load based on asset type
            if (this.scene && this.scene.load) {
                switch (asset.type) {
                    case 'image':
                        this.scene.load.image(asset.key, url);
                        break;
                    case 'audio':
                        this.scene.load.audio(asset.key, url);
                        break;
                    case 'spritesheet':
                        if (asset.frameConfig) {
                            this.scene.load.spritesheet(asset.key, url, asset.frameConfig);
                        } else {
                            console.warn(`Spritesheet ${asset.key} missing frameConfig`);
                        }
                        break;
                    case 'atlas':
                        this.scene.load.atlas(asset.key, url, `${url.replace('.png', '.json')}`);
                        break;
                    case 'video':
                        this.scene.load.video(asset.key, url);
                        break;
                    case 'json':
                        this.scene.load.json(asset.key, url);
                        break;
                }
            }

            // Mark as loaded
            this.loadedAssets.add(asset.key);
        });
    }

    // Get an asset by key
    public getAsset(key: string): any {
        if (!this.scene) {
            console.error('Scene not set. Call setScene() before getAsset()');
            return null;
        }

        // Access specific cache based on asset type
        if (this.scene.cache.json.has(key)) {
            return this.scene.cache.json.get(key);
        } else if (this.scene.textures.exists(key)) {
            return this.scene.textures.get(key);
        } else if (this.scene.cache.audio.has(key)) {
            return this.scene.cache.audio.get(key);
        }
        
        return null;
    }

    // Check if an asset is loaded
    public isAssetLoaded(key: string): boolean {
        return this.loadedAssets.has(key);
    }

    // Clear loaded assets
    public clearLoadedAssets(): void {
        this.loadedAssets.clear();
    }
}
