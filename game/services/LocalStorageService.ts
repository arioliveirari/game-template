
import EventsCenterManager from ".././services/EventsCenter";
import { globalState } from "../GlobalDataManager";

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

        let availableKeys = ['soundModule','inversionModule','wizzardModule','businessModule','InventoryModule', 'loansModule', 'chatModule','missionModule'];

        Object.keys(actualState).filter((key) => !availableKeys.includes(key)).forEach((key, index) => {
            this.globalState = { ...this.globalState, [key]: actualState[key as keyof globalState] };
            
        }) 

        const fullState = {
            globalState: this.globalState,
            businessState: actualState.businessModule.getBState(),
            wizzardState: actualState.wizzardModule.getWState(),
            inversionState: globalState.inversionModule.getJsonState(),
            loansState: globalState.loansModule.getJsonState(),
            chatState: globalState.chatModule.getStateToLocalStorage(),
            missionsState: globalState.missionModule.getStateToLocalStorage(),
        };

        localStorage.setItem('globalStateChambix', JSON.stringify(fullState));

    }
    
    getStates() {
        let oldState = localStorage.getItem('globalStateChambix');
        if (oldState) {
            let parsedState = JSON.parse(oldState);
            this.globalState = parsedState.globalState;
            return this.globalState;
        }
        return false;
    }

    getWizardState() {
        let oldState = localStorage.getItem('globalStateChambix');
        if (oldState) {
            let parsedState = JSON.parse(oldState);
            return parsedState.wizzardState;
        }
        return false;
    }

    getBusinessState() {
        let oldState = localStorage.getItem('globalStateChambix');
        if (oldState) {
            let parsedState = JSON.parse(oldState);
            return parsedState.businessState;
        }
        return false;
    }

    getInversionState() {
        let oldState = localStorage.getItem('globalStateChambix');
        if (oldState) {
            let parsedState = JSON.parse(oldState);
            return parsedState.inversionState;
        }
        return false;
    }

    getLocalStorageStates() {
        let oldState = localStorage.getItem('globalStateChambix');
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