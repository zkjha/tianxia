import {Component, Input, OnInit} from '@angular/core';
import {StorageService} from "../../../service/storage.service";
import {HttpService} from "../../../service/http-service.service";

@Component({
  selector: 'app-my-info',
  templateUrl: './my-info.component.html',
  styleUrls: ['./my-info.component.scss']
})
export class MyInfoComponent implements OnInit {
  @Input()
  show= ''; //  显示哪个信息页
  public userInfo: any = {}; // 用户信息
  public amountAG; // ag余额
  constructor(
    private http: HttpService,
    private storage: StorageService,
  ) { }

  ngOnInit() {
    this.getUserInfo(); // 获得用户信息
    this.getAgBalance(); // 获取ag余额
  }
  // 用户信息
  getUserInfo() {
    this.http.postRx('/api/Users/getUserInfo').subscribe(
      data => {
        if (data) {
          this.userInfo = data;
          this.userInfo.addTime = data.addTime * 1000;

          const loginInfo = this.userInfo['loginInfo'];
          if (loginInfo.length > 0) {
            if (loginInfo.length === 1) {
              this.userInfo.currentLoginTime = loginInfo[0].addTime * 1000;
              this.userInfo.currentLoginIp = loginInfo[0].ip;
              this.userInfo.lastLoginTime = loginInfo[0].addTime * 1000;
              this.userInfo.lastLoginIp = loginInfo[0].ip;
            } else {
              this.userInfo.currentLoginTime = loginInfo[0].addTime * 1000;
              this.userInfo.currentLoginIp = loginInfo[0].ip;
              this.userInfo.lastLoginTime = loginInfo[1].addTime * 1000;
              this.userInfo.lastLoginIp = loginInfo[1].ip;
            }
          }
        }
      }
    )
  }
  // 获取ag余额
  getAgBalance() {
    let userId = this.storage.getStorage('user_id')
    let params = {user_id: userId }
    this.http.postRx('/api/video/getAgBalance', params).subscribe((data) => {
        this.amountAG = data;
      })
  }
}
