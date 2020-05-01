import { Component, OnInit, Inject } from '@angular/core';
import { User, Project } from '../dataModelClasses';
import { DataModelManagerService } from '../data-model-manager.service';
import { Router } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import * as moment from 'moment';
import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';
import { LoginService } from '../login.service';
import { resolve } from 'url';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.css']
})
export class CalendarPageComponent implements OnInit {
  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
  labelFormat = {
    hour: 'numeric',
    minute: '2-digit',
    color: 'black'
  }
  height = parent;
  eventColor = "";
  calendarEvents = [{id: "", title: "empty", start: "", color: ""}]
  contentLoaded = false;
  errorMsg = "";

  constructor(private m: DataModelManagerService, private router: Router, private login: LoginService) {
    
  }

  handleDateClick(arg) { // handler method
    this.m.setDateSelected(moment(arg.dateStr).format());
    this.router.navigate(["/create_project"]);
  }

  handleEventClick(arg) {
    this.m.setProjectSelectedId(arg.event.id);
    this.m.setDateSelected(arg.event.start);
    this.router.navigate(['/update_project']);
  }

  ngOnInit() {
    //this.waitForGoogle();
    this.login.projectsGetAll().subscribe((res) => {
      console.log(res.items);
      for (var i = 0; i < res.items.length; i++) {
        if(res.items[i].extendedProperties.shared.urgency_level == 1){
          this.eventColor = "darkseagreen";
        }
        else if(res.items[i].extendedProperties.shared.urgency_level == 2){
          this.eventColor = "yellowgreen";
        }
        else if(res.items[i].extendedProperties.shared.urgency_level == 3){
          this.eventColor = "gold";
        }
        else if(res.items[i].extendedProperties.shared.urgency_level == 4){
          this.eventColor = "coral";
        }
        else{
          this.eventColor = "orangered";
        }
        this.calendarEvents.push({
          id: res.items[i].id,
          title: res.items[i].summary,
          start: moment(res.items[i].start.dateTime).format(),
          color: this.eventColor
        })
    }
    });
  }
/*
  syncGoogle() {
    if (this.m.isGoogleSignedIn && !this.contentLoaded) {
      this.m.getAllEvents();
      this.m.userGetByEmail(this.m.getGoogleEmail()).subscribe(u => {this.m.user = u;});
      setTimeout(() => {this.loadCalendar();}, 300);
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
        this.loadCalendar();
      }
    }

  loadCalendar() {
    console.log("loading calendar...");
    this.contentLoaded = true;
      var events = this.m.getEventList();
    if (events[0]) {
      for (var i = 0; i < events.length; i++) {
          this.calendarEvents[i] = {
          id: events[i].id,
          title: events[i].summary,
          start: moment(events[i].start.dateTime).format()
        }
      }
    }
  }
*/
}

