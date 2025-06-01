import { EventSystem } from '../services/eventSystem';

/**
 * Interface for game state data
 */
export interface GameState {
    [key: string]: any;
}

/**
 * StateManager - Manages global game state and persistence
 * 
 * This singleton class provides methods to get, set, and persist game state
 * across scenes and game sessions.
 */
export class StateManager {
    private static instance: StateManager;
    private state: GameState = {};
    private eventSystem: EventSystem;
    private storageKey = 'game_template_save';
    private autoSave: boolean = true;

    private constructor() {
        this.eventSystem = EventSystem.getInstance();
        this.loadState();
    }

    /**
     * Get the singleton instance of the StateManager
     */
    public static getInstance(): StateManager {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }

    /**
     * Get a value from the state
     * @param key State key
     * @param defaultValue Default value if key doesn't exist
     */
    public get<T>(key: string, defaultValue?: T): T {
        return (key in this.state) ? this.state[key] : defaultValue as T;
    }

    /**
     * Set a value in the state
     * @param key State key
     * @param value Value to set
     * @param persist Whether to persist the state after setting
     */
    public set<T>(key: string, value: T, persist: boolean = this.autoSave): void {
        const oldValue = this.state[key];
        this.state[key] = value;
        
        // Emit change event
        this.eventSystem.emit('state-changed', key, value, oldValue);
        
        if (persist) {
            this.saveState();
        }
    }

    /**
     * Check if a key exists in the state
     * @param key State key
     */
    public has(key: string): boolean {
        return key in this.state;
    }

    /**
     * Remove a key from the state
     * @param key State key
     * @param persist Whether to persist the state after removal
     */
    public remove(key: string, persist: boolean = this.autoSave): void {
        if (this.has(key)) {
            const oldValue = this.state[key];
            delete this.state[key];
            
            // Emit change event
            this.eventSystem.emit('state-removed', key, oldValue);
            
            if (persist) {
                this.saveState();
            }
        }
    }

    /**
     * Reset the state to empty
     * @param persist Whether to persist the empty state
     */
    public reset(persist: boolean = true): void {
        this.state = {};
        
        // Emit reset event
        this.eventSystem.emit('state-reset');
        
        if (persist) {
            this.saveState();
        }
    }

    /**
     * Save the state to local storage
     */
    public saveState(): void {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(this.storageKey, JSON.stringify(this.state));
                this.eventSystem.emit('state-saved', this.state);
            }
        } catch (error) {
            console.error('Failed to save game state:', error);
            this.eventSystem.emit('state-save-error', error);
        }
    }

    /**
     * Load the state from local storage
     */
    public loadState(): void {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const savedState = window.localStorage.getItem(this.storageKey);
                
                if (savedState) {
                    this.state = JSON.parse(savedState);
                    this.eventSystem.emit('state-loaded', this.state);
                }
            }
        } catch (error) {
            console.error('Failed to load game state:', error);
            this.eventSystem.emit('state-load-error', error);
        }
    }

    /**
     * Set whether to automatically save state on changes
     * @param autoSave Whether to auto-save
     */
    public setAutoSave(autoSave: boolean): void {
        this.autoSave = autoSave;
    }

    /**
     * Get the entire state object
     */
    public getState(): GameState {
        return { ...this.state };
    }

    /**
     * Set multiple state values at once
     * @param partialState Partial state to merge
     * @param persist Whether to persist after setting
     */
    public setState(partialState: Partial<GameState>, persist: boolean = this.autoSave): void {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...partialState };
        
        // Emit change event
        this.eventSystem.emit('state-updated', this.state, oldState);
        
        if (persist) {
            this.saveState();
        }
    }

    /**
     * Export the state as a JSON string
     */
    public exportState(): string {
        return JSON.stringify(this.state);
    }

    /**
     * Import state from a JSON string
     * @param jsonState JSON state string
     * @param persist Whether to persist after import
     */
    public importState(jsonState: string, persist: boolean = true): void {
        try {
            const importedState = JSON.parse(jsonState);
            this.setState(importedState, persist);
            this.eventSystem.emit('state-imported', this.state);
        } catch (error) {
            console.error('Failed to import game state:', error);
            this.eventSystem.emit('state-import-error', error);
        }
    }
}
