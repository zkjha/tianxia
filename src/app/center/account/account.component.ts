import {Component, Input, OnInit} from '@angular/core';

/**
 * 我的账号
 */
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  @Input()
  show= ''; //  显示哪个信息页 默认显示'我的信息'
  constructor() { }

  ngOnInit() {
  }
  /*安全中心跳转登录密码*/
  changepw($event) {
    this.show = $event;
  }
}
