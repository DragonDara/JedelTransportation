import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, UserInfo } from './user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { rejects } from 'assert';
import { AngularFireDatabase } from '@angular/fire/database';

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
export class AuthService {

    public user = new BehaviorSubject<User>(null);
    private expirationTimerToken: any;
    public users: Observable<any[]>;

    constructor (
        private http : HttpClient,
        private router: Router,
        private firestore: AngularFireDatabase
        ) {
        
        }
    
    signup(userinfo: any, password: string): Promise<any> {
          return new Promise((resolve, reject) => {
            this.http.post<IAuthResponseData>(
              'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key= AIzaSyAjX_XIGDgSXLcS66f7L9nBDM9sTMQd2NM'
              , {
                  email: userinfo.email,
                  password: password,
                  returnSecureToken: true 
              })
              .pipe(
                  catchError(this.handleError),
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
      )
    }

    userInfoFromProfile(email: string) {
      // return  this.http.get(
      //   `${environment.firebase.databaseURL}/profiles.json`
      // )
      this.users = this.firestore.list('items').valueChanges();
    }


    login(email: string, password: string): Observable<IAuthResponseData> {
        return this.http.post<IAuthResponseData>(
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
                );
    }

    logout() {
      this.user.next(null); 
      this.router.navigate(['/auth']);
      localStorage.removeItem('userData');
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

}