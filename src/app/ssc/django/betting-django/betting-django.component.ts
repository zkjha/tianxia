import { Component, OnInit, Input } from '@angular/core';
import { NzModalSubject, NzMessageService } from 'ng-zorro-antd';
import { StorageService } from '../../../service/storage.service';
import Tool from 'lodash';

@Component({
  selector: 'app-betting-django',
  templateUrl: './betting-django.component.html',
  styleUrls: ['./betting-django.component.scss']
})
export class BettingDjangoComponent implements OnInit {

  playDjangoData = [];
  allDjangoData: any;

  title = '';

  issue = ''

  constructor(private subject: NzModalSubject,
    private message: NzMessageService,
    private storage: StorageService
  ) {
    // 监听显示
    this.subject.on('onShow', () => {

      let gameData = storage.getStorage('gameData');
      this.title = gameData['title']

      let timeData = storage.getStorage('timeData');

      try {
        this.issue = timeData['cur']['issue'];
      } catch (e) {

      }


      this.sumAllData();
    });
  }

  ngOnInit() {
  }


  @Input()
  set betData(betData) {
    this.playDjangoData = betData;
  }
  @Input()
  set allData(allData) {
    this.allDjangoData = allData;
  }

  // 点击确定
  emitDataOutside(e) {
    this.subject.next(this.playDjangoData);
    this.subject.destroy('onCancel');
  }
  // 关闭
  handleCancel(e) {
    // this.subject.next(this.playDjangoData);
    this.subject.destroy('onCancel');
  }

  onDelete(index) {
    this.playDjangoData.splice(index, 1);
    this.sumAllData();
    this.message.success(`删除成功！`)
  }
  // 统计
  sumAllData() {
    let allCount = 0;
    let allAmount = 0;
    this.playDjangoData.forEach(item => {
      allCount += item.count;
      allAmount += item.htmlData.amount;

    })
    this.allDjangoData['allCount'] = allCount;
    this.allDjangoData['allAmount'] = allAmount;
  }


}
