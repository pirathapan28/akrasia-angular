import { Component, OnInit } from '@angular/core';
import { User } from '../dataModelClasses';
import { DataModelManagerService } from '../data-model-manager.service';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { SaveAlertComponent } from './save-alert/save-alert.component'
import { AuthService } from 'angularx-social-login';


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  checkId: boolean = true;
  user: User;
  response: string;
  picURL: string;
  errorMsg = "";
  contentLoaded = false;
  
  constructor(private m: DataModelManagerService, private auth: AuthService,private router: Router, private login: LoginService, public dialog: MatDialog) {
    
  }

  ngOnInit() {
    if (this.login.isLogged) {
      this.loadUser();
    }
    else {
      this.router.navigate(["/home"]);
    }
  }

  loadUser() {
    this.user = this.login.getUser();
    if (this.user) {
      this.contentLoaded = true;
      this.picURL = this.login.getUserPic();
    }
    else {
      this.login.detectUser();
    }
  }

  
  deleteQuestion() {
    // this.router.navigate(['/delete_project']);
    var del = confirm("Are you sure you want to delete your account?\n");
    if (del == true){
      this.m.userDelete().subscribe();
      this.m.setId("delete");
      this.m.setUser(null);
      
      this.login.deleteAllProjects();
      //this.login.deleteUser();
      this.auth.signOut();
      this.login.isLogged = false;
      this.router.navigate(["/about"]);
    }
    else {
      //this.router.navigate(['/']);
      console.log("Account deletion cancelled");
    }
  }

  showPic(){

  }

  onSubmit() {
    console.log('success');
    //alert('Profile settings saved!')
    this.dialog.open(SaveAlertComponent, {
      width: '500px',
      height: '125px'
    })
    this.m.userUpdate(this.m.getId(), this.m.user).subscribe(u => this.response = u);
    console.log("first day: " + this.m.user.settings.day_off1)

  }
}
