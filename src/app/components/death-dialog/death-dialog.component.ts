import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { TileObject } from 'src/app/classes/tile-object.class';
import { HighscoreService } from '../../services/highscore.service';

@Component({
  selector: 'app-death-dialog',
  templateUrl: './death-dialog.component.html',
  styleUrls: ['./death-dialog.component.scss']
})
export class DeathDialogComponent implements OnInit {

  deathObject: TileObject;
  highscore: boolean = false;

  highscoreForm: FormGroup;

  highscoreSubmitted = false;

  constructor(
    public dialogRef: MatDialogRef<DeathDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogData,
    private highscoreService: HighscoreService) { }

  ngOnInit(): void {
    this.deathObject = this.data.deathObject;

    this.initForm();

    this.highscoreService.checkIfYourHighscore(this.data.score);

    if (this.highscoreService.checkIfHighscore(this.data.score)) {
      this.highscore = true;
    }
  }

  initForm() {
    this.highscoreForm = new FormGroup({
      name: new FormControl('', Validators.required),
      score: new FormControl(this.data.score)
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  formatScore(score: number) {
    return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  async submitHighscore() {
    this.highscoreSubmitted = true;

    await this.highscoreService.addHighScore(this.highscoreForm.value).pipe(first()).toPromise();
    await this.highscoreService.getHighscores().pipe(first()).toPromise();
  }


}


interface dialogData {
  deathObject: TileObject;
  score: number;
}