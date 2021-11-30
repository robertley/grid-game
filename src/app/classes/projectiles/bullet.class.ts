import { Projectile } from "../projectile.class";

export class Bullet extends Projectile {

    subClass = "bullet";
    movementSpeed = 1

    hitWall() {
        this.destroy();
    }
}