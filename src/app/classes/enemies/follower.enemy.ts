import { GameService } from "src/app/services/game.service";
import { ObjectService } from "src/app/services/object.service";
import { EnemeySpawn } from "../animations/enemy-spawn-class";
import { FollowingEnemy } from "./following-enemy.class";

export class Follower extends FollowingEnemy {

    tag = "follower"

    movementSpeed = 4;
    
    animation = new EnemeySpawn(this.gameService, this.objectService);

}