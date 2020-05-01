import { Component, OnInit } from '@angular/core';
import { DataModelManagerService } from '../data-model-manager.service';
import { Router } from '@angular/router';
import {User} from '../dataModelClasses';
import * as moment from 'moment';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  calendarEvents = [];
  selectedEvent = null;
  userList: User[];
  contentLoaded = false;
  errorMsg = "";
  constructor(private m: DataModelManagerService, private router: Router, private login: LoginService) { }

  ngOnInit() {
    //this.waitForGoogle();
    if (this.login.isLogged) {
      this.login.projectsGetAll().subscribe((res) => {
        //console.log(res.items);
        if (res) {
            for (var i = 0; i < res.items.length; i++) {
              var day = moment(res.items[i].start.dateTime).format();
              if (day > moment().format()) {
                this.calendarEvents.push({
                  id: res.items[i].id,
                  title: res.items[i].summary,
                  start: moment(res.items[i].start.dateTime).format("DD-MM-YYYY"),
                  urgency_level: res.items[i].extendedProperties.shared.urgency_level
                });
            }
          }
        }
        this.m.user = this.login.getUser();
        this.contentLoaded = true;  
        this.m.userGetAll().subscribe(users => {this.userList = users;});
        this.calendarEvents.sort(function(a,b){return b.urgency_level - a.urgency_level});
      });
    }
    else {
      this.router.navigate(["/about"]);
    }
  }

  syncGoogle() {
    if (this.m.isGoogleSignedIn && !this.contentLoaded) {
      this.m.getAllEvents();
      this.m.userGetByEmail(this.m.getGoogleEmail()).subscribe(u => {this.m.user = u;});
      setTimeout(() => {this.loadDisplay();}, 300);
    }
    if (!this.m.isGoogleSignedIn) {
      console.log("connection failed... retrying");
      this.m.getAllEvents();
    }
  }

  waitForGoogle() {
      console.log("waiting for google...");
      if (this.m.eventsUpdated) {
        setTimeout(() => {if (!this.m.isGoogleSignedIn) {this.errorMsg = "Please Refresh or Try Again Later..."}}, 10500);
        for (var i = 500; i <= 10000; i += 500) {
          setTimeout(() => {this.syncGoogle()}, i);
        }
      }
      else {
        this.loadDisplay();
      }
    }

  loadDisplay() {
      this.contentLoaded = true;
      this.setEvents();
      this.m.userGetAll().subscribe(users => {this.userList = users;});
      this.calendarEvents.sort(function(a,b){return b.urgency_level - a.urgency_level});
  }
  handleEventClick(event) {
    if (event != null) {
      this.m.setProjectSelectedId(event.id);
      this.m.setDateSelected(event.start);
      this.router.navigate(['/update_project']);
    }
  }

  setEvents() {
    this.m.eventsUpdated = false;
    var events = this.m.getEventList();
    if (events[0]) {
      for (var i = 0; i < events.length; i++) {
        var day = moment(events[i].start.dateTime).format();
        
        if (day > moment().format()) {
          this.calendarEvents.push({
            id: events[i].id,
            title: events[i].summary,
            start: moment(events[i].start.dateTime).format("DD-MM-YYYY"),
            urgency_level: events[i].extendedProperties.shared.urgency_level
        });
        }
      }
    }
  }
}
