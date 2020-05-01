import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-achievement-banner',
  templateUrl: './achievement-banner.component.html',
  styleUrls: ['./achievement-banner.component.css']
})
export class AchievementBannerComponent implements OnInit {

  @Input() achievement: Achievement;
  isComplete: boolean = false;
  percentage: number = 0;
  constructor() {
  }

  ngOnInit() {
    if (this.achievement.status >= this.achievement.outOf) {
      this.achievement.status = this.achievement.outOf;
      this.isComplete = true;
    }
  }
}

class Achievement {
  title: string;
  desc: string;
  status: number;
  outOf: number;
}
