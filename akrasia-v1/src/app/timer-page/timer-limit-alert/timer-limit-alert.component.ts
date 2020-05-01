import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-timer-limit-alert',
  templateUrl: './timer-limit-alert.component.html',
  styleUrls: ['./timer-limit-alert.component.css']
})
export class TimerLimitAlertComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TimerLimitAlertComponent>) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
