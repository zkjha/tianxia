
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';
import Tool from 'lodash';
import { StorageService } from '../../service/storage.service';


@Component({
  selector: "app-ssc-detail",
  templateUrl: "./ssc-detail.component.html",
  styleUrls: ["./ssc-detail.component.css"]
})
export class SscDetailComponent implements OnInit {
  lotteryData: any = [];

  itemData: Array<any> = [];
  isRen: any = false;
  df = true;

  @Output() gameData = new EventEmitter();

  constructor(private storage: StorageService) {}

  ngOnInit() {}

  getPlayData() {
    setTimeout(() => {
      this.lotteryData = this.storage.getStorage("lotteryData");
      this.isRen = this.storage.getStorage("isRen");
      this.onClickTop(0);
    }, 100);
  }
  clickRen(){
    this.df = !this.df;
    if(this.df){
      this.onClickTop(0);
    }else{
      for(let i = 0; i < this.lotteryData.length; i++){
        if(this.lotteryData[i].isRen == 'none'){
          this.onClickTop(i);
          break;
        }
      }
    }
  };

  onClickTop(index) {
    this.storage.setStorage(this.lotteryData[index], "currentPlayData");
    this.itemData = this.lotteryData[index].child;

    this.activeData(index);
    this.onClickPlay(this.itemData[0].child[0]);
  }

  activeData(index) {
    this.lotteryData.forEach(item => {
      item.active = false;
    });
    this.lotteryData[index].active = true;
  }

  onClickPlay(item) {
    this.gameData.emit(item);
    this.itemData = this.removeActive(this.itemData);
    item.active = true;
  }

  removeActive(data) {
    data.forEach( item => {
      item.child.forEach(item2 => {
        item2.active = false;
      });
    });

    return data;
  }
}
