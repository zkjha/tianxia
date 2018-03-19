import {Component, OnInit} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd";
import {HttpService} from "../../../../service/http-service.service";
import {StorageService} from "../../../../service/storage.service";
import {LoadingService} from "../../../../service/loading.service";

/**
 *  个人中心弹出窗 - 财务中心- 账号存款- 高通扫码
 */
@Component({
  selector: 'app-qc-code',
  templateUrl: './qc-code.component.html',
  styleUrls: ['./qc-code.component.scss']
})
export class QcCodeComponent implements OnInit {

  amount: any;

  constructor(private http: HttpService,
              private session: StorageService,
              private message: NzMessageService,
              private loading: LoadingService) {
  }

  qrCodeStr: any = '';
  rechargeType: any = '';
  isShowModal = false;
  _id = null;
  close = () => {
    this.isShowModal = false;
  }
  handleOk = (e) => {
    this.isShowModal = false;
  }

  handleCancel = (e) => {
    this.isShowModal = false;
  }

  getRechargeType(event) {
    this.rechargeType = event;
  }

  getQrCodeStr() {

    if (!this.rechargeType) {
      this.message.info('请选择充值方式', {nzDuration: 5000});
      return false;
    }
    if (!this.amount) {
      this.message.info('请输入充值金额', {nzDuration: 5000});
      return false;
    } else if (this.amount < 50) {
      this.message.info('最低充值金额为50元', {nzDuration: 5000});
      return false;
    }
    const user_id = this.session.getStorage('user_id');
    this.loading.loading('拼命加载中...');
    this.http.post(`api/juhe/pay/unifiedorder?user_id=` + user_id,
      {
        'user_id': user_id,
        'payFlag': 'juhe',
        'service_type': this.rechargeType,
        'order_amount': this.amount
      },
      data => {
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
    )
  }

  ngOnInit() {
  }

}
