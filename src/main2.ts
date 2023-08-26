import './style.css'
import { Actor, CircleCollider, CollisionGroup, CollisionType, Color, Engine, Keys, Physics, vec } from 'excalibur'

const game = new Engine({
  width: 800,
  height: 600,
});
Physics.acc = vec(0,981);

game.showDebug(true);

class Pablo extends Actor{
  ground_collisions: number
  speed: number
  constructor(){
    super({
      width: 100,
      height: 150,
      color: Color.Red,
      collisionType: CollisionType.Active,
    })
    this.ground_collisions = 0
    this.speed = 300
    const pablove_nohy = new Actor({
      x: 0,
      y: 75,
      width: 80,
      height: 1,
    });
    this.addChild(pablove_nohy)
    pablove_nohy.on('collisionstart', (event) => {
      if(event.other != this)
        this.ground_collisions++;
    });
    pablove_nohy.on('collisionend', (event) => {
      if(event.other != this)
        this.ground_collisions--;
    });
  }
  update(engine: Engine, delta: number): void {
    let final_vel_x = 0;
    if (engine.input.keyboard.isHeld(Keys.D)) {
      final_vel_x += this.speed;
    }
    if (engine.input.keyboard.isHeld(Keys.A)) {
      final_vel_x += -this.speed;
    }
    pablo.vel.x = final_vel_x;
    if (engine.input.keyboard.isHeld(Keys.W) && this.ground_collisions > 0) {
      pablo.body.applyLinearImpulse(vec(0,-5000));
    }
  }
}

const pablo = new Pablo();
game.currentScene.camera.strategy.lockToActor(pablo)
game.currentScene.camera.zoom = 0.7;

class Platform extends Actor{
  constructor(x:number,y:number,w:number,h:number){
    super({
      width: w,
      height: h,
      pos: vec(x, y),
      color: Color.Red,
      collisionType: CollisionType.Fixed,
    })
  }
}

game.add(pablo)
game.add(new Platform(0, 600, 400, 100))
game.add(new Platform(100, 550, 100, 300))
//pablo.collider.useCircleCollider(10);
game.start()