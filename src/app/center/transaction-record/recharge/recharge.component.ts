import {Component, OnInit, Output} from '@angular/core';
import {HttpService} from "../../../service/http-service.service";
import {Router} from "@angular/router";

/**
 * 充值记录
 */
@Component({
  selector: "app-recharge",
  templateUrl: "./recharge.component.html",
  styleUrls: ["./recharge.component.scss"]
})
export class RechargeComponent implements OnInit {
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
      type: 1,
      length: 10,
      page: this.page,
      startTime: new Date(this.startTime).getTime() / 1000 || "",
      endTime: new Date(this.endTime).getTime() / 1000 || ""
    };
    this.http.postRx(`api/Users/getPayLogs`, params).subscribe(data => {
      this.total = data["count"];
      this.listData = data["data"];
      // console.log(data)
    });
  }
  clickPagination() {
    this.getList();
  }
}
