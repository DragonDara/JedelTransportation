import { OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.model';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({providedIn:'root'})
export class ProductService implements OnInit{

    constructor(
        private http: HttpClient,
    ) {

    }

    ngOnInit(): void{

    }

    saveProduct(product: Product){
        return this.http.post(
            'https://ng-complete-guide-8c51b.firebaseio.com/products.json',
            product,
            );
    }

    getProducts()  {
        return this.http.get(
            'https://ng-complete-guide-8c51b.firebaseio.com/products.json'
        );
        //return this.firestore.collection("products").snapshotChanges();
    }
}