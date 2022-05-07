import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Participant } from 'src/app/models/interfaces';

@Component({
  selector: 'app-game-final-score',
  templateUrl: './game-final-score.component.html',
  styleUrls: ['./game-final-score.component.css']
})
export class GameFinalScoreComponent implements OnInit {

  winners: Participant[];

  constructor(
    public dialogRef: MatDialogRef<GameFinalScoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Participant[]
  ) { 
    this.winners = data;
  }

  ngOnInit(): void {
    
  }

}
