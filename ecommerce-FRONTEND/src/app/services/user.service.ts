import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, delay, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient,private router:Router){}

 async login(data:any){
    //console.log(data);
    this.http.post("http://localhost:5000/token",data).subscribe(async (result:any)=>{
      //console.log(result);
     let res = await localStorage.setItem("token",result.token);
     console.log("storeage res:",res)
     this.router.navigate(['products']);

      
    })
  }
 
  
  
profile(): Observable<any> {
  let headers = new HttpHeaders().set("Authorization", `bearer ${localStorage.getItem("token")}`);
  return this.http.post("http://localhost:5000/profile", {}, { headers }).pipe(
    map((result: any) => result.authData)
  );
}
}
