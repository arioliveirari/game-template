import Phaser from 'phaser';
import { EventSystem } from '../../services/eventSystem';
import { Component } from './Component';

// Forward declaration to avoid circular dependency

/**
 * Base Entity class for game objects
 * 
 * This class represents a game entity that can have multiple components
 * attached to it. It follows the Entity-Component pattern for better
 * organization and reusability.
 */
export class Entity {
    private id: string;
    private components: Map<string, Component> = new Map();
    private scene: Phaser.Scene;
    private eventSystem: EventSystem;
    private gameObject: Phaser.GameObjects.GameObject | null = null;
    private active: boolean = true;
    private tags: Set<string> = new Set();

    /**
     * Create a new entity
     * @param scene The scene this entity belongs to
     * @param id Optional entity ID (generated if not provided)
     */
    constructor(scene: Phaser.Scene, id?: string) {
        this.scene = scene;
        this.id = id || `entity_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        this.eventSystem = EventSystem.getInstance();
    }

    /**
     * Get the entity's ID
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Get the scene this entity belongs to
     */
    public getScene(): Phaser.Scene {
        return this.scene;
    }

    /**
     * Set the main game object for this entity
     * @param gameObject Phaser game object
     */
    public setGameObject(gameObject: Phaser.GameObjects.GameObject): this {
        this.gameObject = gameObject;
        return this;
    }

    /**
     * Get the main game object for this entity
     */
    public getGameObject<T extends Phaser.GameObjects.GameObject>(): T | null {
        return this.gameObject as T | null;
    }

    /**
     * Add a component to this entity
     * @param component Component to add
     */
    public addComponent(component: Component): this {
        const componentName = component.getName();
        
        if (this.components.has(componentName)) {
            console.warn(`Entity ${this.id} already has a component named ${componentName}. It will be replaced.`);
        }
        
        this.components.set(componentName, component);
        component.setEntity(this);
        component.initialize();
        
        this.eventSystem.emit('entity-component-added', this, component);
        
        return this;
    }

    /**
     * Remove a component from this entity
     * @param componentName Name of the component to remove
     */
    public removeComponent(componentName: string): this {
        if (this.components.has(componentName)) {
            const component = this.components.get(componentName)!;
            component.destroy();
            this.components.delete(componentName);
            
            this.eventSystem.emit('entity-component-removed', this, component);
        }
        
        return this;
    }

    /**
     * Check if this entity has a specific component
     * @param componentName Name of the component to check for
     */
    public hasComponent(componentName: string): boolean {
        return this.components.has(componentName);
    }

    /**
     * Get a component by name
     * @param componentName Name of the component to get
     */
    public getComponent<T extends Component>(componentName: string): T | undefined {
        return this.components.get(componentName) as T | undefined;
    }

    /**
     * Get all components
     */
    public getComponents(): Map<string, Component> {
        return new Map(this.components);
    }

    /**
     * Update all components
     * @param time Current time
     * @param delta Time since last update
     */
    public update(time: number, delta: number): void {
        if (!this.active) return;
        
        this.components.forEach(component => {
            if (component.isActive()) {
                component.update(time, delta);
            }
        });
    }

    /**
     * Destroy this entity and all its components
     */
    public destroy(): void {
        // Destroy all components
        this.components.forEach(component => {
            component.destroy();
        });
        
        this.components.clear();
        
        // Destroy game object if it exists
        if (this.gameObject && !this.gameObject.scene) {
            this.gameObject.destroy();
        }
        
        this.gameObject = null;
        this.active = false;
        
        this.eventSystem.emit('entity-destroyed', this);
    }

    /**
     * Set whether this entity is active
     * @param active Whether the entity is active
     */
    public setActive(active: boolean): this {
        this.active = active;
        
        // Set game object active state if it exists
        if (this.gameObject && 'setActive' in this.gameObject) {
            (this.gameObject as any).setActive(active);
        }
        
        return this;
    }

    /**
     * Check if this entity is active
     */
    public isActive(): boolean {
        return this.active;
    }

    /**
     * Add a tag to this entity
     * @param tag Tag to add
     */
    public addTag(tag: string): this {
        this.tags.add(tag);
        return this;
    }

    /**
     * Remove a tag from this entity
     * @param tag Tag to remove
     */
    public removeTag(tag: string): this {
        this.tags.delete(tag);
        return this;
    }

    /**
     * Check if this entity has a specific tag
     * @param tag Tag to check for
     */
    public hasTag(tag: string): boolean {
        return this.tags.has(tag);
    }

    /**
     * Get all tags for this entity
     */
    public getTags(): string[] {
        return Array.from(this.tags);
    }
}
