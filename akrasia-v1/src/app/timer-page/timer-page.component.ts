import { Component, OnInit } from '@angular/core';
import { DataModelManagerService } from '../data-model-manager.service';
import { Project, User } from '../dataModelClasses';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
import { LoginService } from '../login.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TimerActiveOverlapComponent } from './timer-active-overlap/timer-active-overlap.component';
import { TimerLimitAlertComponent } from './timer-limit-alert/timer-limit-alert.component';

@Component({
  selector: 'app-timer-page',
  templateUrl: './timer-page.component.html',
  styleUrls: ['./timer-page.component.css']
})

export class TimerPageComponent implements OnInit {

  project: Project = {
    extendedProperties: {
        shared: {
            akrasia: true,
            urgency_level: 1,
            importance_level: 1,
            percentage: 0.5,
            due_date: "",
            estimated_time: 1,
            time_worked: 0
        }
    },
    summary: "",
    description: "",
    start: {
        dateTime: "",
    },
    end: {
        dateTime: "",
    },
    reminders: {
        useDefault: false,
        overrides: [
          {method: "email", minutes: 0},
          {method: "popup", minutes: 0}
        ]
    },
    colorId: 2,
  };

  currUser: User = {
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
  }

  constructor(private m: DataModelManagerService, private router: Router, private login: LoginService, public dialog: MatDialog) { }

  time: number = 0;
  currentHours: number = 0;
  play: boolean = false;
  activeTimer: boolean = JSON.parse(localStorage.getItem("activeTimer"));
  interval;

  //on initialization, component gets the event selected from the calendar and populates the local
  //project and user variables
  ngOnInit() {
    this.login.projectGetOne(this.m.getProjectSelectedId()).subscribe((res) => {
      //sets the local project object to the selected project, based on its ID
      this.project = res;
      console.log("project: " + this.project.summary);
      //sets the component's user currUser object to the stored user, handled by the data-model-manager service 
      this.currUser = this.m.user;
      //this.project.extendedProperties.shared.time_worked = 35;
      //sets the number of seconds worked to the project's current time worked
      this.currentHours = this.project.extendedProperties.shared.time_worked;
      console.log("total time worked before timer: " + this.currentHours);
      console.log(this.currUser.username + " " + this.currUser._id);
    });
  }

  //start timer, time based on intervals of 1000 milliseconds
  startTimer() {
    console.log("current timer status: " + localStorage.getItem("activeTimer"));
    let dialogRef;
    //timer checks through localStorage if another timer in another tab is active. If not, it proceeds and starts the timer;
    //if another timer is active, an alert tells the user to stop the other timer.
    if(JSON.parse(localStorage.getItem("activeTimer")) == false){
      localStorage.setItem("activeTimer", "true");
      console.log("timer activated: " + localStorage.getItem("activeTimer"));

      this.play = true;
      this.interval = setInterval(() => {
        this.time++;
        if (this.time % 3600 == 0) { //3600 is equal to 1 hours in miliseconds
          //this.pauseTimer();
          //modal window to alert user that an hour has passed, suggests taking a break
          dialogRef = this.dialog.open(TimerLimitAlertComponent, {
            width: '500px',
            height: '200px'
          });
        }
        //closes the previous dialog to prevent multiple modal windows from stacking
        if(this.time % 7193 == 0){
          dialogRef.close();
        }
      },1000)
    }
    else{
      //modal window to alert user that the system prevented multiple timers from runnning at the same time      
      this.dialog.open(TimerActiveOverlapComponent, {
        width: '500px',
        height: '200px'
      });
    }
  }

  //pauses the timer, sets localStorage value to false
  pauseTimer() {
    localStorage.setItem("activeTimer", "false");
    this.play = false;
    clearInterval(this.interval);
    console.log("current user: " + this.currUser);
  }

  //converts minutes to HH:MM
  minToHours = function(time){
    var hours = (time / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return ((rhours < 10) ? '0' + rhours : rhours) + ':' + 
            ((rminutes < 10) ? '0' + rminutes : rminutes);
  }

  //converts seconds passed to HH:MM:SS format
  toHHMMSS = function (time) {
    var hours   = Math.floor(time / 3600);
    var minutes = Math.floor((time - (hours * 3600)) / 60);
    var seconds = time - (hours * 3600) - (minutes * 60);
    
    // if (hours   < 10) {this.hoursStr   = "0" + this.hoursStr;}
    // if (minutes < 10) {this.minutesStr = "0" + this.minutesStr;}
    // if (seconds < 10) {this.secondsStr = "0" + this.secondsStr;}
    return ((hours < 10) ? '0' + hours : hours) + ':' + 
            ((minutes < 10) ? '0' + minutes : minutes) + ':' + 
            ((seconds < 10) ? '0' + seconds : seconds);
  }
  
  //converts seconds passed to HH:MM format
  toHHMM = function (time) {
    var hours   = Math.floor(time / 3600);
    var minutes = Math.floor((time - (hours * 3600)) / 60);
    var seconds = time - (hours * 3600) - (minutes * 60);
    
    return ((hours < 10) ? '0' + hours : hours) + ':' + 
            ((minutes < 10) ? '0' + minutes : minutes);
  }

  //saves the amount of time worked, updates the current project with this data, adds the time passed to user's
  //time_worked stat, sets localStorage value to false. This function is also run if the tab or window is closed, 
  //to ensure data is stored
  @HostListener('window:beforeunload')
  finish() {
    if (this.play == true){
      localStorage.setItem("activeTimer", "false");
    }
    this.project.extendedProperties.shared.time_worked = +this.currentHours + +Math.floor(this.time / 60);
    console.log("total time worked in minutes after timer: " + this.project.extendedProperties.shared.time_worked);
    this.login.updateProject(this.m.getProjectSelectedId(), this.project).subscribe(p => {
      if(p){
        this.currUser.stats.total_time_worked += +Math.floor(this.time / 60);
        this.currUser.weekly_stats.weekly_time_worked += +Math.floor(this.time / 60);
        this.m.userUpdate(this.currUser._id, this.currUser).subscribe(u => {this.currUser = u});
        this.router.navigate(['/update_project']);
        console.log("user object's stored total time worked: " + this.currUser.stats.total_time_worked)
        console.log("amount of seconds this session: " + this.time);
      }
    });
  }
}

