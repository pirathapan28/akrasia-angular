import { Component, OnInit, Inject } from '@angular/core';
import { DataModelManagerService } from '../data-model-manager.service';
import { Router } from '@angular/router';
import { User, Project } from '../dataModelClasses';
import { LoginService } from '../login.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../update-project-form/update-project-form.component';

@Component({
  selector: 'app-delete-project-form',
  templateUrl: './delete-project-form.component.html',
  styleUrls: ['./delete-project-form.component.css']
})
export class DeleteProjectFormComponent implements OnInit {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private m: DataModelManagerService, private login: LoginService, 
    private router: Router, public dialogRef: MatDialogRef<DeleteProjectFormComponent>) { }

  ngOnInit() { }

  yes() {
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
