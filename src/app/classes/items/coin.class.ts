import { TileObject } from "../tile-object.class";

export class Coin extends TileObject {

    tag = "coin";

    spawn() {
        let coordinate = this.gameService.getRandomCoordinate();

        while(!this.gameService.getTile(coordinate.x, coordinate.y).isEmpty()) {
            coordinate = this.gameService.getRandomCoordinate();
        }

        this.objectService.addObject(coordinate.x, coordinate.y, this);
    }

}