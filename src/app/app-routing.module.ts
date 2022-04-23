import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameFinalScoreComponent } from './pages/game-final-score/game-final-score.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { PresentationPageComponent } from './pages/presentation-page/presentation-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import {AngularFireAuthGuard} from "@angular/fire/compat/auth-guard";
import { FriendsListComponent } from './pages/friends-list/friends-list.component';
import { InvitationPopupComponent } from './invitation-popup/invitation-popup.component';

const routes: Routes = [
  {path: '', component: PresentationPageComponent},
  {path: 'home', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'game-score', component: GameFinalScoreComponent},
  {path: 'account', component: ProfilePageComponent, canActivate: [AngularFireAuthGuard]},
  {path: 'friends', component: FriendsListComponent},
  {path: 'invitation-popup', component: InvitationPopupComponent  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
