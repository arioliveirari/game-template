import { missionsType } from "../Assets/Modals/ModalTypes";
import RPG from "../rpg";

export class Cronometer {
    cronometers: CronometerObject[] = [];
    scene: RPG;
    constructor(scene:RPG) {
      this.scene = scene;
    }
    checkIfCronometerExists(mission:missionsType) {
      return this.cronometers.find(cronometer => cronometer.mission.id === mission.id);
    }

    removedFn(mission:missionsType) {
      this.cronometers = this.cronometers.filter(cronometer => cronometer.mission.id !== mission.id);
    }

    create(mission:missionsType, onCompleteFn:Function) {
      if(this.checkIfCronometerExists(mission)) return;
      const cronometer = new CronometerObject(this.scene, mission, onCompleteFn, this.removedFn.bind(this));
      this.cronometers.push(cronometer);
      return cronometer;
    }
    getByMissionId(id:number) {
      return this.cronometers.find(cronometer => cronometer.mission.id === id);
    }
}

export class CronometerObject {
  mission: missionsType;
  scene: RPG;
  onCompleteFn: Function;
  time: number;
  startedTime: number;
  graphics?: Phaser.GameObjects.Graphics;
  timer?: Phaser.Time.TimerEvent;
  removedFn: Function;
  constructor(scene:RPG, mission:missionsType, onCompleteFn:Function, removedFn:Function) {
    this.removedFn = removedFn;
    this.mission = mission;
    this.scene = scene;
    this.onCompleteFn = onCompleteFn;
    this.time = mission.cronometer || 0;
    this.startedTime = new Date().getTime();
    this.timer = this.scene.time.addEvent({
      delay: 100,
      callback: this.updateCronometer,
      callbackScope: this,
      loop: true
    });
  }

  updateCronometer() {
    const now = new Date().getTime();
    const timePassed = now - this.startedTime;
    const timeLeft = this.time - timePassed;
    if(timeLeft <= 0) {
      this.onCompleteFn(this.mission);
      this.removedFn(this.mission);
      // this.removeCronometer();
    } else {
      this.drawCronometer(timeLeft);
    }
  }

  drawCronometer(timeLeft:number) {
    if(!this.graphics) {
      this.graphics = this.scene.add.graphics();
    }
    this.graphics.clear();
    const { width, height } = this.scene.cameras.main;
    const x = width / 2;
    const y = height - 45;
    const radius = 30;
    const progress = timeLeft / this.time;
    this.graphics.lineStyle(4, 0xffd700);
    this.graphics.strokeCircle(x, y, radius);
    this.graphics.fillStyle(0x000000);
    this.graphics.fillCircle(x, y, radius);
    this.graphics.beginPath();
    this.graphics.fillStyle(0xffd700, 1);
    this.graphics.moveTo(x, y);
    this.graphics.arc(x, y, radius, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(270 + 360 * progress), false);
    this.graphics.lineTo(x, y);
    this.graphics.fillPath();
    this.graphics.closePath();


  }

  removeCronometer() {
    this.removedFn(this.mission);
    this.graphics?.destroy();
    this.graphics = undefined;
    this.timer?.remove();
    this.timer = undefined;
  }

}
