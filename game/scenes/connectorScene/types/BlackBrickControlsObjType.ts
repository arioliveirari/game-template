import BlackBrickGraphicsBlock from "../objects/BlackBrickGraphicsBlock";

export type BlackBrickControlsObj = {
  onClick: (x:number,y:number, obj:BlackBrickGraphicsBlock) => void;
  onHover: (x:number,y:number, obj:BlackBrickGraphicsBlock) => void;
  onHoverOut: (x:number,y:number, obj:BlackBrickGraphicsBlock) => void;
}
