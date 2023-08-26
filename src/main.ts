import {
  Actor,
  Buttons,
  CollisionType,
  Color,
  DegreeOfFreedom,
  Engine,
  Font,
  Gamepad,
  ImageSource,
  Keys,
  Label,
  Loader,
  Physics,
  Scene,
  Side,
  vec,
} from "excalibur";
import { ActorArgs } from "excalibur/build/dist/Actor";
import "./style.css";

//Physics.enabled = true;
//Physics.useRealisticPhysics();
//Physics.acc = vec(0, 1500);

let background_image = new ImageSource('background.png');
let mark_1_image = new ImageSource('mark_1.png');
let mark_2_image = new ImageSource('mark_2.png');
let selector_1_image = new ImageSource('selector_1.png');
let selector_2_image = new ImageSource('selector_2.png');

const loader = new Loader([background_image,mark_1_image,mark_2_image,selector_1_image,selector_2_image]);

const game = new Engine({
  width: 800,
  height: 600,
});
await game.start(loader);

//game.showDebug(true);

const GRID_SIZE = 16;
const GRID_WIDTH = 15;
const GRID_HEIGHT = 15;

game.currentScene.camera.pos = vec(Math.floor(GRID_WIDTH/2)*GRID_SIZE,Math.floor(GRID_HEIGHT/2)*GRID_SIZE);
game.currentScene.camera.zoom = 2;

let going: Player;


class GridActor extends Actor {
  grid_x: number = 0
  grid_y: number = 0

  constructor(grid_x: number,grid_y: number) {
    super({
      width: GRID_SIZE,
      height: GRID_SIZE,
    });
    this.set_position(grid_x, grid_y);
  }
  set_position(new_x: number, new_y: number){
    this.grid_x = new_x;
    this.grid_y = new_y;
    this.pos = vec(new_x * GRID_SIZE, new_y * GRID_SIZE);
  }
}
class BackgroundTile extends GridActor{
  type: "Empty"|"First"|"Second";
  constructor(grid_x: number, grid_y: number){
    super(grid_x, grid_y);
    this.type = "Empty";
    this.graphics.add(background_image.toSprite());
  }
  mark_as(mark: "First"|"Second"){
    this.type = mark;
    this.graphics.add((mark=="First"?mark_1_image:mark_2_image).toSprite());
  }
}
let grid: BackgroundTile[][] = [];
for (let x = 0; x < GRID_WIDTH; x++){
  grid[x] = [];
  for (let y = 0; y < GRID_HEIGHT; y++){
    grid[x][y] = new BackgroundTile(x,y);
    game.add(grid[x][y]);
  }
}

class Player extends GridActor{
  type: "First"|"Second";
  gamepad: Gamepad;
  constructor(image: ImageSource, type: "First"|"Second", gamepad: Gamepad){
    super(Math.floor(GRID_WIDTH/2),Math.floor(GRID_HEIGHT/2));
    this.graphics.add(image.toSprite());
    this.type = type;
    this.gamepad = gamepad;
  }
  update(engine: Engine, delta: number): void {
    if(this.gamepad.wasButtonPressed(Buttons.DpadDown)){
      this.move_by(0,1);
    }
    if(this.gamepad.wasButtonPressed(Buttons.DpadUp)){
      this.move_by(0,-1);
    }
    if(this.gamepad.wasButtonPressed(Buttons.DpadLeft)){
      this.move_by(-1,0);
    }
    if(this.gamepad.wasButtonPressed(Buttons.DpadRight)){
      this.move_by(1,0);
    }
    if(this.gamepad.wasButtonPressed(Buttons.Face2)){
      if(this==going){
        if(grid[this.grid_x][this.grid_y].type == "Empty"){
          grid[this.grid_x][this.grid_y].mark_as(this.type);
          toggle_going();
          check_grid();
        }
      }
    }
  }
  move_by(x: number, y:number){
    this.set_position(((this.grid_x+x)+GRID_WIDTH)%GRID_WIDTH, ((this.grid_y+y)+GRID_HEIGHT)%GRID_HEIGHT);
  }
}
let player_1 = new Player(selector_1_image, "First", game.input.gamepads.at(0));
let player_2 = new Player(selector_2_image, "Second", game.input.gamepads.at(1));
const set_going = (player: Player) => {
  going = player;
  game.backgroundColor = player==player_1?Color.Green:Color.Red;
}
const toggle_going = () => {
  set_going(going==player_1?player_2:player_1);
}
const check_grid = () => {
  for(let player of ["First","Second"]){
      {
        for(let x = 0;x < GRID_WIDTH;x++){
          let count = 0;
          for(let y = 0;y < GRID_HEIGHT;y++){
            if(grid[x][y].type == player){
              count++;
              if(count == 5){
                alert(player + " player won");
                location.reload();
              }
            } else {
              count = 0;
            }
          }
        }
      }
      {
        for(let y = 0;y < GRID_HEIGHT;y++){
          let count = 0;
          for(let x = 0;x < GRID_WIDTH;x++){
            if(grid[x][y].type == player){
              count++;
              if(count == 5){
                alert(player + " player won");
                location.reload();
              }
            } else {
              count = 0;
            }
          }
        }
      }
      {
        for(let x = 0;x < GRID_WIDTH;x++){
          for(let y = 0;y < GRID_HEIGHT;y++){
            for(let i = 0;i < 5;i++){
              if(grid[x+i][y+i].type != player){
                break;
              }
              if(i == 4){
                alert(player + " player won");
                location.reload();
              }
            }
          }
        }
        for(let x = 0;x < GRID_WIDTH;x++){
          for(let y = 0;y < GRID_HEIGHT;y++){
            for(let i = 0;i < 5;i++){
              if(grid[x+i][y-i].type != player){
                break;
              }
              if(i == 4){
                alert(player + " player won");
                location.reload();
              }
            }
          }
        }
      }
  }
};
set_going(player_1);

game.add(player_1);
game.add(player_2);
