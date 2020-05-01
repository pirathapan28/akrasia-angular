import { Component, OnInit } from '@angular/core';
import { DataModelManagerService } from '../data-model-manager.service';
import { User } from '../dataModelClasses';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-achievement-page',
  templateUrl: './achievement-page.component.html',
  styleUrls: ['./achievement-page.component.css']
})
export class AchievementPageComponent implements OnInit {

  private user: User;
  private achieveSetup: Achievement[];
  contentLoaded = false;
  errorMsg = "";
  constructor(private m: DataModelManagerService, private router: Router, private login: LoginService) {
    
  }

  ngOnInit() {
    if (this.login.isLogged) {
      this.loadDisplay();
    }
    else {
      this.router.navigate(["/home"]);
    }
    /*
    if (this.m.eventsUpdated) {
    var time = 300;
    this.m.eventsUpdated = false;
    setTimeout(() => {
      this.m.getAllEvents();
    }, 500);
  }
  
  
  setTimeout(()=> {
    this.m.userGetByEmail(this.m.getGoogleEmail()).subscribe(u => { 
      this.user = u;
      this.m.user = this.user;
      this.achieveSetup = [
        {img: "../assets/Create_First_Project.png", title: "Create 1 Project", desc:"Create your first project!", status: this.user.stats.num_projects_created, outOf:1},
        {img: "../assets/Create_Tenth_Project.png", title: "Create 10 Projects", desc:"You're on your way!", status: this.user.stats.num_projects_created, outOf:10},
        {img: "../assets/Create_20th_Project.png", title: "Create 20 Projects", desc:"Keep it going!", status: this.user.stats.num_projects_created, outOf:20},
        {img: "../assets/Create_50th_Project.png", title: "Create 50 Projects", desc:"You're an akrasia expert!", status: this.user.stats.num_projects_created, outOf:50},
        {img: "../assets/Bronze_Medallion.png", title: "Finish 1 Project", desc:"A good start!", status: this.user.stats.num_projects_finished_early + this.user.stats.num_projects_finished_late, outOf:1},
        {img: "../assets/Silver_Medallion.png", title: "Finish 5 Projects", desc:"Amazing! Keep it up!", status: this.user.stats.num_projects_finished_early + this.user.stats.num_projects_finished_late, outOf:5},
        {img: "../assets/Gold_Medallion.png", title: "Finish 10 Projects", desc:"Keep going, you got this!", status: this.user.stats.num_projects_finished_early + this.user.stats.num_projects_finished_late, outOf:10},
        {img: "../assets/Platinum_Medallion.png", title: "Finish 25 Projects", desc:"Congratulations!", status: this.user.stats.num_projects_finished_early + this.user.stats.num_projects_finished_late, outOf:25}
      ];
      //console.log(this.user);
      //console.log(this.m.user);
    });
  }, 500 + time);
    
    console.log(this.user);*/
  }

  syncGoogle() {
    if (this.m.isGoogleSignedIn && !this.contentLoaded) {
      this.m.getAllEvents();
      setTimeout(() => {this.loadDisplay();}, 500);
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
        setTimeout(()=> {this.loadDisplay()}, 300);
      }
    }

    loadDisplay() {
      this.contentLoaded = true;
      this.m.userGetByEmail(this.login.getUser().email).subscribe(u => {
        this.m.user = u;
        this.user = u;
        this.achieveSetup = [
          {img: "../assets/Create_First_Project.png", title: "Create 1 Project", desc:"Create your first project!", status: this.user.stats.num_projects_created, outOf:1},
          {img: "../assets/Create_Tenth_Project.png", title: "Create 10 Projects", desc:"You're on your way!", status: this.user.stats.num_projects_created, outOf:10},
          {img: "../assets/Create_20th_Project.png", title: "Create 20 Projects", desc:"Keep it going!", status: this.user.stats.num_projects_created, outOf:20},
          {img: "../assets/Create_50th_Project.png", title: "Create 50 Projects", desc:"You're an akrasia expert!", status: this.user.stats.num_projects_created, outOf:50},
          {img: "../assets/Bronze_Medallion.png", title: "Finish 1 Project", desc:"A good start!", status: this.user.stats.num_projects_finished_early + this.user.stats.num_projects_finished_late, outOf:1},
          {img: "../assets/Silver_Medallion.png", title: "Finish 5 Projects", desc:"Amazing! Keep it up!", status: this.user.stats.num_projects_finished_early + this.user.stats.num_projects_finished_late, outOf:5},
          {img: "../assets/Gold_Medallion.png", title: "Finish 10 Projects", desc:"Keep going, you got this!", status: this.user.stats.num_projects_finished_early + this.user.stats.num_projects_finished_late, outOf:10},
          {img: "../assets/Platinum_Medallion.png", title: "Finish 25 Projects", desc:"Congratulations!", status: this.user.stats.num_projects_finished_early + this.user.stats.num_projects_finished_late, outOf:25},
          {img: "../assets/Diamond_Medallion2.png", title: "Finish 50 Projects", desc:"Hollywood Status!", status: this.user.stats.num_projects_finished_early + this.user.stats.num_projects_finished_late, outOf:50},
          {img: "../assets/Diamond_Medallion2.png", title: "Finish 100 Projects", desc:"Almost there to unlock", status: this.user.stats.num_projects_finished_early + this.user.stats.num_projects_finished_late, outOf:100},
          {img: "../assets/Bronze_Medallion.png", title: "Finished 1 Early Project", desc:"Finished your first early project!", status: this.user.stats.num_projects_finished_early, outOf:1},
          {img: "../assets/Silver_Medallion.png", title: "Finished 5 Early Project", desc:"Keep at it!", status: this.user.stats.num_projects_finished_early, outOf:5},
          {img: "../assets/Gold_Medallion.png", title: "Finished 10 Early Project", desc:"Good job!", status: this.user.stats.num_projects_finished_early, outOf:10},
          {img: "../assets/Platinum_Medallion.png", title: "Finished 25 Early Project", desc:"Amazing!", status: this.user.stats.num_projects_finished_early, outOf:25},
          {img: "../assets/badge.png", title: "Finished 50 Early Project", desc:"Hollywood Status!", status: this.user.stats.num_projects_finished_early, outOf:50},
          {img: "../assets/badge.png", title: "Finished 100 Early Project", desc:"Almost there to unlock", status: this.user.stats.num_projects_finished_early, outOf:100}
          
        ];
      })
    }


}

class Achievement {
  img: string;
  title: string;
  desc: string;
  status: number;
  outOf: number;
}
