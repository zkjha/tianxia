import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../service/http-service.service';
import { NzMessageService } from 'ng-zorro-antd';
import { StorageService } from '../../../service/storage.service';
import {LoadingService} from "../../../service/loading.service";

@Component({
  selector: "app-zfb-play",
  templateUrl: "./zfb-play.component.html",
  styleUrls: ["./zfb-play.component.scss"]
})
export class ZfbPlayComponent implements OnInit {
  public isShow = 0;

  rechargeType = 1;
  amount: any = "";
  playData: any = {};
  AMOUNT = "";
  _id = "";

  qrCodeStr: any = "";
  isShowModal = false;
  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private storage: StorageService,
    private loading: LoadingService) {
}

  ngOnInit() {}

  getRechargeType(type) {
    this.rechargeType = type;
  }
  // 下一步
  toSecond() {
    if (!this.amount) {
      this.message.info("请输入充值金额", { nzDuration: 5000 });
      return false;
    } else if (this.amount < 50) {
      this.message.info("最低充值金额为50元", { nzDuration: 5000 });
      return false;
    }
    if (this.rechargeType == 1) {
      this.playAmount();
    } else if (this.rechargeType == 2) {
      this.isShow = 1;
    }
  }

  playAmount() {
    this.loading.loading("拼命加载中...");
    let params = { payMethod: "ALIPAY_QRCODE_PAY", order_amount: this.amount };
    this.http
      .postRxNormal(`/api/jf/pay/unifiedorder`, params)
      .subscribe(data => {
        this.loading.close();
        if (data["errormsg"] == null) {
          this.isShow = 1;
          this.playData = data["result"];
        }
      });
  }
  onSubmit() {
    // 第一种方式
    if (this.rechargeType == 1) {
      this.loading.loading("拼命加载中...");
      this.http
        .getRxNormal(`/api/jf/pay/generCode/${this.playData["paymentInfo"]}`)
        .subscribe(data => {
          this.loading.close();
          if (data["errormsg"] == null) {
            this.isShowModal = true;
            this.qrCodeStr = data["result"]["pay_url"];
          }
        });
    } else if (this.rechargeType == 2) {
      this.getQrCodeStr();
    }
  }

  getQrCodeStr() {
    if (!this.amount) {
      this.message.info('请输入充值金额', {nzDuration: 5000});
      return false;
    } else if (this.amount < 50) {
      this.message.info('最低充值金额为50元', {nzDuration: 5000});
      return false;
    }
    const user_id = this.storage.getStorage("user_id");
    this.loading.loading("拼命加载中...");
    this.http.post(
      `api/juhe/pay/unifiedorder`,
      {
        user_id: user_id,
        payFlag: "juhe",
        service_type: 21,
        order_amount: this.amount
      },
      data => {
        this.isShow = 1;
        this.loading.close();
        // console.log(data)
        if (data && data.result) {
          this.isShowModal = true;
          this.qrCodeStr = JSON.parse(data.result).qrCodeStr;
        }
      },
      error => {
        // console.error(error)
      }
    );
  }
  close = () => {
    this.isShowModal = false;
  };
  handleOk = e => {
    this.isShowModal = false;
  };

  handleCancel = e => {
    this.isShowModal = false;
  };
  changeModel() {
    setTimeout(() => {
      this.AMOUNT = this.smalltoBIG(this.amount);
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
