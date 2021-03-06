import { Injectable } from "@angular/core";
import { Player } from "../classes/player.class";

@Injectable({
    providedIn: 'root'
})
export class KeyboardService {

    player: Player;

    registeredKeys = new Map<string, boolean>();

    constructor() {
    }

    resetService() {
        this.registeredKeys.clear();
    }

    registerKeyEvent(event: KeyboardEvent) {
        this.registeredKeys.set(event.key, true);
    }

    unregisterKeyEvent(event: KeyboardEvent) {
        this.registeredKeys.delete(event.key);
    }

    clearKeys() {
        for (let [key, value] of this.registeredKeys) {
            this.registeredKeys.delete(key);
        }
    }

}