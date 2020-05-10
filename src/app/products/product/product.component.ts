import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { map, tap} from 'rxjs/operators'
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {

  imgURL: any;
  public message: string;
  public images:any[] = [];
  public files:any[] = [];
  private userSub: Subscription;

  public producttypes = [
    { name: "Document", value: 1},
    { name: "Box", value: 2},
    { name: "Food", value: 3}
  ]

  public currencies = [
    { name: "KZT", value: 1},
    { name: "USD", value: 2},
    { name: "EUR", value: 3}
  ]

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
  }

  async onSubmit(productForm: NgForm) {
    let product: Product = {
      productid: Math.floor(Math.random() * 1000) + 1,  
      productname: productForm.value.name,
      weight: productForm.value.weight,
      cost: productForm.value.cost,
      images:[],
      description: productForm.value.description,
      volume: productForm.value.volume,
      currency: productForm.value.currency.name,
      when: productForm.value.when,
      whereto: productForm.value.whereto,
      wherefrom: productForm.value.wherefrom,
      producttype: productForm.value.producttype.name,
      user: JSON.parse(localStorage.getItem('userData')).email,
      userid: JSON.parse(localStorage.getItem('userData')).id,
    }
    //TODO: make a normal, quality redirect after adding a product;
    await this.productService.saveProduct(product, this.files);
    this.router.navigate(['/products']);
  }
  preview(files): void {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    for (let i = 0; i < files.length; i++) {
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.images.push(event.target.result); 
      }
      this.files.push(files[i])
      reader.readAsDataURL(files[i]);
    }
  }

  ngOnDestroy(): void {
  }
}
