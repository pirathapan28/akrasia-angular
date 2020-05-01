import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DataModelManagerService } from '../data-model-manager.service';
import { User } from '../dataModelClasses';

@Component({
  selector: 'app-leaderboard-table',
  templateUrl: './leaderboard-table.component.html',
  styleUrls: ['./leaderboard-table.component.css']
})
export class LeaderboardTableComponent implements OnInit {
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
        this.users.sort(function(a, b){return b.stats.num_projects_created-a.stats.num_projects_created});
        break;
      case 1:
        this.users.sort(function(a, b){return b.stats.num_projects_finished_early-a.stats.num_projects_finished_early});
        break;
      case 2:
        this.users.sort(function(a, b){return a.stats.num_projects_finished_late-b.stats.num_projects_finished_late});
        break;
      case 3:
        this.users.sort(function(a, b){return b.stats.total_time_worked-a.stats.total_time_worked});
        break;
      case 4:
        this.users.sort(function(a, b){return (b.stats.num_projects_finished_early / b.stats.num_projects_finished_late) - (a.stats.num_projects_finished_early / a.stats.num_projects_finished_late)});
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