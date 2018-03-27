import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../service/storage.service';
import {HttpService} from '../service/http-service.service';
import {Model} from "../model/model";

@Component({
  selector: 'app-login-after',
  templateUrl: './login-after.component.html',
  styleUrls: ['./login-after.component.css']
})
export class LoginAfterComponent implements OnInit {

  usableAmount: 0;
  public shohid = 0;
  isVisible = false; // 是否显示弹窗

  // 弹窗中显示哪个信息页  默认显示'我的账号'
  // account我的账号
  finance = "lightCharge"; // 财务中心
  transactionRecord = "betting"; // 交易记录
  report = "user-tab"; // 个人报表
  news = "system-info"; // 消息公告
  proxy = "account-center"; // 代理中心
  showInfo = "account";
  subModel = "my-info"; // 记录弹窗里边的切换页
  bc = null;

  style: any = {
    top: "40px"
  };

  isShowInfo(info) {
    // console.log(info)
    this.showInfo = info;

    // 需要默认显示的放这里
    this.proxy = "team-statistics";
    this.subModel = "my-info";
    this.finance = "lightCharge";
    this.news = "system-info";
    this.report = "user-tab"; // 个人报表
    this.transactionRecord = "betting"; // 交易记录
  }

  openModel = (event: Model) => {
    // console.log(event);
    this.isVisible = true;
    this.showInfo = event.model1;

    // 请勿修改  不然无法默认激活
    this.subModel = event.model2;

    this.proxy = event.model2;
    this.finance = event.model2;
    this.news = event.model2;
    this.report = event.model2; // 个人报表
    this.transactionRecord = event.model2; // 交易记录
  }
  handleCancel = e => {
    // console.log(e);
    this.isVisible = false;
  }

  constructor(private http: HttpService,
              private storage: StorageService,
              private router: Router) {
  }

  ngOnInit() {
    setInterval(() => {
      this.getrefreshInfo();
    }, 5000);
    this.getUserInfo();
  }

  loginOut() {
    this.http.postRx(`api/Users/loginOut`).subscribe(data => {
      this.router.navigateByUrl('/home');
      // location.href = "/home";
      this.storage.clear();
    });
  }
  getUserInfo() {
    this.http.postRx("/api/Users/getUserInfo").subscribe(data => {
      if (data) {
        // console.log(data)
        this.storage.setStorage(data["maxRebate"], "maxRebate");
        this.storage.setStorage(data["minRebate"], "minRebate");
        this.storage.setStorage(data["username"], "user_name");
      }
    });
  }
  // 余额信息
  getrefreshInfo() {
    this.http.postRx("/api/Users/refreshInfo").subscribe(data => {
      if (data) {
        // this.refreshInfo = data;
        this.usableAmount = data["usableAmount"];
        this.storage.setStorage(data["usableAmount"], "usableAmount");
      }
    });
  }

}
