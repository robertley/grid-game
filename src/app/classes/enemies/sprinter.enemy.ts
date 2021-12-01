import { EnemyType } from "src/app/types/enemy-type.type";
import { Follower } from "./follower.enemy";

export class Sprinter extends Follower {

    tag = "sprinter"
    enemyType = "elite" as EnemyType;
    movementSpeed = 2;
    
}