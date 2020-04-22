import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService, IAuthResponseData } from './auth.service';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { flatMap } from 'rxjs/operators';
import { User, UserInfo } from './user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  @ViewChild('authForm') authForm: NgForm;
  public isLoginMode: boolean = true;
  private authSub: Subscription;
  public isLoading : boolean = false;
  public error: string = null;
  public message: string;
  base64: any = null;

  private userInfo: User;

  constructor(
    private authService: AuthService ,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(authForm: NgForm) : void {
    this.authService.userInfoFromProfile(authForm.value.email);
    if(!authForm.valid){
      return;
    }

    const email = authForm.value.email;
    const password = authForm.value.password;
    const name = authForm.value.name;
    const surname = authForm.value.surname;
    const phone = authForm.value.phone;

    this.isLoading = true;

    const userinfo = {
      email: email,
      name: name,
      surname: surname,
      phone: phone
    }
    
    if(this.isLoginMode){
      this.authService.login(email, password);
    }
    else{
      this.authService.signup(userinfo, password).then( success => {
        const userinfo: UserInfo = {
          email: success.email,
          surname: surname,
          name: name,
          phone: phone,
          image: this.base64,
          id: success.id
        }
        this.authService.userInfoToProfile(userinfo)
          .subscribe(
            res => {
              
            },
            err =>{
              console.log(err);
            },
            () =>{
              console.log("auth component userinftoprofile completed");
              this.isLoading = false;
              this.router.navigate(['/auth']);
            }
          );
      })
      .catch(err =>{
        console.log(err);
      });
    }

    authForm.reset();
  }

  onSwitchMode() : void {
    this.isLoginMode = !this.isLoginMode;
    this.authForm.reset();
  }

  preview(files): void {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.base64 = reader.result; 
    }
  }
}
