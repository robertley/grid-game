import { GameService } from "../services/game.service";
import { ObjectService } from "../services/object.service";
import { TileObject } from "./tile-object.class";

export class Projectile extends TileObject {

    movementSpeed = 1;
    movementDirection: "Up" | "Right" | "Down" | "Left";

    damage = 1;

    tag = "projectile";
    subClass = "bullet"

    constructor(gameservice: GameService, objectService: ObjectService, movementDirection: "Up" | "Right" | "Down" | "Left") {
        super(gameservice, objectService);

        this.movementDirection = movementDirection;
    }

    move() {
        if (this.movementDirection == "Up") {
            this.moveUp();
            return;
        }
        if (this.movementDirection == "Right") {
            this.moveRight();
            return;
        }
        if (this.movementDirection == "Down") {
            this.moveDown();
            return;
        }
        if (this.movementDirection == "Left") {
            this.moveLeft();
            return;
        }
    }

    getHtmlClass() {
        let htmlClass = this.tag;
        if (this.subClass) {
            htmlClass += ("-" + this.subClass);
        }
        htmlClass += (" direction-" + this.movementDirection);

        return htmlClass;
    }
}