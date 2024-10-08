import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  constructor(private formBuilder:FormBuilder,private http:HttpClient,private router:Router,private userService:UserService){}

  ngOnInit(): void {
   
  }

  userlogin(data: any) {
    const details = {
      "email": data.email,
      "password": data.password
    };
  
    this.http.post<any>("http://localhost:8000/logincheck", details).subscribe(
      (res) => {
        if (res.error) {
          alert("User not found");
        } else {
          alert("Login Successful");
          this.loginAndNavigate(res);
        }
      },
      (err) => {
        alert("Something went wrong");
      }
    );
  }
  async loginAndNavigate(user: any): Promise<void> {
    try {
      await this.userService.login(user);
      //  delay(500); // Assuming you have a delay function as shown in the previous response
    } catch (error) {
      console.error('Error occurred:', error);
    }
  }


}
