import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../service/http-service.service';


@Component({
  selector: "app-system-info",
  templateUrl: "./system-info.component.html",
  styleUrls: ["./system-info.component.scss"]
})
export class SystemInfoComponent implements OnInit {
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
      length: 10,
      page: this.page,
      type: "1",
      startTime: new Date(this.startTime).getTime() / 1000 || "",
      endTime: new Date(this.endTime).getTime() / 1000 || ""
    };
    this.http.postRx(`api/Messages/getMsgs`, params).subscribe(data => {
      this.total = data["count"];
      this.listData = data["data"];
    });
  }
  clickPagination() {
    this.getList();
  }
}
