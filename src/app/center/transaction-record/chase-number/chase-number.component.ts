import {Component, OnInit, Output} from '@angular/core';
import {HttpService} from "../../../service/http-service.service";
import {Router} from "@angular/router";
import {NzModalService} from "ng-zorro-antd";
import {StorageService} from "../../../service/storage.service";
import {TrackZuihaoDjangoComponent} from "./track-zuihao-django/track-zuihao-django.component";
import { ChaseHistoryDjangoComponent } from '../../../../ssc/django/chase-history-django/chase-history-django.component';

/**
 * 追号记录
 */
@Component({
  selector: 'app-chase-number',
  templateUrl: './chase-number.component.html',
  styleUrls: ['./chase-number.component.scss']
})
export class ChaseNumberComponent implements OnInit {




  listData = [];

  selectedOption = [];

  log_id = null;
  startTime = null;
  endTime = null;
  page = 1;

  total = 0;
  // 游戏选择
  selectedPlay = [];

  selectedStatus = [
    {
      title:'未开始',
      id:'0'
    },
    {
      title:'已开始',
      id:'1'
    },
    {
      title:'已停止',
      id:'2'
    },
    {
      title:'已结束',
      id:'3'
    },
  ]

  selectedStop = [
    {
      title:'是',
      id:'1'
    },
    {
      title:'否',
      id:'0'
    }
  ]

  // 游戏id
  game_id = '';

  // 状态
  status = '';

  winStop = '';

  constructor(private http: HttpService,
    private storage: StorageService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.getList();
    this.getGamesList();
  }

  getList() {
    let params = {
      log_id: this.log_id|| '',
      length: 10,
      page: this.page,
      game_id:this.game_id || '',
      status: this.status || '',
      startTime: new Date(this.startTime).getTime() / 1000 || '',
      endTime: new Date(this.endTime).getTime() / 1000 || '',
      winStop:this.winStop || '',
    }
    this.http.postRx(`api/Users/getChaseLogs`, params).subscribe(
      data => {
        this.total = data['count'];
        this.listData = data['data'];
        // console.log(data)
      }
    )
  }
  clickPagination() {
    this.getList();
  }

  getGamesList() {
    this.http.postRx(`api/Games/getNameList`)
      .subscribe(
      data => {
        this.selectedPlay = data['data'];

      },

    );
  }

   // //追号详情
  openChase(item){
    this.storage.setStorage(item, 'zuihaoData')
    const modal = this.modalService.open({
      content: ChaseHistoryDjangoComponent,
      zIndex:2000,
      closable: false,
      maskClosable: true,
      footer: false,
      width: 584,

    });
  }

}
