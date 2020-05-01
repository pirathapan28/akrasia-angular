import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { DataModelManagerService } from '../data-model-manager.service';
import { User } from '../dataModelClasses';

@Component({
  selector: 'app-leaderboard-weekly',
  templateUrl: './leaderboard-weekly.component.html',
  styleUrls: ['./leaderboard-weekly.component.css']
})
export class LeaderboardWeeklyComponent implements OnInit {
  header : string;
  @Input() users : User[]
  @Input() which : number;
  @Input() end: string;

  constructor(private m: DataModelManagerService) {  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateTable();
  }

  ngOnInit() {
    this.updateTable();
  }

  updateTable() {
    this.header = headers[this.which];
    switch(this.which) {
      case 0:
        this.users.sort(function(a, b){return b.weekly_stats.weekly_projects_created-a.weekly_stats.weekly_projects_created});
        break;
      case 1:
        this.users.sort(function(a, b){return b.weekly_stats.weekly_projects_finished_early-a.weekly_stats.weekly_projects_finished_early});
        break;
      case 2:
        this.users.sort(function(a, b){return a.weekly_stats.weekly_projects_finished_late-b.weekly_stats.weekly_projects_finished_late});
        break;
      case 3:
        this.users.sort(function(a, b){return b.weekly_stats.weekly_time_worked-a.weekly_stats.weekly_time_worked});
        break;
      case 4:
        this.users.sort(function(a, b){return (b.weekly_stats.weekly_projects_finished_early / b.weekly_stats.weekly_projects_finished_late) - (a.weekly_stats.weekly_projects_finished_early / a.weekly_stats.weekly_projects_finished_late)});
        break;
      case 5:
        this.users.sort(function(a, b){return b.achieves-a.achieves});
        break;
      default:
        // code block
    }
  }
}

var headers = [
  "Highest Number of Created Projects",
  "Highest Number of Early Projects",
  "Lowest Number of Delayed Projects",
  "Total Time Worked",
  "Best Early to Delayed Project Ratio",
  "Most Achievements"
];