// Basic imports
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Angular Fire imports
import { AngularFireModule } from "@angular/fire/compat";
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { provideStorage, getStorage } from '@angular/fire/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';

// Angular Material imports
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";

// Component imports
import { AppComponent } from './app.component';
// Pages
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PresentationPageComponent } from './pages/presentation-page/presentation-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { FriendsListComponent } from './pages/friends-list/friends-list.component';

// Components
import { LoginPageComponent } from './components/login-page/login-page.component';
import { PseudoheaderComponent } from './components/pseudoheader/pseudoheader.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { InfoMessagePopupComponent } from './components/info-message-popup/info-message-popup.component';
import { NotoficationDialogComponent } from './components/notofication-Dialog/notofication-Dialog.component';


@NgModule({
	declarations: [
		AppComponent,
		HomePageComponent,
		LoginPageComponent,
		InfoMessagePopupComponent,
		PresentationPageComponent,
		RegisterPageComponent,
		ProfilePageComponent,
		FriendsListComponent,
		PseudoheaderComponent,
		NotoficationDialogComponent
	],
	imports: [
		BrowserModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule,
		AngularFireAuthModule,
		provideFirebaseApp(() => initializeApp(environment.firebase)),
		provideAnalytics(() => getAnalytics()),
		provideAuth(() => getAuth()),
		provideDatabase(() => getDatabase()),
		provideFirestore(() => getFirestore()),
		provideFunctions(() => getFunctions()),
		provideMessaging(() => getMessaging()),
		providePerformance(() => getPerformance()),
		provideRemoteConfig(() => getRemoteConfig()),
		provideStorage(() => getStorage()),
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatIconModule,
		MatInputModule,
		MatButtonModule,
		MatDialogModule,
		MatFormFieldModule,
		ReactiveFormsModule
	],
	providers: [
		ScreenTrackingService, UserTrackingService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
