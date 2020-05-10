import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ProductService } from './product.service';
import { Subscription, throwError, Observable, Subject } from 'rxjs';
import {concatMap} from 'rxjs/operators'
import { Product } from './product.model';
import { AuthService } from '../auth/auth.service';
import { SearchService } from '../services/search.service';
import { NgForm } from '@angular/forms';

export interface IRespondedProduct {
  unique: string
  product: Product,
  respondedbyusers:string[],
  respondeduserid:string[]
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})

export class ProductsComponent implements OnInit, OnDestroy {

  @ViewChild('searchbydestination') searchbydestinationRef: ElementRef;
  @ViewChild('searchbydate') searchbydateRef: ElementRef;
  @ViewChild('searchbydepature') searchbyuserRef: ElementRef;

  public products: any;
  private productsSub: Subscription;
  private filterForm: NgForm;
  public respondedProductAdded: boolean = false;
  public searchTermByDeparture$ = new Subject<string>();
  public searchTermByDestination$ = new Subject<string>();
  public searchTermByDate$ = new Subject<Date>();


  constructor(
    private productService: ProductService,
    private searchService: SearchService
  ) {
    // this.searchTermByDeparture$.subscribe(inputData => {
    //   // this.searchbydateRef.nativeElement.value = '';
    //   // this.searchbydestinationRef.nativeElement.value = '';
    // }, err => console.log(err));
    // this.searchTermByDate$.subscribe(inputData => {
    //   // this.searchbyuserRef.nativeElement.value = '';
    //   // this.searchbydestinationRef.nativeElement.value = '';
    // }, err => console.log(err));
    // this.searchTermByDestination$.subscribe(inputData => {
    //   // this.searchbydateRef.nativeElement.value = '';
    //   // this.searchbyuserRef.nativeElement.value = '';
    // }, err => console.log(err));
    // this.searchService.searchByDeparture(this.searchTermByDeparture$).subscribe(results => {
    //     this.products = results
    // });
    // this.searchService.searchByDestination(this.searchTermByDestination$).subscribe(results => {
    //   this.products = results
    // },() => console.log("destination completed"));
    // this.searchService.searchByDate(this.searchTermByDate$).subscribe( results => {
    //   this.products = results
    // })
  }

  ngOnInit(): void {
    this.productsSub = this.productService.getProducts()
      .subscribe(
        (res: any) => {
          this.products = res;
        },
        err => {
          console.log(err)
        },
        () => {
          console.log("complete ngOnInit ProductsComponent")
        }
      );
    
  }

  onRespondProduct(product) {
    let acceptedbyuser_array = [];
    let accepteduserid_array = [];
    acceptedbyuser_array.push(JSON.parse(localStorage.getItem('userData')).email);
    accepteduserid_array.push(JSON.parse(localStorage.getItem('userData')).id);
    const productToRespond: any = {
      product: product.payload.doc.data(),
      respondedbyusers: acceptedbyuser_array,
      respondeduserid: accepteduserid_array
    }
    this.productService.getRespondProduct(productToRespond.product.productid).then(
      res => {
        res = res.find(element => {return element.product.productid == productToRespond.product.productid});
        console.log(res)
        if(res === undefined){
          // respondedObs = this.productService.addRespondProduct(productToRespond).subscribe();
          this.productService.addRespondProduct(productToRespond).then(res => console.log(res)).catch(err => console.log(err));
          console.log("product hasn't been responded yet")
        }else
        {
          for (let index = 0; index < res.respondedbyusers.length; index++) {
            const user = res.respondedbyusers[index];
            if(user === JSON.parse(localStorage.getItem('userData')).email){
              return throwError('error'); // TODO exit a method and return error to html component
            }
          }
          res.respondedbyusers.push(JSON.parse(localStorage.getItem('userData')).email);
          res.respondeduserid.push(JSON.parse(localStorage.getItem('userData')).id);
          //respondedObs = 
          this.productService.updateRespondeProudct(res[0]);
          console.log("product has been responded ")
        }
      }
    );
    this.respondedProductAdded = true;

    setInterval(()=>{
            this.respondedProductAdded = false;
    }, 3000);

  }

  onFilterProducts(filter: NgForm){
    this.filterForm = filter;
    this.searchService.searchByMultipleProperties(filter).subscribe(
      (products:any) => {
        this.products = products;
        // products.forEach(element => {
        //   console.log(element.payload.doc.data())
        // });
      },
      err => {
        console.log(err)
      }
    );
  }
  onClear(){
    console.log("clear")
    this.productService.getProducts()
      .subscribe(
        (res: any) => {
          this.products = res;  
          this.filterForm.reset()
        },
        err => {
          console.log(err)
        },
        () => {
          console.log("complete ngOnInit ProductsComponent")
        }
      );
  }
  ngOnDestroy(): void {
    this.productsSub.unsubscribe();
  }

}
