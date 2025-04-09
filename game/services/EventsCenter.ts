import Phaser from "phaser";
import { EventsChallengeListener } from "./EventChallengeListener";

//const EventsCenter = new Phaser.Events.EventEmitter();

export type activeEvents = {
    [key: string]: [string, Function][]
};


export interface globalType {
    eventsCenterInstance?: EventsCenterManager,
  }

export type EventsCenterManagerType = EventsCenterManager;
class EventsCenterManager extends Phaser.Events.EventEmitter {
    activeEvents: activeEvents;
    eventsChallengeListener: EventsChallengeListener
    possibleEvents:{ [key: string]: string};
    constructor() {
        if ((global as globalType).eventsCenterInstance) {
            throw new Error('New instance cannot be created!!')
        } else {
            super();   
            this.activeEvents = {};

            this.possibleEvents = {
                
                TEST: "test", // WHEN THE GAME IS READY AND USER DATA HAS BEEN LOADED
                // ejemplos de eventos
                MUSIC_VOLUME_CHANGE: "musicVolumeChange",
                SOUND_VOLUME_CHANGE: "soundVolumeChange",
                BRIGHTNESS_CHANGE: "brightnessChange",
                
                CHANGE_SCENE: "changeScene",
                CHANGE_BACKGROUND_SCENE: "changeBackgroundScene",
                CHANGE_FRONTGROUND_SCENE: "changeForegroundScene",

            }

            this.eventsChallengeListener = new EventsChallengeListener(this.emitEvent.bind(this), this.possibleEvents);

        }
        (global as globalType).eventsCenterInstance = this
    }
    
    getInstance(): this {
        return this
    }

    turnEventOn (sceneKey:string, event: string, callback: Function, context: any) {
        this.activeEvents[sceneKey as keyof activeEvents] = this.activeEvents[sceneKey as keyof activeEvents] || []
        this.activeEvents[sceneKey as keyof activeEvents].push([event, callback])
        this.on(event, callback, context);
    }

    turnEventOff (sceneKey:string, event: string, context: any) {
        this.activeEvents[sceneKey as keyof activeEvents] = this.activeEvents[sceneKey as keyof activeEvents] || []
        this.activeEvents[sceneKey as keyof activeEvents] = this.activeEvents[sceneKey as keyof activeEvents].filter(([e, cb]) => {
            if (e === event) {
                this.off(e, cb, context);
                return false
            }
            return true
        })
    }

    emitEvent (event: string, data: any) {
        if(window && window.dataLayer){
            window.dataLayer.push({
                event: event,
                data: data
            });
        }
        this.eventsChallengeListener.listener(event, data, this);
        this.emit(event, data);
    }

    emitWithResponse(event: string, data: any): any {
        const listeners = this.listeners(event);
        if (listeners.length === 0) return undefined;
        if (listeners.length > 1) {
            console.warn(`Event "${event}" has multiple listeners; only the first response will be used.`);
        }
    
        return listeners[0](data);
    }

    turnOffAllEventsByScene (sceneKey: string)  {
        this.activeEvents[sceneKey as keyof activeEvents] = this.activeEvents[sceneKey as keyof activeEvents] || []
        this.activeEvents[sceneKey as keyof activeEvents].forEach(([event, callback]) => {
            this.off(event, callback);
        })
    }
}

let EventsCenterSingleton;
if (!(global as globalType).eventsCenterInstance) EventsCenterSingleton = new EventsCenterManager()
else EventsCenterSingleton = (global as globalType).eventsCenterInstance
export default EventsCenterSingleton as EventsCenterManager

//export default EventsCenter;