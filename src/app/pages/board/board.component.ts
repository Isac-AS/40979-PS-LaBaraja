import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { PlayCardsComponent } from 'src/app/components/play-cards/play-cards.component';
import { ViewCardsComponent } from 'src/app/components/view-cards/view-cards.component';
import { Card, Game, Lobby, Participant, User } from 'src/app/models/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CustomUtilsService } from 'src/app/services/customUtils.service';
import { databaseService } from 'src/app/services/database.service';
import { GameFinalScoreComponent } from '../game-final-score/game-final-score.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  user: User;
  lobby: Lobby;
  game: Game;

  userAsAParticipant: Participant = {
    hand: [],
    id: '',
    name: '',
    turn: false
  }

  ableToPlay: boolean = true;

  constructor(
    private utils: CustomUtilsService,
    private auth: AuthService,
    private db: databaseService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.user = this.utils.getCleanUser();
    this.lobby = this.utils.getCleanLobby();
    this.game = this.utils.getCleanGame();
  }

  ngOnInit(): void {
    this.auth.getUid().then(async currentUserUid => {
      if (currentUserUid) {
        this.db.readDocument<User>('users', currentUserUid).subscribe(async currentUserData => {
          if (currentUserData) this.user = currentUserData;
          if (currentUserData?.lobby != 'none') {
            this.db.readDocument<Lobby>('lobbies', currentUserData!?.lobby).subscribe(async usersLobby => {
              if (usersLobby) this.lobby = usersLobby;
            })
            this.db.readDocument<Game>('games', currentUserData!?.lobby).subscribe(currentGame => {
              if (currentGame) {
                this.game = currentGame;
                for (let participant of this.game.participants) {
                  if (participant.id == currentUserUid) {
                    this.userAsAParticipant = participant;
                  }
                }
                this.ableToPlay = this.canPlay();
              }
            })
          }
        })
      }
    });
  }

  quitGame() {
    this.db.quitGame(this.user);
    this.router.navigate(['/sala']);
  }

  async startGame() {
    let auxGame = this.game;
    auxGame = this.initializeGameElements(auxGame);
    await this.delay(2000);
    this.db.updateDocument(auxGame, 'games', this.lobby.id);
  }

  initializeGameElements(game: Game): Game {
    let deck = this.utils.getCompleteDeck();
    game = this.dealCards(deck, game);
    game = this.identifyStarter(game);
    game.hasStarted = true;
    return game;
  }

  dealCards(deck: Card[], game: Game): Game {
    let player = 0;
    while (deck.length > 0) {
      let randomCardIndex = Math.floor(Math.random() * (deck.length));
      let randomCard = deck.splice(randomCardIndex, 1)[0];
      game.participants[player].hand.push(randomCard);
      ++player;
      if (player >= game.participants.length) player = 0;
    }
    return game
  }


  identifyStarter(game: Game): Game {
    for (let i = 0; i < this.game.participants.length; i++) {
      if (this.searchInHand(this.game.participants[i].hand)) {
        game.participants[i].turn = true;
        game.turn = i;
        break;
      }
    }
    return game
  }

  searchInHand(hand: Card[]): boolean {
    for (let card of hand) {
      if (card.id === 'bastos-2') {
        return true
      }
    }
    return false;
  }

  advanceTurn() {
    ++this.game.turn;
    if (this.game.turn >= this.game.participants.length) this.game.turn = 0;
    this.userAsAParticipant.turn = false;
    this.game.participants[this.game.turn].turn = true;
    this.game.passCounter++;
    this.db.updateDocument(this.game, 'games', this.lobby.id);
    console.log(this.ableToPlay)
    console.log(this.game.passCounter)
  }

  openHandViewDialog() {
    const dialogRef = this.dialog.open(ViewCardsComponent, {
      data: {
        userAsAParticipant: this.userAsAParticipant,
        game: this.game
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe();
  }

  openPlayDialog() {
    const dialogRef = this.dialog.open(PlayCardsComponent, {
      data: {
        userAsAParticipant: this.userAsAParticipant,
        game: this.game
      },
      width: '80%'
    });
    dialogRef.afterClosed().subscribe();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  clearBoard() {
    this.game.board = [];
    this.ableToPlay = true;
    this.game.passCounter = 0;
    this.db.updateDocument(this.game, 'games', this.lobby.id);
  }

  canPlay(): boolean {
    if(this.game.board.length == 0) return true;
    let cardsWithMoreValueThanBoard: any[] = []
    for (let card of this.userAsAParticipant.hand) {
      if (card.number > this.game.board[0].number && this.game.board.length > 0) {
        cardsWithMoreValueThanBoard.push(card)
      }
    }
    if (cardsWithMoreValueThanBoard.length == 0) return false;
    let groupingArray: any[] = [[], [], [], [], [], [], [], [], [], [], [], []]
    for (let card of cardsWithMoreValueThanBoard) {
      groupingArray[card.number].push(card)
    }
    for (let group of groupingArray) {
      if (group.length >= this.game.board.length) return true;
    }
    return false;
  }

  showWinners() {
    const dialogRef = this.dialog.open(GameFinalScoreComponent, {
      data: this.game.winners,
      width: '80%'
    });
    dialogRef.afterClosed().subscribe();
  }
}
