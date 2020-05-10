import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { UserInfo } from '../auth/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public userid: string;
  public userdata: any;
  public email:string;
  private userinfoSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { 
    this.userid = this.route.snapshot.params['id'];
    this.email = this.route.snapshot.params['email'];
    
  }

  ngOnInit(): void {
    this.authService.userInfoFromProfile(this.email).then(
      res => {
        console.log(res)
        this.userdata = res;
      }
    ).catch(err => console.log(err))
  }

}
