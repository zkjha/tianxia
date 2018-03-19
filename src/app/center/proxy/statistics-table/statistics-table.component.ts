import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../service/http-service.service';

@Component({
  selector: "app-statistics-table",
  templateUrl: "./statistics-table.component.html",
  styleUrls: ["./statistics-table.component.scss"]
})
export class StatisticsTableComponent implements OnInit {
  user_name = null;
  startTime = null;
  endTime = null;
  page = 1;
  pid="";
  total = 0;

  listData = [];

  getType = "teamReport"; // 默认

  cpType = "primary";
  agType = "default";

  constructor(private http: HttpService) {}

  ngOnInit() {
    this.getList();
  }
  timeChange(event){
    this.startTime = event.start;
    this.endTime = event.end;
  };

  onType(type) {
    if (type.index == 0) {
      this.getType = "teamReport";
      this.cpType = "primary";
      this.agType = "default";
    } else {
      this.getType = "agTeamReport";
      this.cpType = "default";
      this.agType = "primary";
    }
    this.getList();
  }
  getLower(name,pid) {
    this.user_name = name;
    this.pid=pid;
    this.getList();
  }

  getList() {
    let params = {
      user_name: this.user_name || "",
      length: 10,
      page: this.page,
      startTime: new Date(this.startTime).getTime() / 1000 || "",
      endTime: new Date(this.endTime).getTime() / 1000 || ""
    };
    this.http
      .postRx(`api/Users/team/${this.getType}`, params)
      .subscribe(data => {
        if(data){
          this.total = data["count"];
          this.listData = data["data"];
        }else{
          this.total = 0;
          this.listData = [];
        }

      });
  }

  backUp(){

    this.user_name="";
    let params = {
      user_name: this.user_name || "",
      pid:this.pid,
      length: 10,
      page: this.page,
      startTime: new Date(this.startTime).getTime() / 1000 || "",
      endTime: new Date(this.endTime).getTime() / 1000 || ""
    };
    this.http
      .postRx(`api/Users/team/${this.getType}`, params)
      .subscribe(data => {
        if(data){
          this.total = data["count"];
          this.listData = data["data"];
        }else{
          this.total = 0;
          this.listData = [];
        }
      });
  }
  backMaxUp(){
    let params = {
      user_name:"",
      length: 10,
      page: this.page,
      startTime: new Date(this.startTime).getTime() / 1000 || "",
      endTime: new Date(this.endTime).getTime() / 1000 || ""
    };
    this.http
      .postRx(`api/Users/team/${this.getType}`, params)
      .subscribe(data => {
        if(data){
          this.total = data["count"];
          this.listData = data["data"];
        }else{
          this.total = 0;
          this.listData = [];
        }
      });
  }

  clickPagination() {
    this.getList();
  }
}
