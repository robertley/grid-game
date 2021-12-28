import { Component, OnInit } from '@angular/core';
import { Highscore } from '../../interfaces/highscore.interface';
import { HighscoreService } from '../../services/highscore.service';
import { first } from 'rxjs/operators';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.scss']
})
export class HighscoresComponent implements OnInit {

  constructor(private highscoreService: HighscoreService) { }

  async ngOnInit() {
    console.log('highscores init')
    await this.highscoreService.getHighscores().pipe(first()).toPromise();
    console.log(this.highscores)
  }

  
  formatScore(score: number) {
    return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  get yourHighscore() {
    return this.highscoreService.yourHighscore;
  }

  get highscores() {
    return this.highscoreService.highscores;
  }
}
