import {Component, OnInit} from '@angular/core';
import {HistoryDjangoComponent} from '../../../ssc/django/history-django/history-django.component';
import {HttpService} from '../../../service/http-service.service';
import {NzModalService, NzMessageService} from 'ng-zorro-antd';
import {StorageService} from '../../../service/storage.service';

@Component({
  selector: "app-xiajitouzhu",
  templateUrl: "./xiajitouzhu.component.html",
  styleUrls: ["./xiajitouzhu.component.scss"]
})
export class XiajitouzhuComponent implements OnInit {
  startTime = null;
  endTime = null;
  page = 1;
  total = 0;
  user_name = null;

  detail: any = {}; // 弹窗详情
  betList: any = [];

  constructor(private http: HttpService,
              private message: NzMessageService,
              private modalService: NzModalService,
              private storage: StorageService) {
  }

  timeChange(event) {
    this.startTime = event.start;
    this.endTime = event.end;
  }

  // Details/betDetail
  getList(index?) {
    const user_id = this.storage.getStorage("user_id");
    const user_name = this.storage.getStorage("user_name");

    this.http
      .postRx(`api/Users/team/getBetLogs`, {
        page: this.page,
        pageSize: 10,
        status: '',
        user_name: this.user_name,
        startTime: new Date(this.startTime).getTime() / 1000 || "",
        endTime: new Date(this.endTime).getTime() / 1000 || ""
      })
      .subscribe(data => {
        if (data) {
          console.log(data);
          this.betList = data.data;
          this.total = data.count;
        } else {
          this.betList = [];
          this.total = 0;
        }
      });
  }


  // 撤单
  revoked(id) {
    let params = {
      id: id
    };
    this.http.postRx(`/api/Games/cancelBet`, params).subscribe(data => {
      this.message.success("撤单成功！");
      // this.getBetLogs(10, 1, "", "");
    });
  }

  ngOnInit() {
    this.getList();
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

}
