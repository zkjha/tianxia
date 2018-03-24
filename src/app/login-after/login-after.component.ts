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
  }
  loginOut() {
    this.http.postRx(`api/Users/loginOut`).subscribe(data => {
      location.href = "/home";
      this.storage.clear();
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
