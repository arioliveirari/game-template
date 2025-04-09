// Module (CLASS): InversionModule
// it will recopile all the inversions active and indicates with events if any inversion has completed or changed state by period or day
import EventsCenterManager from "../services/EventsCenter";
import { InversionAndLoanType } from "./LoanModule";


export type InversionJsonState = {
    isActive: boolean;
    isPaused: boolean;
    inversions: {
        id: string;
        periodLeft: number;
        holdAmout: number;
        percent: number;
    }[];
    totalInvested: number;
    buisnessWinOfDay: number;
    buisnessMoney: number;
    gainLossLastPeriod: number;
}

class InversionModule {
    isActive: boolean = true;
    isPaused: boolean = false;
    inversions: InversionAndLoanType[] = [];
    totalInvested: number = 0;
    buisnessWinOfDay: number = 0;
    buisnessMoney: number = 200;
    eventCenter = EventsCenterManager.getInstance();
    gainLossLastPeriod: number = 0;
    possibleInversions: InversionAndLoanType[] = [
        {
            id: "inversion-1",
            name: "Chambix Stock",
            description: "Stock de la empresa Chambix",
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 2,
            cyclesCompleted: 0,
            periodLeft: 2,
            startAmount: 15,
            holdAmout: 0,
            state: "inactive",
            lastData: "up",
            percent: 8,
            inversionType: "stock"
        },
        {
            id: "inversion-2",
            name: "Plazo fijo 1",
            description: "Plazo fijo en el banco Chambix",
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 16,
            cyclesCompleted: 0,
            periodLeft: 2,
            startAmount: 45,
            holdAmout: 0,
            state: "inactive",
            percent: 8,
            inversionType: "fixed"
        },
        {
            id: "inversion-3",
            name: "Negocio Café",
            description: "El café del barrio",
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 2,
            cyclesCompleted: 0,
            periodLeft: 2,
            startAmount: 45,
            holdAmout: 0,
            lastData: "up",
            state: "active",
            percent: 8,
            inversionType: "stock"
        },
        {
            id: "inversion-4",
            name: "Inversion 4",
            description: "Inversion 4",
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 2,
            cyclesCompleted: 0,
            periodLeft: 2,
            lastData: "down",
            startAmount: 200,
            holdAmout: 0,
            state: "active",
            percent: 8,
            inversionType: "stock"
        },
        {
            id: "inversion-5",
            name: "Inversion 5",
            description: "Inversion 5",
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 2,
            cyclesCompleted: 0,
            periodLeft: 2,
            startAmount: 500,
            holdAmout: 0,
            lastData: "same",
            state: "inactive",
            percent: 8,
            inversionType: "stock"
        },
        {
            id: "inversion-6",
            name: "Inversion 6",
            description: "Inversion 6",
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 2,
            cyclesCompleted: 0,
            periodLeft: 2,
            startAmount: 1000,
            holdAmout: 0,
            lastData: "down",
            state: "disabled",
            percent: 8,
            inversionType: "stock"
        },
        {
            id: "inversion-7",
            name: "Inversion 7",
            description: "Inversion 7",
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 2,
            cyclesCompleted: 0,
            periodLeft: 2,
            startAmount: 2000,
            lastData: "up",
            holdAmout: 0,
            state: "disabled",
            percent: 8,
            inversionType: "stock"
        },
        {
            id: "inversion-8",
            name: "Inversion 8",
            description: "Inversion 8",
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 2,
            cyclesCompleted: 0,
            periodLeft: 2,
            startAmount: 5000,
            holdAmout: 0,
            lastData: "same",
            state: "disabled",
            percent: 8,
            inversionType: "stock"
        },
        {
            id: "inversion-9",
            name: "Plazo fijo 2",
            description: "Plazo fijo en el banco Chambix",
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 12,
            cyclesCompleted: 0,
            periodLeft: 2,
            startAmount: 45,
            holdAmout: 0,
            state: "inactive",
            percent: 12,
            inversionType: "fixed"
        },
        {
            id: "inversion-10",
            name: "Plazo fijo 3",
            description: "Plazo fijo en el banco Chambix",
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 20,
            cyclesCompleted: 0,
            periodLeft: 2,
            startAmount: 45,
            holdAmout: 0,
            state: "inactive",
            percent: 18,
            inversionType: "fixed"
        },
        {
            id: "inversion-11",
            name: "Plazo fijo 4",
            description: "Plazo fijo en el banco Chambix",
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 32,
            cyclesCompleted: 0,
            periodLeft: 2,
            startAmount: 45,
            holdAmout: 0,
            state: "inactive",
            percent: 25,
            inversionType: "fixed"
        },
        {
            id: "inversion-12",
            name: "Plazo fijo 5",
            description: "Plazo fijo en el banco Chambix",
            startDate: new Date(),
            endDate: new Date(),
            periodCycle: 42,
            cyclesCompleted: 0,
            periodLeft: 2,
            startAmount: 45,
            holdAmout: 0,
            state: "inactive",
            percent: 30,
            inversionType: "fixed"
        },
    ]

    constructor() {
        
    }

    updateGlobalDataManager(){
        // this.eventCenter.emit(this.eventCenter.possibleEvents.UPDATE_STATE);
    }

    sumInversions() {
        let oldTotal = this.totalInvested;
        let newTotal = 0;
        [...this.inversions].map(inversion => newTotal += inversion.holdAmout);
        this.gainLossLastPeriod = newTotal - oldTotal;
        this.totalInvested = newTotal;
        this.updateGlobalDataManager();
    }

    handleInversionInGlobalData(type: "add" | "remove", inversion: InversionAndLoanType) {
        this.sumInversions();
        this.eventCenter.emitEvent(this.eventCenter.possibleEvents.HANDLE_INVERSION, { type, inversion });
        this.updateGlobalDataManager();
        
    }

    addInversion(inversion: InversionAndLoanType) {
        this.inversions.push({...inversion, holdAmout: inversion.startAmount, state: "active"});
        this.gainLossLastPeriod = inversion.startAmount;
        this.handleInversionInGlobalData("add", inversion);
        this.updateGlobalDataManager();
        
    }

    removeInversion(id: string) {
        const inversion = this.inversions.find(inversion => inversion.id === id) 
        this.inversions = this.inversions.filter(inversion => inversion.id !== id);
        if (inversion) this.handleInversionInGlobalData("remove", inversion);
        this.updateGlobalDataManager();
        
    }

    updateInversion(id: string, _: Partial<InversionAndLoanType>) {
        this.inversions = this.inversions.map(inversion => {
            if (inversion.id === id) {
                return { ...inversion, ..._ };
            }
            return inversion;
        });
        this.sumInversions();
        this.updateGlobalDataManager();
        
    }

    getInversion(id: string) {
        return this.inversions.find(inversion => inversion.id === id);

    }

    getInversions() {
        return this.inversions;
    }

    getInversionsByState(state: InversionAndLoanType["state"]) {
        return this.inversions.filter(inversion => inversion.state === state);
    }

    getInversionsByDate(date: Date) {
        return this.inversions.filter(inversion => inversion.startDate <= date && inversion.endDate >= date);
    }

    getInversionsByDateRange(startDate: Date, endDate: Date) {
        return this.inversions.filter(inversion => inversion.startDate <= endDate && inversion.endDate >= startDate);
    }

    getOnlyRepeatedInversions(a: InversionAndLoanType[], b: InversionAndLoanType[]) {
        return a.filter(inversion => b.some(inversion2 => inversion.id === inversion2.id));
    }

    // TODO: REMOVE CADUCATED INVERSIONS, NEED TO ASK HOW IS GOING TO BE ENDED

    computeStockInversion(inversion: InversionAndLoanType) {
        let sign = Math.random() > 0.5 ? 1 : -1;
        inversion.periodLeft--;
        if (inversion.periodLeft <= 0) {
            inversion.cyclesCompleted++
            inversion.periodLeft = inversion.periodCycle
            inversion.holdAmout = Math.floor(inversion.holdAmout * (1 + (sign * inversion.percent / 100)));
            inversion.percent = Math.random() * 10;
        };
        this.updateInversion(inversion.id, inversion);
    }

    computeFixedInversion(inversion: InversionAndLoanType) {
        inversion.periodLeft--;
        if (inversion.periodLeft <= 0) {
            inversion.cyclesCompleted++
            inversion.periodLeft = inversion.periodCycle
            inversion.holdAmout = Math.floor(inversion.holdAmout * (1 + (inversion.percent / 100)));
        };
        this.updateInversion(inversion.id, inversion);
    }

    // computestockInversion(inversion: Inversion) {
    //     let sign = 1;
    //     inversion.periodLeft--;
    //     if (inversion.periodLeft <= 0) {
    //         inversion.periodLeft = inversion.periodCycle
    //         inversion.holdAmout = inversion.holdAmout * (1 + (sign * inversion.percent * Math.random() / 100));
    //         inversion.percent = Math.random() * 10;
    //     };
    //     this.updateInversion(inversion.id, inversion);
    // }

    computePeriods() { // case stock market
        if (this.buisnessMoney !== 0) {
            const sign = (Math.random()<0.5 ? 1 : -1)
            const changeBuisnessMoney = sign*Math.round(this.buisnessMoney*(Math.random()*5)/100)
            this.buisnessWinOfDay = changeBuisnessMoney;
            this.buisnessMoney += changeBuisnessMoney
            this.eventCenter.emitEvent(this.eventCenter.possibleEvents.UPDATE_BUSINESS, this.buisnessWinOfDay);
            this.updateGlobalDataManager();
        }
        this.inversions.map(inversion => {
            switch (inversion.inversionType) {
                case "stock":
                    this.computeStockInversion(inversion);
                    break;
                case "fixed":
            this.computeFixedInversion(inversion);
                    break;
                default: break;
            }
        });
    }

    dayChanged() {
        if (!this.isActive || this.isPaused) return
        this.computePeriods();
    }

    applyJsonState(state: InversionJsonState) {
        this.isActive = state.isActive;
        this.isPaused = state.isPaused;
        this.totalInvested = state.totalInvested;
        this.buisnessWinOfDay = state.buisnessWinOfDay;
        this.buisnessMoney = state.buisnessMoney;
        this.gainLossLastPeriod = state.gainLossLastPeriod;
        this.inversions = state.inversions.map(i => {
            const inversion = this.possibleInversions.find(_i => _i.id === i.id);
            if (!inversion) return null;
            return {
                ...inversion,
                holdAmout: i.holdAmout,
                periodLeft: i.periodLeft,
                percent: i.percent,
                state: i.periodLeft > 0 ? "active" : "completed"
            }
        }).filter(i => i !== null) as InversionAndLoanType[];
    }
    
    getJsonState() {
        const newInversionOptions = [...this.inversions].map(i => ({
            id: i.id,
            periodLeft: i.periodLeft,
            holdAmout: i.holdAmout,
            percent: i.percent,
        }))
        return {
            isActive: this.isActive,
            isPaused: this.isPaused,
            inversions: newInversionOptions,
            totalInvested: this.totalInvested,
            buisnessWinOfDay: this.buisnessWinOfDay,
            buisnessMoney: this.buisnessMoney,
            gainLossLastPeriod: this.gainLossLastPeriod
        } as InversionJsonState
    }

}

export default InversionModule;