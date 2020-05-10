import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ProductService } from './products/product.service';
import { NotificationsService} from 'angular2-notifications'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'jedel-transportation';
  //public message;
  public countAccepted: number;
  public isAuthenticated : boolean = false;

  constructor(
    private authService: AuthService,
    //private messageService: MessageService
    private productService: ProductService,
    private notificationsService: NotificationsService 
      ){}

   ngOnInit() {
    this.authService.autoLogin();
    // this.messageService.requestPermission()
    // this.messageService.receiveMessage()
    // this.message = this.messageService.currentMessage
    // this.authService.user.subscribe(
    //   user => {
    //     this.isAuthenticated = !user ? false : true;
    //       if(this.isAuthenticated){
    //         this.productService.getAcceptedUserForProduct(JSON.parse(localStorage.getItem('userData')).email)
    //         .then(
    //           res => {
    //             let message:string = `You've got ${res.length} clients`;
    //             this.notificationsService.info('New clients', message, {
    //               position: ['bottom', 'right'],
    //               timeout: 3000,
    //               animate: 'fade',
    //               showProgressBar: true
    //             });
    //             this.countAccepted = res.length;
    //           }
    //         ).catch(
    //           err => {
    //             console.log(err)
    //           }
    //         );
           
    //       }
    //   }
    // )
   
  }
}
