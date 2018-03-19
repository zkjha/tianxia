import {Component, OnInit} from '@angular/core';
import {HttpService} from "../../../service/http-service.service";
import {NzMessageService, NzModalService} from "ng-zorro-antd";
import {StorageService} from "../../../service/storage.service";
import { HistoryDjangoComponent } from '../../../play/django/history-django/history-django.component';


/**
 * 投注记录
 */
@Component({
  selector: "app-betting",
  templateUrl: "./betting.component.html",
  styleUrls: ["./betting.component.scss"]
})
export class BettingComponent implements OnInit {
  startTime = null;
  endTime = null;
  page = 1;
  total = 0;
  getType = "cp";

  detail: any = {}; // 弹窗详情
  betList: any = [];
  betDetailsList = [];

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private storage: StorageService
  ) {}
  timeChange(event) {
    this.startTime = event.start;
    this.endTime = event.end;
  }

  onType(type) {
    if (type.index == 0) {
      this.getType = "cp";
      this.getBetLogs(10, 1, "", "");
    } else {
      this.getType = "ag";
      this.betDetails();
    }
  }

  getPageData(event) {
    const startTime = new Date(this.startTime).getTime() / 1000 || "";
    const endTime = new Date(this.endTime).getTime() / 1000 || "";
    this.getBetLogs(event.pageSize, event.currentPage, startTime, endTime);
  }

  refarshData() {
    const startTime = new Date(this.startTime).getTime() / 1000 || "";
    const endTime = new Date(this.endTime).getTime() / 1000 || "";
    this.getBetLogs(10, this.page, startTime, endTime);
  }

  getBetLogs(pageSize, currentPage, startTime, endTime) {
    this.http
      .postRx(`api/Users/getBetLogs`, {
        length: pageSize,
        page: currentPage,
        startTime: startTime,
        endTime: endTime,
        type: 1
      })
      .subscribe(data => {
        // console.log(`我执行了`)
        if (data) {
          this.total = data.count;
          this.betList = data.data;
        } else {
          this.total = 0;
          this.betList = [];
        }
      });
  }

  getList() {
    if (this.getType == "cp") {
      this.getPageData({ currentPage: this.page, pageSize: 10 });
    } else {
      this.betDetails();
    }
  }

  // 撤单
  revoked(id) {
    let params = {
      id: id
    };
    this.http.postRx(`/api/Games/cancelBet`, params).subscribe(data => {
      this.message.success("撤单成功！");
      this.getBetLogs(10, 1, "", "");
    });
  }

  ngOnInit() {
    this.getBetLogs(10, 1, "", "");
  }

  // Details/betDetail
  betDetails(index?) {
    const user_id = this.storage.getStorage("user_id");
    const user_name = this.storage.getStorage("user_name");

    this.http
      .postRx(`api/Details/betDetails`, {
        pageIndex: index || 1,
        pageSize: 10,
        username: user_name,
        user_id: user_id,
        startTime: new Date(this.startTime).getTime() / 1000 || "",
        endTime: new Date(this.endTime).getTime() / 1000 || ""
      })
      .subscribe(data => {
        if (data) {
          this.betDetailsList = data.data;
          this.total = data.count;
        } else {
          this.betDetailsList = [];
          this.total = 0;
        }
      });
  }

  // 查看详情
  clickList(list) {
    this.storage.setStorage(list, "infoData");
    const modal = this.modalService.open({
      content: HistoryDjangoComponent,
      zIndex: 2000,
      closable: false,
      maskClosable: false,
      footer: false,
      width: 584
    });
  }

  playHuiDiao() {
    // this.http.
  }
}
