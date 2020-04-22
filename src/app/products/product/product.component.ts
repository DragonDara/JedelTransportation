import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {

  imgURL: any;
  public message: string;
  public images: any[] = [];
  private userSub: Subscription;

  public producttypes = [
    { name: "Document", value: 1},
    { name: "Box", value: 2},
    { name: "Food", value: 3}
  ]

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userSub = this.authService.user
      .subscribe(
        (user) => {
          console.log(user);
          
        }
      );
  }

  onSubmit(productForm: NgForm) : void {
    const product: Product = {
      productid: Math.floor(Math.random() * 100) + 1,  
      productname: productForm.value.name,
      weight: productForm.value.weight,
      cost: productForm.value.cost,
      description: productForm.value.description,
      volume: productForm.value.volume,
      images: this.images,
      producttype: productForm.value.producttype.name,
      user: JSON.parse(localStorage.getItem('userData')).id
    }
    console.log(product);
    this.productService.saveProduct(product)
      .subscribe(
        response => {
          //..
        },
        err => {
          console.log(err);
        },
        () => {
          //completed
        }
      );
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
      reader.readAsDataURL(files[i]);
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
