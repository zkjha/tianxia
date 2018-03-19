import {Component, Input, OnInit} from '@angular/core';
import {StorageService} from "../../../service/storage.service";
import {HttpService} from "../../../service/http-service.service";
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
declare let $: any;
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  @Input()
  show= 'my-info'; //  显示哪个信息页
  @Input() monPw;
  public userData: any = {};
  constructor(
    private http: HttpService,
    private storage: StorageService,
    private router: Router,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.changeArea();
    this.getUserInfo();
  }
  // 修改登录密码与资金密码之间的显示隐藏
  changeArea() {
    $('.changTit').find('li').click(function () {
      $(this).addClass('on').siblings().removeClass('on');
      $('.mima').find('form').eq($(this).index()).removeClass('hidden').siblings().addClass('hidden');
    })
  }
  // 用户信息
  getUserInfo() {
    this.http.postRx('/api/Users/getUserInfo').subscribe(
      data => {
        if (data) {
          this.userData = data;
          // console.log(data);
        }
      }
    )
  }
  // 修改登录密码
  comLoginPW(value) {
    const params = {
      'password': value.old_password,
      'new_password': value.password,
      'renew_password': value.confirm_password,
    };
    this.http.postRxNormal(`api/Users/setPassword`, params ).subscribe(
      data => {
        if (data['errormsg'] == null) {
          this.message.success('修改登陆密码成功')
        } else {
          // this.message.error(data['errormsg'])
        }
      });
  }
//  修改资金密码
  comZiPW(value) {
    const params = {
      'bankPassword': value.old_password,
      'new_bank_password': value.password,
      'renew_bank_password': value.confirm_password,
    };
    this.http.postRxNormal(`api/Users/setBankPassword`, params ).subscribe(
      data => {
        if (data['errormsg'] == null) {
          this.message.success('修改资金密码成功')
        } else {
          // this.message.error(data['errormsg'])
        }
      });
  }
}
