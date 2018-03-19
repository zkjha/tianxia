import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../service/http-service.service';

@Component({
  selector: "app-first-withdraw",
  templateUrl: "./first-withdraw.component.html",
  styleUrls: ["./first-withdraw.component.scss"]
})
export class FirstWithdrawComponent implements OnInit {
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
      page: this.page
    };
    this.http.postRx(`api/Users/team/getFirstWithdraw`, params).subscribe(data => {
      this.total = data["count"];
      this.listData = data["data"];
    });
  }
  clickPagination() {
    this.getList();
  }
}
