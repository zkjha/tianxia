import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {StorageService} from "../../../service/storage.service";
import {HttpService} from "../../../service/http-service.service";
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-security-center',
  templateUrl: './security-center.component.html',
  styleUrls: ['./security-center.component.scss']
})
export class SecurityCenterComponent implements OnInit {
  @Input()
  show= ''; //  显示哪个信息页
  @Output() changepw= new EventEmitter();
  public userTime: any = [];
  public recent: any = {};
  public userInfor: any = {};
  safeBox = true; //  显示安全中心
  phoneBox = false; // 显示修改手机
  emailBox = false; // 绑定邮箱
  qqBox = false; // 绑定qq
  bankBox = false; // 绑定银行卡
  bankLen;
  constructor(
    private http: HttpService,
    private storage: StorageService,
    private _message: NzMessageService
  ) { }

  ngOnInit() {
    this.getUserInfo();
  }
  // 用户信息
  getUserInfo() {
    this.http.postRx('/api/Users/getUserInfo').subscribe(
      data => {
        if (data) {
          if (data.loginInfo.length > 0) {
            for (let i = 0; i < data.loginInfo.length; i ++) {
              data.loginInfo[i].addTime = data.loginInfo[i].addTime * 1000;
            }
          }
          this.userInfor = data;
          this.userTime = data.loginInfo;
          this.recent = data.loginInfo[0];
          this.bankLen = data.bankInfo.length;
        }
      }
    )
  }
  /*跳转到密码修改*/
  showpw() {
    this.changepw.emit('update-password');
  }
  /*绑定手机号*/
  bangPhone() {
    this.safeBox = false;
    this.phoneBox = true;
  }
  sendPhone(value) {
    if (value.tel === '') {
      this._message.create('warning', `请输入手机号`);
    } else if (!(/^1[3|4|5|8][0-9]\d{8}$/).test(value.tel)) {
      this._message.create('warning', `请输入正确的手机号`);
    }else {
      const params = {
        'mobile': value.tel,
      };
      this.http.postRx(`api/Users/setMobile`, params ).subscribe(
        data => {
          if (data) {
            // console.log(data);
          }
        });
    }
  }
  /*绑定邮箱*/
  bangEmail() {
    this.safeBox = false;
    this.emailBox = true;
  }
  sendEmail(value) {
    if (value.email === '') {
      this._message.create('warning', `请输入邮箱`);
    } else if (!(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).test(value.email)) {
      this._message.create('warning', `请输入正确的邮箱`);
    }else {
      const params = {
        'email': value.email,
      };
      this.http.postRx(`api/Users/setEmail`, params ).subscribe(
        data => {
          if (data) {
            // console.log(data);
          }
        });
    }
  }
  /*绑定QQ*/
  bangQQ() {
    this.safeBox = false;
    this.qqBox = true;
  }
  sendqq(value) {
    if (value.qq === '') {
      this._message.create('warning', `请输入qq号`);
    } else if (!(/^[0-9]*[1-9][0-9]*$/).test(value.qq)) {
      this._message.create('warning', `QQ号的格式不正确`);
    }else {
      const params = {
        'qq': value.qq,
      };
      this.http.postRx(`api/Users/setQq`, params ).subscribe(
        data => {
          if (data) {
            // console.log(data);
          }
        });
    }
  }
  // 绑定银行卡
  bangBank() {
    this.safeBox = false;
    this.bankBox = true;
  }
  sendBank(value) {
    if (value.card_user === '') {
      this._message.create('warning', `请输入开户名`);
    } else if (!(/^[0-9]*[1-9][0-9]*$/).test(value.cardCode)) {
      this._message.create('warning', `请输入正确的卡号`);
    } else if (value.bank_address === '') {
      this._message.create('warning', `请输入开户行地址`);
    } else if (!value.moneyPassword) {
      this._message.create('warning', `请输入资金密码`);
    }else {
      const params = {
        'accountName': value.card_user,
        'bankCard': value.cardCode,
        'bankAddress': value.bank_address,
        'bankPassword': value.moneyPassword,
      };
      // console.log(params);
      this.http.postRx(`api/Users/setBankCard`, params ).subscribe(
        data => {
          if (data) {
            // console.log(data);
          }
        });
    }
  }
  // 关闭绑定框
  closePhone() {
    this.getUserInfo();
    this.safeBox = true;
    this.phoneBox = false;
    this.emailBox = false;
    this.qqBox = false;
    this.bankBox = false;
  }


}
