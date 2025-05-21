import GraphicsBlock from "../objects/GraphicsBlock";

export type ControlsObj = {
  onClick: (x:number,y:number, obj:GraphicsBlock) => void;
  onHover: (x:number,y:number, obj:GraphicsBlock) => void;
  onHoverOut: (x:number,y:number, obj:GraphicsBlock) => void;
  onStopClick: (x:number,y:number, obj:GraphicsBlock) => void;
  onMove: (x:number,y:number, obj:GraphicsBlock) => void;
}
  