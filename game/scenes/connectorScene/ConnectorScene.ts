import Phaser from "phaser";
import EventsCenterManager from "../../services/eventsServices/EventsCenterService";


const EMPTYCOLORTYPE = 0xfdfdfd;
export default class ConnectorScene extends Phaser.Scene {

  eventCenter = EventsCenterManager.getInstance();
  draggingBlock: GraphicsBlock | null = null;
  matrix: GraphicsBlock[][] = [];

  player: GraphicPlayer | null = null;

  constructor() {
    super({key: "ConnectorScene", active: false});
  }

  map: number[][] = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,3,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,2,0,0,0,0,0,0,2,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,3,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
  ];

  // map: number[][] = [
  //   [1,3,0,3],
  //   [0,2,0,0],
  //   [0,0,1,0],
  //   [0,2,0,0],
  // ];

  
  create() {
    console.log("SCENE MENU ConnectorScene", this)
    // bring scene to top
    this.scene.bringToTop("ConnectorScene");


    const random = Math.floor(Math.random() * 4);
    this.map = this.rotateMatrix90Degrees(this.map, random);

    const size = 80;
    const n = this.map.length;
    // random between 0 and 4
 
    this.matrix = this.createMatrixMap(n, size)
    this.centerCameraOnMatrix(this.matrix,size);

    this.addBrickLogicToMatrix(this.map, size);
  }

  rotateMatrix90Degrees(matrix: number[][], times:number) {
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
      }
    }
  }

  createPlayer() {
    const size = 80;
    const n = this.map.length;
    this.player = new GraphicPlayer(this, n, n, size, this.controls);
    this.player.draw();
    this.add.existing(this.player.graphics);
  }

  getPositionOfMap(x: number, y: number) {
   return this.map[y][x];
  }

  getConfigByNumer(n:number){
    switch(n){
      case 0:
        return {type: "empty", color: EMPTYCOLORTYPE, alpha: 1};
      case 1:
        return {type: "red", color: 0xff0000, alpha: 1};
      case 2:
        return {type: "green", color: 0x00ff00, alpha: 1};
      case 3:
        return {type: "blue", color: 0x0000ff, alpha: 1};
      default:
        return {type: "empty", color: EMPTYCOLORTYPE, alpha: 1};
    }

  }

  centerCameraOnMatrix(matrix: GraphicsBlock[][], size: number) {
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
    this.cameras.main.setZoom(Math.min(zoomX, zoomY));
    this.cameras.main.setScroll(
      x * -1,
      y * -1
    )

    this.cameras.main.setBackgroundColor(0xffffff);

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
    while(queue.length > 0){
      const [x, y] = queue.shift()!;
      const neighbors = this.getNeighbors(x, y, matrix);
      for(let i = 0; i < neighbors.length; i++){
        const [nx, ny] = neighbors[i];
        if(!visited.has(`${nx},${ny}`)){
          visited.add(`${nx},${ny}`);
          queue.push([nx, ny]);
          // clean the block
          this.matrix[ny][nx].changeConfig({type: "empty", color: EMPTYCOLORTYPE, alpha: 1});
        }
      }
    }
  }

  blackBrickControls: BlackBrickControlsObj = {
    onClick: (x: number, y: number, obj: BlackBrickGraphicsBlock) => {
      obj.graphics.destroy();
    }
  }


  controls: ControlsObj = {
    onClick: (x: number, y: number, obj: GraphicsBlock) => {
      if(!obj.canBeCleared) {
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
      this.draggingBlock = null;
      this.checkIfWin();
    },
    onMove: (x: number, y: number, obj: GraphicsBlock) => {
      if(this.draggingBlock) {
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
    for(let i = 0; i < matrix.length; i++){
      for(let j = 0; j < matrix[i].length; j++){
        if(matrix[i][j] === 1){
          startX = j;
          startY = i;
          break;
        }
      }
      if(startX !== -1) break;
    }

    if(startX === -1) return false;

    queue.push([startX, startY]);
    visited.add(`${startX},${startY}`);

    while(queue.length > 0){
      const [x, y] = queue.shift()!;
      const neighbors = this.getNeighbors(x, y, matrix);
      for(let i = 0; i < neighbors.length; i++){
        const [nx, ny] = neighbors[i];
        if(!visited.has(`${nx},${ny}`)){
          visited.add(`${nx},${ny}`);
          queue.push([nx, ny]);
        }
      }
    }

    // check if all blocks are connected
    for(let i = 0; i < matrix.length; i++){
      for(let j = 0; j < matrix[i].length; j++){
        if(matrix[i][j] === 1 && !visited.has(`${j},${i}`)){
          return false;
        }
      }
    }
    return true;
  }

  getNeighbors(x: number, y: number, matrix: number[][]) {
    const neighbors = [];
    const directions = [
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
      [-1, 0] // up
    ];

    for(let i = 0; i < directions.length; i++){
      const [dx, dy] = directions[i];
      const nx = x + dx;
      const ny = y + dy;
      if(nx >= 0 && nx < matrix[0].length && ny >= 0 && ny < matrix.length && matrix[ny][nx] === 1){
        neighbors.push([nx, ny]);
      }
    }

    return neighbors;
  }
  
  checkIfWin(){
    const colors = this.matrix.map((row) => row.map((block) => block.config.type));
    //@ts-ignore
    const uniqueColors = [...new Set(colors.flat())];

    // beside empty, check if all colors are connected
    for(let i = 0; i < uniqueColors.length; i++){
      const color = uniqueColors[i];
      if(color === "empty") continue;
      const matrixColor = this.matrix.map((row) => row.map((block) => block.config.type === color ? 1 : 0));
      // check if all blocks are connected
      const isConnected = this.checkIfConnected(matrixColor);
      if(!isConnected) {
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
    if(block.config.type !== "empty") {
      if(block.config.type !== this.draggingBlock?.config.type) {
        this.draggingBlock = null
      }
      return
    };
    if(this.draggingBlock) block.changeConfig({...this.draggingBlock.config, alpha: 0.75});

  }

  createMatrixMap(n:number, size:number) {
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
  
  update() {
    // console.log("SCENE MENU UPDATE", this)
  }
}


class GraphicsBlock {
  x: number;
  y: number;
  size: number;
  graphics: Phaser.GameObjects.Graphics;
  controls: ControlsObj
  config: GraphicsBlockConfig;
  canBeCleared: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number, size: number, controls: ControlsObj, config: GraphicsBlockConfig) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.controls = controls;
    this.config = config;
    this.graphics = new Phaser.GameObjects.Graphics(scene);
  }

  draw() {
    const xPos = this.x * this.size;
    const yPos = this.y * this.size;
    if(this.config.type !== "empty") this.canBeCleared = false;
    this.graphics.fillStyle(this.config.color, 1);
    this.graphics.fillRect(xPos, yPos, this.size, this.size);
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.strokeRect(xPos, yPos, this.size, this.size);
    this.graphics.setAlpha(0.5);
    this.graphics.setVisible(true);

    this.graphics.setInteractive(new Phaser.Geom.Rectangle(
      xPos,
      yPos,
      this.size,
      this.size
    ), Phaser.Geom.Rectangle.Contains);
    this.graphics.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.controls.onClick(pointer.x, pointer.y, this);
    });
    this.graphics.on('pointerover', (pointer: Phaser.Input.Pointer) => {
      this.controls.onHover(pointer.x, pointer.y, this);
    });
    this.graphics.on('pointerout', (pointer: Phaser.Input.Pointer) => {
      this.controls.onHoverOut(pointer.x, pointer.y, this);
    });
    this.graphics.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      this.controls.onStopClick(pointer.x, pointer.y, this);
    });
    this.graphics.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.controls.onMove(pointer.x, pointer.y, this);
    });
   
  }

  onHover(){
    // change color
    this.graphics.clear();
    this.graphics.fillStyle(this.config.color, this.config.alpha);
    this.graphics.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
  }

  onHoverOut(){
    // change color
    this.graphics.clear();
    this.graphics.fillStyle(this.config.color, this.config.alpha);
    this.graphics.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
  }
  
  // Create Drag Controls, the idea is to drag the block (not 0 or empty) and colored alll blocks while the drag continues, dont change the color of other blocks colors
  changeConfig(config: GraphicsBlockConfig) {
    // if config.type is equal to current type, clean
    if(this.canBeCleared && this.config.type === config.type) {
      this.graphics.clear();
      this.graphics.fillStyle(EMPTYCOLORTYPE, 1);
      this.graphics.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
      this.graphics.lineStyle(1, 0x000000, 1);
      this.graphics.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
      // set config to empty
      this.config = {type: "empty", color: EMPTYCOLORTYPE, alpha: 1};
    } else {
      // set config to new config
      console.log("SET CONFIG", config);
      this.config = config;
      this.graphics.clear();
      this.graphics.fillStyle(this.config.color, this.config.alpha);
      this.graphics.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
      this.graphics.lineStyle(1, 0x000000, 1);
      this.graphics.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
      // set canBeCleared to false
    }
  }
}

export type ControlsObj = {
  onClick: (x:number,y:number, obj:GraphicsBlock) => void;
  onHover: (x:number,y:number, obj:GraphicsBlock) => void;
  onHoverOut: (x:number,y:number, obj:GraphicsBlock) => void;
  onStopClick: (x:number,y:number, obj:GraphicsBlock) => void;
  onMove: (x:number,y:number, obj:GraphicsBlock) => void;
}
  

export type GraphicsBlockConfig = {
  type: string;
  color: number;
  alpha: number;
}


export type BlackBrickControlsObj = {
  onClick: (x:number,y:number, obj:BlackBrickGraphicsBlock) => void;
}

export class GraphicPlayer {
  x: number;
  y: number;
  size: number;
  graphics: Phaser.GameObjects.Graphics;
  controls: ControlsObj
  config: GraphicsBlockConfig;

  constructor(scene: Phaser.Scene, x: number, y: number, size: number, controls: ControlsObj) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.controls = controls;
    this.graphics = new Phaser.GameObjects.Graphics(scene);
    this.config = {type: "player", color: 0x000000, alpha: 1};
  }
  draw() {
    const xPos = this.x * this.size;
    const yPos = this.y * this.size;
    this.graphics.fillStyle(this.config.color, 1);
    this.graphics.fillRect(xPos, yPos, this.size, this.size);
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.strokeRect(xPos, yPos, this.size, this.size);
    this.graphics.setAlpha(0.5);
    this.graphics.setVisible(true);

  }

  addInteractivity(){
    // player can only move to surrounding blocks and will listen to click events.
    // it's neccesary to highlight the possible blocks that the player can move
    this.graphics.setInteractive(new Phaser.Geom.Rectangle(
      this.x * this.size,
      this.y * this.size,
      this.size,
      this.size
    ), Phaser.Geom.Rectangle.Contains);
    this.graphics.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // this.controls.onClick(pointer.x, pointer.y, this);
    });
    this.graphics.on('pointerover', (pointer: Phaser.Input.Pointer) => {
      // this.controls.onHover(pointer.x, pointer.y, this);
    });
    this.graphics.on('pointerout', (pointer: Phaser.Input.Pointer) => {
      // this.controls.onHoverOut(pointer.x, pointer.y, this);
    }
    );
    this.graphics.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      // this.controls.onStopClick(pointer.x, pointer.y, this);
    }
    );
    this.graphics.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      // this.controls.onMove(pointer.x, pointer.y, this);
    }
    );
  }
  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
    const xPos = this.x * this.size;
    const yPos = this.y * this.size;
    this.graphics.clear();
    this.graphics.fillStyle(this.config.color, 1);
    this.graphics.fillRect(xPos, yPos, this.size, this.size);
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.strokeRect(xPos, yPos, this.size, this.size);
  }
  onHover(){
    // change color
    this.graphics.clear();
    this.graphics.fillStyle(this.config.color, this.config.alpha);
    this.graphics.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
  }
  onHoverOut(){
    // change color
    this.graphics.clear();
    this.graphics.fillStyle(this.config.color, this.config.alpha);
    this.graphics.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
  }
}  
 


class BlackBrickGraphicsBlock {
  x: number;
  y: number;
  size: number;
  graphics: Phaser.GameObjects.Graphics;
  controls: BlackBrickControlsObj
  config: GraphicsBlockConfig;

  constructor(scene: Phaser.Scene, x: number, y: number, size: number, controls: BlackBrickControlsObj) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.controls = controls;
    this.graphics = new Phaser.GameObjects.Graphics(scene);
    this.config = {type: "black", color: 0x000000, alpha: 1};
  }

  draw() {
    const xPos = this.x * this.size;
    const yPos = this.y * this.size;
    this.graphics.fillStyle(this.config.color, 1);
    this.graphics.fillRect(xPos, yPos, this.size, this.size);
    this.graphics.lineStyle(1, 0x000000, 1);
    this.graphics.strokeRect(xPos, yPos, this.size, this.size);
    this.graphics.setAlpha(1);
    this.graphics.setVisible(true);
    this.graphics.setInteractive(new Phaser.Geom.Rectangle(
      xPos,
      yPos,
      this.size,
      this.size
    ), Phaser.Geom.Rectangle.Contains);
    this.graphics.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.controls.onClick(pointer.x, pointer.y, this);
    });
  }
}