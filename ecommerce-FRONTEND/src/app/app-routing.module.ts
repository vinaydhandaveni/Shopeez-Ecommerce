import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SaleComponent } from './pages/sale/sale.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ItemComponent } from './pages/item/item.component';
import { AuthGuard } from './services/auth.guard';
import { OrdersComponent } from './pages/orders/orders.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  {
    path:'login',
    component:LoginComponent
  },
 
  {
    path:'products',
    component:HomeComponent,
  },
  {
    path:'sale',
    component:SaleComponent,
    
  },
  {
    path:"signup",
    component:SignupComponent
  },
  {
    path:'',
    redirectTo:'/main',
    pathMatch:"full"
  },
  {
    path:'Myorders',
    component:OrdersComponent,
    canActivate:[AuthGuard],
  },
  {
  path:'main',
  component:MainComponent
  },
  { path: 'item/:id',
   component: ItemComponent
   }
  
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
