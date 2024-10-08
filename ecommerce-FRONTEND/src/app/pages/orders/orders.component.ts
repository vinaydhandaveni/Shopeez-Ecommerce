import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{
  user1:any;
  Orders:any[]=[];
  constructor(private user:UserService,private product:ProductService){

  }
  ngOnInit(): void {
    this.getUser();
  }



getUser(){
  debugger;
  this.user.profile().subscribe((result:any)=>{
    console.log(result.user);
    debugger;
    this.user1=result.user;
    if(!!this.user1){
      this.loadOrders();
    }
  });
}

loadOrders(){
  this.product.getOrders(this.user1.id).subscribe((result:any)=>{
    this.Orders=result;
    console.log(this.Orders);
  })
 
}

}
