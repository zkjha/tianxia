import { HttpService } from '../../../service/http-service.service';
import { Component, OnInit } from '@angular/core';
import Tool from 'lodash';
import { StorageService } from '../../../service/storage.service';


@Component({
  selector: "app-bonus-details",
  templateUrl: "./bonus-details.component.html",
  styleUrls: ["./bonus-details.component.scss"]
})
export class BonusDetailsComponent implements OnInit {
  tabs = [
    {
      index: 1
    },
    {
      index: 2
    },
    {
      index: 3
    }
  ];
  listData = [];
  titleData = [];

  contentData = [];
  contentActive = "";

  dfRebate = null;

  constructor(private http: HttpService,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.getList();
  }
  getRebate(type) {
    if (type == "low") {
      // 低
      this.dfRebate = this.storage.getStorage("minRebate");
    } else if (type == "high") {
      this.dfRebate = this.storage.getStorage("maxRebate");
    }
  }

  // 请求数据
  getList() {
    this.http.postRx("api/Games/getNameList").subscribe(data => {
      this.titleData = this.sortData(data);
    });
  }

  // 点击头部
  selectedChange(event) {
    if (this.titleData.length > 0) {
      this.getGameData(this.titleData[event]["child"][0]["id"]);
    }
  }

  getGameData(id) {
    const params = { game_id: id };
    this.http
      .postRx("/api/Games/getData", params)
      .map(data => this.arrangeData(data))
      .subscribe(data => {

        this.contentData = data;
        this.contentActive = data[0]["title"];
        this.sortLabelData(data[0]);
      });
  }
  onClickLabel(data) {
    this.sortLabelData(data);
  }
  sortLabelData(data) {
    let arr = [];
    Tool.forEach(data["child"], item => {
      Tool.forEach(item["child"], item2 => {
        item2.info = `${data["title"]}-${item["title"]}-${item2["title"]}`;
        item2.leftTitle = data["title"];
        arr.push(item2);
      });
    });
    Tool.forEach(arr, item=>{
      item.ss = this.dfRebate / item["returnStep"] * item["returnAmount"] + item["bonus"];
    })
    this.listData = arr;
  }

  // 数据处理
  sortData(data) {
    let gameData = [];
    // 第一层
    Tool.forEach(data.data, item => {
      if (item.pid == 0 && item.enabled == 1) {
        item.child = [];
        item.styleHeigth = 31;
        gameData.push(item);
      }
    });
    Tool.forEach(gameData, (item, index) => {
      Tool.forEach(data.data, (item2, index2) => {
        if (item2.pid == item.id && item.enabled == 1) {
          item.child.push(item2);
        }
      });
    });
    // 解析第二层
    return gameData;
  }

  // 数据整理
  arrangeData(data: any): Array<any> {
    let arr = [];
    this.getRebate(data["game"]["frequency"]);
    // 解析第一层
    Tool.forEach(data.type, (item, index) => {
      item.child = [];
      if (item.level === 0) {
        arr.push(item);
      }
    });
    // 第一层排序
    arr.sort(function(a: any, b: any) {
      return a.sort - b.sort;
    });
    // 解析第二层
    Tool.forEach(arr, (item, index) => {
      Tool.forEach(data.type, item2 => {
        if (item2.pid === item.id) {
          item.child.push(item2);
        }
      });
    });
    // 解析第三层数据
    Tool.forEach(arr, item => {
      Tool.forEach(item.child, item2 => {
        Tool.forEach(data.play, item3 => {
          if (item3.pid === item2.id) {
            item2.child.push(item3);
          }
        });
      });
    });
    return arr;
  }
}
