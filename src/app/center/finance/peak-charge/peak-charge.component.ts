import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpService } from '../../../service/http-service.service';
import { StorageService } from '../../../service/storage.service';

@Component({
  selector: "app-peak-charge",
  templateUrl: "./peak-charge.component.html",
  styleUrls: ["./peak-charge.component.scss"]
})
export class PeakChargeComponent implements OnInit {
  public isShow = 0;

  amount: any = "";
  userName: any = "";
  playData: any = {};
  AMOUNT = "";
  _id = "";

  rechargeResult: object;
  isShowModal = false;
  timer: string;
  timers: any;
  counter = 900;
  minute = 0;
  second = 0;
  isShowTimer = true;
  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private session: StorageService
  ) {}

  ngOnInit() {}

  goRecharge() {
    const user_id = this.session.getStorage("user_id");
    if (!this.amount) {
      this.message.info('请输入正确的金额', {nzDuration: 5000});
      return false;
    } else if (parseInt(this.amount) < 50) {
      this.message.info('最低充值金额为50元', {nzDuration: 5000});
      return false;
    }
    this.http.post(
      `api/juhe/pay/transferAccounts`,
      {
        payFlag: "toa",
        order_amount: this.amount,
        user_id: user_id,
        userName:this.userName
      },

      data => {
        this.rechargeResult = JSON.parse(data["result"]);
        console.log(this.rechargeResult);

        this.isShowModal = true;
        this.timer = "15:00";
        this.isShowTimer = true;
        this.timers = setInterval(() => {
          this.counter--;
          this.minute = Math.floor((this.counter % 3600) / 60);
          this.second = (this.counter % 3600) % 60;
          this.timer = this.minute + ":" + this.second;

          if (this.minute === 0 && this.second === 0) {
            clearInterval(this.timers);
            this.isShowTimer = false;
          } else {
            this.isShowTimer = true;
          }
        }, 1000);
        this.isShow = 1;
      },
      error2 => {
        console.error(error2);
      }
    );
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
