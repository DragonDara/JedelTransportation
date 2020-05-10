import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject, Subscription } from 'rxjs';
import { catchError, tap, map, finalize } from 'rxjs/operators';
import { User, UserInfo } from './user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { rejects } from 'assert';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';

export interface IAuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean
}

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {

    public user = new BehaviorSubject<User>(null);
    public userinfo = new BehaviorSubject<UserInfo>(null);
    private expirationTimerToken: any;
    public users: Observable<any[]>;
    private userFromProfileSub: Subscription;

    constructor (
        private http : HttpClient,
        private router: Router,
        private firestore: AngularFireDatabase,
        private storage: AngularFireStorage
        ) {
        
        }
    
    async signup(userinfo: any, password: string): Promise<any> {
          return await new Promise((resolve, reject) => {
            this.http.post<IAuthResponseData>(
              'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key= AIzaSyAjX_XIGDgSXLcS66f7L9nBDM9sTMQd2NM'
              , {
                  email: userinfo.email,
                  password: password,
                  returnSecureToken: true 
              })
              .pipe(
                  catchError(this.handleError),
                  tap(resData => {
                    this.handleAuthentication(
                      resData.email,
                      resData.localId,
                      resData.idToken,
                      +resData.expiresIn
                    );
                  })
                  )
              .subscribe(
                res => {
                  resolve(res);
                },
                err => {
                  console.log(err)
                }
              );
          })
            
    }

    userInfoToProfile(userInfo: UserInfo): Observable<Object> {
      return  this.http.post(
        `${environment.firebase.databaseURL}/profiles.json`,
        userInfo
      );
    }

    userInfoFromProfile(email: string):Promise<UserInfo> {
      // return  this.http.get(
      //   `${environment.firebase.databaseURL}/profiles.json`
      // )
      var user = this.firestore.list<UserInfo>('/profiles', ref => 
        ref.orderByChild('email').equalTo(email)
      ).valueChanges().pipe(
          tap(resData => {
            this.handleUserInfo(resData[0]);
          })
        );
      return new Promise((resolve, reject) => {
          user.subscribe(
            res => {
              resolve(res[0]);
            },
            err => { console.log(err)},
            () => {
              console.log("completed subscvribe inside");
            }
          )
      });
    }


    login(email: string, password: string): Promise<any> {
        return new Promise((resolve,reject) => {
          this.http.post<IAuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key= AIzaSyAjX_XIGDgSXLcS66f7L9nBDM9sTMQd2NM'
            , {
                email: email,
                password: password,
                returnSecureToken: true
            })
            .pipe(
                catchError(this.handleError),
                tap(resData => {
                    this.handleAuthentication(
                      resData.email,
                      resData.localId,
                      resData.idToken,
                      +resData.expiresIn
                    );
                  })
                )
            .subscribe(
              res => {
                resolve(res);
              },
              err => { reject(err)}
              ,() => { console.log("completed login subscribe inside promise")}
            );
              
          })
    }

    logout() {
      this.user.next(null); 
      this.router.navigate(['/auth']);
      localStorage.removeItem('userData');
      localStorage.removeItem('userInfo');
      if(this.expirationTimerToken){
        clearTimeout(this.expirationTimerToken);
      }
      this.expirationTimerToken = null;
    }

    autoLogout(expiratioDuration: number) {
      this.expirationTimerToken = setTimeout(() => {
        this.logout();
      }, expiratioDuration);
    }

    private handleUserInfo(userinfo: UserInfo) {
        const user = new UserInfo(userinfo.email, userinfo.surname, userinfo.name, userinfo.phone, userinfo.image, userinfo.id, userinfo.role);
        this.userinfo.next(user);
        localStorage.setItem('userInfo', JSON.stringify(user));
    }
    private handleAuthentication(
      email: string,
      userId: string,
      token: string,
      expiresIn: number
    ) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
      }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
          return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already';
            break;
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist.';
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'These email or password are not correct.';
            break;
        }
        return throwError(errorMessage);
    }

    autoLogin(){
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if(!userData){
        return;
      }
      const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
      
      if(loadedUser.token){
        this.user.next(loadedUser);
        const expiratioDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expiratioDuration);
      }
    }

    saveUserImage(userinfo){
      const filePath = `profiles/${userinfo.id}/${new Date().getTime()}/`;
      const ref = this.storage.ref(filePath);
      
      return new Promise<any>((resolve,reject) => {
        this.storage.upload(filePath, userinfo.image).snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(
              url => resolve(url),
              err => reject(err)
            )
          })
        ).subscribe()
      }) 

      }

    ngOnDestroy(){
      this.userFromProfileSub.unsubscribe();
    }
}