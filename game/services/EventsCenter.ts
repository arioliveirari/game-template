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
                READY: "ready", // WHEN THE GAME IS READY AND USER DATA HAS BEEN LOADED
                CHANGE_SCENE: "changeScene", // WHEN THE GAME IS READY AND USER DATA HAS BEEN LOADED

                INFO_UPDATE: "infoUpdate", // EVERY TIME THE INFO IS UPDATED IN GLOBAL DATA MANAGER
                UPDATE: "update",
                UPDATE_STATE: "updateState",
                UPDATE_ANY_MONEY: "updateAnyMoney",

                LEAVE_ROOM: "leaveRoom",
                LEAVE_CITY: "leaveCity",

                OPEN_MODAL_FORM: "openModalForm", // OPEN MODAL FORM
                CLOSE_MODAL_FORM: "closeModalForm", // CLOSE MODAL FORM

                OPEN_MISSION_BOX: "openMissionBox", // OPEN MISSION BOX
                CLOSE_MISSION_BOX: "closeMissionBox", // CLOSE MISSSION BOX
                SET_SELECTED_NEWS: "changeSelectedNews", // CHANGE SELECTED NEWS
            
                PLAY_SOUND: "playSound", // PLAY SOUND
                PLAY_MUSIC: "playMusic", // PLAY SOUND

                CHANGE_DATE: "changeDate", // PASS OF TIME
                TIME_CHANGE: "timeChange",
                SLEEP: "sleep", // SLEEP
                TRY_SLEEP: "trySleep", // TRY SLEEP 

                OPEN_MODAL: "openModal", // OPEN MODAL
                CLOSE_MODAL: "closeModal", // CLOSE MODAL

                OPEN_TABLET_MENU: "openTabletMenu", // OPEN TABLET MENU
                CLOSE_TABLET_MENU: "closeTabletMenu", // CLOSE TABLET MENU

                UPDATE_COFFE_COUNTER: "updateCoffeCounter", // UPDATE COFFE COUNTER
                GET_COFFE_COUNTER: "getCoffeCounter", // GET COFFE COUNTER
                COFFEE_NOT_TIME: "coffeeNotTime", // COFFEE NOT TIME

                UNBLOCK_MAP: "unblockMap", // UNBLOCK MAP

                GET_NEWS: "getNews", // GET NEWS
                RESTART_NEWS: "getNews", // GET NEWS
                READ_NEWSPAPER: "readNewspaper", // READ NEWSPAPER AND CHANGE AVAILABLE MISSIONS IN CITY
                MISSIONS_UPDATE: "missionsUpdate", // COMPLETES A MISSION = REWARD + TIME PASS
                HIDE_SHOW_PINS: "hideShowPins", // HIDE OR SHOW PINS IN MAP
                
                CLEAN_FILTER_MISSIONS: "cleanFilterMissions", // CLEAN FILTER MISSIONS
                FILTER_MISSIONS: "filterMissions", // FILTER MISSIONS
                FINISH_MISSION: "finishMission", // MAKE A MISSION
                FINISH_MODAL: "finishModal", // FINISH MODAL
                INPROGRESS_MISSION: "inprogressMission", // INPROGRESS A MISSION
                START_MINIGAME: "startMinigame", // INPROGRESS A MISSION
                DRAW_MINIGAME: "drawMinigame", // INPROGRESS A MISSION
                ADD_MISSION: "addMission", // ADD A MISSION
                GET_QUESTIONS: "getQuestions", // GET QUESTIONS FOR A MINIGAME
                RELATED_MISSION: "relatedMission", // RELATED MISSIONS
                CHECK_MISSION_REQUIREMENTS: "checkMissionRequirements", // CHECK MISSION REQUIREMENTS TO MAKE IT
                REDRAW_MINIGAME: "redrawMinigame", // REDRAW MINIGAME

                TOGGLE_SOUND: "toggleSound",
                TOGGLE_MUSIC: "toggleMusic",
                TOGGLE_BTN_SOUND: "toggleBtnSound",
                TOGGLE_BTN_MUSIC: "toggleBtnMusic",
                FINAL_TILE_TOGGLE: "finalTileToggle",

                BUY_ITEM: "buyItem",
                BUY_ITEMS: "buyItems",
                SELL_ITEMS: "sellItems",
                GET_INVENTARY: "getInventary",
                GET_OBJECTINVENTARY: "getObjectInventary",

                BUY_EXPANSION: "buyExpansion",
                REPAIR_MACHINE: "repairMachine",
                BUY_WORLD_EXPANSION: "buyWorldExpansion",
                UPDATE_BUSINESS_FUEL: "updateBusinessFuel",
                UPDATE_ITEM_LIFE: "updateItemLife",

                GET_STATE: "getState",
                SET_STATE: "setState",
                CHANGE_MONEY: "changeMoney",
                HANDLE_INVERSION: "handleInversion",
                UPDATE_BUSINESS: "updateBusiness",
                HANDLE_LOAN: "handleLoan",
                PAY_LOAN: "payLoan",
                PAY_TRAVEL_TICKET: "payTravelTicket",

                ACTIVATE_INVERSION_MODULE: "activateInversionModule",
                TROFY_COMPLETED: "trofyCompleted",
                TROFIES_UPDATE: "trofiesUpdate",
                CHAT_OPEN: "chatOpen",

                OPEN_MINIGAME: "openMinigame",
                CLOSE_MINIGAME: "closeMinigame",
                ADD_CHAT: "addChat",

                RESTART_GLOBAL_STATE: "restartGlobalState",

                REPAIRMENT: "repairment",

                TOOLTIPS_UPDATE: "tooltipsUpdate",
                LAST_TOOLTIP: "lastTooltip",

                DREAM:"Dream",
                SELECT_WIZARD: "selectWizard",
                CHANGE_GENERIC: "changeGeneric",
                UPDATE_LOCAL: "updateLocal",
                FAIL_MISSION: "failMission",

                ADD_RECORD: "addRecord",
                ADD_MISSION_RECORD: "addMissionRecord",


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