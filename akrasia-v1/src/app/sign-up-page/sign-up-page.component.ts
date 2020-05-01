import { Component, OnInit } from '@angular/core';
import { DataModelManagerService } from '../data-model-manager.service';
import { Router } from '@angular/router';
import { User } from '../dataModelClasses';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.css']
})

export class SignUpPageComponent implements OnInit {
  user: UserForm = {first_name: '', last_name:'', email: '', username: ''};
  constructor(private m: DataModelManagerService, private router: Router) { }

  ngOnInit() {
    
  }

  onSubmit() {
    console.log(this.user);
    //this.m.userAdd(this.user).subscribe(u => console.log(u));
  }

}

class UserForm {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}
