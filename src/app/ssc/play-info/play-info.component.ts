import { ChaseHistoryDjangoComponent } from '../django/chase-history-django/chase-history-django.component';
import { HttpService } from '../../service/http-service.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { StorageService } from '../../service/storage.service';
import Tool from 'lodash';
import { HistoryDjangoComponent } from '../django/history-django/history-django.component';

@Component({
  selector: "app-play-info",
  templateUrl: "./play-info.component.html",
  styleUrls: ["./play-info.component.css"]
})
export class PlayInfoComponent implements OnInit, OnDestroy {
  titleActive = {
    fangan: true,
    zuihao: false,
    kaijiang: false
  };

  winSatus = [
    "未开奖",
    "已中奖",
    "未中奖"
  ] ;

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
      this.getList();
    }, 5000);
  }
  getStatus(num) {
    return this.winSatus[Number(num)];
  }

  // 删除激活
  removeActive() {
    for (var index in this.titleActive ){
      this.titleActive[index] = false;
    }
  }

  // 我的方案
  onClickBetlist() {
    this.getList();
    this.removeActive();
    this.titleActive.fangan = true;
  }
  onClickBetlists() {
    this.onClickBetlist();
    this.message.success("刷新成功");
  }
  shuaxin(){
    this.onClickChase();
    this.message.success("刷新成功");
  };
  // 请求数据
  getList() {
    let gameData = this.storage.getStorage("gameData");
    let params = {
      game_id: gameData["id"],
      page: 1,
      length: 20
    };
    this.http.postRx(`/api/Games/getBetList`, params).subscribe(data => {
      this.programData = data || [];
    });
  }

  // 追号
  onClickChase() {
    this.removeActive();
    this.titleActive.zuihao = true;
    let gameData = this.storage.getStorage("gameData");
    let params = {
      game_id: gameData["id"],
      length: 50
    };
    this.http.postRx(`/api/Games/getChaseList`, params).subscribe(data => {
      // console.log(data)
      this.chaseData = data["data"] || [];
    });
  }
  // 开奖
  onClickKaiJiang() {
    this.removeActive();
    this.titleActive.kaijiang = true;
    let gameData = this.storage.getStorage("gameData");
    let params = {
      game_id: gameData["id"],
      length: 50
    };
    this.http.postRx(`/api/Games/getCodeHistory`, params).subscribe(data => {
      this.lotteryData = data || [];
    });
  }

  // 撤单
  revoked(id) {
    this.http.postRx(`/api/Games/cancelBet`, { id: id }).subscribe(data => {
      this.getList();
      this.message.success("撤单成功！");
    });
  }
  // 我的方案
  clickList(list) {
    this.storage.setStorage(list, "infoData");
    const modal = this.modalService.open({
      content: HistoryDjangoComponent,
      closable: false,
      maskClosable: false,
      footer: false,
      width: 584
    });
  }
  // 追号
  clickJindu(list) {
    this.storage.setStorage(list, "zuihaoData");
    const modal = this.modalService.open({
      content: ChaseHistoryDjangoComponent,
      closable: false,
      maskClosable: false,
      footer: false,
      width: 584
    });
  }
  gengduo() {
    this.openinfoDjango.emit();
  }
  openzuihao() {
    this.openzuihaoD.emit();
  }
  // 销毁定时器
  ngOnDestroy(): void {
    clearInterval(this.date);
  }
}
