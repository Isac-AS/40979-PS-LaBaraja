import { Component, Inject, OnInit } from '@angular/core';
import { databaseService } from 'src/app/services/database.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Card, Game, InGameCardDialogs, Participant } from 'src/app/models/interfaces';

@Component({
  selector: 'app-play-cards',
  templateUrl: './play-cards.component.html',
  styleUrls: ['./play-cards.component.css']
})
export class PlayCardsComponent implements OnInit {

  userAsAParticipant: Participant;
  game: Game;
  cardsToDisplay: any[] = [];
  error: boolean = false;
  errorMessage: string = '';
  

  constructor(
    private db: databaseService,
    public dialogRef: MatDialogRef<PlayCardsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InGameCardDialogs
  ) {
    this.userAsAParticipant = data.userAsAParticipant;
    this.game = data.game;
    for (let card of this.userAsAParticipant.hand) {
      this.cardsToDisplay.push({
        card: card,
        isSelected: false,
      })
    }
  }

  ngOnInit(): void { }

  playMove() {
    if (this.validate()) {
      this.makeMove();
      this.updateElements();
      this.dialogRef.close();
    }
  }

  validate(): boolean {
    if (this.isFirst()) {
      return this.processSelectionAsFirst()
    } else {
      return this.processSelection()
    }
  }

  advanceTurn() {
    this.game.participants[this.game.turn].turn = false;
    ++this.game.turn;
    if (this.game.turn >= this.game.participants.length) this.game.turn = 0;
    this.game.participants[this.game.turn].turn = true;
  }

  makeMove() {
    if (this.retrieveSelected()[0].card.number == 1) {
      this.game.board = this.retrieveSelectedAsCards();
      this.removeSelectedFromParticipantHand();
    } else {
      this.game.board = this.retrieveSelectedAsCards();
      this.removeSelectedFromParticipantHand();
      this.advanceTurn();
    }
    this.updateParticipants()
  }

  updateElements() {
    this.game.passCounter = 0;
    this.db.updateDocument(this.game, 'games', this.game.id);
  }


  updateParticipants() {
    this.game.participants.forEach((value, index) => {
      if (value.hand.length == 0) {
        this.game.winners.push(value);
        this.advanceTurn();
        this.game.participants.splice(index, 1);
        if (this.game.participants.length == 1) {
          this.game.winners.push(this.game.participants[0]);
          this.game.participants = []
          console.log("final de la partida")
        }
      }
    })
  }

  removeSelectedFromParticipantHand() {
    for (let participant of this.game.participants) {
      if (this.userAsAParticipant.id === participant.id) {
        let selectedCards = this.retrieveSelectedAsCards();
        if (participant.hand.length == selectedCards.length) {
            participant.hand = [];
        } else {
          for (let card of selectedCards) {
            participant.hand = this.removeCardFromArray(participant.hand, card);
          }
        }
      }
    }
  }

  removeCardFromArray(array: Card[], element: Card): Card[] {
    array.forEach((value, index) => {
      if (value.id == element.id
      ) {
        array.splice(index, 1);
      }
    });
    return array;
  }

  toggleSelection(element: any) {
    for (let displayInfo of this.cardsToDisplay) {
      if (displayInfo.card.id === element.card.id) {
        displayInfo.isSelected = !displayInfo.isSelected;
      }
    }
  }

  isFirst(): boolean {
    for (let element of this.cardsToDisplay) {
      if (element.card.id === 'bastos-2') {
        return true
      }
    }
    return false;
  }

  retrieveSelected(): any[] {
    let result: any[] = [];
    for (let element of this.cardsToDisplay) {
      if (element.isSelected) result.push(element)
    }
    return result
  }

  retrieveSelectedAsCards(): Card[] {
    let result: Card[] = [];
    for (let element of this.cardsToDisplay) {
      if (element.isSelected) result.push(element.card)
    }
    return result
  }

  processSelectionAsFirst(): boolean {
    let selectedCards: any[] = this.retrieveSelected();
    let necessaryCardCounter: boolean = false;
    for (let element of selectedCards) {
      if (element.card.number != 2) {
        this.error = true;
        this.errorMessage = 'Todas las cartas seleccionadas deben tener el mismo número en este caso como se trata de la primera jugada, deben ser 2.'
        return false;
      }
      if (element.card.id === 'bastos-2') necessaryCardCounter = true;
    }
    if (!necessaryCardCounter) {
      this.error = true;
      this.errorMessage = 'Al ser la primera jugada, se tiene que seleccionar el dos de bastos.'
    }
    return necessaryCardCounter;
  }

  processSelection(): boolean {
    let selectedCards: any[] = this.retrieveSelected();
    let cardNumbers: number[] = [];
    if(this.game.board.length > 0 && this.game.board[0].number == 1) return true;
    if (selectedCards.length != this.game.board.length && (this.game.board.length != 0)) {
      this.error = true;
      this.errorMessage = '¡Se debe seleccionar el mismo número de cartas que hay en el tablero!'
      return false;
    }
    for (let element of selectedCards) {
      if (this.game.board.length > 0) {
        if ((element.card.number <= this.game.board[0].number) && (element.card.number != 1)) {
          this.error = true;
          this.errorMessage = 'Las cartas seleccionadas deben tener un valor superior a las del tablero.'
          return false;
        }
        cardNumbers.push(element.card.number)
      }
    }
    for (let cardNumber of cardNumbers) {
      if (cardNumber != cardNumbers[0]) {
        this.error = true;
        this.errorMessage = 'Todas las cartas seleccionadas deben tener el mismo número.'
        return false;
      }
    }
    return true;
  }

  
}
