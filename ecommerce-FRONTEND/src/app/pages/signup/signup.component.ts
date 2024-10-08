import { HttpClient } from '@angular/common/http';
import { Component ,OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit{

public signupForm !: FormGroup;
isName:boolean=false;
isEmail:boolean=false;
isMobile:boolean=false;
isPassword:boolean=false;
constructor(private formBuilder:FormBuilder,private http:HttpClient,private router:Router){}
ngOnInit(): void {
  this.signupForm=this.formBuilder.group({
    username:[''],
    email:[''],
    password:[''],
    mobile:['']
  })
}

signUp(){
  const sign={
    "username":this.signupForm.get('username')?.value,
    "password":this.signupForm.get('password')?.value,
    "email":this.signupForm.get('email')?.value
  }
 this.http.post<any>("http://localhost:8000/signup",sign).subscribe(res=>{
  alert("signup successful");
  this.signupForm.reset();
  this.router.navigate(['login']);
},err=>{
  alert("Something went wrong");
});
}


xor(a: boolean, b: boolean, c: boolean, d: boolean): boolean {
  return (a || b || c || d) && !(a && b && c && d);
}

}
