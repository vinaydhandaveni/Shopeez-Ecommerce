import { EventEmitter, Input } from '@angular/core';
import { Output } from '@angular/core';
import { Component ,OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { json } from 'express';
import { ProductService } from 'src/app/services/product.service';
import { SharedService } from 'src/app/services/sharedservice.service';
import { PopupLocaltoCartComponent } from '../popup-localto-cart/popup-localto-cart.component';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit{
  productId: number=0;
  product: any;
  description:any;
  cartObj : any = {
    CartId: 0,
    CustId: 1,
    productId: 0,
    Quantity: 0,
    productImageUrl:'',
    productPrice:0,
    productName:''
  };
  isLoggedin:boolean=false;
  user1:any;
  localCart:any[]=[];
  constructor(private route: ActivatedRoute, private productService: ProductService,private sharedService:SharedService,private router:Router,private user:UserService,private dialog:MatDialog) {
    
  }

  ngOnInit():void {
    
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      
      this.productService.getItembyId(this.productId).subscribe((res:any)=>{
        this.product=res[0];
        if(this.product.productDescription!='Books and media')
          this.getDescription(this.product.productDescription);
          if(localStorage.getItem('token'))
           this.getUser();
      });

      
    });
  }

  getUser(){
  
    try{
      if(!!localStorage.getItem('token')){
      this.user.profile().subscribe((result:any)=>{
        if(!!result.user){
        this.user1=result.user;
        
        }
        else{
          this.isLoggedin=false;
        }
      });
    }
  
    }
    catch(error)
    {
      console.error();
    }
  
  }


  addItem(product:any){
    this.addItemToCart(product);
    
   }
  
    addItemToCart(product: any) {
      this.getUser();
      this.cartObj.productId = product.productId;
      this.cartObj.productImageUrl=product.productImageUrl;
      this.cartObj.productName=product.productName;
      this.cartObj.productPrice=product.productPrice;
      
      
        this.cartObj.Quantity=1;
      if(this.isLoggedin){
        this.cartObj.CustId=this.user1.id;
  
      const crtobj={
        "custId":this.cartObj.CustId,
        "productId":this.cartObj.productId
      }
      this.productService.addToCart(crtobj).subscribe((result: any)=>{
       
          alert("Product Added To Cart");
          this.productService.cartAddedSubject.next(true);
         
      })
    
    }
    else{
      try {
        this.localCart = JSON.parse(localStorage.getItem('LocalCart') || '[]'); 
        const newCartItem = { ...this.cartObj };
        this.localCart.push(newCartItem);
        localStorage.setItem('LocalCart', JSON.stringify(this.localCart));
        alert("Product added to cart");
        this.productService.cartAddedSubject.next(true);
      } catch (error) {
        console.error("An error occurred while adding the product to the cart:", error);
      }
      
    }
    this.router.navigateByUrl('/products');
    }
  
  
  getDescription(des:string){
   this.description=JSON.parse(des);
   
  }
  isDescriptionExpanded: boolean = false;

  expandDescription() {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }
  
  getLimitedDescription(description: string): string {
    const linesToShow = 100;
    const lines = description.split(' ');
    if (lines.length <= linesToShow) {
      return description;
    }
    const limitedLines = lines.slice(0, linesToShow);
    return limitedLines.join('\n');

    
  }
  
 
  

}
