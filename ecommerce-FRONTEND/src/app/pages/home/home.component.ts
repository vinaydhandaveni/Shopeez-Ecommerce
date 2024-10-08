import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { delay } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupLocaltoCartComponent } from '../popup-localto-cart/popup-localto-cart.component';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/sharedservice.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  prodlist: any[]=[];
  cartProducts:any[]=[];
  isLoggedIn:boolean=false;
  localCart:any[]=[];
  isRefreshed:boolean=false;
  activeTag: string = '';
  options: string[] = ['Rating', 'Price','None'];
  selectedOption: string='';
  previousOption:string='';

  @Output() public childevent=new EventEmitter<any[]>();
  cartObj : any = {
    CartId: 0,
    CustId: 1,
    productId: 0,
    Quantity: 0,
    productImageUrl:'',
    productPrice:0,
    productName:''
  };
  duplicateList:any[]=[];
  subTotal: number | undefined;
  user1:any;
  ranhere:boolean=false;
  constructor(private prod:ProductService ,private user:UserService,private dialog:MatDialog,private router:Router,private sharedService: SharedService){
   
   
   this.prod.LoginSubject.next(true);
  }

  ngOnInit(): void {
    
    this.getUser();
    delay(100);
    this.loadAllProducts();
    
    
  }
  
  openDialogue(){
    this.dialog.open(PopupLocaltoCartComponent);
    this.sharedService.setOpenDialogOnce(false);
  }


getUser(){
  
  try{
    if(!!localStorage.getItem('token')){
    this.user.profile().subscribe((result:any)=>{
      if(!!result.user){
      this.user1=result.user;
      this.isLoggedIn=true;
      if(!!localStorage.getItem('LocalCart')){
        const shouldOpenDialog = this.sharedService.getOpenDialogOnce();
        if(shouldOpenDialog){
        this.openDialogue();
        }
      }
      this.router.navigate(["products"]);
      }
    },
    (error: any) => {
      this.isLoggedIn=false;
      
    }
   
    );
    this.prod.LoginSubject.next(true);
  }

  }
  catch(error)
  {
    this.isLoggedIn=false;
  }

}


  loadAllProducts(){
    this.prod.getAllProducts().subscribe((result:any)=>{
      this.prodlist=result;
      this.duplicateList=this.prodlist;
      this.prod.cartAddedSubject.next(true);
    });
   
   
  }

  closeDialogue(){
    this.dialog.closeAll();
  }

 addItem(product:any){
  this.addItemToCart(product);
  
 }

  addItemToCart(product: any) {
   
    this.cartObj.productId = product.productId;
    this.cartObj.productImageUrl=product.productImageUrl;
    this.cartObj.productName=product.productName;
    this.cartObj.productPrice=product.productPrice;
    
    
      this.cartObj.Quantity=1;
      this.prod.LoginSubject.next(true);
    if(this.isLoggedIn){

      this.cartObj.CustId=this.user1.id;

    const crtobj={
      "custId":this.cartObj.CustId,
      "productId":this.cartObj.productId
    }
    this.prod.addToCart(crtobj).subscribe((result: any)=>{
     
        alert("Product Added To Cart");
        this.prod.cartAddedSubject.next(true);
        this.prod.LoginSubject.next(true);
       
    })
  
  }
  else{
    try {
      this.localCart = JSON.parse(localStorage.getItem('LocalCart') || '[]'); 
      const newCartItem = { ...this.cartObj };
      this.localCart.push(newCartItem);
      localStorage.setItem('LocalCart', JSON.stringify(this.localCart));
      alert("Product added to cart");
      this.prod.cartAddedSubject.next(true);
      
    } catch (error) {
      console.error("An error occurred while adding the product to the cart:", error);
    }
    
  }
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
  }

refreshPageOnce(delay: number): void {
    if (!this.isRefreshed) {
      this.isRefreshed = true;
      setTimeout(() => {
        window.location.reload();
      }, delay);
    }
  }


  searchtag(tag:string){
    this.activeTag = tag;
    this.prod.searchProducts(tag).subscribe((res)=>{
      this.prodlist=res;
    });
  }


  
  showproduct(id: number) {
    this.router.navigate(['/item', id]);
  }
  
  onOptionSelected() {
   if(this.selectedOption=='None'){
    
   return
    }
    else if(this.selectedOption=='Rating')
    this.prodlist.sort((a,b)=>a.productRating-b.productRating).reverse();
   else if(this.selectedOption=='Price')
    this.prodlist.sort((a,b)=>a.productPrice-b.productPrice)
}

showCheckboxes: boolean = false;
selectedPriceRanges1: boolean = false;
selectedPriceRanges2: boolean = false;
selectedPriceRanges3: boolean = false;
selectedPriceRanges4: boolean = false;
filteredProducts:any[]=[];

filterProducts() {
 
 
    this.prodlist = this.duplicateList.filter(product => {
      if (this.selectedPriceRanges1 && product.productPrice < 300) {
        return true;
      }
      if (this.selectedPriceRanges2 && product.productPrice >= 300 && product.productPrice < 900) {
        return true;
      }
      if (this.selectedPriceRanges3 && product.productPrice >= 900 && product.productPrice <= 2000) {
        return true;
      }
      if (this.selectedPriceRanges4 && product.productPrice > 2000) {
        return true;
      }
      if (!this.selectedPriceRanges1 && !this.selectedPriceRanges2 && !this.selectedPriceRanges3 && !this.selectedPriceRanges4) {
      
        return true;
      }
      return false;
    });
  }
  

  
 


toggleFilter() {
  this.showCheckboxes = !this.showCheckboxes;
}







}
