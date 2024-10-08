import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements OnInit{
  
  public cartAddedSubject =new Subject<boolean>;
  public LoginSubject =new Subject<boolean>;
  public isLoggedin =new Subject<boolean>;
  
  user1 :any;
  constructor(private http:HttpClient,private user:UserService) { 

  }

  ngOnInit(): void {
    
  }
  getAllProducts(): Observable<any[]>{
    return this.http.get<any[]>("http://127.0.0.1:8000/products");
  }

 addToCart(obj: any) : Observable<any> {
    return this.http.post<any>("http://localhost:8000/cart",obj);
 }
 
  
  getCartItemsByCustId(custId:number) : Observable<any[]>  {
    return this.http.get<any[]>("http://localhost:8000/getcart/"+ custId);
   
  }

  removeCartItemById(id:number) : Observable<any[]>  {
    return this.http.delete<any[]>("http://localhost:8000/deleteCart/"+id);
  }
 

  getOrders(custId:number) : Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8000/getorders/" + custId);

  }
  addToOrder(obj: any) : Observable<any> {
    return this.http.post<any>("http://localhost:8000/addOrder",obj);
  }

  updateCart(quantity:number,id:number):Observable<any>{
    const data = { quantity: quantity };
    return this.http.patch<any>("http://localhost:8000/updatecart/"+id,data)
  }

  searchProducts(tag: string): Observable<any> {
    
    return this.http.get<any>("http://localhost:8000/search/"+tag);
  }

  getItembyId(id:number):Observable<any>{
    
    return this.http.get<any>("http://localhost:8000/getItem/"+id);
  }
}
