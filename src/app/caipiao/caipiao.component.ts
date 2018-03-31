import { Component, OnInit } from '@angular/core';
import {LoginAfterComponent} from '../login-after/login-after.component';
import {HttpService} from '../service/http-service.service';
import Tool from 'lodash';

@Component({
  selector: 'app-caipiao',
  templateUrl: './caipiao.component.html',
  styleUrls: ['./caipiao.component.css']
})
export class CaipiaoComponent implements OnInit {
  currentName = {
    name: '彩票专区'
  };

  constructor(
    private http: HttpService
  ) { }
  gameList: any [];
  titleList: any [];


  ngOnInit() {
    this.getNameList();

  }

  // 游戏大厅菜单
  getNameList() {
    this.http.postRx("/api/Games/getNameList").subscribe(data => {
      this.gameList = this.sortData(data);
      console.log(this.gameList);
    });
  }
  // 数据处理
  sortData(data) {
    let gameData = [];
    // 第一层Array
    const dataList = data.data || [];
    dataList.forEach(item => {
      if (item.pid == 0 && item.enabled == 1) {
        item.child = [];
        item.styleHeigth = 31;
        gameData.push(item);
      }
    });
    this.titleList = gameData ;
    gameData.forEach((item, index) => {
      dataList.forEach((item2, index2) => {
        if (item2.pid == item.id && item.enabled == 1) {
          item.child.push(item2);
        }
      });
    });
    // 解析第二层
    return gameData;
  }

}
