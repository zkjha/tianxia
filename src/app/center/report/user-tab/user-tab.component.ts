import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../service/http-service.service';

@Component({
  selector: "app-user-tab",
  templateUrl: "./user-tab.component.html",
  styleUrls: ["./user-tab.component.scss"]
})
export class UserTabComponent implements OnInit {
  startTime = null;
  endTime = null;

  data: any = {};

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
      startTime: new Date(this.startTime).getTime() / 1000 || "",
      endTime: new Date(this.endTime).getTime() / 1000 || ""
    };
    this.http.postRx(`api/Users/getStatData`, params).subscribe(data => {
      this.data = data;
    });
  }
}
