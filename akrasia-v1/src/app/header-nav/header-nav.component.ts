import { Component, OnInit } from '@angular/core';
import {DataModelManagerService} from '../data-model-manager.service';
import { Router } from '@angular/router';
import { AuthService, SocialUser, GoogleLoginProvider } from 'angularx-social-login';
import { UserForm, Stats, UserSettings } from '../dataModelClasses';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.css']
})
export class HeaderNavComponent implements OnInit {
  private user: SocialUser
  
  constructor(private router: Router, private auth: AuthService, private login: LoginService) { }

  ngOnInit() {
    this.router.navigate(["/about"]);
    this.login.detectUser();
  }

  signIn() {
    this.auth.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut() {
    this.auth.signOut();
    this.login.isLogged = false;
    this.router.navigate(["/about"]);
  }

}
