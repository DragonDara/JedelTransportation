import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from './product.service';
import { Subscription } from 'rxjs';
import { Product } from './product.model';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})

export class ProductsComponent implements OnInit, OnDestroy {

  public products: any;
  private productsSub: Subscription;

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productsSub = this.productService.getProducts()
      .subscribe(
        (res: any) => {
          this.products = Object.keys(res).map((product) => { 
            return res[product] 
          });
        },
        err => {
          console.log(err)
        },
        () => {
        }
      );
  }

  onRespondProduct(product: Product[]) {
    console.log(product);
  }

  ngOnDestroy(): void {
    this.productsSub.unsubscribe();
  }

}
