import { GameService } from "../services/game.service";
import { ObjectService } from "../services/object.service";
import { TileObject } from "./tile-object.class";

export class Animation extends TileObject {
    duration: number = 2000;
    tag="animation"

    constructor(gameService: GameService, objectService: ObjectService, duration: number) {
        super(gameService, objectService);
        this.duration = duration;
        this.setDestroy();
    }

    getHtmlClass() {
        return "animation " + this.tag
    }

    setDestroy() {
        setTimeout(() => {
            this.destroy();
        }, this.duration)
    }
}