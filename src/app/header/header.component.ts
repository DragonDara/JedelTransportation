import { Component, OnInit, OnDestroy, NgModule, Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { AuthInterceptorService } from '../auth/auth-interceptor.service';
import { Role } from '../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isAuthenticated : boolean = false;
  private userSub: Subscription;
  private userInfoSub: Subscription;
  public username: string;
  private userid: string;
  public isAdmin: boolean = false;

  @Input() countAccepted: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    
  ) { }

  ngOnInit(): void {
    this.userSub = this.authService.user
      .subscribe(
        (user) => {
          this.isAdmin = false;
          this.isAuthenticated = !user ? false : true;
          if(this.isAuthenticated){
            this.username = user.email
            this.userid = user.id
            this.isAdminFunc(this.username);
          }
        },
        err => {
          console.log(err)
        },
        () => console.log("completed ngonit header component")
      );
  }

  private async isAdminFunc(username){
    var userinfo = await this.authService.userInfoFromProfile(username);
    if(userinfo.role == Role.Admin){
      this.isAdmin = true;
    }
  }
  onLogout() {
    this.authService.logout();
    this.isAuthenticated = false;
  }

  onMyProfile(): void {
    this.router.navigate(['/', this.userid,'user', this.username]).then(res => console.log(res), err => console.log(err));
  }

  onDeliverProduct(): void {
    this.router.navigate(['/products']);
  }
  onReceiveProduct(): void {
    this.router.navigate(['/product']);
  }
  onUserProduct(): void {
    this.router.navigate(['/userproduct']);
  }

  onMessages(): void {
    this.router.navigate(['/messages']).then(res=> {
    }).catch(err => {
      console.log(err)
    })
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
