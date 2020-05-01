import { Component, OnInit } from '@angular/core';
import {DataModelManagerService} from '../data-model-manager.service'
import { Project, User } from '../dataModelClasses';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-create-project-form',
  templateUrl: './create-project-form.component.html',
  styleUrls: ['./create-project-form.component.css']
})
export class CreateProjectFormComponent implements OnInit {
  project: Project = {
    extendedProperties: {
        shared: {
            akrasia: true,
            urgency_level: 1,
            importance_level: 1,
            percentage: 0.5,
            due_date: "",
            estimated_time: 0,
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

timePicker: string;

  constructor(private m: DataModelManagerService, private router: Router, private login: LoginService) {

  }

  ngOnInit() {
    this.currUser = this.m.user;
    this.timePicker = moment(this.m.getDateSelected()).format("HH:mm");
  }

  createProject(f: NgForm): void {
    //start time offset
    this.project.extendedProperties.shared.due_date = moment(this.m.getDateSelected()).hour(parseInt(this.timePicker.substr(0,2))).minute(parseInt(this.timePicker.substr(3, 2))).format();
    //start time
    this.project.start.dateTime = this.m.estimateDate(this.project.extendedProperties.shared.urgency_level, this.project.extendedProperties.shared.percentage);
    console.log("Start time: " + this.project.start.dateTime);
    //end time offset
    this.project.end.dateTime = moment(this.project.start.dateTime).add(1, 'minute').format();
    //estimated time
    this.project.extendedProperties.shared.estimated_time = this.m.estimateTime(this.project.extendedProperties.shared.urgency_level, this.project.extendedProperties.shared.percentage);
      console.log("Estimated Time: " + this.project.extendedProperties.shared.estimated_time);
    //reminders setting
    this.project.reminders.overrides = [{method: "email", minutes: this.project.extendedProperties.shared.estimated_time}, {method: "popup", minutes: this.project.extendedProperties.shared.estimated_time}];
    //updates number of projects user has created
    this.currUser.stats.num_projects_created += +1;
    this.currUser.weekly_stats.weekly_projects_created += +1;
    this.m.userUpdate(this.currUser._id, this.currUser).subscribe(u => {this.currUser = u});
    
    //send the event to google
    this.login.createProject(this.project).subscribe((proj) => {
      if (proj) {
        //go back to calendar page
        this.router.navigate(['/calendar']);
      }
    });
  }

  testTime(){
    console.log( this.m.estimateDate(this.project.extendedProperties.shared.urgency_level, this.project.extendedProperties.shared.percentage));
  }

}