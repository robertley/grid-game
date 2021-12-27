import { GameService } from "src/app/services/game.service";
import { ObjectService } from "src/app/services/object.service";
import { EnemyType } from "src/app/types/enemy-type.type";
import { BigFattyAnimation } from "../animations/big-fatty-animation.class";
import { Heart } from "../items/heart.class";
import { BigFatty } from "./big-fatty.enemy"

export class BigFattyMain extends BigFatty {
    tag = "big-fatty";
    maxHealth = 3;
    health = 3;
    enemyType = "mini-boss" as EnemyType;
    // movementSpeed = 1;

    directionX: "Left" | "Right" = "Left" // TODO random
    directionY: "Up" | "Down" = "Up"

    bigFatties: BigFatty[] = [];

    trigger = false;

    animation = new BigFattyAnimation(this.gameService, this.objectService);

    constructor(gameService: GameService, objectService: ObjectService) {
        super(gameService, objectService);

        this.directionX = Math.floor(Math.random() * 2) == 1 ? "Left" : "Right";
        this.directionY = Math.floor(Math.random() * 2) == 1 ? "Up" : "Down";


        console.log(this)
    }

    move() {

        this.createFatties();

        this.calcMoveY();
        this.moveFatties(this.directionY);
        this.calcMoveX();
        this.moveFatties(this.directionX);
    }

    createFatties() {
        if (this.bigFatties.length > 0) {
            return;
        }

        this.bigFatties.push(this.objectService.addObject(this.location.x - 1, this.location.y - 1, new BigFatty(this.gameService, this.objectService)) as BigFatty);
        this.bigFatties.push(this.objectService.addObject(this.location.x - 1, this.location.y, new BigFatty(this.gameService, this.objectService)) as BigFatty);
        this.bigFatties.push(this.objectService.addObject(this.location.x, this.location.y - 1, new BigFatty(this.gameService, this.objectService)) as BigFatty);
        this.bigFatties.push(this.objectService.addObject(this.location.x, this.location.y, new BigFatty(this.gameService, this.objectService)) as BigFatty);
        this.bigFatties.push(this.objectService.addObject(this.location.x + 1, this.location.y - 1, new BigFatty(this.gameService, this.objectService)) as BigFatty);
        this.bigFatties.push(this.objectService.addObject(this.location.x + 1, this.location.y, new BigFatty(this.gameService, this.objectService)) as BigFatty);
        this.bigFatties.push(this.objectService.addObject(this.location.x + 2, this.location.y - 1, new BigFatty(this.gameService, this.objectService)) as BigFatty);
        this.bigFatties.push(this.objectService.addObject(this.location.x + 2, this.location.y, new BigFatty(this.gameService, this.objectService)) as BigFatty);

        this.bigFatties.push(this.objectService.addObject(this.location.x, this.location.y + 1, new BigFatty(this.gameService, this.objectService)) as BigFatty);
        this.bigFatties.push(this.objectService.addObject(this.location.x + 1, this.location.y + 1, new BigFatty(this.gameService, this.objectService)) as BigFatty);
        this.bigFatties.push(this.objectService.addObject(this.location.x, this.location.y - 2, new BigFatty(this.gameService, this.objectService)) as BigFatty);
        this.bigFatties.push(this.objectService.addObject(this.location.x + 1, this.location.y - 2, new BigFatty(this.gameService, this.objectService)) as BigFatty);
    }

    calcMoveY() {
        if (this.directionY == "Up") {
            if (this.location.y - 3 < 0) {
                this.directionY = "Down";
                this.moveDown();

            } else {
                this.moveUp();
            }

            return;
        }

        if (this.directionY == "Down") {
            if (this.location.y + 3 > this.gameService.gameHeight) {
                this.directionY = "Up";
                this.moveUp();
            } else {
                this.moveDown();
            }
        }
    }

    calcMoveX() {
        if (this.directionX == "Left") {
            if (this.location.x - 2 < 0) {
                this.directionX = "Right";
                this.moveRight();

            } else {
                this.moveLeft();
            }

            return;
        }

        if (this.directionX == "Right") {
            if (this.location.x + 4 > this.gameService.gameWidth) {
                this.directionX = "Left";
                this.moveLeft();

            } else {
                this.moveRight();
            }

        }
    }

    moveFatties(direction: "Up" | "Down" | "Left" | "Right") {

        for (let fatty of this.bigFatties) {
            switch (direction) {
                case "Up":
                    fatty.moveUp();
                    break;
                case "Down":
                    fatty.moveDown();
                    break;
                case "Left":
                    fatty.moveLeft();
                    break;
                case "Right":
                    fatty.moveRight();
                    break;
            }
        }
    }

    onDeath() {
        for (let fatty of this.bigFatties) {
            fatty.destroy();
        }

        let randomC = this.gameService.getRandomCoordinate();
        this.objectService.addObject(randomC.x, randomC.y, new Heart(this.gameService, this.objectService));
    }
}