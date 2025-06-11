import Phaser from "phaser";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";
import GenericButton from "@/game/assets/genericButton";
import Player from "@/game/assets/Bodies/Player";

export type changeProperty = {
  type: "color" | "size";
  value: number;
};
export default class MainScene extends Phaser.Scene {

  eventCenter = EventsCenterManager.getInstance();
  player?: Player;

  constructor() {
    super({ key: "MainScene", active: true });
    // console.log(this.eventCenter.possibleEvents.CHANGE_PLAYER_PROPERTIES)
    // // eventos que escucha la escena
    // this.eventCenter.turnEventOn(
    //   "MainScene",
    //   this.eventCenter.possibleEvents.CHANGE_PLAYER_PROPERTIES,
    //   (data: changeProperty) => {
    //     switch (data.type) {
    //       case "color":
    //         this.player?.changeColor(data.value);
    //         break;
    //       case "size":
    //         this.player?.changeSize(data.value);
    //         break;
    //       default:
    //         break;
    //     }
    //   },
    //   this
    // );
  }



  create() {

    type velocity = number
    type obj = any & velocity

    const obj1: obj = {
      velocity: 2, // 3
      name: "obj1"
    }
    const obj2: obj = {
      velocity: 1, // 4
      name: "obj2"
    }
    const obj3: obj = {
      velocity: 3, // 3
      name: "obj3"
    }
    
    const createLinetimeForTurnOfObjects = (objects: obj[]) => {
      let timeline: (obj[] | null)[] = new Array(12).fill(null).map(() => []);
      
      objects.forEach(obj => {
        const period = this.getPeriodicyOfAttack(obj.velocity);
        
        if (!Array.isArray(timeline[0])) {
          timeline[0] = [];
        }
        (timeline[0] as obj[]).push(obj);
        
        for (let i = period; i < timeline.length; i += period) {
          if (i === 0) continue; 
          
          if (!Array.isArray(timeline[i])) {
            timeline[i] = [];
          }
          (timeline[i] as obj[]).push(obj);
        }
      });
      timeline = timeline.filter(slot => slot && slot.length)
      timeline = timeline.map(slot => {
        if (!slot || !slot.length) return null;
        const uniqueObjs = Array.from(new Map(slot.map(obj => [obj.name, obj])).values());
        return uniqueObjs.sort((a, b) => b.velocity - a.velocity);
      });
      timeline = timeline.flat()
      console.log("timeline", timeline)
      return timeline
    }
    createLinetimeForTurnOfObjects([obj1, obj2, obj3])
  }

  update() {
    // Update logic here
  }

  private getPeriodicyOfAttack(velocity: number) {
    switch (true) {
      case velocity === 1:
        return 4;
      case velocity >= 2 && velocity <= 4:
        return 3;
      case velocity >= 5 && velocity <= 7:
        return 2;
      case velocity >= 8 && velocity <= 10:
        return 1;
      default:
        return 4;
    }
  }
}
