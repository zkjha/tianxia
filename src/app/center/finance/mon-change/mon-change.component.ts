import { Component, OnInit } from '@angular/core';
import {HttpService} from "../../../service/http-service.service";
import { NzMessageService } from 'ng-zorro-antd';
import {LoadingService} from "../../../service/loading.service";
@Component({
  selector: 'app-mon-change',
  templateUrl: './mon-change.component.html',
  styleUrls: ['./mon-change.component.scss']
})
export class MonChangeComponent implements OnInit {
  public monOut = 0;
  public monIn = 0;
  amountAG = 0;
  userBalance = 0;
  transferValue: any;
  constructor(private http: HttpService, private message: NzMessageService, private loading: LoadingService) {
  }
  ngOnInit() {
    this.refreshInfo();
    this.getAgBalance();
  }
  // ag账户
  agAcct(id) {
    if (this.monOut == id || this.monIn == id) {
      this.changeACT()
    } else if (this.monOut == 0) {
      this.monOut = id;
    }else if (this.monIn == 0 && this.monIn != this.monOut) {
      this.monIn = id;
    }else {
      this.changeACT();
    }
  }
  // 转换
  changeACT() {
    let tmp = this.monOut;
    this.monOut = this.monIn;
    this.monIn = tmp;
  }
  // 获取账户余额
  refreshInfo() {
    let that = this;
    this.http.postRx(`api/Users/refreshInfo`, ).subscribe(
      data => {
        this.userBalance = data['usableAmount'];
      },
    );
  }
  // 获取ag余额
  getAgBalance() {
    this.http.postRx(`/api/video/getAgBalance`)
      .subscribe((data) => {
        // console.log(data)
        this.amountAG = data;
      })
  }
  // 转入
  transMon() {;
    if (this.monOut == 1 && this.monIn == 2) {
       this.transferBalance();
    }else if (this.monOut == 2 && this.monIn == 1) {
       this.withdrawFund();
    }else {
      this.message.warning('转换类型有误');
    }
  }
  // 全额转入
  transMonAll() {
    if (this.monOut == 1 && this.monIn == 2) {
      this.transferValue = this.userBalance;
      this.transferBalance();
    }else if (this.monOut == 2 && this.monIn == 1) {
      this.transferValue = this.amountAG;
      this.withdrawFund();
    }else {
      this.message.warning('转换类型有误');
    }
  }
  // 主账户 --> AG
  transferBalance() {
    this.loading.loading('系统正在处理');
    let params = {
      amount: parseInt(this.transferValue) || 0,
    }
    this.http.postRxNormal(`/api/video/transferBalance`, params)
      .subscribe((data) => {
        this.loading.close();
        if (data['errormsg'] == null) {

          this.getAgBalance();
          this.refreshInfo()
          this.message.success('充值成功')
          this.transferValue = ''

        } else {
          this.message.error(data['errormsg'])
        }
      })
  }

  // AG --> 主账户
  withdrawFund() {
    this.loading.loading('系统正在处理');
    let params = {
      amount: parseInt(this.transferValue) || 0,
    }
    this.http.postRxNormal(`/api/video/withdrawFund`, params)
      .subscribe((data) => {
        this.loading.close();
        if (data['errormsg'] == null) {

          this.getAgBalance();
          this.refreshInfo()
          this.message.success('提现成功！')
          this.transferValue = ''
        } else {
          this.message.error(data['errormsg'])
        }
      })
  }
}
