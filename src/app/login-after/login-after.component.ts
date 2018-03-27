import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {StorageService} from '../service/storage.service';
import {HttpService} from '../service/http-service.service';

@Component({
  selector: 'app-login-after',
  templateUrl: './login-after.component.html',
  styleUrls: ['./login-after.component.css']
})
export class LoginAfterComponent implements OnInit {
  usableAmount: 0;

  constructor(
    private http: HttpService,
    private storage: StorageService,
    private router: Router,

  ) { }

  ngOnInit() {
    setInterval(() => {
      this.getrefreshInfo();
    }, 5000);
    this.getUserInfo();
  }
  loginOut() {
    this.http.postRx(`api/Users/loginOut`).subscribe(data => {
      location.href = "/home";
      this.storage.clear();
    });
  }
  getUserInfo() {
    this.http.postRx("/api/Users/getUserInfo").subscribe(data => {
      if (data) {
        // console.log(data)
        this.storage.setStorage(data["maxRebate"], "maxRebate");
        this.storage.setStorage(data["minRebate"], "minRebate");
        this.storage.setStorage(data["username"], "user_name");
      }
    });
  }
  // 余额信息
  getrefreshInfo() {
    this.http.postRx("/api/Users/refreshInfo").subscribe(data => {
      if (data) {
        // this.refreshInfo = data;
        this.usableAmount = data["usableAmount"];
        this.storage.setStorage(data["usableAmount"], "usableAmount");
      }
    });
  }

}
