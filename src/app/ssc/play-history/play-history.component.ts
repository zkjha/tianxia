import { ChaseHistoryDjangoComponent } from '../django/chase-history-django/chase-history-django.component';
import { HttpService } from '../../service/http-service.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { StorageService } from '../../service/storage.service';
import Tool from 'lodash';
import { HistoryDjangoComponent } from '../django/history-django/history-django.component';

@Component({
  selector: "app-play-history",
  templateUrl: "./play-history.component.html",
  styleUrls: ["./play-history.css"]
})
export class PlayHistoryComponent implements OnInit, OnDestroy {
  titleActive = {
    fangan: true,
    zuihao: false,
    kaijiang: false
  };

  // 我的方案
  date = null;

  gameData = null;

  // 我的方案
  programData = [];
  chaseData = [];
  lotteryData = [];

  // 改变下注状态
  @Output() openinfoDjango: EventEmitter<any> = new EventEmitter();
  @Output() openzuihaoD: EventEmitter<any> = new EventEmitter();

  constructor(
    private message: NzMessageService,
    private modalService: NzModalService,
    private storage: StorageService,
    private http: HttpService
  ) {}

  ngOnInit() {
    // this.getList();
    clearInterval(this.date);

    // console.log(this.gameData['id'])
    // 上线打开
    this.date = setInterval(() => {
      this.onClickKaiJiang();
    }, 5000);
  }


  // 开奖
  onClickKaiJiang() {
    let gameData = this.storage.getStorage("gameData");
    let params = {
      game_id: gameData["id"],
      length: 50
    };
    this.http.postRx(`/api/Games/getCodeHistory`, params).subscribe(data => {
      this.lotteryData = data || [];
    });
  }

  // 销毁定时器
  ngOnDestroy(): void {
    clearInterval(this.date);
  }
}
