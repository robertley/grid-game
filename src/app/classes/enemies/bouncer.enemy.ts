import { GameService } from "src/app/services/game.service";
import { ObjectService } from "src/app/services/object.service";
import { EnemeySpawn } from "../animations/enemy-spawn-class";
import { Enemy } from "../enemy.class";

export class BouncerEnemy extends Enemy {

    type: "vertical" | "horizontal";
    forwards = true;

    tag = "bouncer";
    animation = new EnemeySpawn(this.gameService, this.objectService);


    constructor(gameService: GameService, objectService: ObjectService) {
        super(gameService, objectService);


        this.type = Math.floor(Math.random() * 2) == 1 ? "vertical" : "horizontal";
    }

    move() {
        if (this.type == "vertical") {
            if (this.forwards) {
                if (this.location.y - 1 < 0) {
                    this.forwards = false;
                    this.moveDown();
                    return;
                }
                
                this.moveUp();
                return;
            }

            if (this.location.y + 1 > this.gameService.gameHeight - 1) {
                this.forwards = true;
                this.moveUp();
                return;
            }

            this.moveDown();
            return;
        }

        // left right
        if (this.forwards) {
            if (this.location.x - 1 < 0) {
                this.forwards = false;
                this.moveRight();
                return;
            }
            
            this.moveLeft();
            return;
        }

        if (this.location.x + 1 > this.gameService.gameWidth - 1) {
            this.forwards = true;
            this.moveLeft();
            return;
        }

        this.moveRight();
        return;
    }
}