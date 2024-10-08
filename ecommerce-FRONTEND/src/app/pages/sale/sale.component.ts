import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, delay } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit{
  subTotal:number=0;
  cartProducts :any[]=[];
  isLoggedin=false;
  //user1:any;
  saleObj: any =  {
    "SaleId": 0,
    "CustId": 1,
    "SaleDate": new Date(),
    "TotalInvoiceAmount": 0,
    "Discount": 0,
    "PaymentNaration": "Paytmm ",
    "DeliveryAddress1": "FLat302",
    "DeliveryAddress2": "Behind KFC",
    "DeliveryCity": "Hyd",
    "DeliveryPinCode": "500091",
    "DeliveryLandMark": "KFC"
};
orderObj:any={
  CartId: 0,
    CustId: 1,
    productId: 0,
    Quantity: 0,
    productImageUrl:'',
    productPrice:0,
    productName:''
}
user1:any;
  constructor(private productService:ProductService, private router:Router,private user:UserService){
   this.getUser();
    
    
  }
  ngOnInit(): void {
    this.getUser();
    
  }
  getUser(){
    debugger;
    try{
      
        this.user.profile().subscribe((result:any)=>{
          if(!!result.user){
          this.user1=result.user;
            this.isLoggedin=true;
            this.loadCart();
          }
          else{
            this.isLoggedin=false;
            
          }
         
        });
      
      this.loadCart();

  
    }
      catch(error)
      {
        console.error();
      }
     }
  
  loadCart() {
    debugger;
    this.subTotal = 0;
    if (this.isLoggedin) {
      this.productService.getCartItemsByCustId(this.user1.id).subscribe((res: any) => {
        this.cartProducts = res;
        this.subTotal = 0;
        this.cartProducts.forEach(element => {
          this.subTotal = this.subTotal + element.productPrice;
        });

      });


    }
    else {

      try {
        const localCart = JSON.parse(localStorage.getItem('LocalCart') || '[]');
        this.cartProducts = localCart;
        this.subTotal = 0;
        this.cartProducts.forEach(element => {
          this.subTotal = this.subTotal + element.productPrice;
        });
      } catch (error) {
        console.error("An error occurred while retrieving and processing the localCart:", error);
      }

    }
    
    
  }

  remove(id:number){

    
    this.productService.removeCartItemById(id).subscribe((res:any)=>{
    
      this.loadCart();
      this.productService.cartAddedSubject.next(true);

      
    })
  }

  removeLocal(productId:number){
    try {
      const localCart = JSON.parse(localStorage.getItem('LocalCart') || '[]');
    
      
      const attributeToDelete = 'productId';
      const valueToDelete = productId;
    
   
      const indexToDelete = localCart.findIndex(((item: { [x: string]: number; })=> item[attributeToDelete] === valueToDelete));
    
      if (indexToDelete !== -1) {
        localCart.splice(indexToDelete, 1);
        localStorage.setItem('LocalCart', JSON.stringify(localCart));
        console.log('Object deleted successfully');
      } else {
        console.log('Object not found in localCart');
      }
    
    } catch (error) {
      console.error("An error occurred while deleting the object from localCart:", error);
      
    }
    this.loadCart();
      this.productService.cartAddedSubject.next(true);
    
  }
 
  
  addOrder(obj:any){
    this.orderObj.productId = obj.productId;
    this.orderObj.productImageUrl=obj.productImageUrl;
    this.orderObj.productName=obj.productName;
    this.orderObj.productPrice=obj.productPrice;
    this.orderObj.CustId=this.user1.id;
    this.orderObj.Quantity=obj.Quantity;
    const order={
      "custId":this.orderObj.CustId,
      "productId":this.orderObj.productId,
      "quantity":this.orderObj.Quantity
    }
    this.productService.addToOrder(order).subscribe((res:any)=>{
      
    })
  }

  makeSale() {
    this.getUser();
    if(this.isLoggedin){
    for(let i=0;i<this.cartProducts.length;i++){
      debugger;
      this.addOrder(this.cartProducts[i]);
      delay(10);
      this.remove(this.cartProducts[i].id);
    }
    alert("sale success");
    this.router.navigate(['products']);
   
  }
  else{
    this.router.navigate(['/login']);
  }
}

 
update(cart:any,change:number){
if(cart.Quantity<=1 && change==-1)
  return
 if(change==1){
  cart.Quantity+=1;
  this.subTotal+=cart.productPrice
 }
 if(change==-1){
  cart.Quantity-=1;
  this.subTotal-=cart.productPrice
 }
 console.log(this.cartProducts);
 cart.TotalPrice=cart.productPrice*cart.Quantity;
 
}

}
