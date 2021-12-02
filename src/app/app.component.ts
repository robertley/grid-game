import { Component, HostListener } from '@angular/core';
import { Coin } from './classes/items/coin.class';
import { KEY_CODE } from './enums/key-code.enum';
import { LocalStorage } from './interfaces/local-storage.interface';
import { GameService } from './services/game.service';
import { KeyboardService } from './services/keyboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'grid-game';

  localStorage: LocalStorage;

  constructor(private gameService: GameService, private keyboardService: KeyboardService) {
  }


  @HostListener('window:keydown', ['$event'])
  keyEventDown(event: KeyboardEvent) {
    this.keyboardService.registerKeyEvent(event)
  }

  @HostListener('window:keyup', ['$event'])
  keyEventUp(event: KeyboardEvent) {
    this.keyboardService.unregisterKeyEvent(event)
  }

  newGame() {
    this.gameService.startGame();
  }

  get gameRunning() {
    return this.gameService.gameIsRunning;
  }
}
