import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-popup-localto-cart',
  templateUrl: './popup-localto-cart.component.html',
  styleUrls: ['./popup-localto-cart.component.css']
})
export class PopupLocaltoCartComponent implements OnInit {
  cartObj : any = {
    CartId: 0,
    CustId: 1,
    productId: 0,
    Quantity: 0,
    productImageUrl:'',
    productPrice:0,
    productName:''
  };
  user1:any;
constructor(private prod:ProductService,private user :UserService,private router:Router,private dialog:MatDialog){

}
  ngOnInit(): void {
    this.getUser();
  }
getUser(){
  
  try{
    if(!!localStorage.getItem('token')){
    this.user.profile().subscribe((result:any)=>{
      if(!!result.user){
      this.user1=result.user;
      
      }
    });
  }

  }
  catch(error)
  {
    console.error();
  }

}

addItem(product :any){
  this.cartObj.productId = product.productId;
    this.cartObj.productImageUrl=product.productImageUrl;
    this.cartObj.productName=product.productName;
    this.cartObj.productPrice=product.productPrice;
    this.cartObj.Quantity=1;
      this.cartObj.CustId=this.user1.id;
      const crtobj={
        "custId":this.cartObj.CustId,
        "productId":this.cartObj.productId
      }
    this.prod.addToCart(crtobj).subscribe((result: any)=>{
     
        
        this.prod.cartAddedSubject.next(true);
       
    })
}

addLocalToCart(){
  if(localStorage.getItem('LocalCart')){
  var storedItems =JSON.parse(localStorage.getItem('LocalCart') || '[]'); 
if (storedItems) {
for (var i = 0; i < storedItems.length; i++) {
  this.addItem(storedItems[i]);
}
}
}
localStorage.removeItem('LocalCart');
this.dialog.closeAll();
alert("Products Added To Cart");


}

closeDialogue(){
  this.dialog.closeAll();
}

}
