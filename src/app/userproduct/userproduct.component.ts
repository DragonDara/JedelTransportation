import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { element } from 'protractor';
import { Product } from '../products/product.model';
import { ProductService } from '../products/product.service';
import { SharedDataService } from '../services/sharedData.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userproduct',
  templateUrl: './userproduct.component.html',
  styleUrls: ['./userproduct.component.css']
})
export class UserproductComponent implements OnInit, OnDestroy {


  private userProductsSub: Subscription;
  private respondedProductsSub: Subscription;
  public userproducts: Product[];
  public respondedCount:number;
  private productid:number[] = [];
  constructor(
    private productService: ProductService,
    private sharedDataService: SharedDataService,
    private router: Router
  ) { 


    this.userProductsSub = this.productService.getUserProducts(JSON.parse(localStorage.getItem('userData')).email)
    .subscribe(
      res=>{
        this.userproducts = res;
        this.userproducts.forEach(element => {
          this.productid.push(element.productid);
        });
      },
      err => {
        console.log(err)
      },
      () => {
        console.log("completed");
      }
    );

    
  }

  //TODO rewrite the logic code to more readable and optimized( P.S. get responed products by user product id)
  //TODO not getRespondedProducts, it must to be getProductsbyUsers
  ngOnInit(): void {
    this.respondedProductsSub = this.productService.getRespondedProducts().subscribe(
      res => {
        var test = []
        var productsresponded = Object.keys(res).map((product) => { 
          console.log(res)
          return res[product]
        });
        for (let index = 0; index < this.productid.length; index++) {
          const element = this.productid[index];
          productsresponded.findIndex(product => {
            if(product.product.productid === element){
              test.push(product);
            }
          })
          this.userproducts[index].respondedcount = test.length;
          test = [];
        }
      },
      err => {
        console.log(err)
      },
      () => {
        console.log("completed getRespondedProductByUser");
      }
    )

   
  }

  onUserProductProfile(product:Product){
    //TODO pass data from userproduct component to userproductprofile
    // this.sharedDataService.doClick();
    // this.sharedDataService.onClick.subscribe(
    //   cnt => cnt = product
    // );
    // this.router.navigate(['userproduct/profile']);
  }

  ngOnDestroy(): void {
    this.userProductsSub.unsubscribe();
    this.respondedProductsSub.unsubscribe();
  }

}
