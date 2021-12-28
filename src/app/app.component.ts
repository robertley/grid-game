import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HowToPlayComponent } from './components/how-to-play/how-to-play.component';
import { GameService } from './services/game.service';
import { KeyboardService } from './services/keyboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'grid-game';

  discoverItemData;

  constructor(private gameService: GameService,
              private keyboardService: KeyboardService,
              private dialog: MatDialog
            ) {
  }
  
  async ngOnInit() {
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

  howTo() {
    this.dialog.open(HowToPlayComponent, {width: '500px'});
  }

  get gameRunning() {
    return this.gameService.gameIsRunning;
  }

  get doDeathAnimation() {
    return this.gameService.deathAnimation;
  }

 }
