import Phaser from "phaser";
import map from "./maps";
import { ControlsObj } from "./types/ControlsObjType";
import GraphicsBlock from "./objects/GraphicsBlock";
import { BlackBrickControlsObj } from "./types/BlackBrickControlsObjType";
import BlackBrickGraphicsBlock from "./objects/BlackBrickGraphicsBlock";
import { GameConfigType } from "./types/GameConfigType";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";

// TODO: WHY ONLY ONE COLOR?

export default class ConnectorScene extends Phaser.Scene {

  draggingBlock: GraphicsBlock | null = null;
  matrix: GraphicsBlock[][] = [];
  brickMatrix: BlackBrickGraphicsBlock[][] = [];
  eventCenter = EventsCenterManager.getInstance();
  map: number[][] = [];
  size: number = 0;
  groupLifesTemporal: Phaser.GameObjects.Group | null = null;
  constructor() {
    super({ key: "ConnectorScene", active: false });
  }

  create() {
    this.addEventsListeners()
    // bring scene to top
    this.scene.bringToTop("ConnectorScene");

    const gameConfig: GameConfigType = {
      map: map,
      withRandomRotation: true,
      size: 80,
      withBricks: true,
      withZoom: true,
    }

    this.applyGameConfig(gameConfig);

    // TODO MOVER A UI SCENE -->
    const globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, undefined);
    this.groupLifesTemporal = this.add.group();
    for (let i = 0; i < globalState.lifes; i++) {
      const lifeIcon = this.add.rectangle(0, 0, 40, 40, 0xff0000);
      this.add.existing(lifeIcon);
      this.groupLifesTemporal.add(lifeIcon);
    }
    Phaser.Actions.PlaceOnLine(
      this.groupLifesTemporal.getChildren(),
      new Phaser.Geom.Line(
        -50, 150, -50, 250
      ),
      'ease')
    this.add.text(-50, 50, "Score: " + (globalState.score || 0), {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#000000',
    }).setOrigin(1, 0);
    // TODO MOVER A UI SCENE <--
  }

  applyGameConfig(config: GameConfigType) {
    this.map = config.map;
    this.size = config.size;

    if (config.withRandomRotation) {
      const random = Math.floor(Math.random() * 4);
      this.map = this.rotateMatrix90Degrees(this.map, random);
    }

    const n = this.map.length;
    this.matrix = this.createMatrixMap(n, this.size)
    this.centerCameraOnMatrix(this.matrix, this.size, config.withZoom);

    if (config.withBricks) {
      this.addBrickLogicToMatrix(this.map, this.size);
    }

  }

  rotateMatrix90Degrees(matrix: number[][], times: number) {
    const n = matrix.length;
    for (let i = 0; i < times; i++) {
      const newMatrix = [];
      for (let j = 0; j < n; j++) {
        const newRow = [];
        for (let k = n - 1; k >= 0; k--) {
          newRow.push(matrix[k][j]);
        }
        newMatrix.push(newRow);
      }
      matrix = newMatrix;
    }
    return matrix;
  }

  createMatrixMap(n: number, size: number) {
    const matrix = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) {

        const g = new GraphicsBlock(this, j, i, size, this.controls, this.getConfigByNumer(this.getPositionOfMap(j, i)));
        g.draw();
        this.add.existing(g.graphics);

        row.push(g);
        // draw borders

      }
      matrix.push(row);
    }
    return matrix;

  }

  centerCameraOnMatrix(matrix: GraphicsBlock[][], size: number, withZoom = true) {
    const n = matrix.length;

    const totalMatrixWidth = n * size;
    const totalMatrixHeight = n * size;

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const x = (width - totalMatrixWidth) / 2;
    const y = (height - totalMatrixHeight) / 2;

    // this.cameras.main.setPosition(x, y);

    // Zoom to fit the screen but keep the center
    const zoomX = width / totalMatrixWidth;
    const zoomY = height / totalMatrixHeight;

    if (withZoom || zoomX < 1 || zoomY < 1) {
      this.cameras.main.setZoom(Math.min(zoomX, zoomY));
    }

    this.cameras.main.setScroll(
      x * -1,
      y * -1
    )

    this.cameras.main.setBackgroundColor(0xffffff);

  }

  addBrickLogicToMatrix(matrix: number[][], size: number) {
    // add a black tile over each tile on matrix.
    // the tile need to desappear when player clicks on it
    // BlackBrickGraphicsBlock

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        const g = new BlackBrickGraphicsBlock(this, j, i, size, this.blackBrickControls);
        g.draw();
        this.add.existing(g.graphics);
        console.log("BLACK BRICK", g);
        if (!this.brickMatrix[i]) this.brickMatrix[i] = [];
        this.brickMatrix[i][j] = g;
      }
    }
  }

  getPositionOfMap(x: number, y: number) {
    return this.map[y][x];
  }

  getConfigByNumer(n: number) {
    switch (n) {
      case 0:
        return { type: "empty", color: 0xfdfdfd, alpha: 1 };
      case 1:
        return { type: "red", color: 0xff0000, alpha: 1 };
      case 2:
        return { type: "green", color: 0x00ff00, alpha: 1 };
      case 3:
        return { type: "blue", color: 0x0000ff, alpha: 1 };
      case 9:
        return { type: "bomb", color: 0x600909, alpha: 1, exclude: true };
      case 8:
        return { type: "lantern", color: 0xd0de26, alpha: 1, exclude: true };
      default:
        return { type: "empty", color: 0xfdfdfd, alpha: 1, exclude: true };
    }

  }


  cleanConnectionFromBlock(obj: GraphicsBlock) {
    // check the obj and clean all connected blocks with same type
    const type = obj.config.type;
    const color = obj.config.color;
    const matrix = this.matrix.map((row) => row.map((block) => block.config.type === type && block.canBeCleared ? 1 : 0));
    const visited = new Set();
    const queue = [];
    queue.push([obj.x, obj.y]);
    visited.add(`${obj.x},${obj.y}`);
    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      const neighbors = this.getNeighbors(x, y, matrix);
      for (let i = 0; i < neighbors.length; i++) {
        const [nx, ny] = neighbors[i];
        if (!visited.has(`${nx},${ny}`)) {
          visited.add(`${nx},${ny}`);
          queue.push([nx, ny]);
          // clean the block
          const newConfig = { ...this.getConfigByNumer(-1), ...{ exclude: false } }
          this.matrix[ny][nx].changeConfig(newConfig);
        }
      }
    }
  }

  blackBrickControls: BlackBrickControlsObj = {
    onClick: (x: number, y: number, obj: BlackBrickGraphicsBlock) => {
      obj.graphics.destroy();
    },
    onHover: (x: number, y: number, obj: BlackBrickGraphicsBlock) => {
      obj.onHover(x, y, obj)
    },
    onHoverOut: (x: number, y: number, obj: BlackBrickGraphicsBlock) => {
      obj.onHoverOut(x, y, obj)
    }
  }

  controls: ControlsObj = {
    onClick: (x: number, y: number, obj: GraphicsBlock) => {
      const globalState = EventsCenterManager.emitWithResponse(EventsCenterManager.possibleEvents.GET_STATE, undefined)
      console.log("ARIEL ON CLICK", globalState);
      if (!obj.canBeCleared) {
        this.cleanConnectionFromBlock(obj);
        this.draggingBlock = obj;
      }
    },
    onHover: (x: number, y: number, obj: GraphicsBlock) => {
      // tint
      obj.onHover()
    },
    onHoverOut: (x: number, y: number, obj: GraphicsBlock) => {
      // remove tint
      obj.onHoverOut()
    },
    onStopClick: (x: number, y: number, obj: GraphicsBlock) => {
      console.log("STOP CLICKED", x, y, obj);

      if (obj.config.type == "lantern") {
        console.log("LANTERN CLICKED", x, y, obj);
        const matrixColor = this.matrix.map((row) => row.map((block) => 1));
        const n = this.getNearByBlocks(obj.x, obj.y, matrixColor)

        console.log("NEIGHBORS", n, matrixColor);
        for (let i = 0; i < n.length; i++) {
          if (!this.brickMatrix[n[i][1]]) continue;
          const blockObj = this.brickMatrix[n[i][1]][n[i][0]];
          console.log("BLOCK OBJ", blockObj);
          //Remove black Mask on this position
          blockObj.graphics.destroy();
        }
        return
      }
      if (!this.checkIfLose(obj)) {
        this.draggingBlock = null;
        this.checkIfWin();
      }
    },
    onMove: (x: number, y: number, obj: GraphicsBlock) => {
      if (this.draggingBlock) {
        this.dragBlock(obj.x, obj.y, obj);
      }
    }
  }

  checkIfConnected(matrix: number[][]) {
    const visited = new Set();
    const queue = [];
    let startX = -1;
    let startY = -1;

    // find the first block
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          startX = j;
          startY = i;
          break;
        }
      }
      if (startX !== -1) break;
    }

    if (startX === -1) return false;

    queue.push([startX, startY]);
    visited.add(`${startX},${startY}`);

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      const neighbors = this.getNeighbors(x, y, matrix);
      for (let i = 0; i < neighbors.length; i++) {
        const [nx, ny] = neighbors[i];
        if (!visited.has(`${nx},${ny}`)) {
          visited.add(`${nx},${ny}`);
          queue.push([nx, ny]);
        }
      }
    }

    // check if all blocks are connected
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1 && !visited.has(`${j},${i}`)) {
          return false;
        }
      }
    }
    return true;
  }

  getNearByBlocks(x: number, y: number, matrix: number[][]) {
    const neighbors = [];
    const directions = [
      [0, 1], // right
      [1, 1], // down right
      [1, 0], // down
      [1, -1], // down left
      [0, -1], // left
      [-1, -1], // up left
      [-1, 0], // up
      [-1, 1] // up right
    ];
    for (let i = 0; i < directions.length; i++) {
      const [dx, dy] = directions[i];
      const nx = x + dx;
      const ny = y + dy;
      console.log("NEIGHBOR", nx, ny);
      if (nx >= 0 && nx < matrix[0].length && ny >= 0 && ny < matrix.length && matrix[ny][nx] === 1) {
        neighbors.push([nx, ny]);
      }
    }
    return neighbors;
  }

  getNeighbors(x: number, y: number, matrix: number[][]) {
    const neighbors = [];
    const directions = [
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
      [-1, 0] // up
    ];

    for (let i = 0; i < directions.length; i++) {
      const [dx, dy] = directions[i];
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < matrix[0].length && ny >= 0 && ny < matrix.length && matrix[ny][nx] === 1) {
        neighbors.push([nx, ny]);
      }
    }

    return neighbors;
  }

  checkIfLose(obj: GraphicsBlock) {
    if (obj.config.type === "bomb") {
      // console.log("ARIEL", EventsCenterManager.possibleEvents)
      EventsCenterManager.emitEvent(EventsCenterManager.possibleEvents.LOSE_LIFE, undefined);
      this.groupLifesTemporal?.getChildren().pop()?.destroy();
      return true
    } else
      return false;
  }

  checkIfWin() {
    const colors = this.matrix.map((row) => row.map((block) => block.config.type));
    //@ts-ignore
    let uniqueColors = [...new Set(colors.flat())];

    // remove color where their config has exclude true
    uniqueColors = uniqueColors.filter((color) => {
      const block = this.matrix.flat().find((block) => block.config.type === color);
      if (block) {
        return !block.config.exclude;
      }
      return true;
    });

    // beside empty, check if all colors are connected
    for (let i = 0; i < uniqueColors.length; i++) {
      const color = uniqueColors[i];
      if (color === "empty") continue;
      const matrixColor = this.matrix.map((row) => row.map((block) => block.config.type === color ? 1 : 0));
      // check if all blocks are connected
      const isConnected = this.checkIfConnected(matrixColor);
      if (!isConnected) {
        console.log("NOT CONNECTED", color);
        return false;
      } else {
        console.log("CONNECTED", color);
      }
    }
  }

  dragBlock(x: number, y: number, obj: GraphicsBlock) {
    // get the position of the block
    // from x and y, grab matrix position
    const matrixX = Math.floor(x);
    const matrixY = Math.floor(y);
    const block = this.matrix[matrixY][matrixX];
    // check if the block is not empty
    if (block.config.type !== "empty") {
      if (block.config.type !== this.draggingBlock?.config.type) {
        this.draggingBlock = null
      }
      return
    };
    if (this.draggingBlock) block.changeConfig({ ...this.draggingBlock.config, alpha: 0.75 });

  }

  addEventsListeners() {
    this.eventCenter.turnEventOn(
      "connectorScene",
      EventsCenterManager.possibleEvents.GAME_OVER,
      () => {
        console.log("GAME OVER CONNECTOR SCENE");
        this.scene.restart();
      },
      this
    )
  }
}
