import { EnemyType } from "src/app/types/enemy-type.type";
import { EliteAnimation } from "../animations/elite.animation.class";
import { Follower } from "./follower.enemy";
import { FollowingEnemy } from "./following-enemy.class";

export class Sprinter extends FollowingEnemy {

    tag = "sprinter"
    enemyType = "elite" as EnemyType;
    movementSpeed = 2;
    collisionDamage = 2;
    animation = new EliteAnimation(this.gameService, this.objectService);
    
}