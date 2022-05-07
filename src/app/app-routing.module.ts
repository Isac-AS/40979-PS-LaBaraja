import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AngularFireAuthGuard} from "@angular/fire/compat/auth-guard";
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LobbyPageComponent } from './pages/sala-page/lobby-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { FriendsListComponent } from './pages/friends-list/friends-list.component';
import { GameFinalScoreComponent } from './pages/game-final-score/game-final-score.component';
import { PresentationPageComponent } from './pages/presentation-page/presentation-page.component';
import { SalaPageDialog1Component } from './components/sala-page-dialog1/sala-page-dialog1.component';
import { BoardComponent } from './pages/board/board.component';

const routes: Routes = [
  { path: 'board', component: BoardComponent },
  { path: 'sala', component: LobbyPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: '', component: PresentationPageComponent },
  { path: 'friends', component: FriendsListComponent },
  { path: 'game-score', component: GameFinalScoreComponent },
  { path: 'sala_dialog1', component: SalaPageDialog1Component },
  { path: 'account', component: ProfilePageComponent, canActivate: [AngularFireAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
