import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../service/http-service.service';


@Component({
  selector: "app-system-placard",
  templateUrl: "./system-placard.component.html",
  styleUrls: ["./system-placard.component.scss"]
})
export class SystemPlacardComponent implements OnInit {
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
      startTime: new Date(this.startTime).getTime() / 1000 || "",
      endTime: new Date(this.endTime).getTime() / 1000 || ""
    };
    this.http.postRx(`api/News/getNews`, params).subscribe(data => {
      this.total = data["count"];
      this.listData = data["data"];
    });
  }
  clickPagination() {
    this.getList();
  }
}
