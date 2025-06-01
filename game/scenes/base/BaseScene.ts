import Phaser from 'phaser';
import { GAME_CONFIG } from '../../config/game';

export abstract class BaseScene extends Phaser.Scene {
    protected gameConfig = GAME_CONFIG;
    protected isInitialized = false;
    protected sceneKey: string;

    constructor(key: string) {
        super({ key });
        this.sceneKey = key;
    }

    protected abstract initialize(): void;

    protected abstract createScene(): void;

    protected abstract updateScene(time: number, delta: number): void;

    protected abstract preloadScene(): void;

    init(): void {
        this.isInitialized = true;
        this.initialize();
    }

    preload(): void {
        if (!this.isInitialized) {
            this.initialize();
        }
        this.preloadScene();
    }

    create(): void {
        this.createScene();
    }

    update(time: number, delta: number): void {
        this.updateScene(time, delta);
    }

    // Scene Transition Methods
    protected fadeInScene(duration: number = 500): Promise<void> {
        return new Promise((resolve) => {
            this.cameras.main.fadeIn(duration, 0, 0, 0, () => {
                resolve();
            });
        });
    }

    protected fadeOutScene(duration: number = 500): Promise<void> {
        return new Promise((resolve) => {
            this.cameras.main.fadeOut(duration, 0, 0, 0, () => {
                resolve();
            });
        });
    }

    // Utility Methods
    protected getSceneWidth(): number {
        return this.gameConfig.width;
    }

    protected getSceneHeight(): number {
        return this.gameConfig.height;
    }

    protected centerObject(obj: Phaser.GameObjects.Components.Transform & Phaser.GameObjects.GameObject): void {
        obj.setPosition(
            this.getSceneWidth() / 2,
            this.getSceneHeight() / 2
        );
    }
}
