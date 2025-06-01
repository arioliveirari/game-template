import Phaser from 'phaser';
import { EventSystem } from '../services/eventSystem';
import { GAME_CONFIG } from '../config/game';

/**
 * Interface for scene registration data
 */
export interface SceneRegistration {
    key: string;
    scene: new (...args: any[]) => Phaser.Scene;
    active?: boolean;
    visible?: boolean;
    data?: any;
}

/**
 * SceneRegistry - Manages scene registration, transitions, and loading
 * 
 * This singleton class provides methods to register, start, stop, and transition
 * between scenes in the game.
 */
export class SceneRegistry {
    private static instance: SceneRegistry;
    private scenes: Map<string, SceneRegistration> = new Map();
    private game: Phaser.Game | null = null;
    private eventSystem: EventSystem;
    private activeScenes: Set<string> = new Set();
    private transitionDuration: number = GAME_CONFIG.scenes.transitions.duration;

    private constructor() {
        this.eventSystem = EventSystem.getInstance();
    }

    /**
     * Get the singleton instance of the SceneRegistry
     */
    public static getInstance(): SceneRegistry {
        if (!SceneRegistry.instance) {
            SceneRegistry.instance = new SceneRegistry();
        }
        return SceneRegistry.instance;
    }

    /**
     * Set the game instance
     * @param game Phaser.Game instance
     */
    public setGame(game: Phaser.Game): void {
        this.game = game;
    }

    /**
     * Register a scene with the registry
     * @param sceneData Scene registration data
     */
    public register(sceneData: SceneRegistration): void {
        // Check if scene is already registered
        if (this.scenes.has(sceneData.key)) {
            console.log(`Scene ${sceneData.key} is already registered. Skipping registration.`);
            return;
        }
        
        this.scenes.set(sceneData.key, sceneData);
        
        // Add to game if game instance exists
        if (this.game) {
            try {
                this.game.scene.add(sceneData.key, sceneData.scene, sceneData.active || false, sceneData.data);
            } catch (error) {
                console.warn(`Failed to add scene ${sceneData.key} to game:`, error);
                // Remove from our registry if adding to Phaser failed
                this.scenes.delete(sceneData.key);
                return;
            }
        }
        
        this.eventSystem.emit('scene-registered', sceneData.key);
    }

    /**
     * Register multiple scenes at once
     * @param scenesData Array of scene registration data
     */
    public registerMany(scenesData: SceneRegistration[]): void {
        scenesData.forEach(sceneData => this.register(sceneData));
    }

    /**
     * Start a scene
     * @param key Scene key
     * @param data Data to pass to the scene
     */
    public start(key: string, data?: any): void {
        if (!this.game) {
            console.error('Game instance not set. Call setGame() before starting scenes.');
            return;
        }
        
        if (!this.scenes.has(key)) {
            console.error(`Scene ${key} not registered.`);
            return;
        }
        
        this.game.scene.start(key, data);
        this.activeScenes.add(key);
        this.eventSystem.emit('scene-started', key, data);
    }

    /**
     * Stop a scene
     * @param key Scene key
     * @param data Data to pass to the scene
     */
    public stop(key: string, data?: any): void {
        if (!this.game) {
            console.error('Game instance not set. Call setGame() before stopping scenes.');
            return;
        }
        
        if (!this.scenes.has(key)) {
            console.error(`Scene ${key} not registered.`);
            return;
        }
        
        this.game.scene.stop(key, data);
        this.activeScenes.delete(key);
        this.eventSystem.emit('scene-stopped', key, data);
    }

    /**
     * Launch a scene (run in parallel with current scene)
     * @param key Scene key
     * @param data Data to pass to the scene
     */
    public launch(key: string, data?: any): void {
        if (!this.game) {
            console.error('Game instance not set. Call setGame() before launching scenes.');
            return;
        }
        
        if (!this.scenes.has(key)) {
            console.error(`Scene ${key} not registered.`);
            return;
        }
        
        // Start the scene but don't stop current scenes
        this.game.scene.start(key, data);
        this.activeScenes.add(key);
        this.eventSystem.emit('scene-launched', key, data);
    }

    /**
     * Transition from one scene to another with a fade effect
     * @param from Current scene key
     * @param to Target scene key
     * @param data Data to pass to the target scene
     * @param duration Transition duration in ms
     */
    public async transition(from: string, to: string, data?: any, duration?: number): Promise<void> {
        if (!this.game) {
            console.error('Game instance not set. Call setGame() before transitioning scenes.');
            return;
        }
        
        if (!this.scenes.has(from) || !this.scenes.has(to)) {
            console.error(`One or both scenes (${from}, ${to}) not registered.`);
            return;
        }
        
        const transitionDuration = duration || this.transitionDuration;
        
        // Get the current scene
        const fromScene = this.game.scene.getScene(from) as Phaser.Scene;
        
        if (!fromScene || !fromScene.cameras) {
            console.error(`Scene ${from} not available for transition.`);
            this.start(to, data);
            return;
        }
        
        // Emit transition start event
        this.eventSystem.emit('scene-transition-start', from, to, data);
        
        // Fade out current scene
        return new Promise<void>((resolve) => {
            fromScene.cameras.main.fadeOut(transitionDuration, 0, 0, 0, (camera: Phaser.Cameras.Scene2D.Camera, progress: number) => {
                if (progress === 1) {
                    // Stop current scene and start target scene
                    this.stop(from);
                    this.start(to, data);
                    
                    // Get the target scene
                    const toScene = this.game?.scene.getScene(to) as Phaser.Scene;
                    
                    if (toScene && toScene.cameras) {
                        // Fade in target scene
                        toScene.cameras.main.fadeIn(transitionDuration, 0, 0, 0, (camera: Phaser.Cameras.Scene2D.Camera, progress: number) => {
                            if (progress === 1) {
                                // Emit transition complete event
                                this.eventSystem.emit('scene-transition-complete', from, to, data);
                                resolve();
                            }
                        });
                    } else {
                        // If target scene not available, just resolve
                        this.eventSystem.emit('scene-transition-complete', from, to, data);
                        resolve();
                    }
                }
            });
        });
    }

    /**
     * Get a registered scene
     * @param key Scene key
     */
    public getScene(key: string): SceneRegistration | undefined {
        return this.scenes.get(key);
    }

    /**
     * Check if a scene is registered
     * @param key Scene key
     */
    public hasScene(key: string): boolean {
        return this.scenes.has(key);
    }

    /**
     * Check if a scene is active
     * @param key Scene key
     */
    public isSceneActive(key: string): boolean {
        return this.activeScenes.has(key);
    }

    /**
     * Get all registered scenes
     */
    public getAllScenes(): Map<string, SceneRegistration> {
        return new Map(this.scenes);
    }

    /**
     * Get all active scenes
     */
    public getActiveScenes(): string[] {
        return Array.from(this.activeScenes);
    }

    /**
     * Set the default transition duration
     * @param duration Duration in ms
     */
    public setTransitionDuration(duration: number): void {
        this.transitionDuration = duration;
    }
}
