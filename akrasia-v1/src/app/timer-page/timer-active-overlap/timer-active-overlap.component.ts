import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-timer-active-overlap',
  templateUrl: './timer-active-overlap.component.html',
  styleUrls: ['./timer-active-overlap.component.css']
})
export class TimerActiveOverlapComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TimerActiveOverlapComponent>) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
