import { Component, OnInit } from '@angular/core';
import { DataModelManagerService } from '../data-model-manager.service';
import { User } from '../dataModelClasses';

@Component({
  selector: 'app-leaderboard-page',
  templateUrl: './leaderboard-page.component.html',
  styleUrls: ['./leaderboard-page.component.css']
})
export class LeaderboardPageComponent implements OnInit {

  private userList: User[];
  private index: number = 0;
  contentLoaded = false;
  errorMsg = "";
  allTime: boolean;
  viewName: String;
  constructor(private m: DataModelManagerService) {
  }

  ngOnInit() {
    if (!this.m.isGoogleSignedIn) {
      setTimeout(() => {if (!this.contentLoaded) this.errorMsg = "Please Refresh or Try Again Later...";}, 10500);
    setTimeout(() => {
        for (var i = 500; i <= 10000; i += 500) {
          setTimeout(() => {
            if (this.userList.length > 0) {
              this.contentLoaded = true;
            }
          }, i);
        }
    }, 500);
    }
    else {
      this.contentLoaded = true;
    }
    this.m.userGetAll().subscribe(users => {this.userList = users;});
    this.allTime = true;
    this.viewName = "View Weekly Stats";
  }

  selectBoard(idx: number) {
    this.index = idx;
  }

  changeView(){
    if (this.allTime == true) {
      this.allTime = false;
      this.viewName = "View All Time Stats";
    }
    else if (this.allTime == false) {
      this.allTime = true;
      this.viewName = "View Weekly Stats";
    }
  }



}
