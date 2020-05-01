import { Component, OnInit } from '@angular/core';
import {DataModelManagerService} from '../data-model-manager.service'
import { User, Project } from '../dataModelClasses';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { DeleteProjectFormComponent } from '../delete-project-form/delete-project-form.component';
import { FinishProjectFormComponent } from '../finish-project-form/finish-project-form.component';
import { LoginService } from '../login.service';
import { MatDialog } from '@angular/material/dialog';

export interface DialogData{
  tempProject: Project;
  tempUser: User;
}

@Component({
  selector: 'app-update-project-form',
  templateUrl: './update-project-form.component.html',
  styleUrls: ['./update-project-form.component.css']
})
export class UpdateProjectFormComponent implements OnInit {
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


time = {hour: 0, minute: 0};
actual_due_date: string;
false_due_date: string;
disableFinish: boolean;
stopUpdate: boolean;

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

  ngOnInit() {
    this.stopUpdate = false;
    console.log(this.m.getProjectSelectedId());
    this.login.projectGetOne(this.m.getProjectSelectedId()).subscribe((res) => {
      if (res) {
        this.project = res;
        this.currUser = this.m.user;
        console.log(this.project);
        console.log("color: " + this.project.colorId);
        this.actual_due_date = moment(this.project.extendedProperties.shared.due_date).format('MMMM Do YYYY, h:mm a');
        this.false_due_date = moment(this.project.start.dateTime).format('MMMM Do YYYY, h:mm a');

        if(this.project.extendedProperties.shared.time_worked < (this.project.extendedProperties.shared.estimated_time * 0.5)){
          this.disableFinish = true;
        }
        else{
          this.disableFinish = false;
        }
        console.log("Estimated time in minutes: "+ this.project.extendedProperties.shared.estimated_time);
        console.log("Time worked in minutes: " + this.project.extendedProperties.shared.time_worked);
      }
    });
    
  }

  onDelete() {
    this.stopUpdate = true;
    const dialogRef = this.dialog.open(DeleteProjectFormComponent, {
      width: '500px',
      height: '200px'
    });
  }

  onFinish(){
    this.stopUpdate = true;
    const dialogRef = this.dialog.open(FinishProjectFormComponent, {
      width: '500px',
      height: '200px', 
      data: {tempProject: this.project}
    });
  }

  updateProject(f: NgForm): void {
    //send the event to google
    if(this.stopUpdate){
      this.stopUpdate = false;
    }
    else {
      this.login.updateProject(this.m.getProjectSelectedId(), this.project).subscribe((res) => {
        if (res) {
          //go back to calendar page
          this.router.navigate(['/calendar']);
        }
      });
    }
  }

  //converts minutes to HH:MM
  minToHours = function(num){
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return ((rhours < 10) ? '0' + rhours : rhours) + ':' + 
            ((rminutes < 10) ? '0' + rminutes : rminutes);
  }

  //converts seconds to HH:MM format
  toHHMM = function (time) {
    var hours   = Math.floor(time / 3600);
    var minutes = Math.floor((time - (hours * 3600)) / 60);
    var seconds = time - (hours * 3600) - (minutes * 60);
    
    return ((hours < 10) ? '0' + hours : hours) + ':' + 
            ((minutes < 10) ? '0' + minutes : minutes);
  }
}
