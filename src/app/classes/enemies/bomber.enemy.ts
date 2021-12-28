import { EnemeySpawn } from "../animations/enemy-spawn-class";
import { Bomb } from "./bomb.enemy";
import { WanderingEnemy } from "./wandering-enemy,class";

export class Bomber extends WanderingEnemy {
    tag = "bomber"

    movementSpeed = 5;

    attackSpeed = 90;
    
    animation = new EnemeySpawn(this.gameService, this.objectService);

    attack() {
        this.objectService.addObject(this.location.x, this.location.y, new Bomb(this.gameService, this.objectService))
    }
}