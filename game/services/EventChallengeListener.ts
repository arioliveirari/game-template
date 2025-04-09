import { missionsType, modalType } from "../Assets/Modals/ModalTypes";
import { EventsCenterManagerType } from "./EventsCenter";
import { DreamType } from "./Dreams";

export enum ChallengeState { "pending", "completed", "inprogress" }
export enum ChallengeType { "mission", "time", "dream" }
export type MissionTrofyChallenge = {
    check: (ec: EventsCenterManagerType, mission: missionsType, trofy: PossibleTrofy) => { result: boolean, trofyUpdated: PossibleTrofy };
    id: number;
    name: string;
    description: string;
    reward: any;
    completed: boolean;
    type: ChallengeType;
    missionId?: number;
    state: ChallengeState;
    count?: number;
    trofyIcon: "copperTrofy" | "goldTrofy" | "silverTrofy",
    invisible?: boolean;
    unblock?: (e: EventsCenterManagerType) => void;
}

export type DreamTrofyChallenge = {
    check: (ec: EventsCenterManagerType, dream: DreamType, trofy: PossibleTrofy) => { result: boolean, trofyUpdated: PossibleTrofy };
    id: number;
    name: string;
    description: string;
    reward: any;
    completed: boolean;
    type: ChallengeType;
    missionId?: number;
    state: ChallengeState;
    count?: number;
    trofyIcon: "copperTrofy" | "goldTrofy" | "silverTrofy",
    invisible?: boolean;
    unblock?: (e: EventsCenterManagerType) => void;
}

export type PossibleTrofy = MissionTrofyChallenge | DreamTrofyChallenge

export type EventTriggerFnType = (eventName: string, data: any) => void;
export class EventsChallengeListener {
    trofies: PossibleTrofy[];
    eventTriggerFn: EventTriggerFnType;
    possibleEvents: { [key: string]: string };
    constructor(eventTriggerFn: EventTriggerFnType, possibleEvents: { [key: string]: string }) {
        this.eventTriggerFn = eventTriggerFn;
        this.possibleEvents = possibleEvents;

        this.trofies = [
            {
                check: (ec: EventsCenterManagerType, mission: missionsType, trofy: PossibleTrofy) => {
                    if (trofy && trofy.count == 1) {
                        return {
                            result: true,
                            trofyUpdated: { ...trofy, count: trofy.count - 1 } as PossibleTrofy
                        };
                    } else {
                        return {
                            result: false,
                            trofyUpdated: { ...trofy, count: (trofy.count || 1) - 1 } as PossibleTrofy
                        }
                    }
                },
                id: 2,
                name: "Hacer una misión",
                description: "Terminar una misión es un gran comienzo",
                reward: { money: 0, reputation: 10, happiness: 10 },
                completed: false,
                trofyIcon: "copperTrofy",
                type: ChallengeType.mission,
                // missionId: 1,
                state: ChallengeState.pending,
                count: 1,
                unblock: (ec: EventsCenterManagerType) => {
                    // ec.st
                    // send event to add chat mocked 2
                    ec.emitEvent(ec.possibleEvents.ADD_CHAT, { id: "mama" });
                }
            },
            {
                check: (ec: EventsCenterManagerType, mission: missionsType, trofy: PossibleTrofy) => {
                    if (trofy && trofy.count == 1) {
                        return {
                            result: true,
                            trofyUpdated: { ...trofy, count: trofy.count - 1 } as PossibleTrofy
                        };
                    } else {
                        return {
                            result: false,
                            trofyUpdated: { ...trofy, count: (trofy.count || 1) - 1 } as PossibleTrofy
                        }
                    }
                },
                id: 3,
                name: "Hacer 3 misiones",
                description: "Terminar 3 misiones",
                reward: { money: 0, reputation: 10, happiness: 10 },
                completed: false,
                trofyIcon: "silverTrofy",
                type: ChallengeType.mission,
                // missionId: 1,
                state: ChallengeState.pending,
                count: 3,
            },
            {
                check: (ec: EventsCenterManagerType, mission: missionsType, trofy: PossibleTrofy) => {
                    if (trofy && trofy.count == 1) {
                        return {
                            result: true,
                            trofyUpdated: { ...trofy, count: trofy.count - 1 } as PossibleTrofy
                        };
                    } else {
                        return {
                            result: false,
                            trofyUpdated: { ...trofy, count: (trofy.count || 1) - 1 } as PossibleTrofy
                        }
                    }
                },
                id: 4,
                name: "Hacer 5 misiones",
                description: "Terminar 5 mision",
                reward: { money: 0, reputation: 10, happiness: 10 },
                completed: false,
                trofyIcon: "goldTrofy",
                type: ChallengeType.mission,
                // missionId: 1,
                state: ChallengeState.pending,
                count: 5,
            },
            {
                check: (ec: EventsCenterManagerType, dream: DreamType, trofy: PossibleTrofy) => {
                    if (dream && dream.id == "w3") {
                        return {
                            result: true,
                            trofyUpdated: { ...trofy, } as PossibleTrofy
                        };
                    } else {
                        return {
                            result: false,
                            trofyUpdated: { ...trofy } as PossibleTrofy
                        }
                    }
                },
                id: 5,
                invisible: false,
                name: "Gran dormilón",
                description: "Gran dormilón",
                reward: { money: 0, reputation: 0, happiness: 0 },
                completed: false,
                trofyIcon: "copperTrofy",
                type: ChallengeType.dream,
                // missionId: 1,
                state: ChallengeState.pending,
                count: 1,
                unblock: (ec: EventsCenterManagerType) => {
                    ec.emitEvent(ec.possibleEvents.SELECT_WIZARD, {});
                    ec.emitEvent(ec.possibleEvents.ADD_CHAT, {id: "mama2"});
                }
            },
            {
                check: (ec: EventsCenterManagerType, mission: missionsType, trofy: PossibleTrofy) => {
                    if (trofy && trofy.count == 1 && mission.id == 32) {
                        return {
                            result: true,
                            trofyUpdated: { ...trofy, count: trofy.count - 1 } as PossibleTrofy
                        };
                    } else {
                        return {
                            result: false,
                            trofyUpdated: { ...trofy } as PossibleTrofy
                        }
                    }
                },
                id: 6,
                name: "Una playa a tu talla",
                description: "Desbloqueaste la playa!",
                reward: { money: 0, reputation: 20, happiness: 20 },
                completed: false,
                trofyIcon: "goldTrofy",
                type: ChallengeType.mission,
                state: ChallengeState.pending,
                count: 1,
                unblock: (ec: EventsCenterManagerType) => {
                    ec.emitEvent(ec.possibleEvents.UNBLOCK_MAP, "BEACH");
                }
            },
            {
                check: (ec: EventsCenterManagerType, mission: missionsType, trofy: PossibleTrofy) => {
                    if (trofy && trofy.count == 1 && mission.id == 12) {
                        return {
                            result: true,
                            trofyUpdated: { ...trofy, count: trofy.count - 1 } as PossibleTrofy
                        };
                    } else {
                        return {
                            result: false,
                            trofyUpdated: { ...trofy } as PossibleTrofy
                        }
                    }
                },
                id: 7,
                name: "De la piscina y a la oficina",
                description: "Podés trabajar en la oficina!",
                reward: { money: 30, reputation: 20, happiness: 15 },
                completed: false,
                trofyIcon: "goldTrofy",
                type: ChallengeType.mission,
                state: ChallengeState.pending,
                count: 1,
                unblock: (ec: EventsCenterManagerType) => {
                    ec.emitEvent(ec.possibleEvents.UNBLOCK_MAP, "OFFICE");
                }
            },
            {
                check: (ec: EventsCenterManagerType, dream: DreamType, trofy: PossibleTrofy) => {
                    if (dream && dream.id == "w2") {
                        return {
                            result: true,
                            trofyUpdated: { ...trofy, } as PossibleTrofy
                        };
                    } else {
                        return {
                            result: false,
                            trofyUpdated: { ...trofy } as PossibleTrofy
                        }
                    }
                },
                id: 8,
                invisible: true,
                name: "Gran dormilón",
                description: "Gran dormilón",
                reward: { money: 0, reputation: 0, happiness: 0 },
                completed: false,
                trofyIcon: "copperTrofy",
                type: ChallengeType.dream,
                // missionId: 1,
                state: ChallengeState.pending,
                count: 1,
                unblock: (ec: EventsCenterManagerType) => {
                    ec.emitEvent(ec.possibleEvents.ADD_CHAT, {id: "mama1"});
                }
            },
        ];
    }

    listener(eventName: string, data: any, ec: EventsCenterManagerType) {
        if (eventName === ec.possibleEvents.DREAM) {
            this.checkDreamsTrofies(ec, (data as DreamType));
        }
        if (eventName === ec.possibleEvents.FINISH_MODAL) {
            const { modalType, mission } = data as { modalType: modalType, mission: missionsType };
            this.checkMissionTrofies(ec, mission);
        }
        if (eventName === ec.possibleEvents.INPROGRESS_MISSION) {
            if (data.mission.id == 32) {
            this.checkMissionTrofies(ec, data.mission, 6);
            } 
        }
        if (eventName === ec.possibleEvents.SET_STATE) {
            const localStoreTrofies = data.globalState.trofies;
            const newTrofies = this.trofies.map(trofy => {
                const localTrofy = localStoreTrofies.find((t: PossibleTrofy) => t.id === trofy.id);
                if (localTrofy) {
                    trofy.completed = true;
                    trofy.state = ChallengeState.completed;
                }
                return trofy;
            });
            this.trofies = newTrofies;
        }
    }

    markTrofyCompleted(trofy: PossibleTrofy) {
        trofy.completed = true;
        trofy.state = ChallengeState.completed;

    }

    checkDreamsTrofies(ec: EventsCenterManagerType, dream: DreamType) {
        let delay = 1;
        
        this.trofies.filter(({ type, state }) => type == ChallengeType.dream && state != ChallengeState.completed).forEach((trofy) => {
            const { result, trofyUpdated } = (trofy as DreamTrofyChallenge).check(ec, dream, trofy);
            if (trofyUpdated) {
                const index = this.trofies.findIndex(t => t.id === trofy.id);
                this.trofies[index] = trofyUpdated;
            }
            if (result) {
                this.markTrofyCompleted(trofy);
                if (trofy.unblock) trofy.unblock(ec);
                if (!trofy.invisible) this.eventTriggerFn(this.possibleEvents.TROFY_COMPLETED, {trofy, delay});
                delay ++;
            }

        });
    }
    checkMissionTrofies(ec: EventsCenterManagerType, mission: missionsType, id?: number) {
        if (id) {
            const trofy = this.trofies.find(t => t.id === id);
            console.log("trofy", trofy);
            if (trofy) {
                const { result, trofyUpdated } = (trofy as MissionTrofyChallenge).check(ec, mission, trofy);
                if (trofyUpdated) {
                    const index = this.trofies.findIndex(t => t.id === trofy.id);
                    this.trofies[index] = trofyUpdated;
                }
                if (result) {
                    this.markTrofyCompleted(trofy);
                    if (trofy.unblock) trofy.unblock(ec);
                    if (!trofy.invisible) this.eventTriggerFn(this.possibleEvents.TROFY_COMPLETED, {trofy, delay: 1});
                }
            }
            return;
        }
        let delay = 1;
        this.trofies.filter(({ type, state }) => type == ChallengeType.mission && state != ChallengeState.completed).forEach(trofy => {
            const { result, trofyUpdated } = (trofy as MissionTrofyChallenge).check(ec, mission, trofy)
            if (trofyUpdated) {
                const index = this.trofies.findIndex(t => t.id === trofy.id);
                this.trofies[index] = trofyUpdated;
            }

            if (result) {
                this.markTrofyCompleted(trofy);
                if (trofy.unblock) trofy.unblock(ec);

                if (!trofy.invisible) this.eventTriggerFn(this.possibleEvents.TROFY_COMPLETED, {trofy, delay});
                delay ++;
            }
            // fire event ?
        });
    }

}