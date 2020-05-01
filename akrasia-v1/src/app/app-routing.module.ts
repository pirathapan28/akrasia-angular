import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginPageComponent} from "./login-page/login-page.component";
import {CalendarPageComponent} from "./calendar-page/calendar-page.component";
import {TimerPageComponent} from "./timer-page/timer-page.component";
import { NotFoundComponent } from './not-found.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SignUpPageComponent } from './sign-up-page/sign-up-page.component';
import { CreateProjectFormComponent } from './create-project-form/create-project-form.component';
import { UpdateProjectFormComponent } from './update-project-form/update-project-form.component';
import { DeleteProjectFormComponent } from './delete-project-form/delete-project-form.component';
import { FinishProjectFormComponent } from './finish-project-form/finish-project-form.component';
import { AchievementPageComponent } from './achievement-page/achievement-page.component';
import { LeaderboardPageComponent } from './leaderboard-page/leaderboard-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutPageComponent} from './about-page/about-page.component';

const routes: Routes = [
  {path: 'home', component: LandingPageComponent},
  {path: 'profile', component: ProfilePageComponent},
  {path: 'calendar', component: CalendarPageComponent},
  {path: 'timer', component: TimerPageComponent},
  {path: 'create_project', component: CreateProjectFormComponent},
  {path: 'delete_project', component: DeleteProjectFormComponent},
  {path: 'update_project', component: UpdateProjectFormComponent},
  {path: 'finish_project', component: FinishProjectFormComponent},
  {path: 'achievements', component: AchievementPageComponent},
  {path: 'leaderboards', component: LeaderboardPageComponent},
  {path: 'about', component: AboutPageComponent},
  {path: '', redirectTo: '/about', pathMatch: 'full'},
  {path: '*', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
