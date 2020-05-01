import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { DataModelManagerService } from '../data-model-manager.service';
import { Router } from '@angular/router';
class Login {
  id: string;
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(private m: DataModelManagerService, private router: Router) { }

  userLogin: Login;

  ngOnInit() {
    this.userLogin = {
      id: ""
    }
  }

  onSubmit() {
    console.log('success');
    this.m.setId(null);
    this.m.userGetById(this.userLogin.id).subscribe(u => this.m.setUser(u));
    this.router.navigate(['/profile']);
  }

}
