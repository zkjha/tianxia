import { StorageService } from '../../../service/storage.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../service/http-service.service';


@Component({
  selector: "app-account-center",
  templateUrl: "./account-center.component.html",
  styleUrls: ["./account-center.component.scss"]
})
export class AccountCenterComponent implements OnInit {
  listData = [];
  copyContent="";
  // 用户类型
  type = "0";
  maxRebate: any;
  minRebate: any;
  username: any;
  password: any;

  max:any = 0;
  min:any = 0;

  maxInfo = '';
  minInfo = '';

  options = [
    { label: "一天", value: "1" },
    { label: "三天", value: "2" },
    { label: "一周", value: "7" },
    { label: "一月", value: "30" },
    { label: "永久", value: "9999" }
  ];
  selectedOption = this.options[3];

  constructor(private http: HttpService, private message: NzMessageService,
    private storage:StorageService
  ) {}

  ngOnInit() {
    this.max = this.storage.getStorage('maxRebate')
    this.min = this.storage.getStorage("minRebate");
    this.maxInfo = `'高频彩范围（5~${this.max}）'`;
    this.minInfo = `'高频彩范围（5~${this.min}）'`;
    this.copyContent="用户名:"+this.username+",密码:"+this.password;
  }

  goRegister() {
    if (!this.username || !this.password) {
      this.message.error("请输入用户名或密码");
      return;
    }

    this.http
      .postRxNormal(`api/Users/localRegister`, {
        type: this.type,
        maxRebate: this.maxRebate,
        minRebate: this.minRebate,
        username: this.username,
        password: this.password
      })
      .subscribe(data => {
        if (data["errormsg"] == null) {
          this.message.success("开户成功");
        }
      });
  }
  // 生成链接
  getRegCode() {
    if (!this.maxRebate || !this.minRebate) {
      this.message.error("请输入返点");
      return;
    }

    this.http
      .postRxNormal(`/api/RegCode/add`, {
        type: this.type,
        url: this.selectedOption["value"],
        maxRebate: this.maxRebate,
        minRebate: this.minRebate
      })
      .subscribe(data => {
        if (data["errormsg"] == null) {
          this.message.success("操作成功");
        }
      });
  }
  selectChange(event) {
    if (event.index == 2) {
      this.getCodes();
    }
  }
  // 获取链接
  getCodes() {
    this.http
      .postRx(`/api/RegCode/getCodes`, { isNeedUrl: 1 })
      .subscribe(data => {
        this.listData = data;
      });
  }
  copyUrl(url){
     this.message.success('正在处理')
  };
  delUrl(id) {
    this.http.postRx(`/api/RegCode/delete`,{id:id}).subscribe(
      data => {
        this.getCodes();
        this.message.success('删除成功')
      }
    );
  }

  successFun() {
    this.message.success("已成功复制")
  }

}
