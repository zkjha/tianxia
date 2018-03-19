import { Component, OnInit, Output } from '@angular/core';
import { HttpService } from "../../../service/http-service.service";
import { Router } from "@angular/router";
import { StorageService } from "../../../service/storage.service";

/**
 * 流水记录
 */
@Component({
  selector: "app-turnover",
  templateUrl: "./turnover.component.html",
  styleUrls: ["./turnover.component.scss"]
})
export class TurnoverComponent implements OnInit {
  startTime = null;
  endTime = null;
  page = 1;

  total = 0;

  listData = [];

  getType = "cp";

  constructor(private http: HttpService) {}

  ngOnInit() {
    this.getList();
  }
  timeChange(event) {
    this.startTime = event.start;
    this.endTime = event.end;
  }
  onType(type) {
    if (type.index == 0) {
      this.getType = "cp";
    } else {
      this.getType = "ag";
    }
    this.getList();
  }

  getList() {
    let params = {
      length: 10,
      page: this.page,
      startTime: new Date(this.startTime).getTime() / 1000 || "",
      endTime: new Date(this.endTime).getTime() / 1000 || ""
    };
    if (this.getType == "cp") {
      params["typeList"] = [
        "adminOpe",
        "bet",
        "winBet",
        "betReturn",
        "betReturnSelf",
        "cancelBet",
        "recharge",
        "cash",
        "cashSuc",
        "cashFai",
        "chaseBet",
        "cashCounterFee",
        "manualTrans",
        "singleBet",
        "activityPrize"
      ];
    } else {
      params["typeList"] = [
        "ag_win",
        "ag_cat",
        "Ag_withdrawFund",
        "Ag_depositFund"
      ];
    }
    this.http.postRx(`api/Users/getAccLogs`, params).subscribe(data => {
      // console.log(data)
      this.total = data["count"];
      this.listData = data["data"];
    });
  }
  clickPagination() {
    this.getList();
  }
}
