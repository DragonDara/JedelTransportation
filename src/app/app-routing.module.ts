import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './products/product/product.component';


const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'products', canActivate: [AuthGuard], component: ProductsComponent},
  { path: 'product', canActivate: [AuthGuard] ,component: ProductComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
