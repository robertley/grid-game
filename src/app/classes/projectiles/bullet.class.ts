import { Projectile } from "../projectile.class";

export class Bullet extends Projectile {

    hitWall() {
        this.destroy();
    }
}