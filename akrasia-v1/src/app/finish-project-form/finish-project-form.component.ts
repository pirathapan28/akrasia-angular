import { Component, OnInit, Input, Inject } from '@angular/core';
import { DataModelManagerService } from '../data-model-manager.service';
import { Router } from '@angular/router';
import { User, Project } from '../dataModelClasses';
import { LoginService } from '../login.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../update-project-form/update-project-form.component';

@Component({
  selector: 'app-finish-project-form',
  templateUrl: './finish-project-form.component.html',
  styleUrls: ['./finish-project-form.component.css']
})
export class FinishProjectFormComponent{

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private m: DataModelManagerService, private router: Router, 
    private login: LoginService, public dialogRef: MatDialogRef<FinishProjectFormComponent>) { }

  ngOnInit() {
    console.log("start")
    this.login.projectGetOne(this.m.getProjectSelectedId()).subscribe((res) => {
      this.project = res;
      this.currUser = this.m.user;
    });
  }

  yes() {
    if(this.data.tempProject.extendedProperties.shared.time_worked < this.data.tempProject.extendedProperties.shared.estimated_time){
      this.currUser.stats.num_projects_finished_early += +1;
      this.currUser.weekly_stats.weekly_projects_finished_early += +1;
    }
    else{
      this.currUser.stats.num_projects_finished_late += +1;
      this.currUser.weekly_stats.weekly_projects_finished_late += +1;
    }
    this.m.userUpdate(this.currUser._id, this.currUser).subscribe(u => {this.currUser = u});
    this.login.deleteProject(this.m.getProjectSelectedId()).subscribe(() => {
      //go back to calendar page
      this.router.navigate(['/calendar']);
      this.m.setProjectSelectedId("");
    });
    this.dialogRef.close();
  }

  no() {
    this.dialogRef.close();
  }

}
