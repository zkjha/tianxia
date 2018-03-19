import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../service/http-service.service';

@Component({
  selector: "app-lower-water",
  templateUrl: "./lower-water.component.html",
  styleUrls: ["./lower-water.component.scss"]
})
export class LowerWaterComponent implements OnInit {
  user_name = null;
  startTime = null;
  endTime = null;
  page = 1;

  total = 0;

  listData = [];

  options = [
    { value: "adminOpe", label: "后台充值" },
    { value: "bet", label: "投注" },
    { value: "betReturn", label: "投注返点" },
    { value: "betReturnSelf", label: "自身返点" },
    { value: "cancelBet", label: "撤单" },
    { value: "cash", label: "提现" },
    { value: "recharge", label: "充值" },
    { value: "winBet", label: "中奖" }
  ];
  selectedOptio;

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
      endTime: new Date(this.endTime).getTime() / 1000 || "",
      type:this.selectedOptio
    };
    this.http.postRx(`api/Users/team/getTeamAccLogs`, params).subscribe(data => {
      this.total = data["count"];
      this.listData = data["data"];
      console.log(data)
    });
  }
  clickPagination() {
    this.getList();
  }
}
