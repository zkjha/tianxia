import { HttpService } from '../../../service/http-service.service';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../service/storage.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
  styleUrls: ["./member-list.component.scss"]
})
export class MemberListComponent implements OnInit {
  user_name = null;
  startTime = null;
  endTime = null;
  page = 1;

  total = 0;

  listData = [];
  // 设置返点
  isVisible = false;

  isVisible2 = false;

  itemId = "";

  maxRebate: any = "";

  minRebate: any = "";
  // 当前用户余额
  usableAmount: any = 0;
  // 转点金额
  amount = "";
  // 资金密码
  bankPassword = "";

  constructor(
    private http: HttpService,
    private storage: StorageService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.getList();
  }
  timeChange(event) {
    this.startTime = event.start;
    this.endTime = event.end;
  }

  getList() {
    let params = {
      user_name: this.user_name || "",
      length: 10,
      page: this.page
      //,startTime: new Date(this.startTime).getTime() / 1000 || "",
      //endTime: new Date(this.endTime).getTime() / 1000 || ""
    };
    this.http.postRx(`api/Users/team/getLowers`, params).subscribe(data => {
      this.total = data["count"];
      this.listData = data["data"];
      // console.log(data)
    });
  }
  clickPagination() {
    this.getList();
  }

  showModal = itemId => {
    this.isVisible = true;
    this.itemId = itemId;
  };
  showModal2 = itemId => {
    this.isVisible2 = true;
    this.itemId = itemId;
    this.usableAmount = this.storage.getStorage("usableAmount");
  };

  handleCancel() {
    this.isVisible = false;
    this.isVisible2 = false;
  }

  setRebate() {
    this.http
      .postRxNormal(`api/Users/team/setRebate`, {
        id: this.itemId,
        maxRebate: this.maxRebate,
        minRebate: this.minRebate
      })
      .subscribe(data => {
        if (data["errormsg"] == null) {
          this.handleCancel();
          this.getList();
          this.message.success("操作成功");
        }
      });
  }
  manualRebate() {
    this.http
      .postRxNormal(`api/Users/transferAmount`, {
        id: this.itemId,
        amount: this.amount,
        bankPassword: this.bankPassword
      })
      .subscribe(data => {
        if (data["errormsg"] == null) {
          this.handleCancel();
          this.getList();
          this.message.success("操作成功");
        }
      });
  }
}
