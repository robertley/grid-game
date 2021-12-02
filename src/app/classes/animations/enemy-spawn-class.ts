import { GameService } from "src/app/services/game.service";
import { ObjectService } from "src/app/services/object.service";
import { Animation } from "../animation.class";

export class EnemeySpawn extends Animation {
    duration = 2000;
    tag = "enemy-spawn";

    constructor(gameService: GameService, objectService:ObjectService) {
        super(gameService, objectService, 2000);
    }
}