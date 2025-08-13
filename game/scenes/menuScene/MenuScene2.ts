import Phaser from "phaser";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";
import GenericButton from "@/game/assets/genericButton";

export default class MenuScene extends Phaser.Scene {

  eventCenter = EventsCenterManager.getInstance();
  debug?: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: "MenuScene2" });
  }

  preload() {
    this.load.image("player", "/assets/sprites/test/player.png");
    this.load.image("fondoA", "/assets/backgrounds/fondoA.png");
    this.load.image("fondoB", "/assets/backgrounds/fondoB.png");
  }

  create() {
    console.log('ENTRO ARIELITO')
    // const player = this.add.image(window.innerWidth / 2, window.innerHeight / 2, "player");
    this.add.rectangle(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth, window.innerHeight, 0xffffff, 0).setDepth(1);
    const vertices = [
      -1, 1,
      1, 1,
      -1, -1,
      1, -1
    ];

    const uvs = [
      0, 0,
      1, 0,
      0, 1,
      1, 1
    ];

    const indicies = [0, 2, 1, 2, 3, 1];

    const mesh = this.add.mesh(400, 300, 'player').setDepth(2);
    this.debug = this.add.graphics().setDepth(3);
    mesh.panZ(7);
    mesh.setDebug(this.debug);

    mesh.addVertices(vertices, uvs, indicies);

    const rotateRate = 1;
    const panRate = 1;
    const zoomRate = 4;

    this.input.keyboard?.on('keydown-D', () => {

      if (mesh.debugCallback)
      {
          mesh.setDebug();
      }
      else
      {
          mesh.setDebug(this.debug);
      }

  });

  console.log(mesh)

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      console.log('entro al pointer move')
      if (!pointer.isDown)
      {
          return;
      }

      if (!pointer.event.shiftKey)
      {
          mesh.modelRotation.y += pointer.velocity.x * (rotateRate / 800);
          mesh.modelRotation.x += pointer.velocity.y * (rotateRate / 600);
      }
      else
      {
          mesh.panX(pointer.velocity.x * (panRate / 800));
          mesh.panY(pointer.velocity.y * (panRate / 600));
      }

  });
  }

  update() {

  }
}
