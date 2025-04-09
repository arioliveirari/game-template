import { missionsType } from "../Assets/Modals/ModalTypes";
import ObserverPatronModule from "./ObserverPatronModule";

export type MissionModuleState = {
  allMissions: missionsType[];
  filteredMissions: missionsType[];
  availableMissions: missionsType[];
  doneMissions: missionsType[];
  inProgressMissions: missionsType[];
};

class MissionModule extends ObserverPatronModule<Partial<MissionModuleState>> {
  constructor() {
    super({});
  }

  getAllMissions() {
    return this.state;
  }

  public setMissions(missions: MissionModuleState) {
    this.changeState({ ...missions });
  }

  public getMissionById(id: number) {
    return this.getState().allMissions?.find((mission) => mission.id === id);
  }

  public cleanFilterMissions() {
    this.changeState({
      ...this.getState(),
      filteredMissions: [],
    });
  }

  public failMissionInProgress(id: number) {
    // remove mission in progress
    const { inProgressMissions } = this.getState() as MissionModuleState;
    this.changeState({
      ...this.getState(),
      inProgressMissions: inProgressMissions.filter(
        (mission) => mission.id !== id
      ),
    });

    // update mission to make it available again and set Draw on false
    this.changeMissionToAvailable(id);

  }

  public removeDuplicates(
    value: missionsType,
    index: number,
    self: missionsType[]
  ) {
    return self.indexOf(value) === index;
  }

  public handleMissionDone(id: number) {
    const { inProgressMissions, doneMissions } =
      this.getState() as MissionModuleState;
    const mission = inProgressMissions.find((mission) => mission.id === id);
    if (mission) {
      mission.available = false;
      mission.inProgress = false;
      mission.draw = false;
      mission.done = true;
      this.changeState({
        ...this.getState(),
        doneMissions: [...doneMissions, mission],
        inProgressMissions: [...inProgressMissions].filter(
          (mission) => mission.id !== id
        ),
      });
    }
  }

  public markInprogressMissionDrawFalse() {
    const { inProgressMissions } = this.getState() as MissionModuleState;
    this.changeState({
      ...this.getState(),
      inProgressMissions: inProgressMissions.map((mission) => {
        mission.draw = false;
        return mission;
      }),
    });
  }

  public changeMissionToAvailable(id: number) {
    const { allMissions, availableMissions } =
      this.getState() as MissionModuleState;
    const mission = allMissions.find((mission) => mission.id === id);
    if (mission) {
      mission.available = true;
      mission.draw = false;
      mission.startedTime = undefined
      this.changeState({
        ...this.getState(),
        availableMissions: this.mergeMissions([...availableMissions],[mission],false),
      });
    }
  }

  public drawMinigameFromMission(id: number) {
    const { inProgressMissions } = this.getState() as MissionModuleState;
    const mission = inProgressMissions.find((mission) => mission.id === id);
    if (mission) {
      mission.draw = true;
      this.changeState({
        ...this.getState(),
        inProgressMissions: inProgressMissions.map((m) =>
          m.id === id ? { ...m, draw: true } : m
        ),
      });
    }
  }

  public getStateToLocalStorage() {
    return this.getState();
  }

  public getAllFilteredMissions(
    mapType: string,
    excludeInProgress: boolean = true,
    excludeIfWasDone: boolean = true
  ) {
    // get all missions inside available mission with the same city and add to a new array
    const { availableMissions, inProgressMissions, doneMissions } =
      this.getState() as MissionModuleState;

    const filterMissionsFromMapType = availableMissions.filter((mission) =>
      mission.group.includes(mapType)
    );

    const checkIfMissionExistOnList = (missionId: number, list: missionsType[]) => {
      return list.some((mission) => mission.id === missionId);
    }

    let result;
    if (excludeInProgress) {
      result = filterMissionsFromMapType.filter(
        (mission) => !checkIfMissionExistOnList(mission.id, inProgressMissions)
      );
    } else {
      result = filterMissionsFromMapType;
    }

    if (excludeIfWasDone) {
      result = result.filter((mission) => !checkIfMissionExistOnList(mission.id, doneMissions));
    } else {
      result = result;
    }

    return result;
  }

  public mergeMissions(
    a: missionsType[],
    b: missionsType[],
    leftOrRight: true | false
  ) {
    let newArr = []
    if (leftOrRight) {
      newArr = a.concat(b).filter(this.removeDuplicates);
    } else {
      newArr = b.concat(a).filter(this.removeDuplicates);
    }
    return newArr;
  }

  public inProgressMission(id: number, map: string) {
    const { inProgressMissions, availableMissions } =
      this.getState() as MissionModuleState;
    const mission = availableMissions.find((mission) => mission.id === id);
    if (mission) {
      mission.available = false;
      this.changeState({
        ...this.getState(),
        inProgressMissions: [...inProgressMissions, mission],
      });
      this.moveInprogressFollowUpMissionsToAvailable();
    }

    return mission;
  }

  public checkIfMissionRepeatInArray(
    mission: missionsType,
    array: missionsType[]
  ) {
    return array.some((m) => m.id === mission.id);
  }
  // checkMissionInprogress, and check followUpMission array to append those into availableMissions
  public moveInprogressFollowUpMissionsToAvailable() {
    const { inProgressMissions, allMissions } =
      this.getState() as MissionModuleState;

    for (let i = 0; i < inProgressMissions.length; i++) {
      for (let j = 0; j < inProgressMissions[i].followUpMission.length; j++) {
        const mission = allMissions.find(
          (m) => m.id === inProgressMissions[i].followUpMission[j]
        );
        if (
          mission &&
          !this.checkIfMissionRepeatInArray(mission, inProgressMissions)
        ) {
          mission.available = true;
          mission.isFollowUp = true;
          this.changeState({
            ...this.getState(),
            availableMissions: [
              ...(this.getState().availableMissions as any),
              mission,
            ],
          });
        }
      }
    }

    this.notify(this.getState());
  }
}

export default MissionModule;
