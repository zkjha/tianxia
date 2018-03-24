import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../service/storage.service';
import { NzMessageService, NzModalService, NzModalSubject } from 'ng-zorro-antd';
import { HttpService } from '../../../service/http-service.service';
import * as moment from 'moment';

@Component({
  selector: 'app-lottery-history-django',
  templateUrl: './lottery-history-django.component.html',
  styleUrls: ['./lottery-history-django.component.scss']
})
export class LotteryHistoryDjangoComponent implements OnInit {

  data: any = [];
  date: Date = new Date;
  title = ''

  constructor(
    private storage: StorageService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private subject: NzModalSubject,
    private http: HttpService
  ) {

    this.subject.on('onShow', () => {

      this.getData();
      let gameData = this.storage.getStorage('gameData');
      this.title = gameData['title']

    });

  }



  ngOnInit() {

  }

  getData() {
    let date = this.formatDate(this.date);
    let gameData = this.storage.getStorage('gameData');
    let params = {
      game_id: gameData['id'],
      date: date,
    }
    this.http.postRx(`/api/Games/getOneDayCodes`, params)
      .subscribe((data) => {
        this.data = data || []
      })
  }
  onChange() {
    this.getData();
  }

  formatDate(value) {
    return moment(value).format('YYYY-MM-DD')
  }

}
