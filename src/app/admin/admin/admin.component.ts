import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/products/product.service';
import { Subscription, combineLatest } from 'rxjs';
import { timingSafeEqual } from 'crypto';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  private userid: string;
  public temp_products:{}[];
  public products:any[] = [];
  constructor(
    private productService: ProductService,
    private router: Router
  ) { 
    this.userid = JSON.parse(localStorage.getItem('userData')).id;
    
  }

  ngOnInit() {
    combineLatest([this.productService.getProducts(), this.productService.getRespondedProductsSnap()]).subscribe(
      ([products, respondedproducts]) => {
        console.log(products, respondedproducts)
        this.products = [];
        products.forEach((element:any) => {
          const productid = element.payload.doc.data().productid;
          var product: any = {
                productid: productid,
                name: element.payload.doc.data().productname,
                when: element.payload.doc.data().when,
                destination: element.payload.doc.data().destination,
                whereto: element.payload.doc.data().whereto,
                cost: element.payload.doc.data().cost,
                currency: element.payload.doc.data().currency,
                status: 0,
                userid: element.payload.doc.data().userid,
                docid: element.payload.doc.id,
                responddocid: ''
              }
          respondedproducts.find((element1:any) => {
            console.log(productid,element1.payload.doc.data().product.productid)
            if(productid === element1.payload.doc.data().product.productid){
              product.status = 1;
            }
          });
          this.products.push(product);
        })
      }
    )
  }

  onDeleteProduct(product,index): void{
    this.productService.deleteUserProduct(product.productid,product.docid, product.responddocid);
    this.products = [];
  }

  ngOnDestroy(): void {
  }

}
