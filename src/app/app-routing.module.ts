import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { PresentationPageComponent } from './pages/presentation-page/presentation-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';

const routes: Routes = [
  {path: '', component: PresentationPageComponent},
  {path: 'home', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'main', component: MainPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
