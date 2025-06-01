// Using interface to avoid circular dependency
interface IEntity {
    getId(): string;
    getScene(): Phaser.Scene;
    getGameObject<T extends Phaser.GameObjects.GameObject>(): T | null;
}

/**
 * Base Component class for entity components
 * 
 * This abstract class is the base for all components that can be
 * attached to entities. Components encapsulate specific behaviors
 * or features that can be reused across different entities.
 */
export abstract class Component {
    protected entity: IEntity | null = null;
    protected active: boolean = true;
    private name: string;

    /**
     * Create a new component
     * @param name Component name (defaults to class name)
     */
    constructor(name?: string) {
        this.name = name || this.constructor.name;
    }

    /**
     * Get the component name
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Set the entity this component belongs to
     * @param entity Parent entity
     */
    public setEntity(entity: IEntity): void {
        this.entity = entity;
    }

    /**
     * Get the entity this component belongs to
     */
    public getEntity(): IEntity | null {
        return this.entity;
    }

    /**
     * Initialize the component
     * Called when the component is added to an entity
     */
    public initialize(): void {
        // Override in subclasses
    }

    /**
     * Update the component
     * Called every frame if the component is active
     * @param time Current time
     * @param delta Time since last update
     */
    public update(time: number, delta: number): void {
        // Override in subclasses
    }

    /**
     * Destroy the component
     * Called when the component is removed from an entity
     */
    public destroy(): void {
        this.entity = null;
        // Override in subclasses for additional cleanup
    }

    /**
     * Set whether this component is active
     * @param active Whether the component is active
     */
    public setActive(active: boolean): this {
        this.active = active;
        return this;
    }

    /**
     * Check if this component is active
     */
    public isActive(): boolean {
        return this.active;
    }

    /**
     * Get the scene this component's entity belongs to
     */
    protected getScene(): Phaser.Scene | null {
        return this.entity ? this.entity.getScene() : null;
    }

    /**
     * Get the game object this component's entity is attached to
     */
    protected getGameObject<T extends Phaser.GameObjects.GameObject>(): T | null {
        return this.entity ? this.entity.getGameObject<T>() : null;
    }
}
