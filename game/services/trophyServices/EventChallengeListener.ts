import { EventsCenterManagerType } from "../eventsServices/EventsCenterService";

export enum ChallengeStates { "pending", "completed", "inprogress" }

export enum ChallengeTypes { "generic" }

export type ChallengeObjectType = any

export type GenericTrophy = {
    check: (ec: EventsCenterManagerType, challengeObject: ChallengeObjectType, trophy: PossibleTrophy) => { result: boolean, trophyUpdated: PossibleTrophy };
    id: number;
    name: string;
    description: string;
    reward: any;
    completed: boolean;
    type: ChallengeTypes;
    state: ChallengeStates;
    trophyIcon: string,
    count?: number;
    invisible?: boolean;
    unblock?: (e: EventsCenterManagerType) => void;
}


export type PossibleTrophy = GenericTrophy

export type EventTriggerFnType = (eventName: string, data: any) => void;
export class EventsChallengeListener {
    trofies: PossibleTrophy[];
    eventTriggerFn: EventTriggerFnType;
    possibleEvents: { [key: string]: string };
    constructor(eventTriggerFn: EventTriggerFnType, possibleEvents: { [key: string]: string }) {
        this.eventTriggerFn = eventTriggerFn;
        this.possibleEvents = possibleEvents;

        this.trofies = [
            // {
            //     check: (ec: EventsCenterManagerType, challengeObject: ChallengeObjectType, trophy: PossibleTrophy) => {
            //         if (trophy && trophy.count == 1) {
            //             return {
            //                 result: true,
            //                 trophyUpdated: { ...trophy, count: trophy.count - 1 } as PossibleTrophy
            //             };
            //         } else {
            //             return {
            //                 result: false,
            //                 trophyUpdated: { ...trophy, count: (trophy.count || 1) - 1 } as PossibleTrophy
            //             }
            //         }
            //     },
            //     id: 1,
            //     name: "Trofeo de prueba",
            //     description: "Este es un trofeo de prueba",
            //     reward: { money: 10 },
            //     completed: false,
            //     trophyIcon: "copperTrophy",
            //     type: ChallengeTypes.generic,
            //     state: ChallengeStates.pending,
            //     count: 1,
            //     unblock: (ec: EventsCenterManagerType) => {
                    
            //     }
            // },
        ];
    }

    listener(eventName: string, data: any, ec: EventsCenterManagerType) {
        if (eventName === ec.possibleEvents.GENERIC_TROPHY) {
            this.checkGenericTrophyCompletion(ec, (data as ChallengeObjectType));
        }
    }

    markTrophyCompleted(trophy: PossibleTrophy) {
        trophy.completed = true;
        trophy.state = ChallengeStates.completed;
    }

    markTrophyInProgress(trophy: PossibleTrophy) {
        trophy.state = ChallengeStates.inprogress;
    }

    checkGenericTrophyCompletion(ec: EventsCenterManagerType, challengeObject: ChallengeObjectType) {
        let delay = 1;
        this.trofies.filter(({ type, state }) => type == ChallengeTypes.generic && state != ChallengeStates.completed).forEach((trophy) => {
            const { result, trophyUpdated } = (trophy as GenericTrophy).check(ec, challengeObject, trophy);
            if (trophyUpdated) {
                this.markTrophyInProgress(trophyUpdated);
                const index = this.trofies.findIndex(t => t.id === trophy.id);
                this.trofies[index] = trophyUpdated;
            }
            if (result) {
                this.markTrophyCompleted(trophy);
                if (trophy.unblock) trophy.unblock(ec);
                if (!trophy.invisible) this.eventTriggerFn(this.possibleEvents.Trophy_COMPLETED, { trophy, delay });
                delay++;
            }

        });
    }
}