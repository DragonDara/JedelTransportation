import { Component, OnInit, OnDestroy, NgModule } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { AuthInterceptorService } from '../auth/auth-interceptor.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isAuthenticated : boolean = false;
  private userSub: Subscription;
  public username: string;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userSub = this.authService.user
      .subscribe(
        user => {
          this.isAuthenticated = !user ? false : true;
          if(this.isAuthenticated){
            this.username = user.email
          }
        }
      );
  }

  onLogout() {
    this.authService.logout();
    this.isAuthenticated = false;
  }

  onDeliverProduct(): void {
    this.router.navigate(['/product']);
  }
  onReceiveProduct(): void {
    this.router.navigate(['/products']);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
