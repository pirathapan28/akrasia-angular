import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {FullCalendarModule} from '@fullcalendar/angular';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, LoginOpt } from "angularx-social-login";
import { MatDialogModule } from '@angular/material/dialog'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderNavComponent } from './header-nav/header-nav.component';
import { NotFoundComponent } from './not-found.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { TimerPageComponent } from './timer-page/timer-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { CreateProjectFormComponent } from './create-project-form/create-project-form.component';
import { UpdateProjectFormComponent } from './update-project-form/update-project-form.component';
import { DeleteProjectFormComponent } from './delete-project-form/delete-project-form.component';
import { FormModalComponent } from './form-modal/form-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LeaderboardPageComponent } from './leaderboard-page/leaderboard-page.component';
import { AchievementPageComponent } from './achievement-page/achievement-page.component';
import { LeaderboardTableComponent } from './leaderboard-table/leaderboard-table.component';
import { AchievementBannerComponent } from './achievement-banner/achievement-banner.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FinishProjectFormComponent } from './finish-project-form/finish-project-form.component';
import { LoadingPageComponent } from './loading-page/loading-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { TimerActiveOverlapComponent } from './timer-page/timer-active-overlap/timer-active-overlap.component';
import { TimerLimitAlertComponent } from './timer-page/timer-limit-alert/timer-limit-alert.component';
import { SaveAlertComponent } from './profile-page/save-alert/save-alert.component';
import { LeaderboardWeeklyComponent } from './leaderboard-weekly/leaderboard-weekly.component'


const googleLoginOptions: LoginOpt = {
  scope: 'profile email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
};

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("974499849097-ovlm1rims9fno4vlk80rk3lucbqpiaie.apps.googleusercontent.com", googleLoginOptions)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderNavComponent,
    NotFoundComponent,
    CalendarPageComponent,
    TimerPageComponent,
    LoginPageComponent,
    ProfilePageComponent,
    SignUpPageComponent,
    CreateProjectFormComponent,
    UpdateProjectFormComponent,
    DeleteProjectFormComponent,
    FormModalComponent,
    LeaderboardPageComponent,
    AchievementPageComponent,
    LeaderboardTableComponent,
    AchievementBannerComponent,
    LandingPageComponent,
    FinishProjectFormComponent,
    LoadingPageComponent,
    AboutPageComponent,
    TimerActiveOverlapComponent,
    TimerLimitAlertComponent,
    SaveAlertComponent,
    LeaderboardWeeklyComponent
  ],
  entryComponents: [
    TimerActiveOverlapComponent,
    TimerLimitAlertComponent,
    SaveAlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    SocialLoginModule, 
    MatDialogModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
