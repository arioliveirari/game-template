import Phaser from 'phaser';

/**
 * EventSystem - A centralized event management system for game-wide events
 * 
 * This singleton class provides methods to emit and listen to events across different scenes
 * and components in the game. It uses Phaser's built-in event emitter.
 */
export class EventSystem {
    private static instance: EventSystem;
    private emitter: Phaser.Events.EventEmitter;
    private eventRegistry: Map<string, Array<{ callback: Function, context: any }>> = new Map();

    private constructor() {
        this.emitter = new Phaser.Events.EventEmitter();
    }

    /**
     * Get the singleton instance of the EventSystem
     */
    public static getInstance(): EventSystem {
        if (!EventSystem.instance) {
            EventSystem.instance = new EventSystem();
        }
        return EventSystem.instance;
    }

    /**
     * Register an event listener
     * @param eventName Name of the event to listen for
     * @param callback Function to call when the event is emitted
     * @param context Context to bind the callback to
     */
    public on(eventName: string, callback: Function, context?: any): void {
        this.emitter.on(eventName, callback, context);
        
        // Store in registry for cleanup
        if (!this.eventRegistry.has(eventName)) {
            this.eventRegistry.set(eventName, []);
        }
        
        this.eventRegistry.get(eventName)?.push({
            callback,
            context: context || this
        });
    }

    /**
     * Register a one-time event listener
     * @param eventName Name of the event to listen for
     * @param callback Function to call when the event is emitted
     * @param context Context to bind the callback to
     */
    public once(eventName: string, callback: Function, context?: any): void {
        this.emitter.once(eventName, callback, context);
    }

    /**
     * Remove an event listener
     * @param eventName Name of the event to remove listener from
     * @param callback Function to remove
     * @param context Context of the callback
     */
    public off(eventName: string, callback?: Function, context?: any): void {
        this.emitter.off(eventName, callback, context);
        
        // Remove from registry
        if (callback && this.eventRegistry.has(eventName)) {
            const listeners = this.eventRegistry.get(eventName);
            if (listeners) {
                const index = listeners.findIndex(listener => 
                    listener.callback === callback && 
                    (!context || listener.context === context)
                );
                
                if (index !== -1) {
                    listeners.splice(index, 1);
                }
                
                if (listeners.length === 0) {
                    this.eventRegistry.delete(eventName);
                }
            }
        } else if (!callback) {
            // Remove all listeners for this event
            this.eventRegistry.delete(eventName);
        }
    }

    /**
     * Emit an event
     * @param eventName Name of the event to emit
     * @param args Arguments to pass to the event listeners
     */
    public emit(eventName: string, ...args: any[]): void {
        this.emitter.emit(eventName, ...args);
    }

    /**
     * Remove all listeners for a specific context
     * @param context Context to remove listeners for
     */
    public removeAllListeners(context: any): void {
        this.eventRegistry.forEach((listeners, eventName) => {
            const contextListeners = listeners.filter(listener => listener.context === context);
            contextListeners.forEach(listener => {
                this.off(eventName, listener.callback, listener.context);
            });
        });
    }

    /**
     * Remove all event listeners
     */
    public removeAll(): void {
        this.emitter.removeAllListeners();
        this.eventRegistry.clear();
    }

    /**
     * Get the number of listeners for an event
     * @param eventName Name of the event
     * @returns Number of listeners
     */
    public listenerCount(eventName: string): number {
        return this.emitter.listenerCount(eventName);
    }

    /**
     * Check if an event has listeners
     * @param eventName Name of the event
     * @returns True if the event has listeners
     */
    public hasListeners(eventName: string): boolean {
        return this.listenerCount(eventName) > 0;
    }
}
