import { StorageService } from '../../../service/storage.service';
import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../service/http-service.service';

@Component({
  selector: "app-my-login-info",
  templateUrl: "./my-login-info.component.html",
  styleUrls: ["./my-login-info.component.scss"]
})
export class MyLoginInfoComponent implements OnInit {
  startTime = null;
  endTime = null;
  page = 1;

  total = 0;

  listData = [];

  constructor(private http: HttpService,
    private storage:StorageService
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
      type: 1,
      length: 10,
      page: this.page,
      startTime: new Date(this.startTime).getTime() / 1000 || "",
      endTime: new Date(this.endTime).getTime() / 1000 || "",
      user_name:this.storage.getStorage('user_name')
    };
    this.http
      .postRx(`/api/Users/team/getUserLoginLogs`, params)
      .subscribe(data => {
        this.total = data["count"] || 0;
        this.listData = data["data"];
      });
  }
  clickPagination() {
    this.getList();
  }
}
