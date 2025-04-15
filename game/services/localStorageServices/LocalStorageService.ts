
import { globalState } from "@/game/scenes/globalData/GlobalDataManager";
import EventsCenterManager from "../eventsServices/EventsCenterService";

export interface DataPersistType {
    localStorageInstance?: LocalStorageService,
}

class LocalStorageService {
    globalState: Partial<globalState>;
    eventCenter = EventsCenterManager.getInstance();
    constructor() {
        this.globalState = {};
        if ((global as DataPersistType).localStorageInstance) {
            throw new Error('New instance cannot be created!!')
        };

        (global as DataPersistType).localStorageInstance = this
    }

    getInstance(): this {
        return this
    }

    setStates(globalState: globalState){

        let actualState = {...globalState};

        let availableKeys = ['missionModule'];

        Object.keys(actualState).filter((key) => !availableKeys.includes(key)).forEach((key, index) => {
            this.globalState = { ...this.globalState, [key]: actualState[key as keyof globalState] };
            
        }) 

        const fullState = {
            globalState: this.globalState,
        };

        localStorage.setItem('gameInfo', JSON.stringify(fullState));

    }
    
    getStates() {
        let oldState = localStorage.getItem('gameInfo');
        if (oldState) {
            let parsedState = JSON.parse(oldState);
            this.globalState = parsedState.globalState;
            return this.globalState;
        }
        return false;
    }


    getLocalStorageStates() {
        let oldState = localStorage.getItem('gameInfo');
        if (oldState) {
            let parsedState = JSON.parse(oldState);
            return parsedState;
        }
        return false;
    }

    getGlobalState() {
        return this.globalState;
    }
}

let LocalStorageServiceSingleton
if (!(global as DataPersistType).localStorageInstance) LocalStorageServiceSingleton = new LocalStorageService()
else LocalStorageServiceSingleton = (global as DataPersistType).localStorageInstance
export default LocalStorageServiceSingleton as LocalStorageService