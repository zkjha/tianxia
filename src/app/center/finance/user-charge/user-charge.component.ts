import { NzMessageService } from 'ng-zorro-antd';
import { StorageService } from '../../../service/storage.service';
import { HttpService } from '../../../service/http-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: "app-user-charge",
  templateUrl: "./user-charge.component.html",
  styleUrls: ["./user-charge.component.scss"]
})
export class UserChargeComponent implements OnInit {
  listData = [];
  usableAmount = "";
  myAmount = "";
  option: any = {};
  amount = "";
  bankPassword = '';

  constructor(private http: HttpService, private storage: StorageService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.getList();
    this.myAmount = this.storage.getStorage("usableAmount");
  }
  init(){
  this.amount = "";
  this.bankPassword = "";
  this.option.usableAmount = '';
  }
  getList() {
    this.http.postRxNormal("/api/Users/team/getLowers").subscribe(data => {
      if (data["errormsg"] == null) {
        this.listData = data["result"]["data"];
      }
    });
  }
  manualRebate() {
    if(!this.option["id"]){
      this.message.error('请选择转入账号');
      return;
    }
    if (!this.amount) {
      this.message.error("请输入转账金额");
      return;
    }
    if (!this.bankPassword) {
      this.message.error("请输入资金密码");
      return;
    }
    this.http
      .postRxNormal(`api/Users/transferAmount`, {
        id: this.option["id"],
        amount: this.amount,
        bankPassword: this.bankPassword
      })
      .subscribe(data => {
        if (data["errormsg"] == null) {
          this.myAmount = this.storage.getStorage("usableAmount");
          this.getList();
          this.message.success("操作成功");
          this.init();
        }
      });
  }
}
