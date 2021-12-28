import { EnemeySpawn } from "../animations/enemy-spawn-class";
import { Enemy } from "../enemy.class";

export class Bomb extends Enemy {
    tag = "bomb"
    attackSpeed = 100;
    // animation = new EnemeySpawn(this.gameService, this.objectService);


    attack() {
        this.destroy();
    }
}