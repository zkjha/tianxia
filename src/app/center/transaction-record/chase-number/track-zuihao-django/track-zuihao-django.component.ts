import {NzModalSubject, NzMessageService} from 'ng-zorro-antd';
import {Component, OnInit} from '@angular/core';
import {StorageService} from "../../../../service/storage.service";
import {HttpService} from "../../../../service/http-service.service";

@Component({
  selector: 'app-track-zuihao-django',
  templateUrl: './track-zuihao-django.component.html',
  styleUrls: ['./track-zuihao-django.component.scss']
})
export class TrackZuihaoDjangoComponent implements OnInit {

  data: any = [];
  zuihaoData;

  constructor(private http: HttpService,
              private storage: StorageService,
              private subject: NzModalSubject,
              private message: NzMessageService) {
    // 监听显示
    this.subject.on('onShow', () => {
      this.getData()

    });

  }

  getData() {
    let zuihaoData = this.storage.getStorage('zuihaoData');
    let userId = this.storage.getStorage('user_id')
    let params = {
      id: zuihaoData['id'],
      user_id: userId,
    }
    this.http.postRx(`/api/Games/chaseBetDetail `, params)
      .subscribe((data) => {
        if (data['errorCode'] == '0000') {
          this.data = data['result']
        }
      })
  }

  // 撤单
  revoked(id) {
    let gameData = this.storage.getStorage('gameData');
    let userId = this.storage.getStorage('user_id')
    let params = {
      id: id,
      user_id: userId,
    }
    return this.http.postRx(`/api/Games/cancelBet`, params)
      .subscribe((data) => {
        if (data['errormsg'] == null) {
          this.message.success('撤单成功！');
          this.getData();
        } else {
          this.message.error(data['errormsg']);
        }
      })

  }

  // 关闭
  handleCancel() {
    this.subject.destroy('onCancel');
  }

  ngOnInit() {
  }

}
