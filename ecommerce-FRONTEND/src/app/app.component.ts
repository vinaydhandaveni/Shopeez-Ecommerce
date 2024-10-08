import { Component, DoCheck, OnInit } from '@angular/core';
import { ProductService } from './services/product.service';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { Location } from '@angular/common';
import { SaleComponent } from './pages/sale/sale.component';
import { delay } from 'rxjs';
import { SharedService } from './services/sharedservice.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,DoCheck{
  title = 'ecommerce';
  subTotal=0;
  isRequired=true;
  private shouldRefreshPage = false;
  cartLoaded = false;
  cartProducts: any[] = [];
  isLoggedin=false;
  user1:any;

  constructor(private productService:ProductService ,private router:Router,private user:UserService,private location:Location,private sharedService:SharedService){
    console.log("toke",localStorage.getItem('token'));
    this.sharedService.setOpenDialogOnce(true);
   if(!!localStorage.getItem('token')){
      this.getUser();
      delay(500);
    }
  
    this.productService.cartAddedSubject.subscribe(res=>{
     this.loadCart();
    })

    this.productService.LoginSubject.subscribe(res=>{
      if(!!localStorage.getItem('token'))
      this.getUser();
      else
       this.isLoggedin=false;
    })
  
    
  }
  ngDoCheck(): void {
    let curl=this.router.url;
    if(curl=='/login' || curl=='/signup'||curl=='/main'||curl.startsWith('/item/')){
      this.isRequired=false;
    }
     else{
       this.isRequired=true;
      if (!this.cartLoaded) {
        this.loadCart();
        this.cartLoaded = true;
      }

     }
  }


  ngOnInit(): void {
    
  }

  redirectToSale(){
    this.router.navigate(['/sale']);
  }

   id:number=0;
  loadCart() {
    this.subTotal = 0;
      if(this.isLoggedin){

      this.id=this.user1.id;
    this.productService.getCartItemsByCustId(this.id).subscribe((res: any)=> {
      this.cartProducts = res;
      
  this.cartProducts.forEach(element => {
    this.subTotal =  this.subTotal + element.productPrice;
});
    
  });
    
  
  }
  else{
    try {
      const localCart = JSON.parse(localStorage.getItem('LocalCart') || '[]');
     this.cartProducts=localCart;
     this.cartProducts.forEach(element => {
      this.subTotal =  this.subTotal + element.productPrice;
  });
    } catch (error) {
      console.error("An error occurred while retrieving and processing the localCart:", error);
     
      
  
    }
    
  }
  
}

  

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['']);
    this.cartLoaded = false;
    window.location.reload();
  }

 load(eventData:any[]):void{
  this.cartProducts=eventData;

 }
 

 getUser(){
  try{
  this.user.profile().subscribe((result:any)=>{
    try{
    if(!!result.user){
      this.user1=result.user;
        this.isLoggedin=true;
       
      }
      else{
        this.isLoggedin=false;
        this.productService.cartAddedSubject.next(true);
      }
    }
    catch(err){
      this.isLoggedin=false;
    }
    if(this.isLoggedin){
      this.loadCart();
    }
  });
}
  catch(error)
  {
    this.isLoggedin=false;
  }
 }
}
