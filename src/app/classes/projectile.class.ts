import { TileObject } from "./tile-object.class";

export class Projectile extends TileObject {

    movementSpeed = 1;
    movementDirection: "Up" | "Right" | "Down" | "Left";

    fire() {
        
    }

}