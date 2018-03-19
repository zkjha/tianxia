import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../../service/http-service.service";
import {NzMessageService} from "ng-zorro-antd";
import {StorageService} from "../../../service/storage.service";
import { LoadingService } from "../../../service/loading.service";

/**
 * 个人中心弹出窗 - 财务中心- 账号提现
 */
@Component({
  selector: 'app-withdrawals',
  templateUrl: './withdrawals.component.html',
  styleUrls: ['./withdrawals.component.scss']
})
export class WithdrawalsComponent implements OnInit {
  usableAmount;
  bankInfo: [any];
  isChecked = true;
  bankBox = false; // 绑定银行卡
  isMain = true;
  type = 'text';
  pw;
  timon;
  bankid;
  userInfor = [];
  AMOUNT = '';
  bankLen;
  constructor(private http: HttpService,
              private session: StorageService,
              private message: NzMessageService,
              private loading: LoadingService

  ) {
  }
  ngOnInit() {
    this.refreshInfo();
    this.getBankInfo();
    this.getUserInfo();
  }
  refreshInfo() {
      this.http.postRx('api/Users/refreshInfo').subscribe(
      data => {
        this.usableAmount = data.usableAmount;
      },
    );
  }
  // 获得银行信息
  getBankInfo() {
      this.http.postRx('api/cash/cashBankList').subscribe(
      data => {
        this.bankInfo = data;
        if(this.bankInfo.length > 0){
          this.bankid = this.bankInfo[0].id;
        }

      })
  }
  // 用户信息
  getUserInfo() {
    this.http.postRx('/api/Users/getUserInfo').subscribe(
      data => {
        if (data) {
          this.userInfor = data;
          this.bankLen = data.bankInfo.length;
        }
      }
    )
  }
  tobankBox() {
    this.isMain = false
    this.bankBox = true;
  }
  // 提现
  getWithdraw() {
    const params = {
      'bankId': this.bankid,
      'cashAmount': this.timon,
      'cashPass': this.pw,
      'bankPass': this.pw
    };
    this.loading.loading("数据加载中..........");
    if (this.timon < 100 || this.timon === '') {
      this.message.info('最少提现金额是100元', {nzDuration: 5000});
      this.loading.close();
    }else if (this.pw === '') {
      this.message.info('请输入资金密码', {nzDuration: 5000});
      this.loading.close();
    }else {
      this.http.postRx(`api/cash/cashAmount`, params ).subscribe(
        data => {
          this.loading.close();
          this.pw="";
          this.timon=0;
          if (data['errormsg'] == null) {
            this.message.success('提交成功，请等待审核');
          } else {
            this.message.error("提现失败!");
          }
        })
    }
  }
  // 绑定银行卡
  sendBank(value) {
    if (value.card_user === '') {
        this.message.create('warning', `请输入开户名`);
    } else if (!(/^[0-9]*[1-9][0-9]*$/).test(value.cardCode)) {
      this.message.create('warning', `请输入正确的卡号`);
    } else if (value.bank_address === '') {
      this.message.create('warning', `请输入开户行地址`);
    } else if (!value.moneyPassword) {
      this.message.create('warning', `请输入资金密码`);
    }else {
      const params = {
        'accountName': value.card_user,
        'bankCard': value.cardCode,
        'bankAddress': value.bank_address,
        'bankPassword': value.moneyPassword,
      };
      this.http.postRx(`api/Users/setBankCard`, params ).subscribe(
        data => {
          if (data['errormsg'] == null) {
            this.message.success('修改成功');
            this.getUserInfo();
            this.isMain = false
            this.bankBox = true;
          } else {
            this.message.error(data['errormsg'])
          }
        });
    }
  }
  changeModel() {
    setTimeout(() => {
      this.AMOUNT = this.smalltoBIG(this.timon);
    }, 0);
  }
  smalltoBIG(n) {
    var fraction = ["角", "分"];
    var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    var unit = [["元", "万", "亿"], ["", "拾", "佰", "仟"]];
    var head = n < 0 ? "欠" : "";
    n = Math.abs(n);

    var s = "";

    for (var i = 0; i < fraction.length; i++) {
      s += (
        digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
      ).replace(/零./, "");
    }
    s = s || "整";
    n = Math.floor(n);

    for (var i = 0; i < unit[0].length && n > 0; i++) {
      var p = "";
      for (var j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p;
        n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
    }
    return (
      head +
      s
        .replace(/(零.)*零元/, "元")
        .replace(/(零.)+/g, "零")
        .replace(/^整$/, "零元整")
    );
  }

}

