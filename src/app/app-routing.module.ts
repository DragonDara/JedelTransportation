import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './products/product/product.component';
import { UserproductComponent } from './userproduct/userproduct.component';
import { UserproductprofileComponent } from './userproduct/userproductprofile/userproductprofile.component';
import { MessagesComponent } from './userproduct/messages/messages.component';
import { ProfileComponent } from './profile/profile.component';
import { Role } from './auth/user.model';
import { AdminComponent } from './admin/admin/admin.component';


const routes: Routes = [
  { path: '', redirectTo: '/products', canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'products', canActivate: [AuthGuard], component: ProductsComponent},
  { path: 'product', canActivate: [AuthGuard] ,component: ProductComponent},
  { path: 'userproduct', canActivate: [AuthGuard], children:[
    { path: '', component: UserproductComponent},
    { path: ':id/profile',component: UserproductprofileComponent},
  ]},
  { path: 'messages', canActivate:[AuthGuard], component: MessagesComponent},
  { path: ':id/user/:email', canActivate:[AuthGuard], component: ProfileComponent},
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { roles: [Role.Admin] } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
