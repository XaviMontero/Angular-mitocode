import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  token:any; 
  roles: any; 
  username:string; 
  constructor() { 
    this.token = sessionStorage.getItem(environment.TOKEN_NAME);
    let decoded = jwt_decode(this.token);
    console.log(decoded); 
    this.roles= decoded.authorities; 
    this.username = decoded.user_name; 
  
  }

  ngOnInit() {
  }

}
