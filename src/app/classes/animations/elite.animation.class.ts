import { GameService } from "src/app/services/game.service";
import { ObjectService } from "src/app/services/object.service";
import { Animation } from "../animation.class";

export class EliteAnimation extends Animation {
    duration = 4000;
    tag = "elite-enemy-spawn";

    constructor(gameService: GameService, objectService: ObjectService) {
        super(gameService, objectService, 4000);
    }
}