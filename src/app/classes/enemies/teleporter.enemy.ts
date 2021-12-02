import { GameService } from "src/app/services/game.service";
import { ObjectService } from "src/app/services/object.service";
import { Enemy } from "../enemy.class";

export class TeleporterEnemy extends Enemy {

    movementSpeed = 1;

    type: "vertical" | "horizontal";
    forwards = true;

    tag = "teleporter"

    constructor(gameService: GameService, objectService: ObjectService) {
        super(gameService, objectService);


        this.type = Math.floor(Math.random() * 2) == 1 ? "vertical" : "horizontal";
        this.forwards = Math.floor(Math.random() * 2) == 1;
    }

    move() {
        if (this.type == "vertical") {
            if (this.forwards) {
                if (this.location.y - 1 < 0) {
                    this.teleport();
                    return;
                }
                
                this.moveUp();
                return;
            }

            if (this.location.y + 1 > this.gameService.gameHeight - 1) {
                this.teleport();
                return;
            }

            this.moveDown();
            return;
        }

        // left right
        if (this.forwards) {
            if (this.location.x - 1 < 0) {
                this.teleport();
                return;
            }
            
            this.moveLeft();
            return;
        }

        if (this.location.x + 1 > this.gameService.gameWidth - 1) {
            this.teleport();
            return;
        }

        this.moveRight();
        return;
    }

    teleport() {
        if (this.forwards && this.type == "vertical") {
            this.doMove(this.location.x, this.gameService.gameHeight - 1);
            return;
        }
        if (!this.forwards && this.type == "vertical") {
            this.doMove(this.location.x, 0);

            return;
        }
        if (!this.forwards && this.type == "horizontal") {
            this.doMove(0, this.location.y);

            return;
        }
        if (this.forwards && this.type == "horizontal") {
            this.doMove(this.gameService.gameWidth - 1, this.location.y);

            return;
        }
    }
}