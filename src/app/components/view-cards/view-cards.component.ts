import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Game, InGameCardDialogs, Participant } from 'src/app/models/interfaces';
import { databaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-view-cards',
  templateUrl: './view-cards.component.html',
  styleUrls: ['./view-cards.component.css']
})
export class ViewCardsComponent implements OnInit {

  userAsAParticipant: Participant;
  game: Game;

  constructor(
    private db: databaseService,
    public dialogRef: MatDialogRef<ViewCardsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InGameCardDialogs
  ) {
    this.userAsAParticipant = data.userAsAParticipant;
    this.game = data.game;
  }

  ngOnInit(): void {
  }

}
