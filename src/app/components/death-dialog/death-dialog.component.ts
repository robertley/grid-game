import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TileObject } from 'src/app/classes/tile-object.class';

@Component({
  selector: 'app-death-dialog',
  templateUrl: './death-dialog.component.html',
  styleUrls: ['./death-dialog.component.scss']
})
export class DeathDialogComponent implements OnInit {

  deathObject: TileObject;

  constructor(
    public dialogRef: MatDialogRef<DeathDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogData) { }

  ngOnInit(): void {
    this.deathObject = this.data.deathObject;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  formatScore(score: number) {
    return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }  

}


interface dialogData {
  deathObject: TileObject;
  score: number;
}