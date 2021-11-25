import { GameService } from "src/app/services/game.service";
import { ObjectService } from "src/app/services/object.service";
import { Enemy } from "../enemy.class";

export class MiniSniper extends Enemy {

    movementSpeed = 2;

    onHiddenSecton = true;
    maxHealth = 2;
    health = 2;

    subClass = "mini-sniper";

    constructor(gameService: GameService, objectService: ObjectService) {
        super(gameService, objectService);

        this.enemyType = "mini-boss";

    }

    move() {
        
        // shouldn't happen but need it for strict typing
        if (this.location.hiddenSection != undefined) {
            if (this.location.hiddenSection % 2 == 0) {
                this.doMove(this.gameService.player.location.x, this.location.hiddenSection);
                return;
            }

            this.doMove(this.location.hiddenSection, this.gameService.player.location.y);
        }

    }

   
}