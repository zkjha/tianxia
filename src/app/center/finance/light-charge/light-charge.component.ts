import { HttpService } from "../../../service/http-service.service";
import { Component, OnInit } from "@angular/core";
import { NzMessageService } from "ng-zorro-antd";
import {LoadingService} from "../../../service/loading.service";

@Component({
  selector: "app-light-charge",
  templateUrl: "./light-charge.component.html",
  styleUrls: ["./light-charge.component.scss"]
})
export class LightChargeComponent implements OnInit {
  public isShow = 0;

  bankList=[{"id":"BANK_CARD-B2C-POST-P2P","title":"邮政储蓄银行"},
  {"id":"BANK_CARD-B2C-ECITIC-P2P","title":"中信银行"},
  {"id":"BANK_CARD-B2C-SPDB-P2P","title":"浦发银行"},
  {"id":"BANK_CARD-B2C-CIB-P2P","title":"兴业银行"},
  {"id":"BANK_CARD-B2C-ABC-P2P","title":"农业银行"},
  {"id":"BANK_CARD-B2C-GDB-P2P","title":"广发银行"},
  {"id":"BANK_CARD-B2C-ICBC-P2P","title":"工商银行"},
  {"id":"BANK_CARD-B2C-BOC-P2P","title":"中国银行"},
  {"id":"BANK_CARD-B2C-CCB-P2P","title":"建设银行"},
  {"id":"BANK_CARD-B2C-CEB-P2P","title":"光大银行"}];

  pay_type="";
  rechargeType = 1;
  amount: any = "";
  playData: any = {};
  AMOUNT = "";
  constructor(private http: HttpService,
              private message: NzMessageService,
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
    } else if (this.amount < 100) {
      this.message.info("最低充值金额为100元", { nzDuration: 5000 });
      return false;
    }
    this.playAmount();
  }

  playAmount() {
    this.loading.loading("拼命加载中...");

    let params = {
      payMethod: "UNION_PAY",
      order_amount: this.amount,
      pay_type:this.pay_type
    };
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
    // console.log(this.playData)
    if (this.playData["canRedirect"] == true) {
      setTimeout(() => {
        window.open(this.playData["paymentInfo"]);
      }, 500);
    }
  }
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
