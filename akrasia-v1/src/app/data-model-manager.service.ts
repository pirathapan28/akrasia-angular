import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { User, Project, UserForm } from "./dataModelClasses";
import { Observable } from 'rxjs';
import * as gapiFunctions from '../assets/gapi-sign-in';
import * as moment from 'moment';

declare var gapi: any;


@Injectable({
  providedIn: 'root'
})
export class DataModelManagerService {
  private url: string = 'https://salty-harbor-95580.herokuapp.com/api';
  private userId: string;
  user: User;
  userEmail: string;

  newUser: User = {
    _id: "",
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    stats: {
        num_projects_created : 0,
        num_projects_finished_early : 0,
        num_projects_finished_late : 0,
        total_time_worked : 0
      
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
    
  }
  };

  private dateSelected: string = "2019-11-09T03:00:00Z";
  private projectsArray: any[];
  private projectSelected: string;
  private project;
  public isGoogleSignedIn = false;
  public eventsUpdated = true;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(private http: HttpClient) { }
  
  
  setLocalUser() {
    var profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
    //set basic profile info
      this.user.email = profile.getEmail();
      this.user.first_name = profile.getGivenName();
      this.user.last_name = profile.getFamilyName();
    //get the user id and set it
      this.userGetByEmail(this.user.email).subscribe(u => this.setId(u._id));
      this.userId = this.user._id;
      this.getAllEvents();
  }

  getDateSelected() {
    return this.dateSelected;
  }
  setDateSelected(date: string) {
    this.dateSelected = date;
  }

  getProjectSelectedId() {
    return this.projectSelected;
  }
  setProjectSelectedId(id: string) {
    this.projectSelected = id;
  }

  getProjectSelected() {
    return this.project;
  }

  getEventList() {
    return this.projectsArray;
  }

  getGoogleEmail(){
    return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
  }

  getPic(){
    return gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl();
  }

  getEmail() {
    return this.userEmail;
  }

  setEmail(email: string) {
    this.userEmail = email;
  }

  setId(id: string) {
    if (id == "delete") {
      this.userId = null;
    }
    else {
      this.userId = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getId();
    }
  }

  getId() {
    return this.userId; 
  }

  setUser(u: User) {
    this.user = u;
    console.log(u);
    console.log(this.user);
  }

  getUser() {
    return this.user;
  }

  userGetAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/users`);
  }

  userGetByEmail(email:string) : Observable<User>{
    return this.http.get<User>(`${this.url}/users/email/${email}`);
  }

  userGetById(id: string): Observable<User> {
    return this.http.get<User>(`${this.url}/users/${id}`);
  }

  userAdd(newItem: UserForm) {
    return this.http.post<any>(`${this.url}/users/create`, newItem, this.httpOptions);
  }

  userUpdate(id: string, newItem: User): Observable<any> {
    console.log(newItem.stats.total_time_worked + " " + newItem._id);
    return this.http.put<User>(`${this.url}/users/${id}/updated`, newItem, this.httpOptions);
  }

  userDelete(){
    return this.http.delete(`${this.url}/users/${this.user._id}`);
  }

  projectGetAll(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.url}/projects`);
  }

  projectGetOne(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.url}/projects/${id}`);
  }

  projectAdd(newItem: Project){
    return this.http.post<any>(`${this.url}/projects/create`, newItem, this.httpOptions)
  }

  projectUpdate(id: string, newItem: string): Observable<Project> {
    console.log(newItem);
    return this.http.put<Project>(`${this.url}/projects/${id}/updated`, newItem, this.httpOptions);
  }

  projectDelete(id: string){
    return this.http.delete(`${this.url}/projects/${id}`);
  }

  estimateDate(urgency: number, percentage?: number) {
    var date = moment(this.dateSelected);
    var day1 = this.user.settings.day_off1;
    var day2 = this.user.settings.day_off2;
    var startBreak = this.user.settings.schedule_off;
    var endBreak, timeDiff = 0;
    if( (startBreak + this.user.settings.off_length) > 23 ){
      timeDiff = 24 - startBreak;
      endBreak = this.user.settings.off_length - timeDiff;
    }
    else{
      endBreak = this.user.settings.off_length;
    } 
    var offsetAmount = (urgency * urgency) / 25;
    var new_day = date.subtract(offsetAmount * 24 + percentage / 2, 'hours').startOf('hour');

    if (new_day.hour() > startBreak || new_day.hour() < endBreak) {
      new_day.set('hour', startBreak);
      
      //if estimated day is same as actual due date, sets estimated day to previous day
      if (new_day.day() == moment(this.dateSelected).day()) {
        new_day.subtract(1, 'day');
      }
      //if estimated day is same first selected day off, sets estimated day to previous day
      if(new_day.day().toString() == day1.toString()){
        new_day.subtract(1, 'day');
        console.log("day off1 adjust: " + new_day.day())
      }
      //if estimated day is same first selected day off, sets estimated day to earliest available previous day
      if(new_day.day().toString() == day2.toString()){
        new_day.subtract(1, 'day');

        if(new_day.day().toString() == day1.toString()){
          new_day.subtract(1, 'day');
        }
      }
    }
    return new_day.format();
  }

  //function that returns a number representing the number of minutes a project should take to complete
  //TODO: this function will need to be changed once the task page changes and different parameters are used to calculate the estimated time
  estimateTime(urgency: number, percentage?: number) {
    //return (urgency * importance + percentage) * 60;
    return (urgency * urgency + percentage) * 60;
  }
  
  displayGoogleUser() {
    var profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
    console.log(profile.getName());
    
  }

  /* function that attempts to find the MongoDB stored account based on the email string that is passed as a parameter, if 
  it finds a matching account it does nothing, if no account is found, it adds the current user info to the users database */
  checkUserDB(userEmail){
    console.log("checking whether to add user");
    this.userGetByEmail(userEmail).subscribe(res => {
      if(res){
        console.log("not adding");
      }
      else{
        console.log("adding user");
        this.newUser.first_name = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getGivenName();
        this.newUser.last_name = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getFamilyName();
        this.newUser.email = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getEmail();
        this.newUser.username = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName();
        this.newUser.settings.schedule_off = 22;
        this.newUser.settings.off_length = 9;
        this.newUser.settings.day_off1 = -1;
        this.newUser.settings.day_off2 = -1;
        //this.userAdd(this.newUser).subscribe( u => console.log(u));
      }
    });
  }

  async createEvent(project: Project) {
    this.eventsUpdated = true;
    // Example 1: Use method-specific function
    var event = project;
    console.log("Hello!");
    var request = gapi.client.calendar.events.insert({
      'calendarId': 'primary',
      'resource': event
    });
    await new Promise(function(resolve, reject) {
      request.execute(function(event) {
        if (event.htmlLink) {
          console.log(event.htmlLink);

          resolve({description: event.description, due_date: event.end.dateTime, urgency_level: 0, estimated_time: 0});
        }
        else {
          reject(event);
        }
      })
    }).then((res: Project) => {
      console.log(this.projectAdd(res).subscribe());
      console.log(res);
      
    },
    (rej) => {
      console.log(rej);
    });
  }

  //
  async getAllEvents(){
    if (gapi.client.calendar != null) {
      var request = gapi.client.calendar.events.list({
        calendarId: 'primary',
        sharedExtendedProperty: 'akrasia=true',
      });
      var response;
      await new Promise(function(resolve, reject) {
        request.execute(function(response) {
  
          if(response.error || response == false){
            alert('Error');
          }
          else{
            resolve(response.items);
          }
        });
      }).then((res: any[]) => {
        this.projectsArray = res;
        this.isGoogleSignedIn = true;
      });
    }
  }

  //The gapi.client.calendar.events.get function only searches by event id, the string generated by createEvent function is
  //the id but it is a base64 formatted string, decode it at https://www.base64decode.org/, take the decoded string (up
  //to the first space), and use it as the eventID parameter in the function call on profile-page.component.html
  async getEvent(eventID){

    var request = gapi.client.calendar.events.get({
      calendarId: 'primary',
      eventId: eventID
    });
    var event;
    await new Promise(function(resolve, reject) {
      request.execute(function(response) {
        if(response.error || response == false){
          alert('Error');
        }
        else{
          resolve(response);
          /*var string = response.summary + "\n" + response.description + "\nStart Date: " + response.start.dateTime 
            + "\nEnd Date: " + response.end.dateTime;
          alert(string);    */           
        }
      });
    }).then((res: any[]) => {
      this.project = res;
    });
  }

  //The gapi.client.calendar.events.update function only searches by event id, the string generated by createEvent function is
  //the id but it is a base64 formatted string, decode it at https://www.base64decode.org/, take the decoded string (up
  //to the first space), and use it as the eventID parameter in the function call on profile-page.component.html
  updateEvent(eventID: string, project: Project) {
    this.eventsUpdated = true;
    var request = gapi.client.calendar.events.update({
      calendarId: 'primary',
      eventId: eventID,
      resource: project
    });

    request.execute(function(response) {
      if(response.error || response == false){
        alert('Error');
      }
      else{
        var string = "Event updated\n\n New Summary: " + response.summary + "\nDescription: " + response.description;
        console.log(string);
                        
      }
    });
  }


  //The gapi.client.calendar.events.delete function only searches by event id, the string generated by createEvent function is
  //the id but it is a base64 formatted string, decode it at https://www.base64decode.org/, take the decoded string (up
  //to the first space), and use it as the eventID parameter in the function call on profile-page.component.html
  deleteEvent(eventID) {
    this.eventsUpdated = true;
    var request = gapi.client.calendar.events.delete({
      calendarId: 'primary',
      eventId: eventID,
    });

    request.execute(function(response) {
      if(response.error || response == false){
        alert('Error');
      }
      else{
        //alert('Event was deleted');               
      }
    });
  }

}