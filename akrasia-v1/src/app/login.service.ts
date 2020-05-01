import { Injectable } from '@angular/core';
import { DataModelManagerService } from './data-model-manager.service';
import { Router } from '@angular/router';
import { AuthService, SocialUser } from 'angularx-social-login';
import { UserForm, Project, User } from './dataModelClasses';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, ObservableLike } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  isLogged: Boolean = false;
  user: SocialUser;
  httpOptions;
  userId: string;
  constructor(private m: DataModelManagerService, private router: Router, private auth: AuthService, private http: HttpClient) { }
  
  detectUser() {
    this.auth.authState.subscribe((socialUser) => {
      this.user = socialUser;
      console.log(this.user);
      if (this.user) {
        this.httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + this.user.authToken,
            'Content-Type': 'application/json'
          })
        };
        this.m.userGetByEmail(this.user.email).subscribe((dbUser) => {
          if (dbUser) {
            this.m.setUser(dbUser);
            this.isLogged = true;
            this.router.navigate(["/home"]);
          }
          else {
            var newUser: UserForm;
            newUser = {
              username: this.user.name,
              first_name: this.user.firstName,
              last_name: this.user.lastName,
              email: this.user.email,
              projects: [],
              stats: {
                num_projects_created: 0,
                num_projects_finished_early: 0,
                num_projects_finished_late: 0,
                total_time_worked: 0
              },
              settings: {
                schedule_off: 22,
                off_length: 9,
                day_off1: -1,
                day_off2: -1
              },
              achieves: 0,
              weekly_stats: {
                weekly_projects_created : 0,
                weekly_projects_finished_early : 0,
                weekly_projects_finished_late : 0,
                weekly_time_worked : 0
              
            },
            }
            this.m.userAdd(newUser).subscribe();
            this.isLogged = true;
            this.router.navigate(["/home"]);
          }
        })
      }
    });
  }

  getUserPic() {
    return this.user.photoUrl;
  }

  getUser(): User {
    var user = this.m.getUser();
    if (user == null) {
      this.m.userGetByEmail(this.user.email).subscribe((u) => {
        user = u;
      });
    }
    return user;
  }

  getId(): string {
    return this.userId;
  }

  deleteProject(eventID: string) {
    return this.http.delete<any>("https://www.googleapis.com/calendar/v3/calendars/primary/events/" + eventID, this.httpOptions);
  }

  deleteAllProjects() {
    this.projectsGetAll().subscribe((res) => {
      for (var i = 0; i < res.items.length; i++) {
        this.deleteProject(res.items[i].id).subscribe();
      }
    });
  }

  updateProject(eventID: String, proj: Project) {
    return this.http.put<any>("https://www.googleapis.com/calendar/v3/calendars/primary/events/" + eventID, proj, this.httpOptions);
  }

  createProject(proj: Project) {
    return this.http.post<any>("https://www.googleapis.com/calendar/v3/calendars/primary/events", proj, this.httpOptions);
  }

  projectGetOne(eventID: string): Observable<Project> {
    var httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.user.authToken,
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<Project>("https://www.googleapis.com/calendar/v3/calendars/primary/events/" + eventID, httpOptions);
  }

  projectsGetAll(): Observable<Response> {
    var httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.user.authToken,
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<Response>("https://www.googleapis.com/calendar/v3/calendars/primary/events?sharedExtendedProperty=akrasia=true", httpOptions);
  }

  deleteUser() {
    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': "application/x-www-form-urlencoded"
      })
    };
    this.http.get("https://oauth2.googleapis.com/revoke?token=" + this.user.authToken, httpOptions);
  }
  
}

class Response {
  items: GoogleEvent[];
}

class GoogleEvent {
  id: string;
  extendedProperties: {
    shared: {
        akrasia: boolean;
        urgency_level: number;
        importance_level: number;
        percentage: number;
        due_date: string;
        estimated_time: number;
        time_worked: number;
    }
  }
  summary: string;
  description: string;
  start: {
      dateTime: string;
  }
  end: {
      dateTime: string;
  }
  reminders: {
      useDefault: boolean,
      overrides: [
        {method: string, minutes: number},
        {method: string, minutes: number}
      ]
  };
  colorId: number;
}
