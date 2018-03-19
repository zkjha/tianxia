import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../../../service/http-service.service";
import {StorageService} from "../../../../service/storage.service";
import {NzMessageService} from "ng-zorro-antd";


/**
 *  个人中心弹出窗 - 财务中心- 账号存款- 支付宝转网银
 */
@Component({
  selector: 'app-ali-pay',
  templateUrl: './ali-pay.component.html',
  styleUrls: ['./ali-pay.component.scss']
})
export class AliPayComponent implements OnInit {

  rechargeResult: object;
  isShowModal = false;
  timer: string;
  timers: any;
  counter = 900;
  minute = 0;
  second = 0;
  isShowTimer = true;

  amount = '';

  constructor(private http: HttpService,
              private session: StorageService,
              private message: NzMessageService) {
  }

  ngOnInit() {
  }

  close = () => {
    this.isShowModal = false;
    clearInterval(this.timers);
    this.counter = 900;
  }
  handleOk = (e) => {
    this.isShowModal = false;
    clearInterval(this.timers);
    this.counter = 900;
  }

  handleCancel = (e) => {
    this.isShowModal = false;
    clearInterval(this.timers);
    this.counter = 900;
  }

  goRecharge() {
    const user_id = this.session.getStorage('user_id');
    if (!this.amount) {
      this.message.info('请输入正确的金额', {nzDuration: 5000});
      return false;
    } else if (parseInt(this.amount) < 50) {
      this.message.info('最低充值金额为50元', {nzDuration: 5000});
      return false;
    }
    this.http.post(`api/juhe/pay/transferAccounts`,
      {
        'payFlag': 'toa',
        'order_amount': this.amount,
        'user_id': user_id
      },

      data => {
        this.rechargeResult = JSON.parse(data['result']);
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
      },
      error2 => {
        console.error(error2)
      })
  }

}
