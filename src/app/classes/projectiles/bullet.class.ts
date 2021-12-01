import { Projectile } from "../projectile.class";

export class Bullet extends Projectile {

    subClass = "bullet";

    hitWall() {
        this.destroy();
    }
}