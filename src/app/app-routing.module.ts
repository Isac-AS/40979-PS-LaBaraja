import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameFinalScoreComponent } from './pages/game-final-score/game-final-score.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { PresentationPageComponent } from './pages/presentation-page/presentation-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { SalaPageComponent } from './pages/sala-page/sala-page.component';
import { SalaPageDialog1Component } from './components/sala-page-dialog1/sala-page-dialog1.component';
import {AngularFireAuthGuard} from "@angular/fire/compat/auth-guard";
import { FriendsListComponent } from './pages/friends-list/friends-list.component';

const routes: Routes = [
  {path: '', component: PresentationPageComponent},
  {path: 'home', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'game-score', component: GameFinalScoreComponent},
  {path: 'sala', component: SalaPageComponent},
  {path: 'sala_dialog1', component: SalaPageDialog1Component},
  {path: 'account', component: ProfilePageComponent, canActivate: [AngularFireAuthGuard]},
  {path: 'friends', component: FriendsListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
