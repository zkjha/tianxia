import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../service/http-service.service';

@Component({
  selector: "app-recharge-record",
  templateUrl: "./recharge-record.component.html",
  styleUrls: ["./recharge-record.component.scss"]
})
export class RechargeRecordComponent implements OnInit {
  user_name = null;
  startTime = null;
  endTime = null;
  page = 1;

  total = 0;

  listData = [];

  constructor(private http: HttpService) {}

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
      page: this.page,
      startTime: new Date(this.startTime).getTime() / 1000 || "",
      endTime: new Date(this.endTime).getTime() / 1000 || ""
    };
    this.http.postRx(`api/Users/team/getPayLogs`, params).subscribe(data => {
      this.total = data["count"];
      this.listData = data["data"];
      // console.log(data)
    });
  }
  clickPagination() {
    this.getList();
  }
}
