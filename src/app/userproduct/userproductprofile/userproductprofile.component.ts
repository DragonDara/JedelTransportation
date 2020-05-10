import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SharedDataService } from 'src/app/services/sharedData.service';
import { ProductService } from 'src/app/products/product.service';
import { FormArray, FormGroup, FormControl, FormControlName, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Product } from 'src/app/products/product.model';
import { IRespondedProduct } from 'src/app/products/products.component';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { element } from 'protractor';

@Component({
  selector: 'app-userproductprofile',
  templateUrl: './userproductprofile.component.html',
  styleUrls: ['./userproductprofile.component.css']
})
export class UserproductprofileComponent implements OnInit, OnDestroy {

  public editMode: boolean = false;
  public id: number;
  public isLoaded: boolean = false;
  public form: FormGroup;
  public isAccepted: boolean = false; 
  public isNoRespond: boolean = false;
  public acceptedUser:string; 
  public agent: any;
  public product: Product;


  constructor(
  private route: ActivatedRoute,
  private sharedDataService: SharedDataService,
  private productService: ProductService,
  private fb: FormBuilder,
  private chatService: ChatService
  ) { 
      this.id = +this.route.snapshot.params['id'];
      this.agent = JSON.parse(localStorage.getItem('userData'));
    }

  ngOnInit() {
    this.productService.getUserProduct(this.agent.email, this.id).subscribe(
      async (res) => {
        this.product = res[0];
        var userproducts =  await this.productService.getRespondedProductsPromise();
        var userproducts1 = userproducts.find(element =>{
          return  element.product.productid === this.id})
        if(userproducts1 === undefined) {
          this.isNoRespond = true;
        }
        var accepted_user = await this.productService.getAcceptedUserForProduct(this.id);
        console.log(accepted_user)
        if (accepted_user.length !== 0){
          this.isAccepted = true;
          this.acceptedUser = accepted_user[0].acceptedbyuser;
        }
        this.isLoaded = true;
        this.form = this.fb.group({
          "productid": this.product.productid,
          "productname": this.product.productname,
          "producttype": this.product.producttype,
          "cost": this.product.cost,
          "volume": this.product.volume,
          "weight": this.product.weight,
          "description": this.product.description,
          "accepted": this.fb.group({
            "id": userproducts1 === undefined ? this.fb.array(['no Respond']) : this.fb.array(userproducts1.respondeduserid),
            "email": userproducts1 === undefined ? this.fb.array(['no Respond']) : this.fb.array(userproducts1.respondedbyusers)
          })
        });
      },
      err => {
        console.log(err)
      },
      () => console.log("UserproductprofileComponent getUserProduct ngOnInit completed ")
    )
  
  }
  
  getAcceptedUsers() {
    return this.form.get('accepted') as FormArray;
  }
  onSubmit() { 
  }

  onAddAcceptedProduct(index) {
    const acceptedProduct = {
      acceptedbyuser: this.getAcceptedUsers().value.email[index],
      accepteduserid: this.getAcceptedUsers().value.id[index],
      productid: this.form.get('productid').value
    }

    this.productService.addAcceptedUserForProduct(acceptedProduct).subscribe(
      res => {
        const user = {
          id: this.agent.id,
          name: this.agent.email
        };
        const message = 'I am ready to deliver your product!' + acceptedProduct.productid;
        this.chatService.sendMessage(user,message, this.agent.id,acceptedProduct.accepteduserid);
      },
      err => {
        console.log(err)
      },
      () => {
        this.isAccepted = true;
        this.acceptedUser = acceptedProduct.acceptedbyuser;
        console.log("completed onAddAcceptedProduct")
      }
    )
  }
  ngOnDestroy() {
  }

}
