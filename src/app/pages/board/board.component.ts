import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Game, Lobby, User } from 'src/app/models/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { CustomUtilsService } from 'src/app/services/customUtils.service';
import { databaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  user: User;
  lobby: Lobby;
  game: Game;

  hasStarted: boolean = false;

  constructor(
    private utils: CustomUtilsService,
    private auth: AuthService,
    private db: databaseService,
    private router: Router,
  ) {
    this.user = this.utils.getCleanUser();
    this.lobby = this.utils.getCleanLobby();
    this.game = this.utils.getCleanGame();

    this.auth.getUid().then(async currentUserUid => {
      if (currentUserUid){
        this.db.readDocument<User>('users', currentUserUid).subscribe( async currentUserData => {
          if (currentUserData) {
            this.user = currentUserData;
          }
          if (currentUserData?.lobby != 'none') {
            this.db.readDocument<Lobby>('lobbies', currentUserData!?.lobby).subscribe( async usersLobby => {
              if(usersLobby) this.lobby = usersLobby;
            })
            this.db.readDocument<Game>('games', currentUserData!?.lobby).subscribe( async currentGame => {
              if(currentGame) this.game = currentGame;
            })
          }
        })
      }
    });
  }

  ngOnInit(): void {
  }

  quitGame() {
    this.db.quitGame(this.user);
    this.router.navigate(['/sala']);
  }
  

}
